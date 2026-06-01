'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import type { Photo } from '@/lib/types';
import { cloudinaryUrl } from '@/lib/cloudinary';

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

  // Desktop zoom
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile pinch + pan
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const lastScale = useRef(1);
  const lastDist = useRef<number | null>(null);
  const panStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  // Swipe
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const wasPinch = useRef(false);

  const handlePrev = useCallback(() => {
    if (hasPrev) { setZoomed(false); setScale(1); setPan({ x: 0, y: 0 }); onNavigate(currentIndex - 1); }
  }, [hasPrev, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) { setZoomed(false); setScale(1); setPan({ x: 0, y: 0 }); onNavigate(currentIndex + 1); }
  }, [hasNext, currentIndex, onNavigate]);

  useEffect(() => { setZoomed(false); setScale(1); setPan({ x: 0, y: 0 }); }, [currentIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (zoomed || scale > 1) { setZoomed(false); setScale(1); setPan({ x: 0, y: 0 }); } else onClose(); }
      if (e.key === 'ArrowLeft' && !zoomed) handlePrev();
      if (e.key === 'ArrowRight' && !zoomed) handleNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, handlePrev, handleNext, zoomed, scale]);

  // Desktop mouse pan
  const mousePanStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!zoomed && scale <= 1) return;
    e.preventDefault();
    mousePanStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mousePanStart.current) return;
    const dx = e.clientX - mousePanStart.current.x;
    const dy = e.clientY - mousePanStart.current.y;
    const ctn = containerRef.current;
    const cw = ctn ? ctn.offsetWidth : window.innerWidth;
    const ch = ctn ? ctn.offsetHeight : window.innerHeight;
    const effectiveScale = scale > 1 ? scale : (zoomed ? 2.5 : 1);
    const maxX = cw * (effectiveScale - 1) / 2;
    const maxY = ch * (effectiveScale - 1) / 2;
    setPan({
      x: Math.min(Math.max(mousePanStart.current.px + dx, -maxX), maxX),
      y: Math.min(Math.max(mousePanStart.current.py + dy, -maxY), maxY)
    });
  };
  const handleMouseUp = () => { mousePanStart.current = null; };
  const handleImgClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!zoomed) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    }
    if (zoomed || scale > 1) {
      setZoomed(false); setScale(1); setPan({ x: 0, y: 0 });
    } else {
      setZoomed(true);
    }
  };

  // Mobile touch
  const getDist = (t: React.TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastDist.current = getDist(e.touches);
      lastScale.current = scale;
      swipeStart.current = null;
      panStart.current = null;
      wasPinch.current = true;
    } else if (e.touches.length === 1) {
      // Always record start position for tap detection
      swipeStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      if (scale > 1 || zoomed) {
        // Pan mode
        panStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, px: pan.x, py: pan.y };
      } else {
        panStart.current = null;
      }
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastDist.current !== null) {
      e.preventDefault();
      const newScale = Math.min(Math.max(lastScale.current * getDist(e.touches) / lastDist.current, 1), 5);
      setScale(newScale);
    } else if (e.touches.length === 1 && panStart.current && (scale > 1 || zoomed)) {
      e.preventDefault();
      const dx = e.touches[0].clientX - panStart.current.x;
      const dy = e.touches[0].clientY - panStart.current.y;
      // Clamp pan to image bounds
      const ctn = containerRef.current;
      const cw = ctn ? ctn.offsetWidth : window.innerWidth;
      const ch = ctn ? ctn.offsetHeight : window.innerHeight;
      const effectiveScale = scale > 1 ? scale : (zoomed ? 2.5 : 1);
      const maxX = cw * (effectiveScale - 1) / 2;
      const maxY = ch * (effectiveScale - 1) / 2;
      setPan({
        x: Math.min(Math.max(panStart.current.px + dx, -maxX), maxX),
        y: Math.min(Math.max(panStart.current.py + dy, -maxY), maxY)
      });
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    lastDist.current = null;
    panStart.current = null;
    if (scale > 1) {
      // Only reset if it was a true single tap (not a pinch release)
      if (!wasPinch.current && swipeStart.current) {
        const dx = e.changedTouches[0].clientX - swipeStart.current.x;
        const dy = e.changedTouches[0].clientY - swipeStart.current.y;
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
          setScale(1); setPan({ x: 0, y: 0 });
        }
      }
      wasPinch.current = false;
      swipeStart.current = null; return;
    }
    wasPinch.current = false;
    if (swipeStart.current && e.changedTouches.length > 0 && !zoomed) {
      const dx = e.changedTouches[0].clientX - swipeStart.current.x;
      const dy = e.changedTouches[0].clientY - swipeStart.current.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0) handlePrev(); else handleNext();
      } else if (Math.abs(dy) > 80 && Math.abs(dy) > Math.abs(dx)) {
        onClose();
      }
    }
    swipeStart.current = null;
  };

  if (!photo) return null;
  const effectiveScale = scale > 1 ? scale : (zoomed ? 2.5 : 1);

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex flex-col" style={{ background: 'rgba(4,4,4,0.97)' }}
        onClick={() => { if (zoomed || scale > 1) { setZoomed(false); setScale(1); setPan({ x: 0, y: 0 }); } else onClose(); }}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        onContextMenu={e => e.preventDefault()}>

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', background: 'linear-gradient(to bottom,rgba(0,0,0,0.6),transparent)' }}
          onClick={e => e.stopPropagation()}>
          <span className="text-[10px] tracking-[0.3em] text-creme/40 font-poppins">{String(currentIndex + 1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoomed(z => !z)} className="hidden md:flex w-9 h-9 items-center justify-center text-creme/50 hover:text-or border border-white/10 hover:border-or/40 transition-all">
              {zoomed ? <ZoomOut size={15}/> : <ZoomIn size={15}/>}
            </button>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-creme/60 hover:text-creme border border-white/10 hover:border-white/30 transition-all">
              <X size={18}/>
            </button>
          </div>
        </div>

        {/* Nav arrows desktop */}
        {hasPrev && !zoomed && (
          <button className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center text-creme/60 hover:text-creme border border-white/10 hover:border-or/50 transition-all" style={{ background:'rgba(0,0,0,0.5)' }}
            onClick={e => { e.stopPropagation(); handlePrev(); }}><ChevronLeft size={22}/></button>
        )}
        {hasNext && !zoomed && (
          <button className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center text-creme/60 hover:text-creme border border-white/10 hover:border-or/50 transition-all" style={{ background:'rgba(0,0,0,0.5)' }}
            onClick={e => { e.stopPropagation(); handleNext(); }}><ChevronRight size={22}/></button>
        )}

        {/* Image */}
        <div className="flex-1 relative flex items-center justify-center px-4 md:px-16 py-4" ref={containerRef}>
          <motion.div key={photo.src} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}
            ref={imgRef}
            style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in', width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}
            onClick={handleImgClick} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <Image src={cloudinaryUrl(photo.src)} alt={photo.alt||''} width={photo.width||1200} height={photo.height||800}
              className="block select-none" style={{ width: scale > 1 ? "100%" : "auto", height: scale > 1 ? "100%" : "auto", maxWidth: scale > 1 ? "none" : "100%", maxHeight: scale > 1 ? "none" : "100%", objectFit: scale > 1 ? "cover" : "contain" as "cover" | "contain",
                transition: scale === 1 && !zoomed ? 'transform 0.3s ease' : 'none',
                transform: scale > 1
                  ? `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
                  : zoomed
                    ? `translate(${pan.x}px, ${pan.y}px) scale(2.5)`
                    : 'scale(1)',
                transformOrigin: 'center center',
                pointerEvents: 'none',
              }}
              priority draggable={false} onContextMenu={e => e.preventDefault()}/>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="flex-shrink-0 px-4 pb-4" style={{ paddingBottom:'max(16px,env(safe-area-inset-bottom))' }} onClick={e => e.stopPropagation()}>
          {photo.caption && photo.caption.trim() && <p className="font-serif italic text-creme/80 text-sm text-center mb-3">{photo.caption}</p>}
          {/* Mobile dots */}
          <div className="flex md:hidden justify-center items-center gap-5">
            <button onClick={handlePrev} className={`w-10 h-10 flex items-center justify-center text-creme/40 ${!hasPrev?'opacity-20':''}`} disabled={!hasPrev}><ChevronLeft size={20}/></button>
            <div className="flex gap-1.5">
              {photos.slice(Math.max(0,currentIndex-2),currentIndex+3).map((_,i)=>{
                const idx=Math.max(0,currentIndex-2)+i;
                return <div key={idx} style={{width:idx===currentIndex?'16px':'4px',height:'4px',borderRadius:'2px',background:idx===currentIndex?'#c4962a':'rgba(255,255,255,0.2)',transition:'all .3s'}}/>;
              })}
            </div>
            <button onClick={handleNext} className={`w-10 h-10 flex items-center justify-center text-creme/40 ${!hasNext?'opacity-20':''}`} disabled={!hasNext}><ChevronRight size={20}/></button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
