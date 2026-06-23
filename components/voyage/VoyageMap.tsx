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

      pts.forEach((pt, i) => {
        const marker = L.marker([pt.lat, pt.lng], {
          icon: xIcon(i === 0),
        }).addTo(map);

        // Label avec direction anti-chevauchement
        const dir = (() => {
          for (let j = 0; j < i; j++) {
            const o = pts[j];
            if (Math.abs(pt.lat - o.lat) < 4 && Math.abs(pt.lng - o.lng) < 6) {
              return pt.lat < o.lat ? 'bottom' : 'top';
            }
          }
          return 'right';
        })();
        const offsets = { right: [10, 0], left: [-10, 0], top: [0, -10], bottom: [0, 10] };
        L.tooltip({ permanent: true, direction: dir, offset: offsets[dir] })
          .setContent(`<span style="font-size:9px;letter-spacing:0.18em;color:rgba(245,240,232,0.65);text-transform:uppercase;font-family:system-ui;background:transparent;border:none;box-shadow:none;">${pt.label}</span>`)
          .setLatLng([pt.lat, pt.lng])
          .addTo(map);

        marker.bindPopup(`
          <div style="background:#111;border:1px solid #2a2a2a;padding:10px 14px;font-family:system-ui;color:#f5f0e8;min-width:120px;">
            <div style="color:#c4962a;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:4px;">${pt.day ? `Jour ${pt.day}` : `Étape ${i+1}`}</div>
            <div style="font-size:13px;">${pt.label || ''}</div>
          </div>
        `, { className: 'custom-popup' });
      });
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
