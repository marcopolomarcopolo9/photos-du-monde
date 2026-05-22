// @ts-nocheck
'use client';
import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { VOYAGES } from '@/lib/data';
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories';
import Lightbox from '@/components/gallery/Lightbox';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = getCategoryBySlug(slug);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeVoyage, setActiveVoyage] = useState<string | null>(null);

  if (!category) return notFound();

  // Voyages in this category
  const voyages = VOYAGES.filter(v =>
    v.published !== false && (v.categories || []).includes(slug)
  );

  // All photos from these voyages
  const allPhotos = voyages.flatMap(v =>
    (v.photos || []).map((p: any) => ({
      id: `${v.slug}-${p.src}`,
      src: typeof p === 'string' ? p : p.src,
      caption: typeof p === 'object' ? p.caption : '',
      alt: v.title,
      location: v.city || '',
      country: v.country || '',
      date: v.startDate || '',
      width: 1200,
      height: 800,
      voyageSlug: v.slug,
      voyageTitle: v.title,
    }))
  );

  const filteredPhotos = activeVoyage
    ? allPhotos.filter(p => p.voyageSlug === activeVoyage)
    : allPhotos;

  // Other categories for navigation
  const otherCategories = CATEGORIES.filter(c => c.slug !== slug);

  return (
    <div className="min-h-screen bg-noir pt-24 pb-24">

      {/* Hero header */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 pt-8 pb-16">
        <Link href="/categories" className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-creme/30 hover:text-or transition-colors mb-10 font-poppins">
          ← Toutes les catégories
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{category.emoji}</span>
              <div className="w-px h-8 bg-or/30" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-or" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">Catégorie</span>
              </div>
            </div>
            <h1 className="font-serif font-light text-5xl md:text-6xl text-creme italic mb-3">{category.label}</h1>
            <p className="text-creme/45 font-poppins text-sm">{category.description} · {allPhotos.length} photo{allPhotos.length !== 1 ? 's' : ''} · {voyages.length} voyage{voyages.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {voyages.length === 0 ? (
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 text-center py-24">
          <p className="text-creme/25 font-poppins text-sm">Aucun voyage dans cette catégorie pour le moment.</p>
          <Link href="/categories" className="inline-block mt-8 px-8 py-3 border border-white/10 text-creme/40 hover:text-or hover:border-or text-[11px] tracking-widest uppercase transition-all font-poppins">
            Voir toutes les catégories
          </Link>
        </div>
      ) : (
        <>
          {/* Voyage filter tabs */}
          {voyages.length > 1 && (
            <div className="max-w-screen-xl mx-auto px-6 md:px-10 mb-10">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setActiveVoyage(null)}
                  className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-all font-poppins ${!activeVoyage ? 'border-or text-or bg-or/5' : 'border-white/10 text-creme/40 hover:text-creme/70 hover:border-white/20'}`}>
                  Tous ({allPhotos.length})
                </button>
                {voyages.map(v => (
                  <button key={v.slug} onClick={() => setActiveVoyage(v.slug === activeVoyage ? null : v.slug)}
                    className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-all font-poppins ${activeVoyage === v.slug ? 'border-or text-or bg-or/5' : 'border-white/10 text-creme/40 hover:text-creme/70 hover:border-white/20'}`}>
                    {v.country} — {v.title.slice(0, 20)}{v.title.length > 20 ? '…' : ''} ({(v.photos||[]).length})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Photos masonry with captions */}
          <div className="max-w-screen-xl mx-auto px-6 md:px-10 mb-20">
            <div className="masonry-grid">
              {filteredPhotos.map((photo, i) => (
                <div key={photo.id} className="photo-card group">
                  <div className="relative overflow-hidden bg-noir-mid cursor-zoom-in" onClick={() => setLightbox(i)}>
                    <Image src={photo.src} alt={photo.alt} width={800} height={600}
                      className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                    {/* Voyage badge */}
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link href={`/voyages/${photo.voyageSlug}`} onClick={e => e.stopPropagation()}
                        className="text-[9px] tracking-[0.2em] uppercase bg-noir/80 text-or px-2 py-1 backdrop-blur-sm font-poppins hover:bg-or hover:text-noir transition-colors">
                        {photo.country}
                      </Link>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-noir/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  {/* Caption */}
                  {photo.caption && (
                    <div className="pt-2 pb-1 px-1">
                      <p className="text-xs text-creme/50 leading-relaxed font-poppins font-light italic">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Related voyages */}
          {voyages.length > 0 && (
            <div className="max-w-screen-xl mx-auto px-6 md:px-10 mb-20 border-t border-white/5 pt-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-px bg-or" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">Voyages associés</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {voyages.map(v => (
                  <Link key={v.slug} href={`/voyages/${v.slug}`} className="group block relative overflow-hidden">
                    <div className="relative h-52 overflow-hidden bg-noir-mid">
                      {(v.heroImage || v.coverImage) ? (
                        <Image src={v.heroImage || v.coverImage} alt={v.title} fill
                          className="object-cover transition-transform duration-600 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 33vw" />
                      ) : <div className="w-full h-full flex items-center justify-center text-creme/20 text-3xl">📷</div>}
                      <div className="absolute inset-0 bg-gradient-to-t from-noir/85 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-5">
                        <span className="text-[9px] tracking-[0.25em] uppercase text-or mb-1 font-poppins">{v.country}</span>
                        <h3 className="font-serif italic text-lg text-creme font-light">{v.title}</h3>
                        <p className="text-[10px] text-creme/40 mt-1 font-poppins">{(v.photos||[]).length} photos</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Other categories */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 border-t border-white/5 pt-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-px bg-or" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">Autres thèmes</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {otherCategories.map(c => (
            <Link key={c.slug} href={`/categories/${c.slug}`}
              className="flex items-center gap-2 px-4 py-2.5 border border-white/10 hover:border-or/40 transition-all group font-poppins">
              <span>{c.emoji}</span>
              <span className="text-[11px] tracking-[0.15em] uppercase text-creme/50 group-hover:text-creme/80 transition-colors">{c.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox photos={filteredPhotos} currentIndex={lightbox}
          onClose={() => setLightbox(null)} onNavigate={setLightbox} />
      )}
    </div>
  );
}
