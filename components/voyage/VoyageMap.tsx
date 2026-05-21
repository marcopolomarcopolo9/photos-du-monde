// @ts-nocheck
'use client';
import { useEffect, useRef } from 'react';

interface Waypoint {
  lat: number;
  lng: number;
  label: string;
  day?: number;
}

interface Props {
  waypoints: Waypoint[];
  country: string;
  centerLat?: number;
  centerLng?: number;
}

export default function VoyageMap({ waypoints, country, centerLat, centerLng }: Props) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;
    if (!waypoints?.length && !centerLat) return;

    let L;
    import('leaflet').then(mod => {
      L = mod.default;

      // Fix default icon
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const pts = waypoints?.length ? waypoints : [{ lat: centerLat, lng: centerLng, label: country }];

      // Center & zoom
      const lats = pts.map(p => p.lat);
      const lngs = pts.map(p => p.lng);
      const centerLt = (Math.min(...lats) + Math.max(...lats)) / 2;
      const centerLn = (Math.min(...lngs) + Math.max(...lngs)) / 2;

      const map = L.map(mapRef.current, {
        center: [centerLt, centerLn],
        zoom: pts.length === 1 ? 7 : 6,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      instanceRef.current = map;

      // Dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 18,
      }).addTo(map);

      // Draw route line
      if (pts.length > 1) {
        const latlngs = pts.map(p => [p.lat, p.lng]);
        L.polyline(latlngs, {
          color: '#c4962a',
          weight: 2.5,
          opacity: 0.8,
          dashArray: '6, 8',
        }).addTo(map);

        // Fit bounds with padding
        const bounds = L.latLngBounds(latlngs);
        map.fitBounds(bounds, { padding: [48, 48] });
      }

      // Custom marker icon
      const makeIcon = (num, isFirst, isLast) => L.divIcon({
        html: `<div style="
          width:${isFirst || isLast ? 32 : 24}px;
          height:${isFirst || isLast ? 32 : 24}px;
          background:${isFirst ? '#c4962a' : isLast ? '#c4962a' : '#1a1a1a'};
          border:2px solid ${isFirst || isLast ? '#f5f0e8' : '#c4962a'};
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          color:${isFirst || isLast ? '#0a0a0a' : '#c4962a'};
          font-size:10px;
          font-weight:700;
          font-family:system-ui;
          box-shadow:0 2px 12px rgba(0,0,0,0.6);
        ">${num}</div>`,
        className: '',
        iconSize: [isFirst || isLast ? 32 : 24, isFirst || isLast ? 32 : 24],
        iconAnchor: [isFirst || isLast ? 16 : 12, isFirst || isLast ? 16 : 12],
      });

      // Add markers
      pts.forEach((pt, i) => {
        const isFirst = i === 0;
        const isLast = i === pts.length - 1;
        const marker = L.marker([pt.lat, pt.lng], {
          icon: makeIcon(i + 1, isFirst, isLast),
        }).addTo(map);

        const dayInfo = pt.day ? `Jour ${pt.day}` : `Étape ${i + 1}`;
        marker.bindPopup(`
          <div style="background:#111;border:1px solid #2a2a2a;border-radius:8px;padding:12px 14px;min-width:140px;font-family:system-ui;color:#f5f0e8">
            <div style="color:#c4962a;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:4px">${dayInfo}</div>
            <div style="font-size:14px;font-weight:500">${pt.label || 'Étape'}</div>
          </div>
        `, { className: 'custom-popup' });
      });
    });

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [waypoints, centerLat, centerLng, country]);

  if (!waypoints?.length && !centerLat) return null;

  return (
    <div>
      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0 !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: #111 !important;
        }
        .leaflet-control-zoom {
          border: 1px solid #2a2a2a !important;
          background: #111 !important;
        }
        .leaflet-control-zoom a {
          background: #111 !important;
          color: #c4962a !important;
          border-color: #2a2a2a !important;
        }
        .leaflet-control-zoom a:hover {
          background: #1a1a1a !important;
        }
      `}</style>
      <div ref={mapRef} style={{ width:'100%', height:'420px', borderRadius:'4px', background:'#0d0d0d' }} />
    </div>
  );
}
