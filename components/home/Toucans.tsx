'use client';

import { useEffect, useState } from 'react';

interface Bird {
  id: number;
  y: number;         // % from top
  size: number;      // px
  duration: number;  // seconds to cross screen
  delay: number;     // start delay
  flip: boolean;     // left→right or right→left
  opacity: number;
}

const BIRDS: Bird[] = [
  { id: 1, y: 18, size: 52, duration: 28, delay: 0,    flip: false, opacity: 0.55 },
  { id: 2, y: 30, size: 38, duration: 34, delay: 8,    flip: false, opacity: 0.40 },
  { id: 3, y: 14, size: 44, duration: 22, delay: 16,   flip: true,  opacity: 0.45 },
  { id: 4, y: 42, size: 30, duration: 40, delay: 4,    flip: false, opacity: 0.30 },
  { id: 5, y: 24, size: 58, duration: 26, delay: 22,   flip: true,  opacity: 0.50 },
];

// Minimal toucan silhouette — beak + body + tail
function ToucanSVG({ size, flip }: { size: number; flip: boolean }) {
  return (
    <svg
      width={size}
      height={size * 0.55}
      viewBox="0 0 100 55"
      fill="none"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
    >
      {/* Body */}
      <ellipse cx="50" cy="34" rx="22" ry="13" fill="#1a1410" />
      {/* White chest patch */}
      <ellipse cx="46" cy="34" rx="10" ry="8" fill="#e8e0d0" fillOpacity="0.85" />
      {/* Head */}
      <circle cx="70" cy="26" r="12" fill="#1a1410" />
      {/* Beak — long and curved */}
      <path
        d="M 80 23 Q 100 20 102 26 Q 100 30 80 29 Z"
        fill="#C8A96E"
      />
      {/* Beak ridge */}
      <path
        d="M 80 24 Q 100 21 102 26"
        stroke="#9a7a42"
        strokeWidth="0.8"
        fill="none"
      />
      {/* Orange patch on beak near face */}
      <path d="M 80 23 Q 88 20 92 24 Q 88 28 80 29 Z" fill="#e07c30" fillOpacity="0.7" />
      {/* Eye */}
      <circle cx="73" cy="23" r="3" fill="#e8e0d0" />
      <circle cx="73.5" cy="23" r="1.8" fill="#1a1410" />
      <circle cx="74.2" cy="22.2" r="0.5" fill="white" />
      {/* Wing */}
      <ellipse cx="44" cy="31" rx="18" ry="8" fill="#0f0c0a" />
      {/* Tail */}
      <path d="M 28 35 Q 10 38 8 44 Q 15 40 22 42 Q 12 46 10 52 Q 20 44 28 44 Z" fill="#1a1410" />
      {/* Wing highlight */}
      <ellipse cx="44" cy="29" rx="12" ry="4" fill="#2a2520" fillOpacity="0.6" />
    </svg>
  );
}

export default function Toucans() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden" aria-hidden>
      {BIRDS.map((bird) => (
        <div
          key={bird.id}
          style={{
            position: 'absolute',
            top: `${bird.y}%`,
            opacity: bird.opacity,
            animation: `toucan-fly-${bird.flip ? 'rtl' : 'ltr'} ${bird.duration}s linear ${bird.delay}s infinite`,
          }}
        >
          <div
            style={{
              animation: `toucan-bob ${1.8 + bird.id * 0.3}s ease-in-out infinite`,
            }}
          >
            <ToucanSVG size={bird.size} flip={bird.flip} />
          </div>
        </div>
      ))}

      <style jsx global>{`
        @keyframes toucan-fly-ltr {
          0%   { transform: translateX(-120px); }
          100% { transform: translateX(calc(100vw + 120px)); }
        }
        @keyframes toucan-fly-rtl {
          0%   { transform: translateX(calc(100vw + 120px)); }
          100% { transform: translateX(-120px); }
        }
        @keyframes toucan-bob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
      `}</style>
    </div>
  );
}
