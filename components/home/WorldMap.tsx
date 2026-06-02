// @ts-nocheck
'use client';
import { useEffect, useRef, useState } from 'react';

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
        lat: v.lat || null,
        lng: v.lng || null,
        title: v.title,
        country: v.country?.trim(),
        slug: v.slug || v.id,
        link: `/voyages/${v.slug || v.id}`,
        photos: (v.photos || []).length,
      })).filter(p => p.lat && p.lng);

      // Point spécial Svalbard → toutes les photos taguées "svalbard"
      const svalbardCount = voyages.reduce((acc, v) =>
        acc + (v.photos || []).filter(p => typeof p === 'object' && (p.categories || []).includes('svalbard')).length, 0);
      pts.push({
        lat: 78.2232,
        lng: 15.6267,
        title: 'Svalbard',
        country: 'Svalbard',
        link: '/categories/svalbard',
        photos: svalbardCount,
      });

      if (!pts.length) return;

      const map = L.map(mapRef.current, {
        center: [20, 10],
        zoom: 2,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: window.innerWidth >= 768,
        dragging: window.innerWidth >= 768,
        touchZoom: false,
        doubleClickZoom: false,
      });
      instanceRef.current = map;

      // Enable scroll zoom on desktop explicitly
      if (window.innerWidth >= 768) {
        map.scrollWheelZoom.enable();
        map.dragging.enable();
      }

      // Mobile: 2 fingers = zoom, 1 finger = pan when zoomed in
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      if (isMobile) {
        map.touchZoom.enable();
        const container = mapRef.current;
        let initialZoom = map.getZoom();
        
        const onTouchStart = (e) => {
          if (e.touches.length === 1) {
            const currentZoom = map.getZoom();
            if (currentZoom > initialZoom) {
              map.dragging.enable();
            } else {
              map.dragging.disable();
            }
          } else if (e.touches.length >= 2) {
            map.dragging.enable();
          }
        };
        
        container.addEventListener('touchstart', onTouchStart, { passive: true });
        map.on('zoomend', () => { initialZoom = isMobile ? 1 : 2; });
      }

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

      // Fit bounds
      const bounds = L.latLngBounds(pts.map(p => [p.lat, p.lng]));
      map.setView([20, 10], isMobile ? 1 : 2);

      // Smart direction to avoid overlap
      // For each point, check if another point is nearby and offset badge direction
      const getDirection = (pt, all) => {
        const nearby = all.filter(o => o !== pt && Math.abs(o.lat - pt.lat) < 15 && Math.abs(o.lng - pt.lng) < 30);
        if (!nearby.length) return 'bottom';
        const avgLat = nearby.reduce((a, o) => a + o.lat, 0) / nearby.length;
        const avgLng = nearby.reduce((a, o) => a + o.lng, 0) / nearby.length;
        if (pt.lat > avgLat) return 'top';
        if (pt.lng < avgLng) return 'left';
        return 'right';
      };

      pts.forEach((pt, i) => {
        const dir = getDirection(pt, pts);

        // Badge positioning based on direction
        const badgeStyle = {
          top:    'bottom:14px;left:50%;transform:translateX(-50%);',
          bottom: 'top:14px;left:50%;transform:translateX(-50%);',
          left:   'top:50%;right:14px;transform:translateY(-50%);',
          right:  'top:50%;left:14px;transform:translateY(-50%);',
        }[dir];

        const icon = L.divIcon({
          html: `<div style="position:relative;width:8px;height:8px;cursor:pointer;">
            <div class="pm-dot" style="width:8px;height:8px;border-radius:50%;background:#c4962a;position:relative;z-index:2;"></div>
            <div class="pm-badge" style="position:absolute;${badgeStyle}background:rgba(8,8,8,0.88);border:1px solid rgba(196,150,42,0.4);padding:4px 9px;white-space:nowrap;z-index:3;cursor:pointer;transition:border-color .2s;">
              <div style="font-size:10px;letter-spacing:0.15em;color:#f5f0e8;text-transform:uppercase;font-family:system-ui;">${pt.country}</div>
              <div style="font-size:9px;color:#c4962a;font-family:system-ui;margin-top:1px;">${pt.photos} photos</div>
            </div>
          </div>`,
          iconSize: [8, 8],
          iconAnchor: [4, 4],
          className: '',
        });

        const marker = L.marker([pt.lat, pt.lng], { icon }).addTo(map);
        
        marker.on('click', () => { window.location.href = pt.link; });
        

      });
    });

    return () => {
      if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
    };
  }, [voyages]);

  if (!voyages.length) return null;

  const totalPhotos = voyages.reduce((a, v) => a + (v.photos || []).length, 0);

  return (
    <section style={{ background: '#070707', padding: '0 0 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(32px,6vw,80px) clamp(16px,4vw,48px) clamp(20px,3vw,36px) 0' }}>

        <h2 className="md:ml-0 md:mt-0" style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 'clamp(1.8rem,4vw,3.2rem)', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: '12px 0 0 16px' }}>
          Le monde sans frontières
        </h2>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0' }}>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>{`
          .leaflet-container { background:#0a0a0a !important; }
          .leaflet-tile { filter: brightness(0.18) saturate(0.3) sepia(0.2); }
          .pm-dot:hover { transform: scale(1.8); }
        `}</style>
        <div ref={mapRef} className="world-map-container" style={{ width: '100%', background: '#0a0a0a' }} />
      </div>
    </section>
  );
}
