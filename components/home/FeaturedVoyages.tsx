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
      }, 2400);
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
      <div style={{ position: 'absolute', top: '16px', left: '18px', zIndex: 3, fontFamily: '"Cormorant Garamond",serif', fontSize: '11px', color: isHovered ? '#c4962a' : 'rgba(196,150,42,0.4)', letterSpacing: '0.2em', transition: 'color .3s' }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Photo counter */}
      {isHovered && allImgs.length > 1 && (
        <div style={{ position: 'absolute', top: '16px', right: '18px', zIndex: 3, fontFamily: 'system-ui', fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
          {current + 1} / {allImgs.length}
        </div>
      )}

      {/* Progress bar */}
      {isHovered && allImgs.length > 1 && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 4 }}>
          <div key={current} style={{ height: '100%', background: '#c4962a', width: '100%', animation: 'progress 1.2s linear' }} />
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px', zIndex: 3, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
        <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '24px', fontWeight: 300, fontStyle: 'italic', color: '#f5f0e8', margin: '0 0 10px', lineHeight: 1.1, textShadow: '0 1px 8px rgba(0,0,0,0.8)', transition: 'transform .4s', transform: isHovered ? 'translateY(-4px)' : 'translateY(0)' }}>
          {v.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '14px', height: '1px', background: '#c4962a' }} />
          <span style={{ fontFamily: 'system-ui', fontSize: '10px', letterSpacing: '0.3em', color: '#c4962a', textTransform: 'uppercase' }}>
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

  const cols = voyages.length === 1 ? '1fr' : voyages.length === 2 ? '1fr 1fr' : 'repeat(3, 1fr)';

  return (
    <section style={{ background: '#080808', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 48px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'system-ui', fontSize: '10px', letterSpacing: '0.4em', color: '#c4962a', textTransform: 'uppercase', margin: '0 0 12px' }}>
              — {voyages.length} Destination{voyages.length > 1 ? 's' : ''}
            </p>
            <h2 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 'clamp(2.4rem,5vw,4.5rem)', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: 0, lineHeight: 0.95 }}>
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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '3px' }}>
          {voyages.map((v, i) => <VoyageCard key={v.slug||v.id} v={v} index={i} />)}
        </div>
      </div>
    </section>
  );
}
