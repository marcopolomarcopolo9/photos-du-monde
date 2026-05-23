// @ts-nocheck
'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WorldMap() {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const [voyages, setVoyages] = useState([]);

  useEffect(() => {
    fetch('/api/voyages')
      .then(r => r.json())
      .then(d => setVoyages(d.voyages || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!mapRef.current || !voyages.length || instanceRef.current) return;

    import('leaflet').then(Lm => {
      const L = Lm.default;

      const pts = voyages.map(v => ({
        lat: v.lat || (v.country?.toLowerCase().includes('norvège') || v.country?.toLowerCase().includes('norvege') ? 78.2 : null),
        lng: v.lng || (v.country?.toLowerCase().includes('norvège') || v.country?.toLowerCase().includes('norvege') ? 15.6 : null),
        title: v.title,
        country: v.country,
        slug: v.slug || v.id,
        photos: (v.photos || []).length,
      })).filter(p => p.lat && p.lng);

      if (!pts.length) return;

      const map = L.map(mapRef.current, {
        center: [25, 10],
        zoom: 2,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      });
      instanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

      pts.forEach(pt => {
        const icon = L.divIcon({
          html: `<div class="pm-marker">
            <div class="pm-dot"></div>
            <div class="pm-badge">
              <div class="pm-badge-name">${pt.country}</div>
              <div class="pm-badge-photos">${pt.photos} photos</div>
            </div>
          </div>`,
          iconSize: [120, 50],
          iconAnchor: [60, 4],
          className: '',
        });

        L.marker([pt.lat, pt.lng], { icon }).addTo(map)
          .on('click', () => {
            window.location.href = `/voyages/${pt.slug}`;
          });
      });
    });

    return () => {
      if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
    };
  }, [voyages]);

  if (!voyages.length) return null;

  return (
    <section style={{ background: '#070707', padding: '0 0 80px' }}>
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 48px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <div style={{ width: '36px', height: '1px', background: '#c4962a' }} />
          <span style={{ fontSize: '10px', letterSpacing: '0.36em', color: '#c4962a', textTransform: 'uppercase', fontFamily: 'system-ui' }}>
            {voyages.length} destination{voyages.length > 1 ? 's' : ''} · {voyages.reduce((a, v) => a + (v.photos || []).length, 0)} photos
          </span>
        </div>
        <h2 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 'clamp(1.8rem,4vw,3.2rem)', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: 0 }}>
          Le monde exploré
        </h2>
      </div>

      {/* Map */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>{`
          .pm-marker { display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; }
          .pm-dot { width:8px; height:8px; border-radius:50%; background:#c4962a; transition:transform .2s; }
          .pm-marker:hover .pm-dot { transform:scale(1.6); }
          .pm-badge { background:rgba(8,8,8,0.88); border:1px solid rgba(196,150,42,0.35); padding:4px 9px; white-space:nowrap; text-align:center; transition:border-color .2s; }
          .pm-marker:hover .pm-badge { border-color:rgba(196,150,42,0.8); }
          .pm-badge-name { font-size:10px; letter-spacing:0.15em; color:#f5f0e8; text-transform:uppercase; font-family:system-ui; }
          .pm-badge-photos { font-size:9px; color:#c4962a; font-family:system-ui; margin-top:1px; }
          .leaflet-container { background:#0a0a0a !important; }
          .leaflet-tile { filter: brightness(0.18) saturate(0.3) sepia(0.2); }
        `}</style>
        <div ref={mapRef} style={{ width: '100%', height: '420px', background: '#0a0a0a' }} />
      </div>
    </section>
  );
}
