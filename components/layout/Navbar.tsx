'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/voyages', label: 'Destinations' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-noir/90 backdrop-blur-md border-b border-white/5'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-or"
                whileHover={{ scale: 1.8 }}
              />
              <span className="font-serif text-base md:text-lg font-light tracking-[0.2em] uppercase text-creme">
                Photos du Monde
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-[11px] tracking-[0.25em] uppercase font-poppins font-light transition-colors duration-200',
                    pathname === link.href
                      ? 'text-or'
                      : 'text-creme/60 hover:text-creme'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-creme/60 hover:text-or transition-colors"
                aria-label="Rechercher"
              >
                <Search size={16} />
              </button>
            </nav>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-creme/60"
                aria-label="Rechercher"
              >
                <Search size={18} />
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-creme/80"
                aria-label="Menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-40 bg-noir/95 backdrop-blur-lg border-b border-white/5 md:hidden"
          >
            <nav className="flex flex-col px-6 py-6 gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-serif text-xl text-creme/80 hover:text-or transition-colors italic"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-noir/95 backdrop-blur-xl flex items-center justify-center px-6"
          >
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-6 right-6 text-creme/60 hover:text-creme"
            >
              <X size={24} />
            </button>
            <div className="w-full max-w-2xl">
              <div className="text-[10px] tracking-widest uppercase text-or mb-6">
                Rechercher
              </div>
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Costa Rica, Volcan, Toucan…"
                className="w-full bg-transparent border-b border-white/20 focus:border-or outline-none text-creme font-serif text-3xl md:text-4xl italic pb-4 placeholder:text-creme/20 transition-colors"
              />
              <p className="mt-4 text-sm text-creme/30">
                Appuyez sur Entrée pour chercher
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
