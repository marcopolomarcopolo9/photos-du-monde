// @ts-nocheck
import Link from 'next/link';
import Image from 'next/image';
import { getVoyages } from '@/lib/kv';
import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Destinations — Photos du Monde',
  description: 'Tous les voyages photographiques.',
};

export default async function VoyagesPage() {
  const voyages = await getVoyages().then(vs => vs.filter((v: any) => v.published !== false)).catch(() => []);

  return (
    <div className="min-h-screen bg-noir pt-28 pb-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        <ScrollReveal className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-or" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">
              {voyages.length} voyage{voyages.length !== 1 ? 's' : ''}
            </span>
          </div>
          <h1 className="font-serif font-light text-5xl md:text-6xl text-creme italic">Destinations</h1>
        </ScrollReveal>

        {voyages.length === 0 ? (
          <div className="text-center py-24 text-creme/30 font-poppins text-sm">
            Aucun voyage publié pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {voyages.map((v: any, i: number) => {
              const img = v.heroImage || v.coverImage || '';
              return (
                <ScrollReveal key={v.slug || v.id} delay={i * 0.06}>
                  <Link href={`/voyages/${v.slug || v.id}`} className="group block relative overflow-hidden">
                    <div className="relative h-80 overflow-hidden bg-noir-mid">
                      {img ? (
                        <Image src={img} alt={v.title} fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-creme/20 text-4xl">📷</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <span className="text-[9px] tracking-[0.3em] uppercase text-or font-poppins mb-1">{v.country}</span>
                        <h2 className="font-serif italic text-xl text-creme font-light">{v.title}</h2>
                        {v.city && <p className="text-xs text-creme/50 mt-1 font-poppins">{v.city}</p>}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
