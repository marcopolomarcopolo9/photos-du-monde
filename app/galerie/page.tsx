// @ts-nocheck
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { VOYAGES } from '@/lib/data';
import Lightbox from '@/components/gallery/Lightbox';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function GaleriePage() {
  const [filter, setFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const voyages = VOYAGES.filter(v => v.published !== false);
  const countries = [...new Set(voyages.map(v => v.country).filter(Boolean))];

  // Build all photos with metadata
  const allPhotos = voyages.flatMap(v =>
    (v.photos || []).map((p: any, i: number) => ({
      id: `${v.slug}-${i}`,
      src: typeof p === 'string' ? p : p.src,
      alt: v.title,
      location: v.city || '',
      country: v.country || '',
      continent: v.continent || '',
      date: v.startDate || '',
      width: 1200,
      height: 800,
      voyageSlug: v.slug,
    }))
  );

  const filtered = filter === 'all' ? allPhotos : allPhotos.filter(p => p.country === filter);

  return (
    <div className="min-h-screen bg-noir pt-28 pb-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        <ScrollReveal className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-or" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">
              {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
          <h1 className="font-serif font-light text-5xl md:text-6xl text-creme italic">Galerie</h1>
        </ScrollReveal>

        {/* Filters */}
        {countries.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button onClick={() => setFilter('all')}
              className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-colors font-poppins ${filter === 'all' ? 'border-or text-or' : 'border-white/10 text-creme/40 hover:text-creme/70'}`}>
              Tous
            </button>
            {countries.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-colors font-poppins ${filter === c ? 'border-or text-or' : 'border-white/10 text-creme/40 hover:text-creme/70'}`}>
                {c}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-creme/30 font-poppins text-sm">
            Aucune photo — ajoutez des photos depuis l'admin.
          </div>
        ) : (
          <div className="masonry-grid">
            {filtered.map((photo, i) => (
              <div key={photo.id} className="photo-card cursor-pointer group relative overflow-hidden bg-noir-mid"
                onClick={() => setLightboxIndex(i)}>
                <div className="img-zoom">
                  <Image src={photo.src} alt={photo.alt} width={800} height={600}
                    className="w-full h-auto" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                </div>
                <div className="photo-overlay absolute inset-0 bg-gradient-to-t from-noir/80 to-transparent flex flex-col justify-end p-3">
                  <p className="font-serif italic text-sm text-creme/90">{photo.alt}</p>
                  <p className="text-[10px] text-creme/50 mt-0.5 font-poppins">{photo.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {lightboxIndex !== null && (
          <Lightbox photos={filtered} currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
        )}
      </div>
    </div>
  );
}
