// @ts-nocheck
'use client';
import { useState, useEffect, useRef } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getVoyages } from '@/lib/kv';
import { CATEGORIES } from '@/lib/categories';
import VoyageHero from '@/components/voyage/VoyageHero';
import VoyageMapLeaflet from '@/components/voyage/VoyageMap';
import MasonryGrid from '@/components/gallery/MasonryGrid';
import ScrollReveal from '@/components/ui/ScrollReveal';

// Client wrapper for fetching and filtering
export default function VoyagePage({ params }: { params: { slug: string } }) {
  const [voyage, setVoyage] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [photoFilter, setPhotoFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [cubaMuted, setCubaMuted] = useState(false);
  const cubaAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('/api/voyages?all=1')
      .then(r => r.json())
      .then(d => {
        const all = d.voyages || [];
        const v = all.find((v: any) => (v.slug || v.id) === params.slug);
        if (!v) { setLoading(false); return; }
        setVoyage(v);
        setSimilar(all.filter((x: any) =>
          x.published !== false &&
          (x.slug || x.id) !== params.slug &&
          (x.country === v.country || (x.categories || []).some((c: string) => (v.categories || []).includes(c)))
        ).slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  // Play Cuban music when on Cuba voyage
  useEffect(() => {
    if (!voyage) return;
    const isCuba = (voyage.country || '').toLowerCase().includes('cuba') || 
                   (voyage.title || '').toLowerCase().includes('cuba') ||
                   (voyage.slug || '').toLowerCase().includes('cuba');
    if (!isCuba) return;

    const audio = new Audio('https://archive.org/download/MusicSalsaCubana_201704/Los%20Van%20Van.mp3');
    audio.loop = true;
    audio.volume = 0;
    
    const tryPlay = () => {
      audio.play().then(() => {
        // Fade in
        let v = 0;
        const fade = setInterval(() => {
          v = Math.min(v + 0.008, 0.15);
          audio.volume = v;
          if (v >= 0.25) clearInterval(fade);
        }, 120);
      }).catch(() => {});
    };

    // Try on first interaction
    const handler = () => { tryPlay(); document.removeEventListener('click', handler); document.removeEventListener('scroll', handler); };
    document.addEventListener('click', handler, { once: true });
    document.addEventListener('scroll', handler, { once: true });

    return () => {
      // Fade out and stop
      let v = audio.volume;
      const fade = setInterval(() => {
        v = Math.max(0, v - 0.02);
        audio.volume = v;
        if (v <= 0) { audio.pause(); clearInterval(fade); }
      }, 50);
      document.removeEventListener('click', handler);
      document.removeEventListener('scroll', handler);
    };
  }, [voyage]);

  const isCubaPage = voyage && (
    (voyage.country || '').toLowerCase().includes('cuba') ||
    (voyage.title || '').toLowerCase().includes('cuba') ||
    (voyage.slug || '').toLowerCase().includes('cuba')
  );

  const toggleCubaMute = () => {
    const audio = cubaAudioRef.current;
    if (!audio) return;
    if (cubaMuted) { audio.volume = 0.15; setCubaMuted(false); }
    else { audio.volume = 0; setCubaMuted(true); }
  };

  if (loading) return (
    <div className="min-h-screen bg-noir flex items-center justify-center">
      <div className="w-8 h-px bg-or animate-pulse" />
    </div>
  );
  if (!voyage) return notFound();

  const getYear = (d: string) => { if (!d) return ''; const m = String(d).match(/\d{4}/); return m ? m[0] : ''; };

  // Build photos with metadata
  const allPhotos = (voyage.photos || []).map((p: any, i: number) => ({
    id: `${voyage.slug}-p${i}`,
    src: typeof p === 'string' ? p : (p.src || ''),
    alt: (typeof p === 'object' && p.caption) ? p.caption : voyage.title,
    caption: typeof p === 'object' ? (p.caption || '') : '',
    categories: typeof p === 'object' ? (p.categories || []) : [],
    location: '',
    country: voyage.country || '',
    date: voyage.startDate || voyage.date || '',
    width: 1200, height: 800,
    voyageSlug: voyage.slug || voyage.id,
  }));

  // Get all unique categories used in photos
  const photoCategories = [...new Set(allPhotos.flatMap((p: any) => p.categories))];

  // Filter photos
  const filteredPhotos = photoFilter === 'all'
    ? allPhotos
    : allPhotos.filter((p: any) => p.categories.includes(photoFilter));

  return (
    <div className="bg-noir min-h-screen">
      <VoyageHero voyage={voyage} />

      {/* Cuba music mute button */}
      {isCubaPage && (
        <button onClick={toggleCubaMute}
          title={cubaMuted ? 'Activer la musique' : 'Couper la musique'}
          style={{
            position: 'fixed', bottom: '84px', right: '20px', zIndex: 9000,
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'rgba(8,8,8,0.88)',
            border: `1px solid ${cubaMuted ? 'rgba(255,255,255,0.15)' : 'rgba(196,150,42,0.6)'}`,
            color: cubaMuted ? 'rgba(255,255,255,0.4)' : '#c4962a',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)', transition: 'all 0.3s',
          }}>
          {cubaMuted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/>
              <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" strokeOpacity="0.7"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" strokeOpacity="0.4"/>
            </svg>
          )}
        </button>
      )}

      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <div className="flex flex-wrap gap-8 mb-12">
                {getYear(voyage.startDate||voyage.date) && (
                  <div><div className="text-[10px] tracking-widest uppercase text-or mb-1 font-poppins">Année</div><div className="text-sm text-creme/70">{getYear(voyage.startDate||voyage.date)}</div></div>
                )}
                <div><div className="text-[10px] tracking-widest uppercase text-or mb-1 font-poppins">Pays</div><div className="text-sm text-creme/70">{voyage.country}</div></div>
                {voyage.city && <div><div className="text-[10px] tracking-widest uppercase text-or mb-1 font-poppins">Région</div><div className="text-sm text-creme/70">{voyage.city}</div></div>}
                {allPhotos.length > 0 && <div><div className="text-[10px] tracking-widest uppercase text-or mb-1 font-poppins">Photos</div><div className="text-sm text-creme/70">{allPhotos.length}</div></div>}
              </div>
            </ScrollReveal>

            {voyage.description && (
              <ScrollReveal delay={0.1}>
                <p className="text-creme/60 leading-[1.9] text-base mb-10 font-poppins font-light max-w-2xl">{voyage.description}</p>
              </ScrollReveal>
            )}

          </div>

          {/* Sidebar map */}
          <div className="lg:col-span-1">
            {((voyage.waypoints || []).length > 0 || voyage.lat) && (
              <ScrollReveal direction="right">
                {((voyage.waypoints || []).length > 0 || voyage.lat) && <div className="text-[10px] tracking-[0.3em] uppercase text-or mb-4 font-poppins">Itinéraire</div>}
                <VoyageMapLeaflet waypoints={voyage.waypoints || []} country={voyage.country} centerLat={voyage.lat} centerLng={voyage.lng} />
              </ScrollReveal>
            )}
          </div>
        </div>

        {/* ── Photos section ── */}
        {allPhotos.length > 0 && (
          <div className="mt-16">
            <ScrollReveal>
              <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-or" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">
                    {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Photo category filters */}
              {photoCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-10">
                  <button onClick={() => setPhotoFilter('all')}
                    className={`flex items-center gap-1.5 px-4 py-2 border transition-all font-poppins text-[10px] tracking-[0.15em] uppercase ${photoFilter === 'all' ? 'border-or text-or bg-or/5' : 'border-white/10 text-creme/40 hover:text-creme/70 hover:border-white/20'}`}>
                    Toutes ({allPhotos.length})
                  </button>
                  {photoCategories.map((cat: string) => {
                    const catData = CATEGORIES.find(c => c.slug === cat);
                    const count = allPhotos.filter((p: any) => p.categories.includes(cat)).length;
                    return (
                      <button key={cat} onClick={() => setPhotoFilter(cat)}
                        className={`flex items-center gap-1.5 px-4 py-2 border transition-all font-poppins text-[10px] tracking-[0.15em] uppercase ${photoFilter === cat ? 'border-or text-or bg-or/5' : 'border-white/10 text-creme/40 hover:text-creme/70 hover:border-white/20'}`}>
                        <span>{catData?.label || cat} ({count})</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollReveal>

            <MasonryGrid photos={filteredPhotos} showFilters={false} />
          </div>
        )}

        {/* Similar voyages */}
        {similar.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-px bg-or" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">Voyages similaires</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similar.map((v: any) => (
                <Link key={v.slug||v.id} href={`/voyages/${v.slug||v.id}`} className="group block relative overflow-hidden">
                  <div className="relative h-44 overflow-hidden bg-noir-mid">
                    {(v.heroImage||v.coverImage) && <Image src={v.heroImage||v.coverImage} alt={v.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-noir/85 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <span className="text-[9px] tracking-[0.25em] uppercase text-or mb-1 font-poppins">{v.country}</span>
                      <h3 className="font-serif italic text-base text-creme font-light">{v.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <div className="gold-line mb-10" />
          <div className="flex justify-between items-center">
            <Link href="/voyages" className="text-[11px] tracking-widest uppercase text-creme/50 hover:text-or transition-colors font-poppins">← Tous les voyages</Link>
            <Link href="/galerie" className="text-[11px] tracking-widest uppercase text-creme/50 hover:text-or transition-colors font-poppins">Galerie complète →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
