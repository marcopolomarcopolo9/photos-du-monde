'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const down = () => setClicked(true);
    const up = () => setClicked(false);

    const checkHover = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovered(
        !!(
          t.closest('a') ||
          t.closest('button') ||
          t.closest('[data-cursor-hover]')
        )
      );
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mousemove', checkHover);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousemove', checkHover);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        animate={{ x: pos.x - 4, y: pos.y - 4, scale: clicked ? 0.5 : 1 }}
        transition={{ type: 'spring', stiffness: 800, damping: 35, mass: 0.1 }}
      >
        <div className="w-2 h-2 rounded-full bg-or" />
      </motion.div>
      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        animate={{
          x: pos.x - 20,
          y: pos.y - 20,
          scale: hovered ? 1.8 : clicked ? 0.8 : 1,
          opacity: hovered ? 0.6 : 0.35,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.5 }}
      >
        <div className="w-10 h-10 rounded-full border border-or" />
      </motion.div>
    </>
  );
}
