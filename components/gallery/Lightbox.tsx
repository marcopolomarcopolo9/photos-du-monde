'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';
import type { Photo } from '@/lib/types';

interface Props {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ photos, currentIndex, onClose, onNavigate }: Props) {
  const photo = photos[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1);
  }, [hasPrev, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1);
  }, [hasNext, currentIndex, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, handlePrev, handleNext]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] bg-noir/98 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close */}
        <button
          className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center text-creme/60 hover:text-creme border border-white/10 hover:border-white/30 transition-all"
          onClick={onClose}
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        {/* Counter */}
        <div className="absolute top-5 left-5 text-[10px] tracking-widest text-creme/40 z-10">
          {String(currentIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
        </div>

        {/* Prev */}
        {hasPrev && (
          <button
            className="absolute left-4 md:left-8 z-10 w-12 h-12 flex items-center justify-center text-creme/60 hover:text-creme border border-white/10 hover:border-or/50 transition-all"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            aria-label="Photo précédente"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Next */}
        {hasNext && (
          <button
            className="absolute right-4 md:right-8 z-10 w-12 h-12 flex items-center justify-center text-creme/60 hover:text-creme border border-white/10 hover:border-or/50 transition-all"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            aria-label="Photo suivante"
          >
            <ChevronRight size={22} />
          </button>
        )}

        {/* Image */}
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-full flex items-center justify-center px-20 py-16"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative max-w-5xl w-full max-h-[80vh] aspect-auto">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="object-contain w-full h-full max-h-[72vh]"
              priority
            />
          </div>
        </motion.div>

        {/* Caption */}
        <motion.div
          key={`caption-${photo.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="absolute bottom-8 left-0 right-0 flex justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <p className="font-serif italic text-creme/80 text-base mb-2">{photo.alt}</p>
            <div className="flex items-center justify-center gap-4 text-xs text-creme/40">
              <span className="flex items-center gap-1">
                <MapPin size={10} /> {photo.location}
              </span>
              <span className="w-px h-3 bg-creme/20" />
              <span className="flex items-center gap-1">
                <Calendar size={10} />{' '}
                {new Date(photo.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Thumbnail strip */}
        <div
          className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-1.5 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {photos.slice(Math.max(0, currentIndex - 3), currentIndex + 4).map((p, i) => {
            const actualIndex = Math.max(0, currentIndex - 3) + i;
            return (
              <button
                key={p.id}
                onClick={() => onNavigate(actualIndex)}
                className={`relative w-10 h-7 overflow-hidden transition-all duration-200 ${
                  actualIndex === currentIndex ? 'ring-1 ring-or opacity-100' : 'opacity-30 hover:opacity-60'
                }`}
              >
                <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="40px" />
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
