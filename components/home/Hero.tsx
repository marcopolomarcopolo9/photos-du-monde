// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    fetch('/api/admin/homepage').then(r => r.json()).then(d => setConfig(d));
  }, []);
  const hero = config && config.hero ? config.hero : {};
  const bg = hero.backgroundImage || '';
  const title = hero.title || 'Explorer le monde';
  const italic = hero.italicTitle || "à travers l'objectif.";
  const tagline = hero.tagline || 'VOYAGES · NATURE · PHOTOGRAPHIE';
  const btn1 = hero.cta1 || 'VOIR LES VOYAGES';
  const btn2 = hero.cta2 || 'GALERIE';

  return (
    <section style={{ position:'relative', height:'100vh', minHeight:'600px', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'flex-start' }}>
      {/* Background */}
      {bg && <div style={{ position:'absolute', inset:0, backgroundImage:'url('+bg+')', backgroundSize:'cover', backgroundPosition:'center', zIndex:0 }} />}
      {!bg && <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#0a1208 0%,#0d1a0d 50%,#080808 100%)', zIndex:0 }} />}
      {/* Overlays */}
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.52)', zIndex:1 }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)', zIndex:1 }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'200px', background:'linear-gradient(to top, #080808, transparent)', zIndex:1 }} />

      {/* Content */}
      <div style={{ position:'relative', zIndex:2, padding:'0 clamp(24px,8vw,120px)', maxWidth:'800px' }}>
        {/* Eyebrow */}
        <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'28px' }}>
          <div style={{ width:'32px', height:'1px', background:'#c4962a' }} />
          <span style={{ fontSize:'10px', letterSpacing:'0.35em', color:'#c4962a', textTransform:'uppercase', fontWeight:'600' }}>{tagline}</span>
        </div>

        {/* Title */}
        <h1 style={{ margin:'0 0 32px', fontFamily:'Georgia,serif', lineHeight:1.15 }}>
          <span style={{ display:'block', fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:'300', color:'#f5f0e8', letterSpacing:'0.02em' }}>{title}</span>
          <em style={{ display:'block', fontSize:'clamp(2.2rem,4.5vw,3.6rem)', fontWeight:'300', fontStyle:'italic', color:'#c4962a', letterSpacing:'0.01em' }}>{italic}</em>
        </h1>

        {/* CTA buttons */}
        <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
          <Link href="/voyages" style={{ padding:'14px 32px', background:'#c4962a', color:'#0a0a0a', fontWeight:'700', textDecoration:'none', letterSpacing:'0.15em', textTransform:'uppercase', fontSize:'12px' }}>{btn1}</Link>
          <Link href="/galerie" style={{ padding:'14px 32px', border:'1px solid rgba(255,255,255,0.35)', color:'rgba(255,255,255,0.85)', textDecoration:'none', letterSpacing:'0.15em', textTransform:'uppercase', fontSize:'12px', fontWeight:'400' }}>{btn2}</Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position:'absolute', bottom:'36px', left:'50%', transform:'translateX(-50%)', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
        <div style={{ width:'1px', height:'40px', background:'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))' }} />
        <span style={{ fontSize:'9px', letterSpacing:'0.3em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>Défiler</span>
      </div>
    </section>
  );
}
