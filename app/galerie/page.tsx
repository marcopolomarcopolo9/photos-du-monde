// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/gallery/Lightbox';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function GaleriePage() {
  const [voyages, setVoyages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/voyages').then(r => r.json()).then(d => {
      setVoyages(d.voyages || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const countries = [...new Set(voyages.map((v: any) => v.country).filter(Boolean))];
  const allPhotos = voyages.flatMap((v: any) =>
    (v.photos || []).map((p: any, i: number) => ({
      id: `${v.slug}-${i}`,
      src: typeof p === 'string' ? p : p.src,
      alt: (typeof p === 'object' && p.caption) ? p.caption : v.title,
      caption: typeof p === 'object' ? (p.caption || '') : '',
      location: v.city || '',
      country: v.country || '',
      date: v.startDate || '',
      width: 1200, height: 800,
      voyageSlug: v.slug || v.id,
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

        {countries.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button onClick={() => setFilter('all')} className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-colors font-poppins ${filter === 'all' ? 'border-or text-or' : 'border-white/10 text-creme/40 hover:text-creme/70'}`}>Tous</button>
            {countries.map(c => (
              <button key={c} onClick={() => setFilter(c)} className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-colors font-poppins ${filter === c ? 'border-or text-or' : 'border-white/10 text-creme/40 hover:text-creme/70'}`}>{c}</button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-24 text-creme/30 font-poppins text-sm">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-creme/30 font-poppins text-sm">Aucune photo pour le moment.</div>
        ) : (
          <div className="masonry-grid">
            {filtered.map((photo, i) => (
              <div key={photo.id} className="photo-card cursor-pointer group relative overflow-hidden bg-noir-mid" onClick={() => setLightboxIndex(i)}>
                <div className="img-zoom">
                  <Image src={photo.src} alt={photo.alt} width={800} height={600} className="w-full h-auto" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                </div>
                {photo.caption && (
                  <div className="px-2 pt-1.5 pb-2">
                    <p className="text-[11px] text-creme/45 leading-relaxed font-poppins font-light italic">{photo.caption}</p>
                  </div>
                )}
                <div className="photo-overlay absolute inset-0 bg-gradient-to-t from-noir/70 to-transparent flex flex-col justify-end p-3 pointer-events-none">
                  <p className="font-serif italic text-sm text-creme/90">{photo.alt}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {lightboxIndex !== null && (
          <Lightbox photos={filtered} currentIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
        )}
      </div>
    </div>
  );
}
