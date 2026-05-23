'use client';
import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handlePrev = useCallback(() => { if (hasPrev) onNavigate(currentIndex - 1); }, [hasPrev, currentIndex, onNavigate]);
  const handleNext = useCallback(() => { if (hasNext) onNavigate(currentIndex + 1); }, [hasNext, currentIndex, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, handlePrev, handleNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx > 0) handlePrev(); else handleNext();
    }
    if (Math.abs(dy) > 80 && Math.abs(dy) > Math.abs(dx)) onClose();
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-noir/97 flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={e => e.preventDefault()}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 flex-shrink-0" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <span className="text-[11px] text-creme/40 font-poppins tracking-widest">
          {currentIndex + 1} / {photos.length}
        </span>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-creme/60 hover:text-creme transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 relative flex items-center justify-center px-4 md:px-16 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="relative w-full h-full flex items-center justify-center">
            <div className="relative" style={{ maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%' }}>
              <Image
                src={cloudinaryUrl(photo.src)}
                alt={photo.alt || ''}
                fill
                className="object-contain"
                sizes="100vw"
                priority
                draggable={false}
                onContextMenu={e => e.preventDefault()}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows - desktop only */}
        {hasPrev && (
          <button onClick={handlePrev} className="hidden md:flex absolute left-4 w-12 h-12 items-center justify-center border border-white/15 hover:border-or/50 text-creme/50 hover:text-or transition-all">
            <ChevronLeft size={20} />
          </button>
        )}
        {hasNext && (
          <button onClick={handleNext} className="hidden md:flex absolute right-4 w-12 h-12 items-center justify-center border border-white/15 hover:border-or/50 text-creme/50 hover:text-or transition-all">
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Caption + swipe hint on mobile */}
      <div className="flex-shrink-0 px-4 md:px-6 pb-4 md:pb-6" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        {photo.caption && photo.caption.trim() && (
          <p className="text-sm text-creme/55 font-poppins italic text-center mb-2">{photo.caption}</p>
        )}
        {/* Swipe indicator - mobile only */}
        <div className="flex md:hidden justify-center items-center gap-6 mt-2">
          {hasPrev && <button onClick={handlePrev} className="w-10 h-10 flex items-center justify-center text-creme/40"><ChevronLeft size={20} /></button>}
          <div className="flex gap-1.5">
            {photos.slice(Math.max(0, currentIndex-2), Math.min(photos.length, currentIndex+3)).map((_, i) => {
              const realIdx = Math.max(0, currentIndex-2) + i;
              return <div key={realIdx} style={{ width: realIdx === currentIndex ? '16px' : '4px', height: '4px', borderRadius: '2px', background: realIdx === currentIndex ? '#c4962a' : 'rgba(255,255,255,0.2)', transition: 'all .3s' }} />;
            })}
          </div>
          {hasNext && <button onClick={handleNext} className="w-10 h-10 flex items-center justify-center text-creme/40"><ChevronRight size={20} /></button>}
        </div>
      </div>
    </motion.div>
  );
}
