// @ts-nocheck
'use client';
import { useEffect, useRef, useState } from 'react';

interface Waypoint { lat: number; lng: number; label: string; day?: number; }
interface Props { waypoints: Waypoint[]; country: string; centerLat?: number; centerLng?: number; }

// Normalise une coordonnée : accepte virgule décimale, espaces, et rejette les invalides
const toNum = (v: any) => {
  if (typeof v === 'number') return isNaN(v) ? null : v;
  if (typeof v === 'string') {
    const n = parseFloat(v.trim().replace(',', '.'));
    return isNaN(n) ? null : n;
  }
  return null;
};

export default function VoyageMap({ waypoints, country, centerLat, centerLng }: Props) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const [legend, setLegend] = useState([]);

  // Construit la liste des points valides (partagée entre la carte et la légende)
  const rawPts = waypoints?.length
    ? waypoints.map(w => ({ ...w, lat: toNum(w.lat), lng: toNum(w.lng) }))
    : [{ lat: toNum(centerLat), lng: toNum(centerLng), label: country }];
  const validPts = rawPts.filter(p => p.lat != null && p.lng != null && (p.label || '').trim());

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;
    if (!validPts.length) return;

    import('leaflet').then(Lm => {
      const L = Lm.default;
      delete L.Icon.Default.prototype._getIconUrl;

      const pts = validPts;
      const latlngs = pts.map(p => [p.lat, p.lng]);
      const lats = pts.map(p => p.lat);
      const lngs = pts.map(p => p.lng);
      const cLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const cLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

      const map = L.map(mapRef.current, {
        center: [cLat, cLng],
        zoom: pts.length === 1 ? 7 : 6,
        scrollWheelZoom: false,
        dragging: window.innerWidth >= 768,
        touchZoom: window.innerWidth < 768,
        zoomControl: false,
        attributionControl: false,
      });
      instanceRef.current = map;

      // Mobile : 2 doigts pour zoomer, 1 doigt pour deplacer quand zoome
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        const initialZoom = map.getZoom();
        const container = mapRef.current;
        if (container) {
          container.addEventListener('touchstart', (e) => {
            if (e.touches.length >= 2) {
              map.touchZoom.enable();
              map.dragging.enable();
            } else if (e.touches.length === 1) {
              if (map.getZoom() > initialZoom) map.dragging.enable();
              else map.dragging.disable();
            }
          }, { passive: true });
        }
      }

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
      }).addTo(map);

      if (pts.length > 1) {
        map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40] });
      }

      // Croix numerotee : le numero est dans une pastille a cote du X.
      // Aucun nom sur la carte -> chevauchement physiquement impossible.
      const numberedIcon = (n) => L.divIcon({
        html: `<div style="position:relative;width:14px;height:14px;">
          <svg width="14" height="14" viewBox="0 0 16 16" style="display:block;">
            <line x1="2" y1="2" x2="14" y2="14" stroke="#c4962a" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="14" y1="2" x2="2" y2="14" stroke="#c4962a" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <div style="position:absolute;top:-7px;left:13px;min-width:14px;height:14px;padding:0 3px;
            background:rgba(8,8,8,0.9);border:1px solid rgba(196,150,42,0.6);border-radius:7px;
            display:flex;align-items:center;justify-content:center;
            font-size:9px;font-weight:600;color:#c4962a;font-family:system-ui;line-height:1;">${n}</div>
        </div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        className: '',
      });

      pts.forEach((pt, i) => {
        const marker = L.marker([pt.lat, pt.lng], { icon: numberedIcon(i + 1) }).addTo(map);
        marker.bindPopup(`
          <div style="background:#111;border:1px solid #2a2a2a;padding:10px 14px;font-family:system-ui;color:#f5f0e8;min-width:120px;">
            ${pt.day ? `<div style="color:#c4962a;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:4px;">Jour ${pt.day}</div>` : ''}
            <div style="font-size:13px;">${pt.label || ''}</div>
          </div>
        `, { className: 'custom-popup' });
      });

      setLegend(pts.map((pt, i) => ({ n: i + 1, label: pt.label })));
    });

    return () => {
      if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
    };
  }, [waypoints, centerLat, centerLng, country]);

  if (!validPts.length) return null;

  return (
    <div>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper { background:transparent!important; border:none!important; box-shadow:none!important; padding:0!important; }
        .custom-popup .leaflet-popup-content { margin:0!important; }
        .custom-popup .leaflet-popup-tip { background:#111!important; }
        .leaflet-tile-pane { filter: brightness(2.3) contrast(1.6) saturate(1.2); }
      `}</style>
      <div ref={mapRef} style={{ width: '100%', height: '400px', background: '#0d0d0d' }} />

      {legend.length > 0 && (
        <div style={{
          marginTop: '12px',
          display: 'grid',
          gridTemplateColumns: legend.length > 5 ? '1fr 1fr' : '1fr',
          gap: '4px 16px',
        }}>
          {legend.map(({ n, label }) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <span style={{
                flexShrink: 0,
                minWidth: '16px', height: '16px', padding: '0 3px',
                background: 'rgba(8,8,8,0.9)', border: '1px solid rgba(196,150,42,0.6)', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', fontWeight: 600, color: '#c4962a', fontFamily: 'system-ui', lineHeight: 1,
              }}>{n}</span>
              <span style={{
                fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(245,240,232,0.8)', fontFamily: 'system-ui',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
