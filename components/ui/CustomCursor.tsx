'use client';
import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'default' | 'hover' | 'click' | 'photo'>('default');
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef<number>();

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.documentElement.style.cursor = 'none';

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [data-cursor="hover"]')) setState('hover');
      else if (t.closest('img, [data-cursor="photo"]')) setState('photo');
      else setState('default');
    };

    const down = () => setState('click');
    const up = () => setState('default');

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    return () => {
      document.documentElement.style.cursor = '';
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, []);

  const sizes = {
    default: { dot: 5, ring: 32, opacity: 0.6 },
    hover:   { dot: 4, ring: 48, opacity: 1 },
    click:   { dot: 3, ring: 22, opacity: 1 },
    photo:   { dot: 0, ring: 56, opacity: 0.9 },
  };
  const s = sizes[state];

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[99999] hidden md:block"
        style={{
          width: `${s.dot}px`, height: `${s.dot}px`,
          borderRadius: '50%', background: '#c4962a',
          marginLeft: `-${s.dot / 2}px`, marginTop: `-${s.dot / 2}px`,
          transition: 'width 0.2s, height 0.2s, margin 0.2s',
          willChange: 'transform',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[99998] hidden md:block"
        style={{
          width: `${s.ring}px`, height: `${s.ring}px`,
          borderRadius: '50%',
          border: state === 'photo' ? '1.5px solid rgba(196,150,42,0.8)' : '1px solid rgba(196,150,42,0.5)',
          marginLeft: `-${s.ring / 2}px`, marginTop: `-${s.ring / 2}px`,
          opacity: s.opacity,
          transition: 'width 0.3s ease, height 0.3s ease, margin 0.3s ease, opacity 0.2s',
          willChange: 'transform',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {state === 'photo' && (
          <span style={{ fontSize: '11px', color: 'rgba(196,150,42,0.8)', fontFamily: 'system-ui' }}>
            ↔
          </span>
        )}
      </div>
    </>
  );
}
