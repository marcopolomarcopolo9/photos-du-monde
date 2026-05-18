import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        noir: '#0a0805',
        'noir-soft': '#12100c',
        'noir-mid': '#1a1710',
        creme: '#f0e8d8',
        'creme-dim': '#c8bfaa',
        or: '#C8A96E',
        'or-light': '#e0c990',
        'or-dark': '#9a7a42',
        volcan: '#7A2E1A',
        'volcan-bright': '#C04A28',
        lave: '#E8562A',
        jungle: '#1A3D14',
        'jungle-light': '#2d6a22',
        ocean: '#0D2035',
        'ocean-light': '#1a3a5c',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-barlow)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.3em',
        ultra: '0.5em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-32px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s ease-out forwards',
        'fade-in': 'fade-in 1.2s ease-out forwards',
        'ken-burns': 'ken-burns 8s ease-out forwards',
        'slide-right': 'slide-right 0.6s ease-out forwards',
        pulse: 'pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
