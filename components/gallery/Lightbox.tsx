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

  // Swipe
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Pinch zoom
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const lastScale = useRef(1);
  const lastDist = useRef<number | null>(null);
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const handlePrev = useCallback(() => {
    if (hasPrev) { setScale(1); setOffset({ x: 0, y: 0 }); onNavigate(currentIndex - 1); }
  }, [hasPrev, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) { setScale(1); setOffset({ x: 0, y: 0 }); onNavigate(currentIndex + 1); }
  }, [hasNext, currentIndex, onNavigate]);

  // Reset zoom on photo change
  useEffect(() => { setScale(1); setOffset({ x: 0, y: 0 }); }, [currentIndex]);

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

  const getDist = (t: React.TouchList) =>
    Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastDist.current = getDist(e.touches);
      lastScale.current = scale;
    } else if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      if (scale > 1) {
        dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, ox: offset.x, oy: offset.y };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastDist.current !== null) {
      e.preventDefault();
      const dist = getDist(e.touches);
      const newScale = Math.min(Math.max(lastScale.current * (dist / lastDist.current), 1), 4);
      setScale(newScale);
    } else if (e.touches.length === 1 && scale > 1 && dragStart.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setOffset({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    lastDist.current = null;
    dragStart.current = null;

    if (scale <= 1 && touchStartX.current !== null && touchStartY.current !== null) {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0) handlePrev(); else handleNext();
      } else if (Math.abs(dy) > 80 && Math.abs(dy) > Math.abs(dx)) {
        onClose();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Double tap/click to zoom
  const lastTap = useRef(0);
  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTap.current < 350) {
      if (scale > 1) {
        setScale(1); setOffset({ x: 0, y: 0 });
      } else {
        setScale(2.5);
      }
    }
    lastTap.current = now;
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0 }),
  };

  const [direction, setDirection] = useState(0);
  const navigate = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setScale(1); setOffset({ x: 0, y: 0 });
    onNavigate(idx);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-noir/97 flex flex-col select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => handleDoubleTap(e)}
      onContextMenu={e => e.preventDefault()}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 flex-shrink-0"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <span className="text-[11px] text-creme/40 font-poppins tracking-widest">
          {currentIndex + 1} / {photos.length}
        </span>
        <span className="text-[10px] text-or/60 font-poppins hidden md:block">{scale > 1 ? "Double-clic pour dézoomer" : "Double-clic pour zoomer"}</span>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-creme/60 hover:text-creme">
          <X size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              style={{
                width: '100%', height: '100%',
                transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
                transition: scale === 1 ? 'transform 0.3s ease' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
              <div className="relative w-full h-full">
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
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Desktop arrows */}
        {hasPrev && (
          <button onClick={() => navigate(currentIndex - 1)}
            className="hidden md:flex absolute left-4 w-12 h-12 items-center justify-center border border-white/15 hover:border-or/50 text-creme/50 hover:text-or transition-all z-10">
            <ChevronLeft size={20} />
          </button>
        )}
        {hasNext && (
          <button onClick={() => navigate(currentIndex + 1)}
            className="hidden md:flex absolute right-4 w-12 h-12 items-center justify-center border border-white/15 hover:border-or/50 text-creme/50 hover:text-or transition-all z-10">
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Bottom */}
      <div className="flex-shrink-0 px-4 pb-4"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        {photo.caption && photo.caption.trim() && (
          <p className="text-sm text-creme/55 font-poppins italic text-center mb-3">{photo.caption}</p>
        )}
        {/* Mobile nav dots */}
        <div className="flex md:hidden justify-center items-center gap-5">
          <button onClick={() => navigate(currentIndex - 1)}
            className={`w-10 h-10 flex items-center justify-center text-creme/40 ${!hasPrev ? 'opacity-20' : ''}`}
            disabled={!hasPrev}>
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-1.5">
            {photos.slice(Math.max(0, currentIndex - 2), Math.min(photos.length, currentIndex + 3)).map((_, i) => {
              const idx = Math.max(0, currentIndex - 2) + i;
              return <div key={idx} style={{ width: idx === currentIndex ? '16px' : '4px', height: '4px', borderRadius: '2px', background: idx === currentIndex ? '#c4962a' : 'rgba(255,255,255,0.2)', transition: 'all .3s' }} />;
            })}
          </div>
          <button onClick={() => navigate(currentIndex + 1)}
            className={`w-10 h-10 flex items-center justify-center text-creme/40 ${!hasNext ? 'opacity-20' : ''}`}
            disabled={!hasNext}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
