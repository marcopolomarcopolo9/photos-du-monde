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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat, i) => {
            const s = stats[cat.slug];
            const count = s?.count || 0;
            const cover = s?.cover || '';
            return (
              <ScrollReveal key={cat.slug} delay={i * 0.05}>
                <Link href={`/categories/${cat.slug}`} className="group block relative overflow-hidden h-56 bg-noir-mid border border-white/5 hover:border-or/30 transition-all duration-300">
                  {cover && (
                    <>
                      <Image src={cover} alt={cat.label} fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-40 group-hover:opacity-60" sizes="25vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/30 to-noir/10" />
                    </>
                  )}
                  {!cover && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-10"></span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <span className="text-3xl mb-2"></span>
                    <h2 className="font-serif italic text-xl text-creme font-light mb-1">{cat.label}</h2>
                    <p className="text-[10px] text-creme/40 font-poppins">
                      {count > 0 ? `${count} photo${count > 1 ? 's' : ''}` : 'Aucune photo encore'}
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 w-7 h-7 border border-white/10 group-hover:border-or flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                    <span className="text-or text-xs">→</span>
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
