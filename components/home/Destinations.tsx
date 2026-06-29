// @ts-nocheck
import Image from 'next/image';
import Link from 'next/link';
import { VOYAGES } from '@/lib/data';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { MapPin } from 'lucide-react';

export default function Destinations() {
  // Group voyages by continent
  const byContinent = VOYAGES.reduce<Record<string, typeof VOYAGES>>((acc, v) => {
    const key = v.continent || 'Autres';
    if (!acc[key]) acc[key] = [];
    acc[key].push(v);
    return acc;
  }, {});

  const continents = Object.entries(byContinent).slice(0, 4);
  const allVoyages = VOYAGES.slice(0, 6);

  return (
    <section className="bg-noir py-24 md:py-32">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        {/* Header */}
        <ScrollReveal className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-or" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">
              Destinations
            </span>
          </div>
          <h2 className="font-serif font-light text-4xl md:text-5xl text-creme italic leading-snug">
            Pays <em>explorés</em>
          </h2>
          <p className="mt-4 text-sm text-creme/45 max-w-md font-poppins font-light leading-relaxed">
            Des volcans hawaïens aux forêts primaires d'Amazonie, chaque destination révèle un fragment de nature sauvage.
          </p>
        </ScrollReveal>

        {/* Destination grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allVoyages.map((voyage, i) => (
            <ScrollReveal key={voyage.id} delay={i * 0.08}>
              <Link href={`/voyages/${voyage.slug}`} className="group block relative overflow-hidden">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={voyage.heroImage || voyage.coverImage || ''}
                    alt={voyage.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Dark gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/30 to-transparent" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-jungle/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="flex items-center gap-2 mb-2 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                      <MapPin size={10} className="text-or" />
                      <span className="text-[9px] tracking-[0.3em] uppercase text-or font-poppins">
                        {voyage.continent || voyage.country}
                      </span>
                    </div>
                    <h3 className="font-serif italic text-xl md:text-2xl text-creme font-light leading-tight mb-1">
                      {voyage.country2 && voyage.country2.trim() ? `${(voyage.country || '').trim()} et ${voyage.country2.trim()}` : voyage.country}
                    </h3>
                    <p className="text-xs text-creme/55 font-poppins font-light leading-relaxed line-clamp-2 max-w-xs opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                      {voyage.subtitle || voyage.description || voyage.city}
                    </p>
                    {/* Photo count */}
                    <div className="mt-3 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-creme/50 font-poppins">
                        {voyage.photos.length} photo{voyage.photos.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-or font-poppins">
                        Voir →
                      </span>
                    </div>
                  </div>

                  {/* Corner badge */}
                  <div className="absolute top-4 right-4 w-8 h-8 border border-creme/20 group-hover:border-or flex items-center justify-center transition-all duration-300">
                    <span className="text-[9px] text-creme/50 group-hover:text-or font-poppins transition-colors">
                      {i + 1 < 10 ? `0${i + 1}` : i + 1}
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal delay={0.3} className="mt-14 flex justify-center">
          <Link
            href="/voyages"
            className="group inline-flex items-center gap-4 border border-white/15 hover:border-or/60 px-8 py-4 transition-all duration-300"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-creme/60 group-hover:text-creme font-poppins transition-colors">
              Toutes les destinations
            </span>
            <span className="text-creme/40 group-hover:text-or group-hover:translate-x-1 transition-all duration-300">→</span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
