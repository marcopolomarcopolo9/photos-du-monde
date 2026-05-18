'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { Photo } from '@/lib/types';
import GalleryFilters from './GalleryFilters';
import Lightbox from './Lightbox';

interface Props {
  photos: Photo[];
  showFilters?: boolean;
}

const CONTINENT_FILTERS = [
  { value: 'all', label: 'Toutes' },
  { value: 'Amérique Centrale', label: 'Am. Centrale' },
  { value: 'Amérique du Sud', label: 'Am. du Sud' },
  { value: 'Amérique du Nord', label: 'Am. du Nord' },
  { value: 'Europe', label: 'Europe' },
];

export default function MasonryGrid({ photos, showFilters = true }: Props) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? photos
        : photos.filter((p) => p.continent === activeFilter),
    [photos, activeFilter]
  );

  return (
    <div>
      {showFilters && (
        <div className="mb-10">
          <GalleryFilters
            filters={CONTINENT_FILTERS}
            active={activeFilter}
            onChange={setActiveFilter}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="masonry-grid"
        >
          {filtered.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="photo-card cursor-pointer group relative overflow-hidden bg-noir-mid"
              onClick={() => setLightboxIndex(i)}
              data-cursor-hover
            >
              <div className="img-zoom">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  className="w-full h-auto block"
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  loading="lazy"
                />
              </div>

              {/* Hover overlay */}
              <div className="photo-overlay absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/30 to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin size={10} className="text-or" />
                  <span className="text-[9px] tracking-widest uppercase text-or">
                    {photo.country}
                  </span>
                </div>
                <p className="font-serif italic text-sm text-creme/90 leading-tight">
                  {photo.location}
                </p>
                <p className="text-[10px] text-creme/40 mt-1">
                  {new Date(photo.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {lightboxIndex !== null && (
        <Lightbox
          photos={filtered}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
