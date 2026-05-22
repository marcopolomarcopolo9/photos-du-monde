// @ts-nocheck
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getVoyages } from '@/lib/kv';
import { CATEGORIES } from '@/lib/categories';
import VoyageHero from '@/components/voyage/VoyageHero';
import VoyageMapLeaflet from '@/components/voyage/VoyageMap';
import MasonryGrid from '@/components/gallery/MasonryGrid';
import ScrollReveal from '@/components/ui/ScrollReveal';

export const dynamic = 'force-dynamic';

interface Props { params: { slug: string } }

export default async function VoyagePage({ params }: Props) {
  const voyages = await getVoyages().catch(() => []);
  const voyage = voyages.find((v: any) => (v.slug || v.id) === params.slug);
  if (!voyage || voyage.published === false) notFound();

  const getYear = (d: string) => { if (!d) return ''; const m = d.match(/\d{4}/); return m ? m[0] : d; };
  const year = getYear(voyage.startDate || voyage.date || '');

  const photos = (voyage.photos || []).map((p: any, i: number) => ({
    id: `${voyage.slug}-p${i}`,
    src: typeof p === 'string' ? p : (p.src || ''),
    alt: typeof p === 'object' && p.caption ? p.caption : voyage.title,
    caption: typeof p === 'object' ? (p.caption || '') : '',
    location: voyage.city || '',
    country: voyage.country || '',
    continent: voyage.continent || '',
    date: voyage.startDate || voyage.date || '',
    width: 1200, height: 800,
    voyageSlug: voyage.slug || voyage.id,
  }));

  // Similar voyages
  const similar = voyages.filter((v: any) =>
    v.published !== false &&
    (v.slug || v.id) !== (voyage.slug || voyage.id) &&
    (v.country === voyage.country || (v.categories || []).some((c: string) => (voyage.categories || []).includes(c)))
  ).slice(0, 3);

  return (
    <div className="bg-noir min-h-screen">
      <VoyageHero voyage={voyage} />

      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main content */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              {/* Stats */}
              <div className="flex flex-wrap gap-8 mb-12">
                {year && <div><div className="text-[10px] tracking-widest uppercase text-or mb-1">Année</div><div className="text-sm text-creme/70">{year}</div></div>}
                <div><div className="text-[10px] tracking-widest uppercase text-or mb-1">Pays</div><div className="text-sm text-creme/70">{voyage.country}</div></div>
                {voyage.city && <div><div className="text-[10px] tracking-widest uppercase text-or mb-1">Région</div><div className="text-sm text-creme/70">{voyage.city}</div></div>}
                {photos.length > 0 && <div><div className="text-[10px] tracking-widest uppercase text-or mb-1">Photos</div><div className="text-sm text-creme/70">{photos.length}</div></div>}
              </div>
            </ScrollReveal>

            {/* Description */}
            {voyage.description && (
              <ScrollReveal delay={0.1}>
                <p className="text-creme/65 leading-[1.9] text-base mb-12 font-poppins font-light max-w-2xl">{voyage.description}</p>
              </ScrollReveal>
            )}

            {/* Categories */}
            {(voyage.categories || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-12">
                {(voyage.categories || []).map((cat: string) => {
                  const catData = CATEGORIES.find((c: any) => c.slug === cat);
                  return (
                    <Link key={cat} href={`/categories/${cat}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-or/30 hover:border-or hover:bg-or/5 transition-all text-[10px] tracking-[0.15em] uppercase text-or/70 hover:text-or font-poppins">
                      <span>{catData?.emoji || '📷'}</span>
                      <span>{catData?.label || cat}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-6">
              {(voyage.waypoints || []).length > 0 || voyage.lat ? (
                <ScrollReveal direction="right">
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-or mb-4 font-poppins">Itinéraire</div>
                    <VoyageMapLeaflet waypoints={voyage.waypoints || []} country={voyage.country} centerLat={voyage.lat} centerLng={voyage.lng} />
                    {(voyage.waypoints || []).length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        {(voyage.waypoints || []).map((wp: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 text-xs text-creme/50 font-poppins">
                            <div className="w-5 h-5 rounded-full border border-or/50 flex items-center justify-center text-or text-[9px] flex-shrink-0">{i+1}</div>
                            <span>{wp.label}</span>
                            {wp.day && <span className="text-creme/30">· Jour {wp.day}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ) : null}
            </div>
          </div>
        </div>

        {/* Photos gallery */}
        {photos.length > 0 && (
          <div className="mt-16">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-8 h-px bg-or" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">{photos.length} photographies</span>
              </div>
            </ScrollReveal>
            <MasonryGrid photos={photos} showFilters={false} />
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
                    {(v.heroImage||v.coverImage) && (
                      <Image src={v.heroImage||v.coverImage} alt={v.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" />
                    )}
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

        {/* Navigation */}
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
