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
  const containerRef = useRef(null);
  const [voyages, setVoyages] = useState([]);
  const [countries, setCountries] = useState({ features: [] });
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    fetch('/api/voyages')
      .then(r => r.json())
      .then(d => setVoyages(d.voyages || []))
      .catch(() => {});

    // GeoJSON pays pour l'habillage hexagonal du globe
    fetch('https://unpkg.com/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(topo =>
        import('topojson-client').then(tj =>
          setCountries(tj.feature(topo, topo.objects.countries))
        )
      )
      .catch(() => {});
  }, []);

  // Dimensionnement responsive — dépend de voyages car le conteneur
  // n'existe pas tant que les données ne sont pas chargées
  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      const isMobile = window.innerWidth < 768;
      setSize({ w, h: isMobile ? Math.min(w, 420) : Math.min(w * 0.72, 620) });
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

  // Config initiale du globe : rotation auto + vue centrée Europe/Afrique
  const onGlobeReady = () => {
    const g = globeRef.current;
    if (!g) return;
    g.controls().autoRotate = true;
    g.controls().autoRotateSpeed = 0.55;
    g.controls().enableZoom = true;
    g.controls().minDistance = 180;
    g.controls().maxDistance = 480;
    g.pointOfView({ lat: 25, lng: 10, altitude: window.innerWidth < 768 ? 2.6 : 2.1 }, 0);
    // Sphère quasi-noire, légèrement plus claire que le fond
    const mat = g.globeMaterial();
    mat.color.set('#0d0d0d');
    mat.emissive?.set?.('#050505');
  };

  if (!voyages.length) return null;

  return (
    <section style={{ background: '#070707', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(32px,6vw,80px) clamp(16px,4vw,48px) clamp(20px,3vw,36px) 0' }}>
        <h2 className="md:ml-0 md:mt-0" style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 'clamp(1.8rem,4vw,3.2rem)', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: '12px 0 0 16px' }}>
          Le monde sans frontières
        </h2>
      </div>

      <div ref={containerRef} style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', cursor: 'grab' }}>
        {size.w > 0 && (
          <Globe
            fRef={globeRef}
            width={size.w}
            height={size.h}
            backgroundColor="rgba(0,0,0,0)"
            showAtmosphere={true}
            atmosphereColor="#c4962a"
            atmosphereAltitude={0.13}
            onGlobeReady={onGlobeReady}

            hexPolygonsData={countries.features}
            hexPolygonResolution={3}
            hexPolygonMargin={0.55}
            hexPolygonUseDots={true}
            hexPolygonColor={() => 'rgba(196,150,42,0.55)'}

            pointsData={pts}
            pointLat="lat"
            pointLng="lng"
            pointColor={() => '#f5f0e8'}
            pointAltitude={0.015}
            pointRadius={0.55}
            onPointClick={p => { window.location.href = p.link; }}

            labelsData={pts}
            labelLat="lat"
            labelLng="lng"
            labelText="country"
            labelSize={1.15}
            labelDotRadius={0}
            labelColor={() => '#f5f0e8'}
            labelAltitude={0.018}
            labelResolution={2}
            onLabelClick={p => { window.location.href = p.link; }}
          />
        )}
      </div>

      <p style={{ textAlign: 'center', color: 'rgba(245,240,232,0.35)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'system-ui', padding: '4px 0 28px' }}>
        Faites tourner le globe — touchez un point pour explorer
      </p>
    </section>
  );
}
