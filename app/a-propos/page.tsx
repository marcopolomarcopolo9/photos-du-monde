// @ts-nocheck
import type { Metadata } from 'next';
import { HOMEPAGE_CONFIG } from '@/lib/homepage';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Link from 'next/link';
import { Camera, Globe, Award, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Photographe voyageur — découvrez l\'histoire derrière Photos du Monde.',
};

export default function AboutPage() {
  const about = HOMEPAGE_CONFIG.about;
  const footer = HOMEPAGE_CONFIG.footer || {};

  return (
    <div className="bg-noir min-h-screen pt-28 pb-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        {/* Hero text */}
        <ScrollReveal className="mb-20 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-or" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">À propos</span>
          </div>
          <h1 className="font-serif font-light text-5xl md:text-6xl text-creme italic leading-tight mb-8">
            Derrière<br /><em>l&apos;objectif</em>
          </h1>
          <p className="text-creme/60 text-base leading-[1.9] font-poppins font-light">
            {about?.intro || 'Photographe voyageur passionné par la nature sauvage et les cultures du monde.'}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-20">

          {/* Stats */}
          <ScrollReveal direction="left">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Globe, value: about?.countries || '32', label: 'Pays explorés', color: 'text-or' },
                { icon: Camera, value: about?.photos || '4 800', label: 'Photos prises', color: 'text-or' },
                { icon: Award, value: about?.years || '8', label: 'Années d\'exp.', color: 'text-or' },
                { icon: Heart, value: '∞', label: 'Passion nature', color: 'text-or' },
              ].map((stat) => (
                <div key={stat.label} className="bg-noir-mid border border-white/5 p-6 hover:border-or/20 transition-colors">
                  <stat.icon size={18} className={`${stat.color} mb-4 opacity-60`} />
                  <div className="font-serif text-4xl text-creme font-light mb-1">{stat.value}</div>
                  <div className="text-[11px] tracking-[0.15em] uppercase text-creme/40 font-poppins">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Philosophy */}
          <ScrollReveal direction="right" delay={0.1}>
            <h2 className="font-serif italic text-2xl text-creme mb-6">Ma philosophie</h2>
            <div className="space-y-5 text-creme/55 text-sm leading-[1.9] font-poppins font-light">
              <p>
                Chaque voyage est une immersion totale — je ne photographie pas les lieux, je vis à l&apos;intérieur d&apos;eux. 
                Pendant des semaines, j&apos;attends la lumière, j&apos;apprivoise les animaux, j&apos;apprends les rythmes de chaque écosystème.
              </p>
              <p>
                Les meilleurs clichés naissent toujours de la patience. Un lever de soleil sur un volcan, un toucan 
                qui s&apos;arrête trois secondes sur une branche — ces instants ne se commandent pas.
              </p>
              <p>
                Toutes mes photos sont réalisées dans le respect total de la faune et des communautés locales. 
                Aucun animal n&apos;a été perturbé, aucun écosystème altéré pour ces images.
              </p>
            </div>

            {/* Equipment */}
            <div className="mt-8 pt-8 border-t border-white/5">
              <h3 className="text-[10px] tracking-[0.3em] uppercase text-or mb-4 font-poppins">Équipement</h3>
              <div className="flex flex-wrap gap-2">
                {['Sony A7R V', '200-600mm f/5.6', '24-70mm f/2.8', 'Trépied Gitzo', 'DJI Mavic 3'].map(item => (
                  <span key={item} className="text-[11px] px-3 py-1.5 border border-white/10 text-creme/50 font-poppins">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Destinations highlight */}
        <ScrollReveal className="mb-20">
          <div className="gold-line mb-12" />
          <h2 className="font-serif italic text-3xl text-creme mb-4">Destinations favorites</h2>
          <p className="text-creme/40 text-sm mb-10 font-poppins">Les endroits qui m&apos;ont le plus marqué</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Costa Rica', desc: 'Biodiversité incomparable' },
              { name: 'Galápagos', desc: 'Faune endémique unique' },
              { name: 'Hawaï', desc: 'Volcans et forêts tropicales' },
              { name: 'Amazonie', desc: 'Forêt primaire intacte' },
            ].map((dest) => (
              <div key={dest.name} className="p-5 border border-white/5 hover:border-or/30 transition-colors group">
                <div className="w-5 h-px bg-or mb-3 group-hover:w-8 transition-all duration-300" />
                <div className="font-serif italic text-creme text-base mb-1">{dest.name}</div>
                <div className="text-[11px] text-creme/35 font-poppins">{dest.desc}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* CTA Contact */}
        <ScrollReveal>
          <div className="text-center py-16 border-t border-white/5">
            <p className="text-creme/40 text-sm mb-6 font-poppins">Une question, un projet, une collaboration ?</p>
            <Link href="/contact"
              className="inline-flex items-center gap-3 px-10 py-4 bg-or text-noir text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-or/90 transition-colors font-poppins">
              Me contacter
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
