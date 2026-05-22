// @ts-nocheck
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FEATURED_VOYAGES } from '@/lib/data';
import { useState } from 'react';

export default function FeaturedVoyages() {
  const voyages = FEATURED_VOYAGES.slice(0, 4);
  const [hovered, setHovered] = useState<string | null>(null);

  if (!voyages.length) return null;

  const main = voyages[0];
  const others = voyages.slice(1);

  const getYear = (d: string) => {
    if (!d) return '';
    const m = d.match(/\d{4}/);
    return m ? m[0] : '';
  };

  const getImg = (v: any) => v.heroImage || v.coverImage || '';

  return (
    <section style={{ background: '#070707', padding: '0' }}>

      {/* ── Header ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '1px', background: '#c4962a' }} />
            <span style={{ fontSize: '10px', letterSpacing: '0.32em', color: '#c4962a', textTransform: 'uppercase', fontFamily: 'system-ui' }}>Explorations</span>
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: 0, lineHeight: 1.1 }}>
            Derniers voyages
          </h2>
        </div>
        <Link href="/voyages" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', transition: 'color .3s', fontFamily: 'system-ui' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#c4962a')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.4)')}>
          Tout voir
          <span style={{ display: 'block', width: '32px', height: '1px', background: 'currentColor' }} />
        </Link>
      </div>

      {/* ── Main layout ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>

        {/* Big card left */}
        {main && (
          <Link href={`/voyages/${main.slug || main.id}`} style={{ display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden', aspectRatio: '3/4', gridRow: 'span 2' }}
            onMouseEnter={() => setHovered(main.slug || main.id)}
            onMouseLeave={() => setHovered(null)}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${getImg(main)})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.8s cubic-bezier(0.22,1,0.36,1)', transform: hovered === (main.slug||main.id) ? 'scale(1.04)' : 'scale(1)' }} />
            {/* Gradient */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />
            {/* Number */}
            <div style={{ position: 'absolute', top: '24px', left: '24px', fontFamily: '"Cormorant Garamond",serif', fontSize: '13px', color: 'rgba(196,150,42,0.6)', letterSpacing: '0.2em' }}>01</div>
            {/* Content */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '20px', height: '1px', background: '#c4962a' }} />
                <span style={{ fontSize: '10px', letterSpacing: '0.28em', color: '#c4962a', textTransform: 'uppercase', fontFamily: 'system-ui' }}>{main.country} {getYear(main.startDate || main.date) && `· ${getYear(main.startDate||main.date)}`}</span>
              </div>
              <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: '0 0 12px', lineHeight: 1.15 }}>
                {main.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.5)', margin: '0 0 20px', lineHeight: 1.7, maxWidth: '380px', fontFamily: 'system-ui' }}>
                {(main.description || '').slice(0, 100)}{main.description?.length > 100 ? '...' : ''}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: hovered === (main.slug||main.id) ? 1 : 0, transition: 'opacity .4s' }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#c4962a', textTransform: 'uppercase', fontFamily: 'system-ui' }}>Découvrir</span>
                <div style={{ width: '40px', height: '1px', background: '#c4962a' }} />
              </div>
            </div>
          </Link>
        )}

        {/* Right column — stacked cards */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '3px' }}>
          {others.slice(0, 2).map((v, i) => (
            <Link key={v.slug||v.id} href={`/voyages/${v.slug||v.id}`} style={{ display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={() => setHovered(v.slug||v.id)}
              onMouseLeave={() => setHovered(null)}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${getImg(v)})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)', transform: hovered === (v.slug||v.id) ? 'scale(1.05)' : 'scale(1)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }} />
              {/* Number */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', fontFamily: '"Cormorant Garamond",serif', fontSize: '13px', color: 'rgba(196,150,42,0.6)', letterSpacing: '0.2em' }}>0{i+2}</div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontSize: '10px', letterSpacing: '0.28em', color: '#c4962a', textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontFamily: 'system-ui' }}>{v.country}</span>
                  <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(1.2rem,2.5vw,1.7rem)', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: 0, lineHeight: 1.2 }}>
                    {v.title}
                  </h3>
                </div>
                <div style={{ width: '36px', height: '36px', border: `1px solid ${hovered === (v.slug||v.id) ? '#c4962a' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s', background: hovered === (v.slug||v.id) ? 'rgba(196,150,42,0.1)' : 'transparent', flexShrink: 0 }}>
                  <span style={{ color: hovered === (v.slug||v.id) ? '#c4962a' : 'rgba(255,255,255,0.4)', fontSize: '14px', transition: 'color .3s' }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 4th voyage — horizontal banner ── */}
      {others[2] && (
        <Link href={`/voyages/${others[2].slug||others[2].id}`} style={{ display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden', height: '220px', maxWidth: '1400px', margin: '0 auto', padding: '0 40px 80px' }}
          onMouseEnter={() => setHovered('banner')} onMouseLeave={() => setHovered(null)}>
          <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${getImg(others[2])})`, backgroundSize: 'cover', backgroundPosition: 'center 40%', transition: 'transform 0.7s ease', transform: hovered === 'banner' ? 'scale(1.03)' : 'scale(1)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 40px', gap: '32px' }}>
              <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '13px', color: 'rgba(196,150,42,0.6)', letterSpacing: '0.2em' }}>04</span>
              <div style={{ width: '1px', height: '60px', background: 'rgba(196,150,42,0.3)' }} />
              <div>
                <span style={{ fontSize: '10px', letterSpacing: '0.28em', color: '#c4962a', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontFamily: 'system-ui' }}>{others[2].country}</span>
                <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '2rem', fontWeight: 300, color: '#f5f0e8', fontStyle: 'italic', margin: 0 }}>
                  {others[2].title}
                </h3>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px', opacity: hovered === 'banner' ? 1 : 0, transition: 'opacity .4s' }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#c4962a', textTransform: 'uppercase', fontFamily: 'system-ui' }}>Découvrir</span>
                <div style={{ width: '48px', height: '1px', background: '#c4962a' }} />
              </div>
            </div>
          </div>
        </Link>
      )}

    </section>
  );
}
