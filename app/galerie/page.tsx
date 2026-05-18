import type { Metadata } from 'next';
import { ALL_PHOTOS } from '@/lib/data';
import MasonryGrid from '@/components/gallery/MasonryGrid';

export const metadata: Metadata = {
  title: 'Galerie — Photos du Monde',
  description: 'Galerie photographique complète — volcans, jungles, oiseaux du monde entier.',
  openGraph: {
    title: 'Galerie — Photos du Monde',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&h=630&q=80',
      },
    ],
  },
};

export default function GaleriePage() {
  return (
    <div className="min-h-screen bg-noir pt-32 pb-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-or" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-or">
              {ALL_PHOTOS.length} photographies
            </span>
          </div>
          <h1 className="font-serif font-light text-5xl md:text-6xl text-creme italic">
            Galerie
          </h1>
          <p className="mt-4 text-sm text-creme/45 max-w-lg leading-relaxed">
            L&apos;ensemble des photographies réalisées lors des voyages. Cliquez sur
            une image pour l&apos;agrandir.
          </p>
        </div>

        {/* Grid */}
        <MasonryGrid photos={ALL_PHOTOS} showFilters />
      </div>
    </div>
  );
}
