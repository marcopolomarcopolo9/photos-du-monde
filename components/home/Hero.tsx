// @ts-nocheck
'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [config, setConfig] = useState(null);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('/api/admin/homepage').then(r => r.json()).then(d => setConfig(d.config || d));
  }, []);

  const hero = config?.hero || {};
  const rawSlides = (hero.slides || []).filter(s => s && s.image);
  const slides = rawSlides.length > 0 ? rawSlides : hero.backgroundImage ? [{ image: hero.backgroundImage, country: '', caption: '' }] : [];

  const goTo = useCallback((idx) => {
    if (transitioning || idx === current) return;
    setTransitioning(true);
    setPrev(current);
    setCurrent(idx);
    setTimeout(() => { setPrev(null); setTransitioning(false); }, 1200);
  }, [current, transitioning]);

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [slides.length, current, goTo]);

  const title = hero.title || 'Explorer le monde';
  const italic = hero.italicTitle || "à travers l'objectif.";
  const tagline = hero.tagline || 'VOYAGES · NATURE · PHOTOGRAPHIE';
  const btn1 = hero.cta1 || 'VOIR LES VOYAGES';
  const btn2 = hero.cta2 || 'GALERIE';

  return (
    <section style={{ position:'relative', height:'100vh', minHeight:'600px', overflow:'hidden', display:'flex', alignItems:'center' }}>

      {/* Slide images */}
      {slides.length === 0 && (
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#0a1208,#080808)', zIndex:0 }} />
      )}
      {slides.map((slide, i) => (
        <div key={i} style={{
          position:'absolute', inset:0, zIndex: i === current ? 2 : i === prev ? 1 : 0,
          backgroundImage: `url(${slide.image})`,
          backgroundSize:'cover', backgroundPosition:'center',
          opacity: i === current ? 1 : 0,
          transform: `translateY(${scrollY * 0.35}px) scale(1.15)`,
          transition: i === current ? 'opacity 1.2s ease-in-out' : i === prev ? 'opacity 1.2s ease-in-out' : 'none',
          willChange: 'transform',
        }} />
      ))}

      {/* Overlays */}
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.48)', zIndex:3 }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.15) 65%,transparent 100%)', zIndex:3 }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'220px', background:'linear-gradient(to top,#080808,transparent)', zIndex:3 }} />

      {/* Content */}
      <div style={{ position:'relative', zIndex:4, padding:'0 clamp(24px,8vw,120px)', maxWidth:'780px' }}>
        {/* Tagline */}
        <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'28px' }}>
          <div style={{ width:'32px', height:'1px', background:'#c4962a' }} />
          <span style={{ fontSize:'10px', letterSpacing:'0.35em', color:'#c4962a', textTransform:'uppercase', fontWeight:'600' }}>{tagline}</span>
        </div>

        {/* Title */}
        <h1 style={{ margin:'0 0 16px', fontFamily:'Georgia,serif', lineHeight:1.15 }}>
          <span style={{ display:'block', fontSize:'clamp(1.8rem,3.5vw,3rem)', fontWeight:'300', color:'#f5f0e8', letterSpacing:'0.02em' }}>{title}</span>
          <em style={{ display:'block', fontSize:'clamp(2rem,4vw,3.4rem)', fontWeight:'300', fontStyle:'italic', color:'#c4962a' }}>{italic}</em>
        </h1>

        {/* Current slide location */}
        {slides[current]?.country && (
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'28px', opacity:0.7 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#c4962a"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            <span style={{ fontSize:'11px', letterSpacing:'0.25em', color:'rgba(255,255,255,0.6)', textTransform:'uppercase' }}>
              {slides[current].country}{slides[current].caption ? ' — ' + slides[current].caption : ''}
            </span>
          </div>
        )}

        {/* CTAs */}
        <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginTop: slides[current]?.country ? '0' : '28px' }}>
          <Link href="/voyages" style={{ padding:'13px 30px', background:'#c4962a', color:'#0a0a0a', fontWeight:'700', textDecoration:'none', letterSpacing:'0.15em', textTransform:'uppercase', fontSize:'11px' }}>{btn1}</Link>
          <Link href="/galerie" style={{ padding:'13px 30px', border:'1px solid rgba(255,255,255,0.35)', color:'rgba(255,255,255,0.85)', textDecoration:'none', letterSpacing:'0.15em', textTransform:'uppercase', fontSize:'11px', fontWeight:'400' }}>{btn2}</Link>
        </div>
      </div>

      {/* Slide dots */}
      {slides.length > 1 && (
        <div style={{ position:'absolute', bottom:'36px', right:'clamp(24px,6vw,80px)', zIndex:4, display:'flex', gap:'10px', alignItems:'center' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === current ? '28px' : '6px', height:'6px',
              background: i === current ? '#c4962a' : 'rgba(255,255,255,0.3)',
              border:'none', cursor:'pointer', padding:0, borderRadius:'3px',
              transition:'all 0.4s ease',
            }} />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <div style={{ position:'absolute', bottom:'32px', left:'50%', transform:'translateX(-50%)', zIndex:4, display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
        <div style={{ width:'1px', height:'36px', background:'linear-gradient(to bottom,transparent,rgba(255,255,255,0.25))' }} />
      </div>

      {/* Slide counter */}
      {slides.length > 1 && (
        <div style={{ position:'absolute', top:'50%', right:'clamp(16px,4vw,48px)', transform:'translateY(-50%)', zIndex:4, display:'flex', flexDirection:'column', gap:'8px' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width:'2px', height: i === current ? '32px' : '16px',
              background: i === current ? '#c4962a' : 'rgba(255,255,255,0.2)',
              border:'none', cursor:'pointer', padding:0, transition:'all 0.4s ease',
            }} />
          ))}
        </div>
      )}

    </section>
  );
}
