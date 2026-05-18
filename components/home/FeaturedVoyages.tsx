import Image from 'next/image';
import Link from 'next/link';
import { FEATURED_VOYAGES } from '@/lib/data';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Calendar, Camera, MapPin } from 'lucide-react';

export default function FeaturedVoyages() {
  return (
    <section className="bg-noir py-24 md:py-32">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        {/* Section header */}
        <ScrollReveal className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-or" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-or">Explorations récentes</span>
          </div>
          <h2 className="font-serif font-light text-4xl md:text-5xl text-creme italic">
            Derniers voyages
          </h2>
        </ScrollReveal>

        {/* Featured grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-3">

          {/* Large card — first voyage */}
          {FEATURED_VOYAGES[0] && (
            <ScrollReveal className="md:col-span-7 md:row-span-2" delay={0.1}>
              <Link href={`/voyages/${FEATURED_VOYAGES[0].slug}`} className="block group">
                <div className="relative h-[420px] md:h-[560px] overflow-hidden img-zoom">
                  <Image
                    src={FEATURED_VOYAGES[0].heroImage}
                    alt={FEATURED_VOYAGES[0].heroImageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 58vw"
                  />
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/30 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge">{FEATURED_VOYAGES[0].country}</span>
                    </div>
                    <h3 className="font-serif text-3xl md:text-4xl text-creme italic font-light leading-tight mb-2">
                      {FEATURED_VOYAGES[0].title}
                    </h3>
                    <p className="text-sm text-creme/60 mb-5 max-w-sm leading-relaxed line-clamp-2">
                      {FEATURED_VOYAGES[0].subtitle}
                    </p>
                    <div className="flex items-center gap-5 text-creme/40">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Camera size={12} /> {FEATURED_VOYAGES[0].photos.length} photos
                      </span>
                      <span className="flex items-center gap-1.5 text-xs">
                        <Calendar size={12} /> {FEATURED_VOYAGES[0].duration} jours
                      </span>
                    </div>

                    {/* Hover arrow */}
                    <div className="absolute bottom-8 right-8 w-10 h-10 border border-creme/20 group-hover:border-or flex items-center justify-center transition-all duration-300 group-hover:bg-or/10">
                      <span className="text-creme/40 group-hover:text-or transition-colors text-sm">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          )}

          {/* Smaller cards */}
          {FEATURED_VOYAGES.slice(1, 3).map((voyage, i) => (
            <ScrollReveal key={voyage.id} className="md:col-span-5" delay={0.2 + i * 0.1}>
              <Link href={`/voyages/${voyage.slug}`} className="block group">
                <div className="relative h-64 md:h-[268px] overflow-hidden img-zoom">
                  <Image
                    src={voyage.heroImage}
                    alt={voyage.heroImageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={11} className="text-or" />
                      <span className="text-[10px] tracking-widest uppercase text-or">{voyage.continent}</span>
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl text-creme italic font-light leading-tight mb-1">
                      {voyage.title}
                    </h3>
                    <p className="text-xs text-creme/50">{voyage.subtitle}</p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* View all */}
        <ScrollReveal delay={0.3} className="mt-12 flex justify-center">
          <Link
            href="/voyages"
            className="flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-creme/60 hover:text-or transition-colors group"
          >
            <div className="w-8 h-px bg-current transition-all group-hover:w-16" />
            Tous les voyages
            <div className="w-8 h-px bg-current transition-all group-hover:w-16" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
