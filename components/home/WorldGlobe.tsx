// @ts-nocheck
'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(
  () => import('react-globe.gl').then(m => {
    const G = m.default;
    // next/dynamic ne transmet pas les refs → on passe par une prop dédiée
    const Wrapped = ({ fRef, ...props }) => <G ref={fRef} {...props} />;
    return Wrapped;
  }),
  { ssr: false, loading: () => <div style={{ color: '#c4962a', padding: '40px' }}>…</div> }
);

export default function WorldGlobe() {
  const globeRef = useRef(null);
  const hoverRef = useRef(false); // pause de la rotation au survol
  const controlsRef = useRef(null);
  const containerRef = useRef(null);
  const [voyages, setVoyages] = useState([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    fetch('/api/voyages')
      .then(r => r.json())
      .then(d => setVoyages(d.voyages || []))
      .catch(() => {});
  }, []);

  // Dimensionnement responsive — dépend de voyages car le conteneur
  // n'existe pas tant que les données ne sont pas chargées
  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      const isMobile = window.innerWidth < 768;
      setSize({ w, h: isMobile ? Math.min(w * 1.1, 520) : Math.min(w * 0.85, 780) });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [voyages.length]);

  // Points de voyage (même logique que l'ancienne carte, bi-pays inclus)
  const pts = voyages.flatMap(v => {
    const base = { title: v.title, link: `/voyages/${v.slug || v.id}` };
    const points = [];
    if (v.lat && v.lng) points.push({ ...base, lat: v.lat, lng: v.lng, country: v.country?.trim() });
    if (v.country2?.trim() && v.lat2 && v.lng2) points.push({ ...base, lat: v.lat2, lng: v.lng2, country: v.country2.trim() });
    return points;
  }).filter(p => p.lat && p.lng);

  // Point spécial Svalbard
  pts.push({ lat: 78.2232, lng: 15.6267, country: 'Svalbard', link: '/categories/svalbard' });

  const [globeMounted, setGlobeMounted] = useState(false);

  // Config du globe : appliquée dès que l'instance existe (plus fiable que onGlobeReady
  // à travers le wrapper next/dynamic). Retente tant que la ref n'est pas prête.
  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const setup = () => {
      if (cancelled) return;
      const g = globeRef.current;
      if (!g || typeof g.controls !== 'function') {
        if (tries++ < 100) setTimeout(setup, 100);
        return;
      }
      import('three').then(THREE => {
        if (cancelled) return;

        // Trouve le mesh du globe dans la scène (react-globe.gl n'expose pas
        // globeMaterial() comme méthode — c'était la cause du plantage qui
        // annulait relief ET rotation)
        let globeMesh = null;
        g.scene().traverse(o => {
          if (!globeMesh && o.isMesh && o.material?.isMeshPhongMaterial) globeMesh = o;
        });
        if (!globeMesh) {
          if (tries++ < 100) setTimeout(setup, 150);
          return;
        }

        // Ambiant modéré + directionnelle attachée à la caméra avec un GRAND
        // décalage latéral : lumière rasante qui sculpte le relief, toujours
        // du côté visible (pas de face nuit)
        g.lights([new THREE.AmbientLight(0xffffff, 0.85)]);
        const cam = g.camera();
        const dl = new THREE.DirectionalLight(0xffffff, 1.5);
        dl.position.set(250, 180, 60); // fort décalage → ombres rasantes visibles
        cam.add(dl);
        g.scene().add(cam);

        // Relief 3D RÉEL : la topographie déforme la géométrie de la sphère.
        // CRUCIAL : la sphère d'origine (75x75 segments) est trop grossière
        // pour que les chaînes de montagnes existent → on la remplace par une
        // géométrie haute résolution avant d'appliquer le displacement
        const mat = globeMesh.material;
        const r = globeMesh.geometry?.parameters?.radius || 100;
        globeMesh.geometry.dispose();
        globeMesh.geometry = new THREE.SphereGeometry(r, 400, 200);
        new THREE.TextureLoader().load(
          'https://unpkg.com/three-globe/example/img/earth-topology.png',
          topo => {
            mat.displacementMap = topo;
            mat.displacementScale = 6;   // relief exagéré mais limité (parallaxe des badges)
            mat.displacementBias = -0.5; // les océans restent au niveau de la sphère
            mat.bumpMap = topo;
            mat.bumpScale = 30;
            mat.needsUpdate = true;
          }
        );

        const c = g.controls();
        controlsRef.current = c;
        c.enableDamping = false; // arrêt NET de la rotation au survol (sinon inertie de plusieurs secondes)
        // Le autoRotate natif fonctionne depuis le fix du crash globeMaterial
        // (c'est lui qui tournait "tout seul") — on le pilote directement
        c.autoRotate = !hoverRef.current;
        c.autoRotateSpeed = 0.4; // rotation légère
        c.enableZoom = true;
        c.zoomSpeed = 0.8;
        c.minDistance = 140;   // zoom rapproché possible
        c.maxDistance = 500;
        c.update();

        g.pointOfView({ lat: 25, lng: 10, altitude: window.innerWidth < 768 ? 2.1 : 1.65 }, 0);

        // Pause pendant la manipulation (drag/pinch), reprise après 4s
        let resumeTimer = null;
        c.addEventListener('start', () => {
          c.autoRotate = false;
          if (resumeTimer) clearTimeout(resumeTimer);
        });
        c.addEventListener('end', () => {
          resumeTimer = setTimeout(() => { if (!hoverRef.current) c.autoRotate = true; }, 4000);
        });
      });
    };
    setup();
    return () => { cancelled = true; };
  }, [globeMounted, voyages.length]);

  // Pause de la rotation quand la souris est sur le globe.
  // Méthode infaillible : on écoute les mouvements au niveau du document
  // et on teste si le curseur est dans le rectangle du conteneur
  // (les événements enter/leave sur ce conteneur se sont avérés peu fiables)
  useEffect(() => {
    const onMove = (e) => {
      const el = containerRef.current;
      const c = controlsRef.current;
      if (!el || !c) return;
      const r = el.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (inside !== hoverRef.current) {
        hoverRef.current = inside;
        c.autoRotate = !inside;
      }
    };
    document.addEventListener('pointermove', onMove);
    return () => document.removeEventListener('pointermove', onMove);
  }, []);

  const onGlobeReady = () => setGlobeMounted(true);

  // Zoom garanti via boutons : ajuste l'altitude de la caméra directement
  const zoomBy = (factor) => {
    const g = globeRef.current;
    if (!g) return;
    const pov = g.pointOfView();
    const alt = Math.min(4, Math.max(0.35, pov.altitude * factor));
    g.pointOfView({ ...pov, altitude: alt }, 350);
  };

  // Espace réservé pendant le chargement des données : évite que la section
  // apparaisse d'un coup et fasse sauter la page vers le globe
  if (!voyages.length) {
    return <section style={{ background: '#070707', minHeight: '60vh' }} />;
  }

  return (
    <section style={{ background: '#070707', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(32px,6vw,80px) clamp(16px,4vw,48px) clamp(20px,3vw,36px) 0' }}>
        <h2 className="md:ml-0 md:mt-0" style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 'clamp(1.8rem,4vw,3.2rem)', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: '12px 0 0 16px' }}>
          Le monde sans frontières
        </h2>
      </div>

      <div ref={containerRef}
        onDoubleClick={() => zoomBy(1 / 1.5)}
        style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', cursor: 'grab', position: 'relative', userSelect: 'none', WebkitUserSelect: 'none' }}>
        <div style={{ position: 'absolute', right: 'clamp(12px,3vw,32px)', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 5 }}>
          {[['+', 1 / 1.35], ['−', 1.35]].map(([sym, f]) => (
            <button key={sym} onClick={() => zoomBy(f)} aria-label={sym === '+' ? 'Zoomer' : 'Dézoomer'}
              style={{ width: '38px', height: '38px', background: 'rgba(8,8,8,0.75)', border: '1px solid rgba(196,150,42,0.5)', color: '#c4962a', fontSize: '20px', lineHeight: 1, cursor: 'pointer', fontFamily: 'system-ui', backdropFilter: 'blur(2px)' }}>
              {sym}
            </button>
          ))}
        </div>
        {size.w > 0 && (
          <Globe
            fRef={globeRef}
            width={size.w}
            height={size.h}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
            showAtmosphere={true}
            atmosphereColor="#88b3d6"
            atmosphereAltitude={0.15}
            onGlobeReady={onGlobeReady}

            htmlElementsData={pts}
            htmlLat="lat"
            htmlLng="lng"
            htmlAltitude={0.002}
            htmlElement={p => {
              // Conteneur de taille NULLE : ancre non ambiguë (centre = coin = même point).
              // Le point doré est centré pile sur la coordonnée, le label en dessous.
              const el = document.createElement('div');
              el.style.position = 'relative';
              el.style.width = '0';
              el.style.height = '0';
              el.innerHTML = `
                <div style="position:absolute;left:0;top:0;transform:translate(-50%,-50%);width:9px;height:9px;border-radius:50%;background:#ffd76a;border:1.5px solid rgba(8,8,8,0.9);box-shadow:0 0 10px rgba(255,215,106,0.8);"></div>
                <div style="position:absolute;left:0;top:8px;transform:translateX(-50%);background:rgba(8,8,8,0.85);border:1px solid rgba(196,150,42,0.55);padding:3px 9px;font-size:10px;letter-spacing:0.15em;color:#f5f0e8;text-transform:uppercase;font-family:system-ui,sans-serif;white-space:nowrap;backdrop-filter:blur(2px);">${p.country}</div>`;
              el.style.pointerEvents = 'auto';
              el.style.cursor = 'pointer';
              el.onclick = () => { window.location.href = p.link; };
              return el;
            }}
            htmlElementVisibilityModifier={(el, isVisible) => {
              el.style.opacity = isVisible ? '1' : '0';
              el.style.pointerEvents = isVisible ? 'auto' : 'none';
              el.style.transition = 'opacity .25s';
            }}
          />
        )}
      </div>

      <p style={{ textAlign: 'center', color: 'rgba(245,240,232,0.35)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'system-ui', padding: '4px 0 28px' }}>
        Faites tourner le globe — double-cliquez pour zoomer, touchez un point pour explorer
      </p>
    </section>
  );
}
