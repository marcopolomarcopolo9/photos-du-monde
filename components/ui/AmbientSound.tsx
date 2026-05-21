'use client';

import { useState, useEffect, useRef } from 'react';

// Free jungle ambient sounds (royalty-free, streamable)
const SOUNDS = [
  'https://assets.mixkit.co/music/preview/mixkit-jungle-journey-270.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-tropical-birds-ambience-1185.mp3',
];

export default function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sourceIdx, setSourceIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const triedRef = useRef(false);

  useEffect(() => {
    // Show button after 2s
    const t = setTimeout(() => setVisible(true), 2000);

    // Create audio
    const audio = new Audio(SOUNDS[sourceIdx]);
    audio.loop = true;
    audio.volume = 0.12;
    audioRef.current = audio;

    audio.addEventListener('canplaythrough', () => setReady(true));
    audio.addEventListener('error', () => {
      // Try next source
      if (sourceIdx < SOUNDS.length - 1) setSourceIdx(i => i + 1);
    });
    audio.load();

    // Try autoplay on first user interaction
    const tryPlay = () => {
      if (triedRef.current) return;
      triedRef.current = true;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };
    document.addEventListener('click', tryPlay, { once: true });
    document.addEventListener('scroll', tryPlay, { once: true });

    return () => {
      clearTimeout(t);
      audio.pause();
      audio.src = '';
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('scroll', tryPlay);
    };
  }, [sourceIdx]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  if (!visible) return null;

  return (
    <button
      onClick={toggle}
      title={playing ? 'Couper le son' : 'Ambiance jungle'}
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9000,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'rgba(10,10,10,0.85)',
        border: '1px solid rgba(196,150,42,0.35)',
        color: playing ? '#c4962a' : 'rgba(255,255,255,0.35)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease',
        boxShadow: playing ? '0 0 0 2px rgba(196,150,42,0.15)' : 'none',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,150,42,0.7)';
        (e.currentTarget as HTMLElement).style.color = '#c4962a';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = playing ? 'rgba(196,150,42,0.35)' : 'rgba(255,255,255,0.15)';
        (e.currentTarget as HTMLElement).style.color = playing ? '#c4962a' : 'rgba(255,255,255,0.35)';
      }}
    >
      {playing ? (
        /* Sound waves icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <style>{`
            @keyframes pulse-sound {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.4; }
            }
            .sound-wave-2 { animation: pulse-sound 1.2s ease-in-out infinite; }
            .sound-wave-3 { animation: pulse-sound 1.2s ease-in-out 0.3s infinite; }
          `}</style>
          <path className="sound-wave-2" d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path className="sound-wave-3" d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        /* Muted icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}

      {/* Ripple when playing */}
      {playing && (
        <span style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '50%',
          border: '1px solid rgba(196,150,42,0.2)',
          animation: 'ripple 2s ease-out infinite',
        }} />
      )}

      <style jsx>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </button>
  );
}
