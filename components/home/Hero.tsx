'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { HERO_SLIDES } from '@/lib/data';
import Toucans from './Toucans';

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.18;
    }
    if (soundOn) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setSoundOn(!soundOn);
  };

  const next = useCallback(() => {
    setPrev(current);
    setCurrent((c) => (c + 1) % HERO_SLIDES.length);
  }, [current]);

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next]);

  const slide = HERO_SLIDES[current];

  const wordVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.3 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-noir">
      {/* Letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-noir z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-noir z-20 pointer-events-none" />

      {/* Permanent tagline */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute top-20 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none"
      >
        <p className="text-[10px] tracking-[0.45em] uppercase text-creme/35 font-poppins font-light whitespace-nowrap">
          Voyages &nbsp;·&nbsp; Nature &nbsp;·&nbsp; Photographie
        </p>
      </motion.div>

      {/* Background images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1.0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slide.image}
            alt={slide.location}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Ken Burns subtle zoom */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: 1.06 }}
            transition={{ duration: 8, ease: 'linear' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-noir via-noir/40 to-noir/20 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-noir/60 via-transparent to-transparent pointer-events-none" />

      {/* Toucans */}
      <Toucans />

      {/* Content */}
      <div className="relative z-30 h-full flex flex-col justify-end pb-20 md:pb-24 px-6 md:px-14 max-w-screen-xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={slide.id} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-6 h-px bg-or" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins font-light">
                {slide.country} &bull; {slide.location} &bull; {slide.year}
              </span>
            </motion.div>

            {/* Title — word by word */}
            <h1 className="font-serif font-light text-5xl md:text-7xl lg:text-8xl text-creme leading-[1.0] mb-6 overflow-hidden">
              {slide.title.split('\n').map((line, li) => (
                <div key={li} className="overflow-hidden">
                  {line.split(' ').map((word, wi) => (
                    <motion.span
                      key={wi}
                      custom={li * 3 + wi}
                      variants={wordVariants}
                      className="inline-block mr-[0.3em]"
                      style={{ display: 'inline-block' }}
                    >
                      {wi === 0 && li === 0 ? word : wi === 0 ? <em>{word}</em> : word}
                    </motion.span>
                  ))}
                </div>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="text-sm md:text-base text-creme/60 max-w-md leading-relaxed mb-8 font-poppins font-light"
            >
              {slide.subtitle}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <Link
                href={`/voyages/${slide.slug}`}
                className="inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-creme border border-creme/30 hover:border-or hover:text-or px-6 py-3.5 transition-all duration-300 group"
              >
                Voir le voyage
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Sound toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          onClick={toggleSound}
          className="absolute top-6 right-6 md:right-14 flex items-center gap-2 text-creme/50 hover:text-or transition-colors z-30 group"
          aria-label={soundOn ? 'Couper le son' : 'Activer le son ambiance'}
        >
          <span className="text-[9px] tracking-[0.25em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
            {soundOn ? 'Silence' : 'Ambiance'}
          </span>
          {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </motion.button>

        {/* Slide dots */}
        <div className="absolute bottom-6 md:bottom-8 right-6 md:right-14 flex items-center gap-3 z-30">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setPrev(current); setCurrent(i); }}
              aria-label={`Slide ${i + 1}`}
              className="relative h-px flex items-center"
            >
              <div className={`h-px transition-all duration-500 ${i === current ? 'w-8 bg-or' : 'w-4 bg-white/30 hover:bg-white/60'}`} />
            </button>
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30"
        >
          <div className="text-[9px] tracking-[0.3em] uppercase text-creme/40">Scroll</div>
          <ChevronDown size={14} className="text-creme/40" />
        </motion.div>
      </div>
    </section>
  );
}
