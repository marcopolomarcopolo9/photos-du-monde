'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, ZoomIn, ZoomOut } from 'lucide-react';
import type { Photo } from '@/lib/types';
import { cloudinaryUrl } from '@/lib/cloudinary';

interface Props {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ photos, currentIndex, onClose, onNavigate }: Props) {
  // Preload adjacent photos for instant navigation
  useEffect(() => {
    const toPreload = [currentIndex - 1, currentIndex + 1, currentIndex + 2].filter(
      i => i >= 0 && i < photos.length
    );
    toPreload.forEach(i => {
      const img = new window.Image();
      img.src = photos[i]?.src || '';
    });
  }, [currentIndex, photos]);

  const photo = photos[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [showInfo, setShowInfo] = useState(true);
  const imgRef = useRef<HTMLDivElement>(null);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const lastDist = useRef<number | null>(null);
  const lastScale = useRef(1);
  const [pinchScale, setPinchScale] = useState(1);

  const handlePrev = useCallback(() => {
    if (hasPrev) { setZoomed(false); setPinchScale(1); onNavigate(currentIndex - 1); }
  }, [hasPrev, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) { setZoomed(false); setPinchScale(1); onNavigate(currentIndex + 1); }
  }, [hasNext, currentIndex, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (zoomed) setZoomed(false); else onClose(); }
      if (e.key === 'ArrowLeft' && !zoomed) handlePrev();
      if (e.key === 'ArrowRight' && !zoomed) handleNext();
      if (e.key === 'z' || e.key === 'Z') setZoomed(z => !z);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, handlePrev, handleNext, zoomed]);

  useEffect(() => { setZoomed(false); setPinchScale(1); }, [currentIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleImgClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!zoomed) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setZoomPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
    setZoomed(z => !z);
  };

  // Touch handlers
  const getDist = (t: React.TouchList) =>
    Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastDist.current = getDist(e.touches);
      lastScale.current = pinchScale;
    } else {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastDist.current !== null) {
      e.preventDefault();
      const newScale = Math.min(Math.max(lastScale.current * (getDist(e.touches) / lastDist.current), 1), 4);
      setPinchScale(newScale);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    lastDist.current = null;
    if (pinchScale <= 1 && touchStartX.current !== null && touchStartY.current !== null) {
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

  if (!photo) return null;

  const date = photo.date
    ? new Date(photo.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
    : null;

  const effectiveScale = pinchScale > 1 ? pinchScale : (zoomed ? 2.5 : 1);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[200]"
        style={{ background: 'rgba(4,4,4,0.97)' }}
        onClick={() => { if (zoomed) setZoomed(false); else onClose(); }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onContextMenu={e => e.preventDefault()}
      >
        {/* Top bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)', paddingTop: 'max(16px, env(safe-area-inset-top))' }}
          onClick={e => e.stopPropagation()}
        >
          <span className="text-[10px] tracking-[0.3em] text-creme/40 font-poppins">
            {String(currentIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoomed(z => !z)}
              className="hidden md:flex w-9 h-9 items-center justify-center text-creme/50 hover:text-or border border-white/10 hover:border-or/40 transition-all">
              {zoomed ? <ZoomOut size={15} /> : <ZoomIn size={15} />}
            </button>
            <button onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-creme/60 hover:text-creme border border-white/10 hover:border-white/30 transition-all">
              <X size={18} />
            </button>
          </div>
        </motion.div>

        {/* Prev */}
        {hasPrev && !zoomed && (
          <button className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center text-creme/60 hover:text-creme border border-white/10 hover:border-or/50 transition-all"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={e => { e.stopPropagation(); handlePrev(); }}>
            <ChevronLeft size={22} />
          </button>
        )}
        {hasNext && !zoomed && (
          <button className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center text-creme/60 hover:text-creme border border-white/10 hover:border-or/50 transition-all"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={e => { e.stopPropagation(); handleNext(); }}>
            <ChevronRight size={22} />
          </button>
        )}

        {/* Image */}
        <div className="absolute inset-0 flex items-center justify-center px-4 md:px-16 py-20">
          <motion.div
            key={photo.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            ref={imgRef}
            style={{
              cursor: zoomed ? 'zoom-out' : 'zoom-in',
              overflow: effectiveScale > 1 ? 'hidden' : 'visible',
              width: effectiveScale > 1 ? '90vw' : 'auto',
              height: effectiveScale > 1 ? '78vh' : 'auto',
              maxWidth: '90vw',
              maxHeight: '78vh',
            }}
            onClick={handleImgClick}
            onMouseMove={handleMouseMove}
          >
            <Image
              src={cloudinaryUrl(photo.src)}
              alt={photo.alt || ''}
              width={photo.width || 1200}
              height={photo.height || 800}
              className="block max-w-[90vw] max-h-[78vh] object-contain select-none"
              style={{
                transition: effectiveScale === 1 ? 'transform 0.2s ease' : 'none',
                transform: effectiveScale > 1
                  ? `scale(${effectiveScale}) translate(${(50 - zoomPos.x) * 0.6}%, ${(50 - zoomPos.y) * 0.6}%)`
                  : 'scale(1)',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                pointerEvents: 'none',
              }}
              priority
              draggable={false}
              onContextMenu={e => e.preventDefault()}
            />
          </motion.div>
        </div>

        {/* Caption */}
        {showInfo && photo.caption && photo.caption.trim() && (
          <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center pb-6 pt-12"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)' }}
            onClick={e => e.stopPropagation()}>
            <p className="font-serif italic text-creme/80 text-base text-center px-8">{photo.caption}</p>
          </div>
        )}

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5"
            onClick={e => e.stopPropagation()}>
            {photos.slice(Math.max(0, currentIndex - 4), currentIndex + 5).map((p, i) => {
              const idx = Math.max(0, currentIndex - 4) + i;
              return (
                <button key={idx}
                  onClick={() => { setZoomed(false); onNavigate(idx); }}
                  className="relative overflow-hidden transition-all duration-200"
                  style={{ width: idx === currentIndex ? '44px' : '30px', height: '28px', opacity: idx === currentIndex ? 1 : 0.3, outline: idx === currentIndex ? '1px solid #c4962a' : 'none', outlineOffset: '1px' }}>
                  <Image src={cloudinaryUrl(p.src)} alt="" fill className="object-cover" sizes="44px" />
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile nav */}
        <div className="flex md:hidden absolute bottom-16 left-1/2 -translate-x-1/2 items-center gap-6 z-20"
          onClick={e => e.stopPropagation()}>
          <button onClick={handlePrev} className={`w-10 h-10 flex items-center justify-center text-creme/40 ${!hasPrev ? 'opacity-20' : ''}`} disabled={!hasPrev}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNext} className={`w-10 h-10 flex items-center justify-center text-creme/40 ${!hasNext ? 'opacity-20' : ''}`} disabled={!hasNext}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Keyboard hints desktop */}
        <div className="absolute bottom-4 right-5 z-20 hidden md:flex items-center gap-3"
          onClick={e => e.stopPropagation()}>
          {[['←→', 'naviguer'], ['Z', 'zoomer'], ['Esc', 'fermer']].map(([key, label]) => (
            <div key={key} className="flex items-center gap-1">
              <kbd className="text-[9px] px-1.5 py-0.5 bg-white/5 border border-white/10 text-creme/30 font-mono">{key}</kbd>
              <span className="text-[9px] text-creme/20 font-poppins">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
