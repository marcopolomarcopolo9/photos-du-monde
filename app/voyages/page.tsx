// @ts-nocheck
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { cloudinaryUrl } from '@/lib/cloudinary';
import ScrollReveal from '@/components/ui/ScrollReveal';

function VoyageCard({ v, index }: { v: any; index: number }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const photos = (v.photos || []).map((p: any) => typeof p === 'string' ? p : p.src).filter(Boolean);
  const mainImg = v.heroImage || v.coverImage || photos[0] || '';
  const allImgs = mainImg ? [mainImg, ...photos.filter((p: string) => p !== mainImg)].slice(0, 6) : photos.slice(0, 6);
  const getYear = () => String(v.startDate || v.date || '').match(/\d{4}/)?.[0] || '';

  useEffect(() => {
    if (isHovered && allImgs.length > 1) {
      intervalRef.current = setInterval(() => setCurrent(c => (c + 1) % allImgs.length), 3000);
    } else {
      clearInterval(intervalRef.current);
      setCurrent(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isHovered, allImgs.length]);

  return (
    <Link href={`/voyages/${v.slug || v.id}`}
      style={{ display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden', aspectRatio: '3/4', maxHeight: '450px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>

      {allImgs.map((img: string, i: number) => (
        <Image key={img} src={cloudinaryUrl(img)} alt={v.title} fill
          style={{ objectFit: 'cover', opacity: i === current ? 1 : 0, transition: 'opacity 0.8s ease', zIndex: i === current ? 1 : 0 }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={index < 3 && i === 0} />
      ))}
      {!allImgs.length && <div style={{ position: 'absolute', inset: 0, background: '#111' }} />}

      {/* Overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.05) 100%)', zIndex: 2 }} />

      {/* Dot */}
      <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 3, width: '5px', height: '5px', borderRadius: '50%', background: isHovered ? '#c4962a' : 'rgba(196,150,42,0.35)', transition: 'background .3s' }} />

      {/* Counter */}
      {isHovered && allImgs.length > 1 && (
        <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 3, fontFamily: 'system-ui', fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>
          {current + 1} / {allImgs.length}
        </div>
      )}

      {/* Text box */}
      <div style={{ position: 'absolute', bottom: '10px', left: '9px', right: '9px', padding: '11px 13px', zIndex: 3, border: '1.5px solid rgba(255,255,255,0.35)', background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}>
        <div style={{ width: '16px', height: '1px', background: '#c4962a', marginBottom: '8px' }} />
        <p style={{ fontFamily: 'system-ui', fontSize: '13px', letterSpacing: '0.2em', color: '#c4962a', textTransform: 'uppercase', margin: '0 0 7px', fontWeight: 700 }}>
          {v.country}{getYear() ? ` · ${getYear()}` : ''}
        </p>
        <h3 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: '26px', fontWeight: 300, fontStyle: 'italic', color: '#f5f0e8', margin: isHovered ? '0 0 10px' : '0', lineHeight: 1.1, transition: 'transform .4s', transform: isHovered ? 'translateY(-2px)' : 'translateY(0)' }}>
          {v.title}
        </h3>
        {isHovered && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'system-ui', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Découvrir</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ width: '24px', height: '24px', border: '1px solid rgba(196,150,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#c4962a', fontSize: '11px' }}>→</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {isHovered && allImgs.length > 1 && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.08)', zIndex: 4 }}>
          <div key={current} style={{ height: '100%', background: '#c4962a', width: '100%', animation: 'progress 3s linear forwards' }} />
        </div>
      )}

      <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
    </Link>
  );
}

export default function VoyagesPage() {
  const [voyages, setVoyages] = useState([]);

  useEffect(() => {
    fetch('/api/voyages').then(r => r.json()).then(d => setVoyages(d.voyages || [])).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-noir pt-28 pb-24">
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 clamp(24px,5vw,80px)" }}>
        <ScrollReveal className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-or" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">
              {voyages.length} voyage{voyages.length !== 1 ? 's' : ''}
            </span>
          </div>
          <h1 className="font-serif font-light text-5xl md:text-6xl text-creme italic">Destinations</h1>
        </ScrollReveal>

        {voyages.length === 0 ? (
          <div className="text-center py-24 text-creme/30 font-poppins text-sm">Aucun voyage publié pour le moment.</div>
        ) : (
          <div className="voyage-grid" style={{ maxWidth: "1200px", margin: "0 auto", gap: "20px" }}>
            {voyages.map((v: any, i: number) => (
              <VoyageCard key={v.slug || v.id} v={v} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
