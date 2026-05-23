// @ts-nocheck
'use client';
import { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from './Lightbox';
import type { Photo } from '@/lib/types';

interface Props {
  photos: Photo[];
  showFilters?: boolean;
}

// Individual photo card with zoom-in-place effect
const PhotoCard = memo(({ photo, index, onClick }: { photo: Photo; index: number; onClick: () => void }) => {
  const [zooming, setZooming] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget.querySelector('img');
    if (el) setRect(el.getBoundingClientRect());
    setZooming(true);
    setTimeout(() => {
      setZooming(false);
      onClick();
    }, 280);
  };

  return (
    <motion.div
      className="photo-card group relative bg-noir-mid overflow-hidden cursor-zoom-in"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleClick}
      data-cursor="photo"
    >
      {/* Zoom flash overlay */}
      <AnimatePresence>
        {zooming && (
          <motion.div
            className="absolute inset-0 z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{ background: '#fff' }}
          />
        )}
      </AnimatePresence>

      <div className="img-zoom overflow-hidden">
        <Image
          src={cloudinaryUrl(photo.src)}
          alt={photo.alt || ''}
          width={photo.width || 800}
          height={photo.height || 600}
          className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading={index < 6 ? 'eager' : 'lazy'}
        />
      </div>

      {/* Hover overlay */}
      <div className="photo-overlay absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end p-3">
        {photo.alt && <p className="font-serif italic text-sm text-creme/90 leading-snug">{photo.alt}</p>}
        {photo.caption && photo.caption.trim() && photo.location && <p className="text-[10px] text-creme/50 mt-0.5 font-poppins">{photo.location}</p>}
      </div>

      {/* Zoom icon */}
      <div className="absolute top-2 right-2 w-7 h-7 bg-noir/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(196,150,42,0.9)" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </div>

      {/* Caption */}
      {photo.caption && photo.caption.trim() && (
        <div className="px-2 pt-1.5 pb-2 bg-noir/95">
          <p className="text-[11px] text-creme/45 leading-relaxed font-poppins italic">{photo.caption}</p>
        </div>
      )}
    </motion.div>
  );
});

PhotoCard.displayName = 'PhotoCard';

export default function MasonryGrid({ photos, showFilters = true }: Props) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filters = showFilters ? ['all', ...new Set(photos.map(p => p.continent).filter(Boolean))] : [];
  const filtered = activeFilter === 'all' ? photos : photos.filter(p => p.continent === activeFilter);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);

  return (
    <div>
      {/* Filters */}
      {showFilters && filters.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-all duration-200 font-poppins ${activeFilter === f ? 'border-or text-or bg-or/5' : 'border-white/10 text-creme/40 hover:text-creme/60 hover:border-white/20'}`}>
              {f === 'all' ? `Toutes (${photos.length})` : f}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="masonry-grid"
        >
          {filtered.map((photo, i) => (
            <PhotoCard key={photo.id || photo.src} photo={photo} index={i} onClick={() => openLightbox(i)} onContextMenu={e => e.preventDefault()} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox */}
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
