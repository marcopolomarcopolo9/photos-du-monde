import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Camera, MapPin } from 'lucide-react';
import { VOYAGES } from '@/lib/data';
import ScrollReveal from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Voyages — Photos du Monde',
  description: 'Tous les voyages photographiques — Costa Rica, Galápagos, Amazonie, Islande, Hawaii.',
};

export default function VoyagesPage() {
  return (
    <div className="min-h-screen bg-noir pt-32 pb-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-or" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-or">
              {VOYAGES.length} expéditions
            </span>
          </div>
          <h1 className="font-serif font-light text-5xl md:text-6xl text-creme italic">
            Voyages
          </h1>
        </div>

        {/* Voyages list */}
        <div className="flex flex-col gap-px">
          {VOYAGES.map((voyage, i) => (
            <ScrollReveal key={voyage.id} delay={i * 0.05}>
              <Link
                href={`/voyages/${voyage.slug}`}
                className="group flex flex-col md:flex-row gap-0 border border-transparent hover:border-white/5 transition-all duration-300 bg-noir hover:bg-noir-mid"
              >
                {/* Image */}
                <div className="relative w-full md:w-80 h-56 md:h-52 flex-shrink-0 overflow-hidden img-zoom">
                  <Image
                    src={voyage.heroImage}
                    alt={voyage.heroImageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-noir/30 md:bg-gradient-to-r" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between p-6 md:p-8 border-t md:border-t-0 md:border-l border-white/5">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      {voyage.categories.slice(0, 3).map((cat) => (
                        <span key={cat} className="badge text-[9px] py-1">{cat}</span>
                      ))}
                    </div>
                    <h2 className="font-serif italic text-2xl md:text-3xl text-creme group-hover:text-or transition-colors duration-300 mb-2">
                      {voyage.title}
                    </h2>
                    <p className="text-creme/50 text-sm mb-4">{voyage.subtitle}</p>
                    <p className="text-creme/40 text-sm leading-relaxed line-clamp-2 max-w-2xl">
                      {voyage.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white/5">
                    <span className="flex items-center gap-2 text-xs text-creme/40">
                      <MapPin size={11} className="text-or" />
                      {voyage.city}, {voyage.country}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-creme/40">
                      <Calendar size={11} className="text-or" />
                      {new Date(voyage.startDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-creme/40">
                      <Clock size={11} className="text-or" />
                      {voyage.duration} jours
                    </span>
                    <span className="flex items-center gap-2 text-xs text-creme/40">
                      <Camera size={11} className="text-or" />
                      {voyage.photos.length} photos
                    </span>
                    <span className="ml-auto text-xs text-or tracking-widest group-hover:translate-x-1 transition-transform">
                      Voir →
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
