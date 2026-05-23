// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories';
import Lightbox from '@/components/gallery/Lightbox';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = getCategoryBySlug(slug);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeVoyage, setActiveVoyage] = useState<string | null>(null);
  const [allPhotos, setAllPhotos] = useState<any[]>([]);
  const [voyages, setVoyages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/voyages?all=1')
      .then(r => r.json())
      .then(d => {
        const vs = (d.voyages || []).filter((v: any) => v.published !== false);
        
        // Photos tagged with this category (per-photo tags)
        const photos: any[] = [];
        const voyagesWithPhotos = new Map();
        
        vs.forEach((v: any) => {
          (v.photos || []).forEach((p: any, i: number) => {
            const cats = typeof p === 'object' ? (p.categories || []) : [];
            if (cats.includes(slug)) {
              const photo = {
                id: `${v.slug}-p${i}`,
                src: typeof p === 'string' ? p : p.src,
                alt: (typeof p === 'object' && p.caption) ? p.caption : v.title,
                caption: typeof p === 'object' ? (p.caption || '') : '',
                location: v.city || '',
                country: v.country || '',
                date: v.startDate || '',
                width: 1200, height: 800,
                voyageSlug: v.slug || v.id,
                voyageTitle: v.title,
                voyageCountry: v.country,
              };
              photos.push(photo);
              voyagesWithPhotos.set(v.slug || v.id, v);
            }
          });
        });

        setAllPhotos(photos);
        setVoyages([...voyagesWithPhotos.values()]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (!category) return (
    <div className="min-h-screen bg-noir flex items-center justify-center">
      <p className="text-creme/30 font-poppins">Catégorie introuvable</p>
    </div>
  );

  const filteredPhotos = activeVoyage
    ? allPhotos.filter(p => p.voyageSlug === activeVoyage)
    : allPhotos;

  const otherCategories = CATEGORIES.filter(c => c.slug !== slug);

  return (
    <div className="min-h-screen bg-noir pt-24 pb-24">

      {/* Hero */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 pt-8 pb-14">
        <Link href="/categories" className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-creme/30 hover:text-or transition-colors mb-10 font-poppins">
          ← Tous les thèmes
        </Link>
        <div className="flex items-start gap-5 mb-4">
          <span className="text-5xl">{category.emoji}</span>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-or" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">Thème</span>
            </div>
            <h1 className="font-serif font-light text-5xl md:text-6xl text-creme italic mb-2">{category.label}</h1>
            <p className="text-creme/40 text-sm font-poppins">
              {loading ? 'Chargement...' : `${allPhotos.length} photo${allPhotos.length !== 1 ? 's' : ''} · ${voyages.length} voyage${voyages.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 flex justify-center py-20">
          <div className="w-8 h-px bg-or animate-pulse" />
        </div>
      ) : allPhotos.length === 0 ? (
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 text-center py-24">
          <p className="text-creme/25 font-poppins text-sm mb-2">Aucune photo taguée "{category.label}" pour le moment.</p>
          <p className="text-creme/15 font-poppins text-xs">Tague des photos depuis l'admin → modifier un voyage → emojis sous chaque photo</p>
          <Link href="/categories" className="inline-block mt-10 px-8 py-3 border border-white/10 text-creme/40 hover:text-or hover:border-or text-[11px] tracking-widest uppercase transition-all font-poppins">
            Voir tous les thèmes
          </Link>
        </div>
      ) : (
        <>
          {/* Voyage filter */}
          {voyages.length > 1 && (
            <div className="max-w-screen-xl mx-auto px-6 md:px-10 mb-10">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setActiveVoyage(null)}
                  className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-all font-poppins ${!activeVoyage ? 'border-or text-or bg-or/5' : 'border-white/10 text-creme/40 hover:text-creme/60'}`}>
                  Tous ({allPhotos.length})
                </button>
                {voyages.map(v => {
                  const count = allPhotos.filter(p => p.voyageSlug === (v.slug||v.id)).length;
                  return (
                    <button key={v.slug||v.id} onClick={() => setActiveVoyage(activeVoyage === (v.slug||v.id) ? null : (v.slug||v.id))}
                      className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-all font-poppins ${activeVoyage === (v.slug||v.id) ? 'border-or text-or bg-or/5' : 'border-white/10 text-creme/40 hover:text-creme/60'}`}>
                      {v.country} — {v.title.slice(0,18)}{v.title.length>18?'…':''} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Masonry photos */}
          <div className="max-w-screen-xl mx-auto px-6 md:px-10 mb-20">
            <div className="masonry-grid">
              {filteredPhotos.map((photo, i) => (
                <div key={photo.id} className="photo-card group">
                  <div className="relative overflow-hidden cursor-zoom-in" onClick={() => setLightbox(i)}>
                    <Image src={photo.src} alt={photo.alt} width={800} height={600}
                      className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Link href={`/voyages/${photo.voyageSlug}`} onClick={e => e.stopPropagation()}
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] tracking-[0.2em] uppercase bg-noir/80 text-or px-2 py-1 backdrop-blur-sm font-poppins hover:bg-or hover:text-noir">
                      {photo.voyageCountry}
                    </Link>
                  </div>
                  {photo.caption && (
                    <div className="pt-1.5 pb-1 px-1">
                      <p className="text-[11px] text-creme/45 italic font-poppins leading-relaxed">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Related voyages */}
          {voyages.length > 0 && (
            <div className="max-w-screen-xl mx-auto px-6 md:px-10 border-t border-white/5 pt-16 mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-px bg-or" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">Voyages associés</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {voyages.map(v => (
                  <Link key={v.slug||v.id} href={`/voyages/${v.slug||v.id}`} className="group block relative overflow-hidden">
                    <div className="relative h-48 overflow-hidden bg-noir-mid">
                      {(v.heroImage||v.coverImage) && (
                        <Image src={v.heroImage||v.coverImage} alt={v.title} fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-noir/85 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-5">
                        <span className="text-[9px] tracking-[0.25em] uppercase text-or mb-1 font-poppins">{v.country}</span>
                        <h3 className="font-serif italic text-lg text-creme font-light">{v.title}</h3>
                        <p className="text-[10px] text-creme/40 mt-1 font-poppins">
                          {allPhotos.filter(p => p.voyageSlug === (v.slug||v.id)).length} photo{allPhotos.filter(p => p.voyageSlug === (v.slug||v.id)).length !== 1 ? 's' : ''} dans ce thème
                        </p>
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
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 border-t border-white/5 pt-14">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-px bg-or" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">Autres thèmes</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {otherCategories.map(c => (
            <Link key={c.slug} href={`/categories/${c.slug}`}
              className="flex items-center gap-2 px-4 py-2.5 border border-white/10 hover:border-or/40 transition-all group font-poppins">
              <span>{c.emoji}</span>
              <span className="text-[11px] tracking-[0.15em] uppercase text-creme/50 group-hover:text-creme/80 transition-colors">{c.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox photos={filteredPhotos} currentIndex={lightbox}
          onClose={() => setLightbox(null)} onNavigate={setLightbox} />
      )}
    </div>
  );
}
