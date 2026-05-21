'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, ZoomIn, ZoomOut, Download } from 'lucide-react';
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
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [showInfo, setShowInfo] = useState(true);
  const imgRef = useRef<HTMLDivElement>(null);

  const handlePrev = useCallback(() => {
    if (hasPrev) { setZoomed(false); onNavigate(currentIndex - 1); }
  }, [hasPrev, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) { setZoomed(false); onNavigate(currentIndex + 1); }
  }, [hasNext, currentIndex, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (zoomed) setZoomed(false); else onClose(); }
      if (e.key === 'ArrowLeft' && !zoomed) handlePrev();
      if (e.key === 'ArrowRight' && !zoomed) handleNext();
      if (e.key === 'z' || e.key === 'Z') setZoomed(z => !z);
      if (e.key === 'i' || e.key === 'I') setShowInfo(s => !s);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, handlePrev, handleNext, zoomed]);

  // Reset zoom when photo changes
  useEffect(() => { setZoomed(false); }, [currentIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
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

  if (!photo) return null;

  const date = photo.date
    ? new Date(photo.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
    : null;

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
      >

        {/* ── Top bar ── */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Counter */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.3em] text-creme/40 font-poppins">
              {String(currentIndex + 1).padStart(2, '0')}
              <span className="text-creme/20 mx-1">/</span>
              {String(photos.length).padStart(2, '0')}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomed(z => !z)}
              title={zoomed ? 'Dézoomer (Z)' : 'Zoomer (Z)'}
              className="w-9 h-9 flex items-center justify-center text-creme/50 hover:text-or border border-white/10 hover:border-or/40 transition-all"
            >
              {zoomed ? <ZoomOut size={15} /> : <ZoomIn size={15} />}
            </button>
            <button
              onClick={() => setShowInfo(s => !s)}
              title="Infos (I)"
              className="w-9 h-9 flex items-center justify-center text-creme/50 hover:text-or border border-white/10 hover:border-or/40 transition-all text-[11px] font-poppins"
            >i</button>
            <a
              href={photo.src}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              title="Télécharger"
              className="w-9 h-9 flex items-center justify-center text-creme/50 hover:text-or border border-white/10 hover:border-or/40 transition-all"
            >
              <Download size={14} />
            </a>
            <button
              onClick={onClose}
              title="Fermer (Esc)"
              className="w-9 h-9 flex items-center justify-center text-creme/50 hover:text-creme border border-white/10 hover:border-white/30 transition-all ml-1"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>

        {/* ── Prev button ── */}
        <AnimatePresence>
          {hasPrev && !zoomed && (
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-creme/60 hover:text-creme border border-white/10 hover:border-or/50 transition-all"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              onClick={e => { e.stopPropagation(); handlePrev(); }}
            >
              <ChevronLeft size={22} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Next button ── */}
        <AnimatePresence>
          {hasNext && !zoomed && (
            <motion.button
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-creme/60 hover:text-creme border border-white/10 hover:border-or/50 transition-all"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              onClick={e => { e.stopPropagation(); handleNext(); }}
            >
              <ChevronRight size={22} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Main image ── */}
        <div className="absolute inset-0 flex items-center justify-center px-16 py-20">
          <motion.div
            key={photo.id || photo.src}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            ref={imgRef}
            className="relative max-w-[90vw] max-h-[78vh]"
            style={{
              cursor: zoomed ? 'zoom-out' : 'zoom-in',
              overflow: zoomed ? 'hidden' : 'visible',
              width: zoomed ? '90vw' : 'auto',
              height: zoomed ? '78vh' : 'auto',
            }}
            onClick={handleImgClick}
            onMouseMove={handleMouseMove}
          >
            <Image
              src={photo.src}
              alt={photo.alt || ''}
              width={photo.width || 1200}
              height={photo.height || 800}
              className="block max-w-[90vw] max-h-[78vh] object-contain select-none"
              style={{
                transition: zoomed ? 'none' : 'transform 0.4s ease',
                transform: zoomed
                  ? `scale(2.5) translate(${(50 - zoomPos.x) * 0.6}%, ${(50 - zoomPos.y) * 0.6}%)`
                  : 'scale(1)',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              }}
              priority
              draggable={false}
            />
          </motion.div>
        </div>

        {/* ── Caption / Info ── */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              key="caption"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 z-20 flex justify-center pb-6 pt-12"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center px-8">
                {photo.alt && (
                  <p className="font-serif italic text-creme/85 text-base md:text-lg mb-2 leading-snug">
                    {photo.alt}
                  </p>
                )}
                <div className="flex items-center justify-center gap-4 text-[11px] text-creme/40 font-poppins">
                  {photo.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={10} className="text-or/60" />
                      {photo.location}
                    </span>
                  )}
                  {photo.location && date && <span className="w-px h-3 bg-creme/15" />}
                  {date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={10} className="text-or/60" />
                      {date}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Thumbnail strip ── */}
        {photos.length > 1 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 pb-3"
            style={{ bottom: showInfo ? '64px' : '12px' }}
            onClick={e => e.stopPropagation()}
          >
            {photos.slice(Math.max(0, currentIndex - 4), currentIndex + 5).map((p, i) => {
              const idx = Math.max(0, currentIndex - 4) + i;
              return (
                <button
                  key={idx}
                  onClick={() => { setZoomed(false); onNavigate(idx); }}
                  className="relative overflow-hidden transition-all duration-200"
                  style={{
                    width: idx === currentIndex ? '44px' : '30px',
                    height: '28px',
                    opacity: idx === currentIndex ? 1 : 0.3,
                    outline: idx === currentIndex ? '1px solid #c4962a' : 'none',
                    outlineOffset: '1px',
                  }}
                >
                  <Image
                    src={typeof p.src === 'string' ? p.src : ''}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </button>
              );
            })}
          </motion.div>
        )}

        {/* ── Keyboard hints ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 right-5 z-20 hidden md:flex items-center gap-3"
          onClick={e => e.stopPropagation()}
        >
          {[
            ['←→', 'naviguer'],
            ['Z', 'zoomer'],
            ['I', 'infos'],
            ['Esc', 'fermer'],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center gap-1">
              <kbd className="text-[9px] px-1.5 py-0.5 bg-white/5 border border-white/10 text-creme/30 font-mono">{key}</kbd>
              <span className="text-[9px] text-creme/20 font-poppins">{label}</span>
            </div>
          ))}
        </motion.div>

      </motion.div>
    </AnimatePresence>
  );
}
