'use client';
import { useState, useEffect, useRef } from 'react';

function createJungle(ctx: AudioContext, master: GainNode) {
  const stops: (() => void)[] = [];

  // Wind
  const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const wind = ctx.createBufferSource();
  wind.buffer = buf; wind.loop = true;
  const wf = ctx.createBiquadFilter(); wf.type = 'bandpass'; wf.frequency.value = 350; wf.Q.value = 0.25;
  const wg = ctx.createGain(); wg.gain.value = 0.035;
  wind.connect(wf); wf.connect(wg); wg.connect(master); wind.start();
  stops.push(() => { try { wind.stop(); } catch {} });

  // Crickets
  const chirp = (freq: number, delay: number, ms: number) => {
    let on = true;
    const tick = () => {
      if (!on || ctx.state === 'closed') return;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq + (Math.random() - .5) * 40;
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      o.connect(g); g.connect(master);
      o.start(); o.stop(ctx.currentTime + 0.1);
      setTimeout(tick, ms + Math.random() * ms * .6);
    };
    setTimeout(tick, delay);
    stops.push(() => { on = false; });
  };
  chirp(4100, 0, 170); chirp(3750, 80, 210); chirp(4400, 150, 155); chirp(3500, 40, 290);

  // Birds
  const bird = (base: number, delay: number, ms: number) => {
    let on = true;
    const tick = () => {
      if (!on || ctx.state === 'closed') return;
      const notes = [1, 1.18, 0.88].slice(0, 2 + Math.floor(Math.random() * 2));
      notes.forEach((r, i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; const f = base * r + (Math.random() - .5) * 70;
        o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.13);
        o.frequency.linearRampToValueAtTime(f * 1.07, ctx.currentTime + i * 0.13 + 0.09);
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.13);
        g.gain.linearRampToValueAtTime(0.065, ctx.currentTime + i * 0.13 + 0.025);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.13 + 0.2);
        o.connect(g); g.connect(master);
        o.start(ctx.currentTime + i * 0.13); o.stop(ctx.currentTime + i * 0.13 + 0.28);
      });
      setTimeout(tick, ms + Math.random() * ms);
    };
    setTimeout(tick, delay);
    stops.push(() => { on = false; });
  };
  bird(1750, 300, 3800); bird(2350, 900, 5500); bird(1150, 1600, 7200); bird(2700, 500, 4600);

  // Frogs
  const frog = (delay: number, ms: number) => {
    let on = true;
    const tick = () => {
      if (!on || ctx.state === 'closed') return;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = 580;
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(170 + Math.random() * 45, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.18);
      g.gain.setValueAtTime(0.045, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      o.connect(fl); fl.connect(g); g.connect(master);
      o.start(); o.stop(ctx.currentTime + 0.26);
      setTimeout(tick, ms + Math.random() * ms * 2.2);
    };
    setTimeout(tick, delay);
    stops.push(() => { on = false; });
  };
  frog(600, 2800); frog(1400, 4200);

  return () => stops.forEach(fn => fn());
}

export default function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const stopJungleRef = useRef<(() => void) | null>(null);
  const doneRef = useRef(false);

  const startSound = () => {
    if (doneRef.current) return;
    doneRef.current = true;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const master = ctx.createGain();
    // Fade in over 2s
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 2);
    master.connect(ctx.destination);
    ctxRef.current = ctx;
    masterRef.current = master;

    stopJungleRef.current = createJungle(ctx, master);
    setPlaying(true);
    setStarted(true);
  };

  useEffect(() => {
    // Start on ANY interaction — mousemove, scroll, touchstart, keydown
    const events = ['mousemove', 'scroll', 'touchstart', 'keydown', 'pointerdown'];
    const handler = () => startSound();
    events.forEach(e => window.addEventListener(e, handler, { once: true, passive: true }));
    return () => events.forEach(e => window.removeEventListener(e, handler));
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const ctx = ctxRef.current;
    const master = masterRef.current;

    if (!ctx) { startSound(); return; }

    if (playing) {
      master!.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      setPlaying(false);
    } else {
      ctx.resume();
      master!.gain.setTargetAtTime(0.3, ctx.currentTime, 0.5);
      setPlaying(true);
    }
  };

  return (
    <>
      {/* Sound button — always visible */}
      <button
        onClick={toggle}
        title={playing ? 'Couper le son ambiance' : 'Activer le son ambiance'}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 9000,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(8,8,8,0.88)',
          border: `1px solid ${playing ? 'rgba(196,150,42,0.6)' : 'rgba(255,255,255,0.15)'}`,
          color: playing ? '#c4962a' : 'rgba(255,255,255,0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease',
          boxShadow: playing ? '0 0 16px rgba(196,150,42,0.15)' : 'none',
        }}
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" strokeOpacity="0.7"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" strokeOpacity="0.4"/>
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
            <span style={{ position:'absolute', inset:'-5px', borderRadius:'50%', border:'1px solid rgba(196,150,42,0.2)', animation:'ripple-s 2.4s ease-out infinite', pointerEvents:'none' }} />
            <span style={{ position:'absolute', inset:'-11px', borderRadius:'50%', border:'1px solid rgba(196,150,42,0.1)', animation:'ripple-s 2.4s ease-out 0.9s infinite', pointerEvents:'none' }} />
          </>
        )}
      </button>

      <style>{`
        @keyframes ripple-s {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.45); opacity: 0; }
        }
      `}</style>
    </>
  );
}
