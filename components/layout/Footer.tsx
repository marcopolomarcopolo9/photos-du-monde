'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Instagram, Mail } from 'lucide-react';

function FooterDesc() {
  const [desc, setDesc] = useState('Un carnet visuel de voyages autour du monde.');
  useEffect(() => {
    fetch('/api/admin/homepage').then(r=>r.json()).then(d=>{
      const desc = d.homepage?.footer?.description || d.footer?.description; if(desc) setDesc(desc);
    }).catch(()=>{});
  }, []);
  return <p className="text-sm text-creme/40 leading-relaxed max-w-xs mt-4" style={{textAlign:'justify'}}>{desc}</p>;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-noir border-t border-white/5">
      <div className="max-w-screen-xl mx-auto px-5 md:px-10 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-or" />
              <span className="font-serif text-base tracking-[0.2em] uppercase text-creme">
                Photos du Monde
              </span>
            </div>
            <FooterDesc />
          </div>



          {/* Contact */}
          <div>
            <div className="text-[10px] tracking-widest uppercase text-or mb-5">
              Contact
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-creme/50 hover:text-creme transition-colors"
              >
                <Instagram size={14} />
                @photosdumonde
              </a>
              <a
                href="mailto:contact@photosdumonde.fr"
                className="flex items-center gap-2 text-sm text-creme/50 hover:text-creme transition-colors"
              >
                <Mail size={14} />
                contact@photosdumonde.fr
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="gold-line mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-creme/25 tracking-wider">
            © {year} Photos du Monde — Tous droits réservés
          </p>
          <p className="font-serif italic text-xs text-creme/25">
            &ldquo;La photographie, c&apos;est la vérité.&rdquo; — Jean-Luc
            Godard
          </p>
        </div>
      <div style={{ textAlign: 'center', paddingTop: '16px', paddingBottom: '8px' }}>
        <p style={{ fontSize: '10px', color: 'rgba(245,240,232,0.2)', letterSpacing: '0.1em', fontFamily: 'system-ui' }}>
          Made with ❤️ by Marcopolo Studio
        </p>
      </div>
      </div>
    </footer>
  );
}
