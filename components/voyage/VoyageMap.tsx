// @ts-nocheck
'use client';
import { useEffect, useRef } from 'react';

interface Waypoint { lat: number; lng: number; label: string; day?: number; }
interface Props { waypoints: Waypoint[]; country: string; centerLat?: number; centerLng?: number; }

export default function VoyageMap({ waypoints, country, centerLat, centerLng }: Props) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;
    if (!waypoints?.length && !centerLat) return;

    import('leaflet').then(L => {
      L = L.default;
      delete L.Icon.Default.prototype._getIconUrl;

      const pts = waypoints?.length ? waypoints : [{ lat: centerLat, lng: centerLng, label: country }];
      const latlngs = pts.map(p => [p.lat, p.lng]);

      const lats = pts.map(p => p.lat);
      const lngs = pts.map(p => p.lng);
      const cLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const cLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

      const map = L.map(mapRef.current, {
        center: [cLat, cLng],
        zoom: pts.length === 1 ? 7 : 6,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: window.innerWidth >= 768,
        touchZoom: window.innerWidth < 768, // mobile only
        zoomControl: false,
        attributionControl: false,
      });
instanceRef.current = map;
      
      // Mobile: 2 fingers zoom, 1 finger pan when zoomed
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        const initialZoom = map.getZoom();
        const container = mapRef.current;
        if (container) {
          container.addEventListener('touchstart', (e) => {
            if (e.touches.length >= 2) {
              map.touchZoom.enable();
              map.dragging.enable();
            } else if (e.touches.length === 1) {
              if (map.getZoom() > initialZoom) {
                map.dragging.enable();
              } else {
                map.dragging.disable();
              }
            }
          }, { passive: true });
        }
      }

      // Dark CartoDB tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
      }).addTo(map);

      if (pts.length > 1) {
        map.fitBounds(L.latLngBounds(latlngs), { padding: [48, 48] });
      }

      // X cross marker
      const xIcon = (isFirst) => L.divIcon({
        html: `<svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <line x1="2" y1="2" x2="14" y2="14" stroke="#c4962a" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="14" y1="2" x2="2" y2="14" stroke="#c4962a" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        className: '',
      });

      const CHAR_W = 6.2, LABEL_H = 14, PAD = 4;
      const labelW = (s) => Math.max((s || '').length * CHAR_W, 10);

      // Crée les croix + des markers de label vides (repositionnés ensuite)
      const labelMarkers = [];
      pts.forEach((pt, i) => {
        const marker = L.marker([pt.lat, pt.lng], { icon: xIcon(i === 0) }).addTo(map);
        marker.bindPopup(`
          <div style="background:#111;border:1px solid #2a2a2a;padding:10px 14px;font-family:system-ui;color:#f5f0e8;min-width:120px;">
            <div style="color:#c4962a;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:4px;">${pt.day ? `Jour ${pt.day}` : `Étape ${i+1}`}</div>
            <div style="font-size:13px;">${pt.label || ''}</div>
          </div>
        `, { className: 'custom-popup' });

        const lm = L.marker([pt.lat, pt.lng], {
          icon: L.divIcon({ html: '', iconSize: [0, 0], iconAnchor: [0, 0], className: '' }),
          interactive: false,
        }).addTo(map);
        labelMarkers.push(lm);
      });

      // Place chaque label collé à SA croix, dans la 1ère direction libre.
      // 8 directions candidates testées dans l'ordre (droite, gauche, bas, haut, diagonales).
      const repositionLabels = () => {
        const screen = pts.map(p => map.latLngToContainerPoint([p.lat, p.lng]));
        // boîtes occupées par les croix elles-mêmes (~18px) pour ne pas écrire dessus
        const boxes = screen.map(sp => ({ x1: sp.x - 9, y1: sp.y - 9, x2: sp.x + 9, y2: sp.y + 9 }));

        const overlaps = (a, b) =>
          a.x1 < b.x2 + PAD && a.x2 > b.x1 - PAD && a.y1 < b.y2 + PAD && a.y2 > b.y1 - PAD;

        pts.forEach((pt, i) => {
          const sp = screen[i];
          const w = labelW(pt.label);
          // candidats {dx, dy} : dx/dy = coin haut-gauche de la boîte texte par rapport au X
          const candidates = [
            { dx: 11,        dy: -LABEL_H / 2 }, // droite
            { dx: -w - 11,   dy: -LABEL_H / 2 }, // gauche
            { dx: -w / 2,    dy: 11 },           // bas
            { dx: -w / 2,    dy: -LABEL_H - 11 },// haut
            { dx: 11,        dy: 11 },           // bas-droite
            { dx: -w - 11,   dy: 11 },           // bas-gauche
            { dx: 11,        dy: -LABEL_H - 11 },// haut-droite
            { dx: -w - 11,   dy: -LABEL_H - 11 },// haut-gauche
          ];

          let chosen = candidates[0];
          for (const c of candidates) {
            const box = { x1: sp.x + c.dx, y1: sp.y + c.dy, x2: sp.x + c.dx + w, y2: sp.y + c.dy + LABEL_H };
            const hit = boxes.some(b => overlaps(box, b));
            if (!hit) { chosen = c; boxes.push(box); break; }
            // si dernier candidat et tout chevauche, on prend quand même le 1er
            if (c === candidates[candidates.length - 1]) {
              boxes.push({ x1: sp.x + chosen.dx, y1: sp.y + chosen.dy, x2: sp.x + chosen.dx + w, y2: sp.y + chosen.dy + LABEL_H });
            }
          }

          labelMarkers[i].setIcon(L.divIcon({
            html: `<span style="font-size:9px;letter-spacing:0.18em;color:rgba(245,240,232,0.85);text-transform:uppercase;font-family:system-ui;white-space:nowrap;pointer-events:none;text-shadow:0 1px 3px rgba(0,0,0,0.95);display:inline-block;transform:translate(${chosen.dx}px,${chosen.dy + LABEL_H / 2 - 4}px)">${pt.label}</span>`,
            iconSize: [0, 0], iconAnchor: [0, 0], className: '',
          }));
        });
      };

      map.whenReady(() => { repositionLabels(); setTimeout(repositionLabels, 100); });
      map.on('zoomend moveend', repositionLabels);
    });

    return () => {
      if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
    };
  }, [waypoints, centerLat, centerLng, country]);

  if (!waypoints?.length && !centerLat) return null;

  return (
    <div>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper { background:transparent!important; border:none!important; box-shadow:none!important; padding:0!important; }
        .custom-popup .leaflet-popup-content { margin:0!important; }
        .custom-popup .leaflet-popup-tip { background:#111!important; }
        .leaflet-tooltip { background:transparent!important; border:none!important; box-shadow:none!important; padding:0!important; }
        .leaflet-tooltip::before { display:none!important; }
        .leaflet-tile-pane { filter: brightness(2.3) contrast(1.6) saturate(1.2); }
      `}</style>
      <div ref={mapRef} style={{ width:'100%', height:'400px', background:'#0d0d0d' }} />
    </div>
  );
}
