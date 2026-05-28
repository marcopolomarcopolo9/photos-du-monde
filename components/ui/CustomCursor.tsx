'use client';
import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'default' | 'hover' | 'click' | 'photo'>('default');
  const [visible, setVisible] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef<number>();

  useEffect(() => {
    // Hide on touch/mobile devices completely
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.innerWidth < 768) return;
    
    setVisible(true);
    document.documentElement.style.cursor = 'none';

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [data-cursor="hover"]')) setState('hover');
      else if (t.closest('img, [data-cursor="photo"]')) setState('photo');
      else setState('default');
    };

    const click = () => {
      setState('click');
      setTimeout(() => setState('default'), 150);
    };

    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`;
      }
      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('click', click);
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('click', click);
      if (raf.current) cancelAnimationFrame(raf.current);
      document.documentElement.style.cursor = '';
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div ref={dotRef} className="pointer-events-none fixed top-0 left-0 z-[99999]"
        style={{ width: 8, height: 8, borderRadius: '50%', background: '#c4962a',
          boxShadow: state === 'hover' ? '0 0 12px rgba(196,150,42,0.8)' : 'none',
          transform: 'translate(-100px,-100px)', willChange: 'transform' }} />
      <div ref={ringRef} className="pointer-events-none fixed top-0 left-0 z-[99998]"
        style={{ width: 36, height: 36, borderRadius: '50%',
          border: state === 'photo' ? '1.5px solid rgba(196,150,42,0.8)' : '1px solid rgba(196,150,42,0.5)',
          transform: 'translate(-100px,-100px)', willChange: 'transform',
          transition: 'width .2s, height .2s, border .2s',
          ...(state === 'hover' ? { width: 48, height: 48 } : {}),
          ...(state === 'click' ? { width: 24, height: 24 } : {}) }} />
    </>
  );
}
