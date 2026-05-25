// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Image from 'next/image';
import { cloudinaryUrl } from '@/lib/cloudinary';
import Link from 'next/link';
import { Camera, Globe, Award, Heart } from 'lucide-react';
import { HOMEPAGE_CONFIG } from '@/lib/homepage';

export default function AboutPage() {
  const [about, setAbout] = useState(HOMEPAGE_CONFIG.about);

  useEffect(() => {
    fetch('/api/admin/homepage')
      .then(r => r.json())
      .then(d => {
        const config = typeof d.config === 'string' ? JSON.parse(d.config) : d.config;
        if (config?.about) setAbout(config.about);
      })
      .catch(() => {});
  }, []);

  const equipment = about.equipment?.split(',').map((e: string) => e.trim()).filter(Boolean) || [];
  const favorites = about.favorites || [];

  return (
    <div className="bg-noir min-h-screen pt-28 pb-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <ScrollReveal direction="left">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-or" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">À propos</span>
            </div>
            <h1 className="font-serif font-light text-5xl md:text-6xl text-creme italic leading-tight mb-8">
              Derrière<br /><em>l&apos;objectif</em>
            </h1>
            <p className="text-creme/60 text-base leading-[1.9] font-poppins font-light mb-6">
              {about.intro || 'Photographe voyageur passionné par la nature sauvage et les cultures du monde.'}
            </p>
            {about.philosophy && (
              <p className="text-creme/45 text-sm leading-[1.9] font-poppins font-light">
                {about.philosophy}
              </p>
            )}
          </ScrollReveal>

          {/* Photo */}
          <ScrollReveal direction="right" delay={0.1}>
            {about.photo ? (
              <div className="relative aspect-[3/4] max-w-sm mx-auto overflow-hidden">
                <Image src={about.photo.includes('cloudinary') ? about.photo.replace('/upload/', '/upload/q_100,f_auto/') : about.photo} alt="Photo du photographe" fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/40 to-transparent" />
              </div>
            ) : (
              <div className="aspect-[3/4] max-w-sm mx-auto bg-noir-mid border border-white/5 flex flex-col items-center justify-center gap-4">
                <Camera size={32} className="text-creme/20" />
                <p className="text-creme/25 text-xs font-poppins">Photo à ajouter depuis l&apos;admin</p>
              </div>
            )}
          </ScrollReveal>
        </div>

        {/* Stats */}
        <ScrollReveal className="mb-20">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Globe, value: about.countries || 32, label: 'Pays explorés' },
              { icon: Camera, value: about.photos?.toLocaleString?.('fr-FR') || '4 800', label: 'Photos prises' },
              { icon: Award, value: about.years || 8, label: "Années d'exp." },
              { icon: Heart, value: '∞', label: 'Passion nature' },
            ].map(s => (
              <div key={s.label} className="bg-noir-mid border border-white/5 p-6 hover:border-or/20 transition-colors">
                <s.icon size={16} className="text-or mb-4 opacity-50" />
                <div className="font-serif text-4xl text-creme font-light mb-1">{s.value}</div>
                <div className="text-[11px] tracking-[0.15em] uppercase text-creme/40 font-poppins">{s.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Philosophy + Equipment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <ScrollReveal direction="left">
            <h2 className="font-serif italic text-2xl text-creme mb-6">Ma philosophie</h2>
            <div className="space-y-5 text-creme/55 text-sm leading-[1.9] font-poppins font-light">
              {about.philosophy && <p>{about.philosophy}</p>}
              {about.philosophy2 && <p>{about.philosophy2}</p>}
              <p>Toutes mes photos sont réalisées dans le respect total de la faune et des communautés locales.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.1}>
            <h2 className="font-serif italic text-2xl text-creme mb-6">Équipement</h2>
            <div className="flex flex-wrap gap-2">
              {(equipment.length > 0 ? equipment : ['Sony A7R V','200-600mm f/5.6','24-70mm f/2.8','Trépied Gitzo','DJI Mavic 3']).map(item => (
                <span key={item} className="text-[11px] px-3 py-1.5 border border-white/10 text-creme/50 font-poppins hover:border-or/30 transition-colors">{item}</span>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <ScrollReveal className="mb-20">
            <div className="h-px bg-white/5 mb-12" />
            <h2 className="font-serif italic text-3xl text-creme mb-10">Destinations favorites</h2>
            <div className="grid grid-cols-2 gap-3">
              {favorites.map((dest: any) => (
                <div key={dest.name} className="p-5 border border-white/5 hover:border-or/30 transition-colors group">
                  <div className="w-5 h-px bg-or mb-3 group-hover:w-8 transition-all duration-300" />
                  <div className="font-serif italic text-creme text-base mb-1">{dest.name}</div>
                  <div className="text-[11px] text-creme/35 font-poppins">{dest.desc}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <div className="text-center py-16 border-t border-white/5">
            <p className="text-creme/40 text-sm mb-6 font-poppins">Une question, un projet, une collaboration ?</p>
            <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-4 bg-or text-noir text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-or/90 transition-colors font-poppins">
              Me contacter
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
