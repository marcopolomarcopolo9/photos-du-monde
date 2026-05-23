// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/voyages', label: 'Destinations' },
  { href: '/categories', label: 'Thèmes' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
  { href: '/admin', label: 'Admin', desktopOnly: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'bg-noir/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
        )}
      >
        <div className="max-w-screen-xl mx-auto px-5 md:px-10">
          <div className="flex items-center justify-between h-14 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-or" whileHover={{ scale: 1.8 }} />
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-sm md:text-base font-light tracking-[0.18em] uppercase text-creme">
                  Photos du Monde
                </span>
                <span className="text-[9px] tracking-[0.12em] text-or/60 italic font-serif">
                  by Rolf Etter
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}
                  className={cn('text-[11px] tracking-[0.25em] uppercase font-poppins font-light transition-colors duration-200',
                    pathname === link.href ? 'text-or' : 'text-creme/60 hover:text-creme')}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="flex md:hidden items-center justify-center w-10 h-10 text-creme/80"
              aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-noir/98 backdrop-blur-xl md:hidden flex flex-col"
          >
            {/* Close */}
            <div className="flex justify-between items-center px-5 h-14 border-b border-white/5">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-or" />
                <span className="font-serif text-sm tracking-[0.18em] uppercase text-creme">Photos du Monde</span>
              </Link>
              <button onClick={() => setMenuOpen(false)} className="w-10 h-10 flex items-center justify-center text-creme/60">
                <X size={22} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col flex-1 justify-center px-8 gap-2">
              {NAV_LINKS.filter(l => !l.desktopOnly).map((link, i) => (
                <motion.div key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <Link href={link.href} onClick={() => setMenuOpen(false)}
                    className={cn('block py-4 font-serif text-3xl font-light italic transition-colors border-b border-white/5',
                      pathname === link.href ? 'text-or' : 'text-creme/70 hover:text-or')}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom */}
            <div className="px-8 pb-10 pt-6 border-t border-white/5">
              <p className="text-[10px] tracking-[0.25em] text-creme/30 uppercase">© Rolf Etter</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
