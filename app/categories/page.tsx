// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/categories';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function CategoriesPage() {
  const [stats, setStats] = useState<Record<string, { count: number; cover: string }>>({});

  useEffect(() => {
    fetch('/api/voyages?all=1')
      .then(r => r.json())
      .then(d => {
        const voyages = (d.voyages || []).filter((v: any) => v.published !== false);
        const s: Record<string, { count: number; cover: string }> = {};
        voyages.forEach((v: any) => {
          (v.photos || []).forEach((p: any) => {
            const cats = typeof p === 'object' ? (p.categories || []) : [];
            const photoSrc = typeof p === 'string' ? p : (p.src || '');
            cats.forEach((cat: string) => {
              if (!s[cat]) s[cat] = { count: 0, cover: photoSrc || v.heroImage || v.coverImage || '' };
              s[cat].count++;
            });
          });
        });
        setStats(s);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-noir pt-28 pb-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        <ScrollReveal className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-or" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">Thèmes</span>
          </div>
          <h1 className="font-serif font-light text-5xl md:text-6xl text-creme italic">Catégories</h1>
          <p className="text-creme/40 text-sm mt-3 font-poppins">Explorer par environnement ou thème</p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {CATEGORIES.map((cat, i) => {
            const s = stats[cat.slug];
            const count = s?.count || 0;
            const cover = s?.cover || '';
            return (
              <ScrollReveal key={cat.slug} delay={i * 0.05}>
                <Link href={`/categories/${cat.slug}`}
                  style={{ display:'block', position:'relative', overflow:'hidden', aspectRatio:'3/4', maxHeight:'280px', textDecoration:'none' }}
                  className="group">
                  {/* Image */}
                  {cover ? (
                    <>
                      <Image src={cover} alt={cat.label} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" sizes="25vw" />
                      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.2) 55%,transparent 100%)' }} />
                    </>
                  ) : (
                    <div style={{ position:'absolute', inset:0, background:'#0d0d0d' }} />
                  )}

                  {/* Dot */}
                  <div style={{ position:'absolute', top:'12px', left:'12px', width:'5px', height:'5px', borderRadius:'50%', background:'rgba(196,150,42,0.35)', transition:'background .3s' }} className="group-hover:!bg-[#c4962a]" />

                  {/* Text box */}
                  <div style={{ position:'absolute', bottom:'10px', left:'9px', right:'9px', padding:'11px 13px', border:'1.5px solid rgba(255,255,255,0.35)', background:'rgba(0,0,0,0.25)', backdropFilter:'blur(6px)' }}>
                    <div style={{ width:'16px', height:'1px', background:'#c4962a', marginBottom:'8px' }} />
                    <p style={{ fontFamily:'system-ui', fontSize:'9px', letterSpacing:'0.28em', color:'rgba(196,150,42,0.8)', textTransform:'uppercase', margin:'0 0 5px' }}>
                      {count > 0 ? `${count} photo${count > 1 ? 's' : ''}` : cat.description}
                    </p>
                    <h2 style={{ fontFamily:'"Cormorant Garamond",Georgia,serif', fontSize:'22px', fontWeight:300, fontStyle:'italic', color:'#f5f0e8', margin:0, lineHeight:1.1 }}>
                      {cat.emoji} {cat.label}
                    </h2>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
