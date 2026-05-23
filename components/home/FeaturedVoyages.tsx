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

  return (
    <section style={{ background: '#080808', paddingBottom: '120px' }}>

      {/* ── Section title ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '100px 48px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'system-ui', fontSize: '10px', letterSpacing: '0.4em', color: '#c4962a', textTransform: 'uppercase', margin: '0 0 16px' }}>
              — {voyages.length} Destinations
            </p>
            <h2 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 'clamp(3rem,6vw,5.5rem)', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: 0, lineHeight: 0.95, letterSpacing: '-0.01em' }}>
              Voyages
            </h2>
          </div>
          <Link href="/voyages" style={{ fontFamily: 'system-ui', fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(245,240,232,0.25)', textDecoration: 'none', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '8px', transition: 'color .3s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#c4962a'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,232,0.25)'}>
            Voir tout
            <span style={{ display: 'block', width: '48px', height: '1px', background: 'currentColor' }} />
          </Link>
        </div>
      </div>

      {/* ── Voyages list ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
        {voyages.map((v, i) => {
          const img = getImg(v);
          const year = getYear(v);
          const num = String(i + 1).padStart(2, '0');
          const isHov = hovered === i;

          return (
            <Link key={v.slug||v.id} href={`/voyages/${v.slug||v.id}`}
              style={{ display: 'grid', gridTemplateColumns: '64px 1fr 320px', alignItems: 'center', gap: '0', textDecoration: 'none', padding: '28px 0', borderTop: '1px solid rgba(255,255,255,0.06)', transition: 'background .3s', cursor: 'pointer' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}>

              {/* Number */}
              <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '13px', color: isHov ? '#c4962a' : 'rgba(196,150,42,0.3)', letterSpacing: '0.15em', transition: 'color .3s', paddingTop: '2px' }}>
                {num}
              </span>

              {/* Title + meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div>
                  <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(1.6rem,3vw,2.6rem)', fontWeight: 300, fontStyle: 'italic', color: isHov ? '#f5f0e8' : 'rgba(245,240,232,0.75)', margin: 0, lineHeight: 1, transition: 'color .3s' }}>
                    {v.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                    <span style={{ fontFamily: 'system-ui', fontSize: '10px', letterSpacing: '0.25em', color: '#c4962a', textTransform: 'uppercase' }}>
                      {v.country}
                    </span>
                    {year && <>
                      <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
                      <span style={{ fontFamily: 'system-ui', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>{year}</span>
                    </>}
                    {(v.photos||[]).length > 0 && <>
                      <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
                      <span style={{ fontFamily: 'system-ui', fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>{v.photos.length} photos</span>
                    </>}
                  </div>
                </div>

                {/* Arrow */}
                <span style={{ fontFamily: 'system-ui', fontSize: '18px', color: '#c4962a', opacity: isHov ? 1 : 0, transform: isHov ? 'translateX(0)' : 'translateX(-8px)', transition: 'all .3s', marginLeft: '8px' }}>
                  →
                </span>
              </div>

              {/* Thumbnail — appears on hover */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ position: 'relative', width: isHov ? '280px' : '220px', height: isHov ? '160px' : '120px', overflow: 'hidden', transition: 'all .4s cubic-bezier(0.22,1,0.36,1)', opacity: isHov ? 1 : 0.35 }}>
                  {img ? (
                    <Image src={img} alt={v.title} fill style={{ objectFit: 'cover', transition: 'transform .6s ease', transform: isHov ? 'scale(1.05)' : 'scale(1)' }} sizes="320px" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#111' }} />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
                </div>
              </div>
            </Link>
          );
        })}

        {/* Last line */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
      </div>
    </section>
  );
}
