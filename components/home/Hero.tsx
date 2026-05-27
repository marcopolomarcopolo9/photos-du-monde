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
    fetch('/api/admin/homepage').then(r => r.json()).then(d => setConfig(d.config || d)).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hero = config?.hero || {};
  const rawSlides = (hero.slides || []).filter((s: any) => s && s.image);
  const slides = rawSlides.length > 0 ? rawSlides : hero.backgroundImage ? [{ image: hero.backgroundImage, country: '', caption: '' }] : [];

  const goTo = useCallback((idx: number) => {
    if (transitioning || idx === current) return;
    setTransitioning(true);
    setPrev(current);
    setCurrent(idx);
    setTimeout(() => { setPrev(null); setTransitioning(false); }, 1200);
  }, [current, transitioning]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => goTo((current + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length, current, goTo]);

  const title = hero.title || 'Explorer le monde';
  const italic = hero.italicTitle || "à travers l'objectif.";
  const tagline = '';
  const btn1 = hero.cta1 || 'VOIR LES VOYAGES';
  const btn2 = hero.cta2 || 'GALERIE';

  return (
    <section style={{ position:'relative', height:'100vh', minHeight:'600px', overflow:'hidden', display:'flex', alignItems:'center' }}>
      {slides.length === 0 && <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#0a1208,#080808)', zIndex:0 }} />}
      {slides.map((slide: any, i: number) => (
        <div key={i} style={{
          position:'absolute', inset:0, zIndex: i === current ? 2 : i === prev ? 1 : 0,
          backgroundImage: `url(${slide.image})`, backgroundSize:'cover', backgroundPosition:'center',
          opacity: i === current ? 1 : 0,
          transform: `translateY(${scrollY * 0.35}px) scale(1.15)`,
          transition: i === current ? 'opacity 1.2s ease-in-out' : i === prev ? 'opacity 1.2s ease-in-out' : 'none',
          willChange: 'transform',
        }} />
      ))}
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', zIndex:3 }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.15) 65%,transparent 100%)', zIndex:3 }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'220px', background:'linear-gradient(to top,#080808,transparent)', zIndex:3 }} />

      <div style={{ position:'relative', zIndex:4, padding:'0 clamp(24px,8vw,120px)', maxWidth:'780px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'28px' }}>
          
          {tagline && <span style={{ fontSize:'10px', letterSpacing:'0.35em', color:'#c4962a', textTransform:'uppercase', fontFamily:'system-ui' }}>{tagline}</span>}
        </div>
        <h1 style={{ margin:'0 0 16px', fontFamily:'Georgia,serif', lineHeight:1.15 }}>
          <span style={{ display:'block', fontSize:'clamp(1.53rem,2.975vw,2.55rem)', fontWeight:300, color:'#f5f0e8', letterSpacing:'0.02em' }}>{title}</span>
          <em style={{ display:'block', fontSize:'clamp(1.7rem,3.4vw,2.89rem)', fontWeight:300, fontStyle:'italic', color:'#c4962a' }}>{italic}</em>
        </h1>
        {slides[current]?.country && (
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'28px', opacity:0.7 }}>
            <span style={{ fontSize:'9px', letterSpacing:'0.25em', color:'rgba(255,255,255,0.6)', textTransform:'uppercase', fontFamily:'system-ui' }}>
              📍 {slides[current].country}{slides[current].caption ? ' — ' + slides[current].caption : ''}
            </span>
          </div>
        )}
        <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginTop: slides[current]?.country ? '0' : '28px' }}>
          <Link href="/voyages" style={{ padding:'13px 30px', background:'#c4962a', color:'#0a0a0a', fontWeight:700, textDecoration:'none', letterSpacing:'0.15em', textTransform:'uppercase', fontSize:'13px' }}>{btn1}</Link>
          <Link href="/galerie" style={{ padding:'13px 30px', padding:'13px 30px', border:'1px solid rgba(255,255,255,0.35)', color:'rgba(255,255,255,0.85)', textDecoration:'none', letterSpacing:'0.15em', textTransform:'uppercase', fontSize:'13px', fontWeight:700 }}>{btn2}</Link>
        </div>
      </div>

      {slides.length > 1 && (
        <div style={{ position:'absolute', bottom:'36px', right:'clamp(24px,6vw,80px)', zIndex:4, display:'flex', gap:'10px', alignItems:'center' }}>
          {slides.map((_: any, i: number) => (
            <button key={i} onClick={() => goTo(i)} style={{ width: i === current ? '28px' : '6px', height:'6px', background: i === current ? '#c4962a' : 'rgba(255,255,255,0.3)', border:'none', cursor:'pointer', padding:0, borderRadius:'3px', transition:'all 0.4s ease' }} />
          ))}
        </div>
      )}
    </section>
  );
}
