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
          const ya = parseInt(String(a.startDate || a.date || '2000').match(/\d{4}/)?.[0] || '2000');
          const yb = parseInt(String(b.startDate || b.date || '2000').match(/\d{4}/)?.[0] || '2000');
          return yb - ya;
        });
        setVoyages(sorted);
      })
      .catch(() => {});
  }, []);

  if (!voyages.length) return null;

  const getImg = (v) => v.heroImage || v.coverImage || '';
  const getYear = (v) => String(v.startDate || v.date || '').match(/\d{4}/)?.[0] || '';

  const [main, ...rest] = voyages;

  const CardImage = ({ v }) => {
    const img = getImg(v);
    if (!img) return <div style={{ position: 'absolute', inset: 0, background: '#111' }} />;
    return (
      <Image
        src={img}
        alt={v.title}
        fill
        style={{ objectFit: 'cover', transition: 'transform 0.8s ease', transform: hovered === (v.slug||v.id||'main') ? 'scale(1.04)' : 'scale(1)' }}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );
  };

  return (
    <section style={{ background: '#070707', padding: '0 0 100px' }}>

      {/* Header */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '90px 48px 56px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '1px', background: '#c4962a' }} />
              <span style={{ fontSize: '10px', letterSpacing: '0.36em', color: '#c4962a', textTransform: 'uppercase', fontFamily: 'system-ui' }}>
                {voyages.length} destination{voyages.length > 1 ? 's' : ''}
              </span>
            </div>
            <h2 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: 0, lineHeight: 1.05 }}>
              Voyages
            </h2>
          </div>
          <Link href="/voyages" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(245,240,232,0.35)', textDecoration: 'none', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', fontFamily: 'system-ui' }}>
            Voir tous <span style={{ display: 'block', width: '40px', height: '1px', background: 'currentColor' }} />
          </Link>
        </div>
      </div>

      {/* Main big card */}
      {main && (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px', marginBottom: '3px' }}>
          <Link href={`/voyages/${main.slug || main.id}`}
            style={{ display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden', height: 'clamp(380px,55vh,620px)' }}
            onMouseEnter={() => setHovered('main')} onMouseLeave={() => setHovered(null)}>
            <CardImage v={{ ...main, slug: 'main' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.2) 50%,transparent 100%)', zIndex: 1 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(0,0,0,0.6) 0%,transparent 60%)', zIndex: 1 }} />
            <div style={{ position: 'absolute', top: '32px', left: '36px', zIndex: 2, fontFamily: '"Cormorant Garamond",serif', fontSize: '11px', color: 'rgba(196,150,42,0.5)', letterSpacing: '0.25em' }}>01</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 48px', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '24px', height: '1px', background: '#c4962a' }} />
                <span style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#c4962a', textTransform: 'uppercase', fontFamily: 'system-ui' }}>
                  {main.country}{getYear(main) ? ` · ${getYear(main)}` : ''}
                </span>
              </div>
              <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: '0 0 14px', lineHeight: 1.1 }}>
                {main.title}
              </h3>
              {main.description && (
                <p style={{ fontFamily: 'system-ui', fontSize: '13px', color: 'rgba(245,240,232,0.5)', margin: 0, maxWidth: '480px', lineHeight: 1.8 }}>
                  {main.description.slice(0,120)}{main.description.length > 120 ? '…' : ''}
                </p>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Rest grid */}
      {rest.length > 0 && (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: rest.length === 1 ? '1fr' : rest.length === 2 ? '1fr 1fr' : 'repeat(3,1fr)',
            gap: '3px', marginTop: '3px',
          }}>
            {rest.map((v, i) => (
              <Link key={v.slug||v.id} href={`/voyages/${v.slug||v.id}`}
                style={{ display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden', height: rest.length <= 2 ? '380px' : '300px' }}
                onMouseEnter={() => setHovered(v.slug||v.id)} onMouseLeave={() => setHovered(null)}>
                <CardImage v={v} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.1) 60%,transparent 100%)', zIndex: 1 }} />
                <div style={{ position: 'absolute', top: '20px', left: '24px', zIndex: 2, fontFamily: '"Cormorant Garamond",serif', fontSize: '11px', color: 'rgba(196,150,42,0.5)', letterSpacing: '0.25em' }}>
                  {String(i+2).padStart(2,'0')}
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <span style={{ fontFamily: 'system-ui', fontSize: '9px', letterSpacing: '0.28em', color: '#c4962a', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      {v.country}{getYear(v) ? ` · ${getYear(v)}` : ''}
                    </span>
                    <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(1.2rem,2vw,1.6rem)', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: 0, lineHeight: 1.15 }}>
                      {v.title}
                    </h3>
                  </div>
                  <div style={{ width: '38px', height: '38px', flexShrink: 0, border: `1px solid ${hovered===(v.slug||v.id)?'#c4962a':'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '16px' }}>
                    <span style={{ color: hovered===(v.slug||v.id)?'#c4962a':'rgba(255,255,255,0.4)', fontSize: '15px' }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
