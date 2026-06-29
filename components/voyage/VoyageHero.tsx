// @ts-nocheck
'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function VoyageHero({ voyage }: { voyage: any }) {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setLoaded(true);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const img = voyage.heroImage || voyage.coverImage || '';
  const getYear = (d: string) => { if (!d) return ''; const m = String(d).match(/\d{4}/); return m ? m[0] : ''; };
  const year = getYear(voyage.startDate || voyage.date || '');

  return (
    <section ref={sectionRef} style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
      
      {/* Background with parallax */}
      {img && (
        <div style={{
          position: 'absolute', inset: '-15%',
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${scrollY * 0.4}px)`,
          willChange: 'transform',
          transition: 'opacity 1.2s ease',
          opacity: loaded ? 1 : 0,
        }} />
      )}
      {!img && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0a1208,#080808)' }} />}

      {/* Cinematic overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 100%)', zIndex: 1 }} />
      {/* Letterbox bars */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)', zIndex: 1 }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(16px,4vw,80px) clamp(24px,5vh,96px)' }}>
        
        {/* Back link */}
        <div style={{
          position: 'absolute', top: '-420px', left: 'clamp(24px,6vw,80px)',
          opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.8s ease 0.2s',
        }}>
          <Link href="/voyages" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'system-ui' }}
            onMouseEnter={e => e.currentTarget.style.color = '#c4962a'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
            ← Destinations
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', gap: '40px' }}>
          <div>
            {/* Eyebrow */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px',
              opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s ease 0.1s',
            }}>
              <div style={{ width: '40px', height: '1px', background: '#c4962a' }} />
              <span style={{ fontSize: '10px', letterSpacing: '0.35em', color: '#c4962a', textTransform: 'uppercase', fontFamily: 'system-ui' }}>
                {voyage.country2 && voyage.country2.trim() ? `${(voyage.country || '').trim()} et ${voyage.country2.trim()}` : voyage.country}{year ? ` · ${year}` : ''}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(1.8rem, 7vw, 6rem)',
              fontWeight: 300, fontStyle: 'italic',
              color: '#f5f0e8', margin: '0 0 24px', lineHeight: 1.05,
              opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1s ease 0.25s',
            }}>
              {voyage.title}
            </h1>


          </div>

          {/* Stats sidebar */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-end',
            opacity: loaded ? 1 : 0, transform: loaded ? 'translateX(0)' : 'translateX(20px)',
            transition: 'all 0.9s ease 0.5s',
          }}>
            {voyage.city && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '9px', letterSpacing: '0.3em', color: '#c4962a', textTransform: 'uppercase', fontFamily: 'system-ui', marginBottom: '4px' }}>Région</div>
                <div style={{ fontSize: '13px', color: 'rgba(245,240,232,0.7)', fontFamily: 'system-ui' }}>{voyage.city}</div>
              </div>
            )}
            {(voyage.photos || []).length > 0 && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '9px', letterSpacing: '0.3em', color: '#c4962a', textTransform: 'uppercase', fontFamily: 'system-ui', marginBottom: '4px' }}>Photos</div>
                <div style={{ fontSize: '13px', color: 'rgba(245,240,232,0.7)', fontFamily: 'system-ui' }}>{voyage.photos.length}</div>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 'clamp(24px,4vh,48px)', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          opacity: loaded ? 0.4 : 0, transition: 'opacity 1s ease 1s',
        }}>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(196,150,42,0.8), transparent)', animation: 'scrollPulse 2s ease-in-out infinite' }} />
        </div>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.3); }
        }
      `}</style>
    </section>
  );
}
