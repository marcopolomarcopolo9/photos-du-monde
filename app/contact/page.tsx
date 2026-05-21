'use client';
import { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Mail, Instagram, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? 'sent' : 'error');
      if (res.ok) setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const inp = "w-full bg-noir-mid border border-white/8 focus:border-or/50 text-creme/80 px-4 py-3.5 outline-none transition-colors text-sm font-poppins placeholder:text-creme/25";

  return (
    <div className="bg-noir min-h-screen pt-28 pb-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        <ScrollReveal className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-or" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">Contact</span>
          </div>
          <h1 className="font-serif font-light text-5xl md:text-6xl text-creme italic leading-tight">
            Parlons<br /><em>d&apos;un projet</em>
          </h1>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

          {/* Form */}
          <ScrollReveal className="lg:col-span-3" direction="left">
            {status === 'sent' ? (
              <div className="flex flex-col items-start gap-6 py-12">
                <div className="w-14 h-14 bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <Check size={22} className="text-green-400" />
                </div>
                <div>
                  <h2 className="font-serif italic text-2xl text-creme mb-2">Message envoyé !</h2>
                  <p className="text-creme/50 text-sm font-poppins">Je reviendrai vers vous très prochainement.</p>
                </div>
                <button onClick={() => setStatus('idle')} className="text-[11px] tracking-[0.2em] uppercase text-or border border-or/30 px-6 py-3 hover:bg-or/5 transition-colors font-poppins">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-or mb-2 font-poppins">Nom *</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Votre nom" className={inp} required />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-or mb-2 font-poppins">Email *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="votre@email.com" className={inp} required />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-or mb-2 font-poppins">Sujet</label>
                  <input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Collaboration, question, achat de tirage..." className={inp} />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-or mb-2 font-poppins">Message *</label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)} placeholder="Décrivez votre projet ou votre question..." rows={6} className={`${inp} resize-none leading-relaxed`} required />
                </div>
                {status === 'error' && (
                  <p className="text-red-400 text-sm font-poppins">Une erreur s&apos;est produite. Réessayez ou contactez-moi directement.</p>
                )}
                <button type="submit" disabled={status === 'sending'}
                  className="self-start flex items-center gap-3 px-10 py-4 bg-or text-noir text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-or/90 transition-colors disabled:opacity-60 font-poppins">
                  {status === 'sending' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border border-noir/40 border-t-noir rounded-full animate-spin" />
                      Envoi...
                    </span>
                  ) : (
                    <><Send size={13} /> Envoyer</>
                  )}
                </button>
              </form>
            )}
          </ScrollReveal>

          {/* Info */}
          <ScrollReveal className="lg:col-span-2" direction="right" delay={0.1}>
            <div className="space-y-8">
              <div>
                <h2 className="font-serif italic text-xl text-creme mb-4">On peut parler de…</h2>
                <ul className="space-y-2">
                  {[
                    'Tirages photo sur mesure',
                    'Collaboration éditoriale',
                    'Projets documentaires',
                    'Licences d\'utilisation',
                    'Ateliers photo',
                    'Simple curiosité',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-creme/50 font-poppins">
                      <div className="w-1 h-1 rounded-full bg-or/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <a href="mailto:contact@photosdumonde.fr"
                  className="flex items-center gap-3 text-sm text-creme/50 hover:text-creme transition-colors font-poppins group">
                  <div className="w-9 h-9 border border-white/10 group-hover:border-or/40 flex items-center justify-center transition-colors">
                    <Mail size={14} className="text-or/60" />
                  </div>
                  contact@photosdumonde.fr
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-creme/50 hover:text-creme transition-colors font-poppins group">
                  <div className="w-9 h-9 border border-white/10 group-hover:border-or/40 flex items-center justify-center transition-colors">
                    <Instagram size={14} className="text-or/60" />
                  </div>
                  @photosdumonde
                </a>
              </div>

              <div className="pt-6 border-t border-white/5">
                <p className="text-[11px] text-creme/30 leading-relaxed font-poppins">
                  Réponse sous 48h en général. Pour les projets urgents, préférez l&apos;email direct.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
