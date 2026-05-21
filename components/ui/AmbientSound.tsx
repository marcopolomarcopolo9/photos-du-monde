'use client';

import { useState, useEffect, useRef } from 'react';

// Generates jungle ambient using Web Audio API — no external file needed
function createJungleAmbience(ctx: AudioContext, masterGain: GainNode) {
  const sounds: { stop: () => void }[] = [];

  // ── Wind / background noise ──────────────────────────────────
  const bufferSize = ctx.sampleRate * 3;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  const windFilter = ctx.createBiquadFilter();
  windFilter.type = 'bandpass';
  windFilter.frequency.value = 400;
  windFilter.Q.value = 0.3;

  const windGain = ctx.createGain();
  windGain.gain.value = 0.04;

  noiseSource.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(masterGain);
  noiseSource.start();
  sounds.push({ stop: () => noiseSource.stop() });

  // ── Cricket chirps ───────────────────────────────────────────
  function chirp(freq: number, delay: number, interval: number) {
    let stopped = false;
    const tick = () => {
      if (stopped || ctx.state === 'closed') return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq + (Math.random() - 0.5) * 30;
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      o.connect(g); g.connect(masterGain);
      o.start(ctx.currentTime);
      o.stop(ctx.currentTime + 0.1);
      setTimeout(tick, interval + Math.random() * interval * 0.5);
    };
    setTimeout(tick, delay);
    sounds.push({ stop: () => { stopped = true; } });
  }

  chirp(4200, 0,    180);
  chirp(3800, 60,   220);
  chirp(4500, 110,  160);
  chirp(3600, 30,   300);

  // ── Bird calls ───────────────────────────────────────────────
  function birdCall(baseFreq: number, delay: number, interval: number) {
    let stopped = false;
    const tick = () => {
      if (stopped || ctx.state === 'closed') return;
      const notes = [1, 1.2, 0.9, 1.35].slice(0, 2 + Math.floor(Math.random() * 3));
      notes.forEach((ratio, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        const f = baseFreq * ratio + (Math.random() - 0.5) * 80;
        o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
        o.frequency.linearRampToValueAtTime(f * 1.08, ctx.currentTime + i * 0.12 + 0.08);
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        g.gain.linearRampToValueAtTime(0.07, ctx.currentTime + i * 0.12 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.18);
        o.connect(g); g.connect(masterGain);
        o.start(ctx.currentTime + i * 0.12);
        o.stop(ctx.currentTime + i * 0.12 + 0.25);
      });
      setTimeout(tick, interval + Math.random() * interval);
    };
    setTimeout(tick, delay);
    sounds.push({ stop: () => { stopped = true; } });
  }

  birdCall(1800, 200,  4000);
  birdCall(2400, 800,  6000);
  birdCall(1200, 1500, 8000);
  birdCall(2800, 400,  5000);

  // ── Distant frog croaks ──────────────────────────────────────
  function frog(delay: number, interval: number) {
    let stopped = false;
    const tick = () => {
      if (stopped || ctx.state === 'closed') return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(180 + Math.random() * 40, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.05, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;

      o.connect(filter); filter.connect(g); g.connect(masterGain);
      o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.25);
      setTimeout(tick, interval + Math.random() * interval * 2);
    };
    setTimeout(tick, delay);
    sounds.push({ stop: () => { stopped = true; } });
  }

  frog(500,  3000);
  frog(1200, 4500);

  return { stop: () => sounds.forEach(s => s.stop()) };
}

export default function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const jungleRef = useRef<{ stop: () => void } | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const start = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const master = ctx.createGain();
    master.gain.value = 0.28;
    master.connect(ctx.destination);
    ctxRef.current = ctx;
    gainRef.current = master;

    jungleRef.current = createJungleAmbience(ctx, master);
    setPlaying(true);
  };

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!startedRef.current) { start(); return; }

    const gain = gainRef.current;
    const ctx = ctxRef.current;
    if (!gain || !ctx) return;

    if (playing) {
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      setPlaying(false);
    } else {
      ctx.resume();
      gain.gain.setTargetAtTime(0.28, ctx.currentTime, 0.5);
      setPlaying(true);
    }
  };

  // Auto-start on first interaction
  useEffect(() => {
    const handler = () => { if (!startedRef.current) start(); };
    window.addEventListener('click', handler, { once: true });
    window.addEventListener('scroll', handler, { once: true });
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('scroll', handler);
    };
  }, []);

  if (!visible) return null;

  return (
    <button onClick={toggle} title={playing ? 'Couper le son' : 'Ambiance jungle'}
      style={{
        position: 'fixed', bottom: '28px', right: '28px', zIndex: 9000,
        width: '44px', height: '44px', borderRadius: '50%',
        background: 'rgba(8,8,8,0.88)',
        border: `1px solid ${playing ? 'rgba(196,150,42,0.6)' : 'rgba(255,255,255,0.12)'}`,
        color: playing ? '#c4962a' : 'rgba(255,255,255,0.3)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)', transition: 'all 0.3s ease',
        boxShadow: playing ? '0 0 16px rgba(196,150,42,0.12)' : 'none',
      }}>

      {playing ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" strokeOpacity="0.6"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" strokeOpacity="0.35"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      )}

      {playing && (
        <>
          <span style={{ position:'absolute', inset:'-5px', borderRadius:'50%', border:'1px solid rgba(196,150,42,0.2)', animation:'ripple1 2.4s ease-out infinite' }} />
          <span style={{ position:'absolute', inset:'-10px', borderRadius:'50%', border:'1px solid rgba(196,150,42,0.1)', animation:'ripple1 2.4s ease-out 0.8s infinite' }} />
        </>
      )}

      <style>{`
        @keyframes ripple1 {
          0% { transform:scale(0.95); opacity:0.8; }
          100% { transform:scale(1.4); opacity:0; }
        }
      `}</style>
    </button>
  );
}
