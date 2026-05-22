// @ts-nocheck
import Link from 'next/link';
import Image from 'next/image';
import { VOYAGES } from '@/lib/data';
import { CATEGORIES } from '@/lib/categories';
import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catégories — Photos du Monde',
  description: 'Explorez par thème : volcans, forêts, plages, faune et plus.',
};

export default function CategoriesPage() {
  const voyages = VOYAGES.filter(v => v.published !== false);

  return (
    <div className="min-h-screen bg-noir pt-28 pb-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        <ScrollReveal className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-or" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">Thèmes</span>
          </div>
          <h1 className="font-serif font-light text-5xl md:text-6xl text-creme italic">Catégories</h1>
          <p className="text-creme/40 text-sm mt-3 font-poppins">Explorez par centres d'intérêt</p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat, i) => {
            const count = voyages.filter(v => (v.categories||[]).includes(cat.slug)).length;
            const photoCount = voyages
              .filter(v => (v.categories||[]).includes(cat.slug))
              .reduce((a, v) => a + (v.photos||[]).length, 0);

            // Find a cover photo
            const coverVoyage = voyages.find(v => (v.categories||[]).includes(cat.slug) && (v.heroImage||v.coverImage));
            const cover = coverVoyage ? (coverVoyage.heroImage || coverVoyage.coverImage) : '';

            return (
              <ScrollReveal key={cat.slug} delay={i * 0.05}>
                <Link href={`/categories/${cat.slug}`} className="group block relative overflow-hidden h-56 bg-noir-mid border border-white/5 hover:border-or/30 transition-all duration-300">
                  {cover ? (
                    <>
                      <Image src={cover} alt={cat.label} fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-50 group-hover:opacity-70" sizes="(max-width: 640px) 50vw, 25vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/40 to-noir/20" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl opacity-15">{cat.emoji}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <span className="text-2xl mb-2">{cat.emoji}</span>
                    <h2 className="font-serif italic text-xl text-creme font-light mb-1">{cat.label}</h2>
                    <p className="text-[10px] text-creme/40 font-poppins">
                      {count > 0 ? `${count} voyage${count > 1 ? 's' : ''} · ${photoCount} photos` : 'Bientôt disponible'}
                    </p>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-4 right-4 w-7 h-7 border border-white/10 group-hover:border-or flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
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
