// @ts-nocheck
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { VOYAGES } from '@/lib/data';
import VoyageHero from '@/components/voyage/VoyageHero';
import VoyageMapLeaflet from '@/components/voyage/VoyageMap';
import AnecdoteCard from '@/components/voyage/AnecdoteCard';
import MasonryGrid from '@/components/gallery/MasonryGrid';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return VOYAGES.map((v) => ({ slug: v.slug }));
}

// Normalize photos from new data structure
function normalizePhotos(voyage: any) {
  return (voyage.photos || []).map((p: any, i: number) => ({
    id: `${voyage.slug}-p${i}`,
    src: typeof p === 'string' ? p : (p.src || ''),
    alt: p.alt || voyage.title,
    location: p.location || voyage.city || '',
    country: voyage.country || '',
    continent: voyage.continent || '',
    date: p.date || voyage.startDate || '',
    width: p.width || 1200,
    height: p.height || 800,
    voyageSlug: voyage.slug,
    tags: p.tags || [],
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const voyage = VOYAGES.find(v => v.slug === params.slug);
  if (!voyage) return {};
  return {
    title: `${voyage.title} â— ${voyage.country}`,
    description: voyage.description.slice(0, 160),
    openGraph: {
      title: `${voyage.title} â— Photos du Monde`,
      description: voyage.subtitle,
      images: [{ url: voyage.heroImage }],
    },
  };
}

export default function VoyagePage({ params }: Props) {
  const voyage = VOYAGES.find(v => v.slug === params.slug);
  if (!voyage) notFound();

  // Only show year
  const getYear = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return String(d.getFullYear());
    // If it's already just a year like "2024"
    const match = dateStr.match(/\d{4}/);
    return match ? match[0] : dateStr;
  };

  const year = getYear(voyage.startDate);
  const photos = normalizePhotos(voyage);

  return (
    <div className="bg-noir min-h-screen">
      <VoyageHero voyage={voyage} />

      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          <div className="lg:col-span-2">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-px bg-or" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-or">Le voyage</span>
              </div>
              <p className="text-creme/70 text-base leading-[1.9] mb-12 max-w-2xl">
                {voyage.description}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="gold-line mb-10" />
            <ScrollReveal delay={0.15}>
              <div className="flex flex-wrap gap-8 mb-16">
                {year && (
                  <div>
                    <div className="text-[10px] tracking-widest uppercase text-or mb-1">Année</div>
                    <div className="text-sm text-creme/70">{year}</div>
                  </div>
                )}
                <div>
                  <div className="text-[10px] tracking-widest uppercase text-or mb-1">Pays</div>
                  <div className="text-sm text-creme/70">{voyage.country}</div>
                </div>
                {(voyage.city) && (
                  <div>
                    <div className="text-[10px] tracking-widest uppercase text-or mb-1">Région</div>
                    <div className="text-sm text-creme/70">{voyage.city}{voyage.region ? `, ${voyage.region}` : ''}</div>
                  </div>
                )}
                {(voyage.photos || []).length > 0 && (
                  <div>
                    <div className="text-[10px] tracking-widest uppercase text-or mb-1">Photos</div>
                    <div className="text-sm text-creme/70">{voyage.photos.length}</div>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {(voyage.anecdotes||[]).length > 0 && (
              <div className="mb-16">
                <ScrollReveal>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-8 h-px bg-or" />
                    <h2 className="font-serif italic text-2xl text-creme">Anecdotes de terrain</h2>
                  </div>
                </ScrollReveal>
                <div className="flex flex-col gap-8">
                  {(voyage.anecdotes||[]).map((anecdote, i) => (
                    <AnecdoteCard key={anecdote.id} anecdote={anecdote} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-6">
              <ScrollReveal direction="right">
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-or mb-4">Itinéraire</div>
                  <VoyageMapLeaflet
                    waypoints={voyage.waypoints || []}
                    country={voyage.country}
                    centerLat={voyage.lat}
                    centerLng={voyage.lng}
                  />
                  {(voyage.waypoints||[]).length > 0 && (
                    <div className="mt-3 flex flex-col gap-2">
                      {(voyage.waypoints||[]).map((wp, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs text-creme/50">
                          <div className="w-5 h-5 rounded-full border border-or/50 flex items-center justify-center text-or text-[9px] flex-shrink-0">{i+1}</div>
                          <span>{wp.label}</span>
                          {wp.day && <span className="text-creme/30">· Jour {wp.day}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>

              {(voyage.tips||[]).length > 0 && (
                <ScrollReveal direction="right" delay={0.1}>
                  <div className="bg-noir-mid border border-white/5 p-6 md:p-8">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-or mb-6">
                      Conseils pratiques
                    </div>
                    <ul className="flex flex-col gap-3">
                      {(voyage.tips||[]).map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-creme/55 leading-relaxed">
                          <CheckCircle size={13} className="text-or mt-1 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </div>

        {photos.length > 0 && (
          <div className="mt-20 md:mt-28">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-10">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-8 h-px bg-or" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-or">
                      {photos.length} photographies
                    </span>
                  </div>
                  <h2 className="font-serif italic text-3xl text-creme">Galerie du voyage</h2>
                </div>
              </div>
            </ScrollReveal>
            <MasonryGrid photos={photos} showFilters={false} />
          </div>
        )}

        <div className="mt-24 md:mt-32">
          <div className="gold-line mb-10" />
          <div className="flex justify-between items-center">
            <Link href="/voyages" className="flex items-center gap-3 text-[11px] tracking-widest uppercase text-creme/50 hover:text-or transition-colors">
              ← Tous les voyages
            </Link>
            <Link href="/galerie" className="flex items-center gap-3 text-[11px] tracking-widest uppercase text-creme/50 hover:text-or transition-colors">
              Galerie complète →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
