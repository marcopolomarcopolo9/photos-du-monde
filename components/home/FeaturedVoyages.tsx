// @ts-nocheck
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { useState, useEffect, useRef } from 'react';

function VoyageCard({ v, index }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const photos = (v.photos || []).map(p => typeof p === 'string' ? p : p.src).filter(Boolean);
  const mainImg = v.heroImage || v.coverImage || photos[0] || '';
  const allImgs = mainImg ? [mainImg, ...photos.filter(p => p !== mainImg)].slice(0, 6) : photos.slice(0, 6);
  const getYear = () => String(v.startDate || v.date || '').match(/\d{4}/)?.[0] || '';

  useEffect(() => {
    if (isHovered && allImgs.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrent(c => (c + 1) % allImgs.length);
      }, 3000);
    } else {
      clearInterval(intervalRef.current);
      setCurrent(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isHovered, allImgs.length]);

  return (
    <Link href={`/voyages/${v.slug || v.id}`}
      style={{ display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden', aspectRatio: '3/4', maxHeight: '420px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>

      {/* Photos crossfade */}
      {allImgs.map((img, i) => (
        <Image key={img} src={cloudinaryUrl(img)} alt={v.title} fill
          style={{ objectFit: 'cover', opacity: i === current ? 1 : 0, transition: 'opacity 0.8s ease', zIndex: i === current ? 1 : 0 }}
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={index === 0 && i === 0}
        />
      ))}
      {!allImgs.length && <div style={{ position: 'absolute', inset: 0, background: '#111' }} />}

      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.05) 100%)', zIndex: 2, transition: 'opacity .4s', opacity: isHovered ? 1 : 0.85 }} />

      {/* Number */}
      <div style={{ position: 'absolute', top: '18px', left: '18px', zIndex: 3, width: '6px', height: '6px', borderRadius: '50%', background: isHovered ? '#c4962a' : 'rgba(196,150,42,0.4)', transition: 'background .3s' }} />

      {/* Photo counter */}
      {isHovered && allImgs.length > 1 && (
        <div style={{ position: 'absolute', top: '16px', right: '18px', zIndex: 3, fontFamily: 'system-ui', fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
          {current + 1} / {allImgs.length}
        </div>
      )}

      {/* Progress bar */}
      {isHovered && allImgs.length > 1 && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 4 }}>
          <div key={current} style={{ height: '100%', background: '#c4962a', width: '100%', animation: 'progress 3s linear forwards' }} />
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'absolute', bottom: '12px', left: '10px', right: '10px', padding: '12px 14px', zIndex: 3, border: '1.5px solid rgba(255,255,255,0.35)', background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}>
        <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '48px', fontWeight: 300, fontStyle: 'italic', color: '#f5f0e8', margin: '0 0 10px', lineHeight: 1.1, textShadow: '0 1px 8px rgba(0,0,0,0.8)', transition: 'transform .4s', transform: isHovered ? 'translateY(-4px)' : 'translateY(0)' }}>
          {v.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '14px', height: '1px', background: '#c4962a' }} />
          <span style={{ fontFamily: 'system-ui', fontSize: '14px', letterSpacing: '0.3em', color: 'rgba(196,150,42,0.8)', textTransform: 'uppercase' }}>
            {v.country}{getYear() ? ` · ${getYear()}` : ''}
          </span>
        </div>
        <div style={{ marginTop: '12px', opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(6px)', transition: 'all .3s', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'system-ui', fontSize: '10px', letterSpacing: '0.2em', color: '#c4962a', textTransform: 'uppercase' }}>Découvrir</span>
          <div style={{ width: '28px', height: '1px', background: '#c4962a' }} />
        </div>
      </div>

      <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
    </Link>
  );
}

export default function FeaturedVoyages() {
  const [voyages, setVoyages] = useState([]);

  useEffect(() => {
    fetch('/api/voyages')
      .then(r => r.json())
      .then(d => {
        const sorted = (d.voyages || []).sort((a, b) => {
          const ya = parseInt(String(a.startDate||a.date||'2000').match(/\d{4}/)?.[0]||'2000');
          const yb = parseInt(String(b.startDate||b.date||'2000').match(/\d{4}/)?.[0]||'2000');
          return yb - ya;
        });
        setVoyages(sorted);
      })
      .catch(() => {});
  }, []);

  if (!voyages.length) return null;

  const cols = '1fr'; // handled by CSS

  return (
    <section style={{ background: '#080808', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(32px,6vw,80px) clamp(16px,4vw,48px) clamp(20px,4vw,48px)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'system-ui', fontSize: '10px', letterSpacing: '0.4em', color: '#c4962a', textTransform: 'uppercase', margin: '0 0 12px' }}>
              — {voyages.length} Destination{voyages.length > 1 ? 's' : ''}
            </p>
            <h2 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 'clamp(1.62rem,5.4vw,4.05rem)', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: 0, lineHeight: 0.95 }}>
              Voyages
            </h2>
          </div>
          <Link href="/voyages" style={{ fontFamily: 'system-ui', fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(245,240,232,0.25)', textDecoration: 'none', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '6px' }}
            onMouseEnter={e => e.currentTarget.style.color = '#c4962a'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,232,0.25)'}>
            Voir tout <span style={{ display: 'block', width: '40px', height: '1px', background: 'currentColor' }} />
          </Link>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px,4vw,48px)' }}>
        <div className="voyage-grid">
          {voyages.map((v, i) => <VoyageCard key={v.slug||v.id} v={v} index={i} />)}
        </div>
      </div>
    </section>
  );
}
