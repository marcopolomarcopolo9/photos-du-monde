// @ts-nocheck
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function FeaturedVoyages() {
  const [voyages, setVoyages] = useState([]);
  const [hovered, setHovered] = useState(null);

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

  const getImg = (v) => v.heroImage || v.coverImage || '';
  const getYear = (v) => String(v.startDate||v.date||'').match(/\d{4}/)?.[0] || '';

  const cols = voyages.length === 1 ? '1fr' : voyages.length === 2 ? '1fr 1fr' : 'repeat(3, 1fr)';

  return (
    <section style={{ background: '#080808', paddingBottom: '120px' }}>

      {/* Header */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '100px 48px 56px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'system-ui', fontSize: '10px', letterSpacing: '0.4em', color: '#c4962a', textTransform: 'uppercase', margin: '0 0 14px' }}>
              — {voyages.length} Destination{voyages.length > 1 ? 's' : ''}
            </p>
            <h2 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 'clamp(3rem,6vw,5.5rem)', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: 0, lineHeight: 0.95 }}>
              Voyages
            </h2>
          </div>
          <Link href="/voyages" style={{ fontFamily: 'system-ui', fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(245,240,232,0.25)', textDecoration: 'none', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '8px' }}
            onMouseEnter={e => e.currentTarget.style.color = '#c4962a'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,232,0.25)'}>
            Voir tout <span style={{ display: 'block', width: '48px', height: '1px', background: 'currentColor' }} />
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '3px' }}>
          {voyages.map((v, i) => {
            const img = getImg(v);
            const year = getYear(v);
            const isHov = hovered === i;

            return (
              <Link key={v.slug||v.id} href={`/voyages/${v.slug||v.id}`}
                style={{ display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden', aspectRatio: '3/4' }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}>

                {/* Image */}
                {img ? (
                  <Image src={img} alt={v.title} fill
                    style={{ objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)', transform: isHov ? 'scale(1.05)' : 'scale(1)' }}
                    sizes="(max-width: 768px) 100vw, 33vw" />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: '#111' }} />
                )}

                {/* Overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)', transition: 'opacity .4s', opacity: isHov ? 1 : 0.85 }} />

                {/* Number top left */}
                <div style={{ position: 'absolute', top: '20px', left: '22px', fontFamily: '"Cormorant Garamond",serif', fontSize: '12px', color: 'rgba(196,150,42,0.5)', letterSpacing: '0.2em' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Content bottom — titre en haut, pays en bas */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 22px' }}>
                  <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(1.3rem,2.2vw,1.8rem)', fontWeight: 300, fontStyle: 'italic', color: '#f5f0e8', margin: '0 0 10px', lineHeight: 1.15, transition: 'transform .4s', transform: isHov ? 'translateY(-4px)' : 'translateY(0)' }}>
                    {v.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '16px', height: '1px', background: '#c4962a' }} />
                    <span style={{ fontFamily: 'system-ui', fontSize: '9px', letterSpacing: '0.3em', color: '#c4962a', textTransform: 'uppercase' }}>
                      {v.country}{year ? ` · ${year}` : ''}
                    </span>
                  </div>

                  {/* Arrow on hover */}
                  <div style={{ marginTop: '14px', opacity: isHov ? 1 : 0, transform: isHov ? 'translateY(0)' : 'translateY(6px)', transition: 'all .3s', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'system-ui', fontSize: '10px', letterSpacing: '0.2em', color: '#c4962a', textTransform: 'uppercase' }}>Découvrir</span>
                    <div style={{ width: '32px', height: '1px', background: '#c4962a' }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
