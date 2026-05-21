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
  const bg = hero.backgroundImage || '/images/hero-default.jpg';
  const title = hero.title || 'PHOTOS';
  const italic = hero.italicTitle || 'du Monde';
  const tagline = hero.tagline || 'Voyages photographiques';
  const btn1 = hero.button1 || 'Explorer les voyages';
  const btn2 = hero.button2 || 'Contact';
  return (
    <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(' + bg + ')', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff', padding: '0 2rem' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem,8vw,7rem)', fontWeight: 900, letterSpacing: '0.05em', lineHeight: 1, marginBottom: '0.5rem' }}>
          {title} <em style={{ fontStyle: 'italic', color: '#c9a96e' }}>{italic}</em>
        </h1>
        <p style={{ fontSize: 'clamp(1rem,2vw,1.4rem)', opacity: 0.85, marginBottom: '2.5rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{tagline}</p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href='/voyages' style={{ padding: '1rem 2.5rem', background: '#c9a96e', color: '#111', fontWeight: 700, borderRadius: '4px', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{btn1}</Link>
          <Link href='/contact' style={{ padding: '1rem 2.5rem', border: '1px solid rgba(255,255,255,0.6)', color: '#fff', fontWeight: 600, borderRadius: '4px', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{btn2}</Link>
        </div>
      </div>
    </section>
  );
}