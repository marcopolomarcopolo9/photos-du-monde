'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const AUDIO_URL = 'https://res.cloudinary.com/doxsjisyx/video/upload/v1779694581/photos-du-monde/classical-ambient.mp3';

export default function AmbientSound() {
  const pathname = usePathname();
  const isCubaPage = pathname?.toLowerCase().includes('de-la-musique') || pathname?.toLowerCase().includes('cuba');
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  const startSound = () => {
    if (startedRef.current) return;
    if (window.innerWidth < 768) return; // no sound on mobile
    startedRef.current = true;
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    audio.play().then(() => {
      setPlaying(true);
      let v = 0;
      const fade = setInterval(() => {
        v = Math.min(v + 0.008, 0.22);
        audio.volume = v;
        if (v >= 0.22) clearInterval(fade);
      }, 80);
    }).catch(() => {
      // Browser blocked — reset so next interaction tries again
      startedRef.current = false;
    });
  };

  // Fade out when Cuba music starts, fade back in when it stops
  useEffect(() => {
    const onCubaStart = () => {
      const audio = audioRef.current;
      if (!audio) return;
      let v = audio.volume;
      const fade = setInterval(() => {
        v = Math.max(0, v - 0.02);
        audio.volume = v;
        if (v <= 0) { audio.pause(); clearInterval(fade); setPlaying(false); }
      }, 50);
    };
    const onCubaStop = () => {
      const audio = audioRef.current;
      if (!audio || !startedRef.current) return;
      audio.volume = 0;
      audio.play().then(() => {
        setPlaying(true);
        let v = 0;
        const fade = setInterval(() => {
          v = Math.min(v + 0.01, 0.22);
          audio.volume = v;
          if (v >= 0.22) clearInterval(fade);
        }, 80);
      }).catch(() => {});
    };
    window.addEventListener('cuba-music-start', onCubaStart);
    window.addEventListener('cuba-music-stop', onCubaStop);
    return () => {
      window.removeEventListener('cuba-music-start', onCubaStart);
      window.removeEventListener('cuba-music-stop', onCubaStop);
    };
  }, []);

  useEffect(() => {
    const events = ['pointerdown', 'touchstart', 'mousemove', 'scroll', 'keydown', 'click'];
    
    const handler = () => {
      if (!startedRef.current && !isCubaPage) startSound();
    };

    // Try immediately in case document is already interactive
    const timer = setTimeout(() => {
      events.forEach(e => window.addEventListener(e, handler, { passive: true }));
    }, 300);

    return () => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, handler));
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) { startSound(); return; }
    if (playing) {
      let v = audio.volume;
      const fade = setInterval(() => {
        v = Math.max(0, v - 0.02);
        audio.volume = v;
        if (v <= 0) { audio.pause(); clearInterval(fade); }
      }, 50);
      setPlaying(false);
    } else {
      audio.volume = 0;
      audio.play().then(() => {
        setPlaying(true);
        let v = 0;
        const fade = setInterval(() => {
          v = Math.min(v + 0.012, 0.22);
          audio.volume = v;
          if (v >= 0.22) clearInterval(fade);
        }, 60);
      });
    }
  };

  if (isCubaPage) return null;

  return (
    <>
      <button onClick={toggle} title={playing ? 'Couper le son' : 'Ambiance sonore'}
        className="hidden md:flex"
        style={{
          position: 'fixed', bottom: 'max(24px, env(safe-area-inset-bottom, 24px))', right: '16px', zIndex: 9000,
          width: '48px', height: '48px', borderRadius: '50%',
          background: 'rgba(8,8,8,0.88)',
          border: `1px solid ${playing ? 'rgba(196,150,42,0.6)' : 'rgba(255,255,255,0.15)'}`,
          color: playing ? '#c4962a' : 'rgba(255,255,255,0.4)',
          cursor: 'pointer', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)', transition: 'all 0.3s ease',
          boxShadow: playing ? '0 0 16px rgba(196,150,42,0.15)' : 'none',
        }}>
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" strokeOpacity="0.7"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" strokeOpacity="0.4"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/>
            <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        )}
        {playing && <>
          <span style={{ position:'absolute', inset:'-5px', borderRadius:'50%', border:'1px solid rgba(196,150,42,0.25)', animation:'ra 2.5s ease-out infinite', pointerEvents:'none' }}/>
          <span style={{ position:'absolute', inset:'-11px', borderRadius:'50%', border:'1px solid rgba(196,150,42,0.1)', animation:'ra 2.5s ease-out 1s infinite', pointerEvents:'none' }}/>
        </>}
      </button>
      <style>{`@keyframes ra{0%{transform:scale(.9);opacity:.8}100%{transform:scale(1.5);opacity:0}}`}</style>
    </>
  );
}
