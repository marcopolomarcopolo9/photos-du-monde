'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Camera, Map, BookOpen, Eye } from 'lucide-react';
import Link from 'next/link';
import { VOYAGES } from '@/lib/data';

type Tab = 'voyages' | 'add-voyage' | 'add-photo';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('voyages');
  const [saved, setSaved] = useState(false);

  // Form state for new voyage
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    country: '',
    city: '',
    continent: 'Amérique Centrale',
    startDate: '',
    endDate: '',
    description: '',
    heroImageUrl: '',
    tip: '',
    tips: [] as string[],
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addTip = () => {
    if (form.tip.trim()) {
      setForm((f) => ({ ...f, tips: [...f.tips, f.tip.trim()], tip: '' }));
    }
  };

  const TABS = [
    { id: 'voyages' as Tab, label: 'Voyages', icon: Map },
    { id: 'add-voyage' as Tab, label: 'Nouveau voyage', icon: BookOpen },
    { id: 'add-photo' as Tab, label: 'Ajouter photos', icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-noir pt-24 pb-20">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-or" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-or">Interface admin</span>
          </div>
          <h1 className="font-serif font-light text-4xl text-creme italic">Administration</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-10 border-b border-white/5 pb-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-[11px] tracking-widest uppercase border-b-2 transition-all duration-200 ${
                tab === id
                  ? 'border-or text-or'
                  : 'border-transparent text-creme/40 hover:text-creme/70'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ─── VOYAGES LIST ─── */}
          {tab === 'voyages' && (
            <motion.div
              key="voyages"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col gap-3">
                {VOYAGES.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-5 bg-noir-mid border border-white/5 hover:border-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-1 h-12 bg-or/30 group-hover:bg-or transition-colors" />
                      <div>
                        <div className="font-serif italic text-lg text-creme group-hover:text-or transition-colors">
                          {v.title}
                        </div>
                        <div className="text-xs text-creme/40 mt-0.5">
                          {v.country} · {new Date(v.startDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })} · {v.photos.length} photos
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/voyages/${v.slug}`}
                        className="p-2 text-creme/40 hover:text-or transition-colors"
                        title="Voir"
                      >
                        <Eye size={15} />
                      </Link>
                      <button
                        className="p-2 text-creme/40 hover:text-red-400 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setTab('add-voyage')}
                className="mt-6 flex items-center gap-2 px-5 py-3 border border-dashed border-white/15 text-creme/40 hover:text-or hover:border-or text-[11px] tracking-widest uppercase transition-all"
              >
                <Plus size={13} />
                Ajouter un voyage
              </button>
            </motion.div>
          )}

          {/* ─── ADD VOYAGE ─── */}
          {tab === 'add-voyage' && (
            <motion.div
              key="add-voyage"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl"
            >
              <div className="flex flex-col gap-6">

                {/* Title */}
                <FieldGroup label="Titre du voyage">
                  <AdminInput
                    placeholder="La nuit où la terre a rugit"
                    value={form.title}
                    onChange={(v) => setForm((f) => ({ ...f, title: v }))}
                    type="serif"
                  />
                </FieldGroup>

                {/* Subtitle */}
                <FieldGroup label="Sous-titre">
                  <AdminInput
                    placeholder="Volcan Arenal, Costa Rica"
                    value={form.subtitle}
                    onChange={(v) => setForm((f) => ({ ...f, subtitle: v }))}
                  />
                </FieldGroup>

                {/* Country + City */}
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Pays">
                    <AdminInput
                      placeholder="Costa Rica"
                      value={form.country}
                      onChange={(v) => setForm((f) => ({ ...f, country: v }))}
                    />
                  </FieldGroup>
                  <FieldGroup label="Ville">
                    <AdminInput
                      placeholder="La Fortuna"
                      value={form.city}
                      onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                    />
                  </FieldGroup>
                </div>

                {/* Continent */}
                <FieldGroup label="Continent">
                  <select
                    value={form.continent}
                    onChange={(e) => setForm((f) => ({ ...f, continent: e.target.value }))}
                    className="w-full bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 text-sm px-4 py-3 outline-none appearance-none transition-colors"
                  >
                    {['Amérique Centrale', 'Amérique du Sud', 'Amérique du Nord', 'Europe', 'Asie', 'Afrique', 'Océanie'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </FieldGroup>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Date de départ">
                    <AdminInput
                      type="date"
                      value={form.startDate}
                      onChange={(v) => setForm((f) => ({ ...f, startDate: v }))}
                    />
                  </FieldGroup>
                  <FieldGroup label="Date de retour">
                    <AdminInput
                      type="date"
                      value={form.endDate}
                      onChange={(v) => setForm((f) => ({ ...f, endDate: v }))}
                    />
                  </FieldGroup>
                </div>

                {/* Description */}
                <FieldGroup label="Description">
                  <textarea
                    rows={5}
                    placeholder="Description du voyage…"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 text-sm px-4 py-3 outline-none resize-none transition-colors leading-relaxed"
                  />
                </FieldGroup>

                {/* Hero image URL */}
                <FieldGroup label="URL de l'image principale">
                  <AdminInput
                    placeholder="https://images.unsplash.com/…"
                    value={form.heroImageUrl}
                    onChange={(v) => setForm((f) => ({ ...f, heroImageUrl: v }))}
                  />
                </FieldGroup>

                {/* Tips */}
                <FieldGroup label="Conseils pratiques">
                  <div className="flex gap-2">
                    <input
                      value={form.tip}
                      onChange={(e) => setForm((f) => ({ ...f, tip: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && addTip()}
                      placeholder="Ajouter un conseil…"
                      className="flex-1 bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 text-sm px-4 py-3 outline-none transition-colors"
                    />
                    <button
                      onClick={addTip}
                      className="px-4 py-3 bg-or/10 border border-or/30 hover:bg-or/20 text-or transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  {form.tips.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2">
                      {form.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-creme/50 bg-noir-mid p-3 border border-white/5">
                          <span className="text-or mt-0.5">·</span>
                          {tip}
                          <button
                            onClick={() => setForm((f) => ({ ...f, tips: f.tips.filter((_, j) => j !== i) }))}
                            className="ml-auto text-creme/30 hover:text-red-400"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </FieldGroup>

                {/* Save */}
                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-8 py-4 bg-or text-noir text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-or-light transition-colors"
                  >
                    <Save size={14} />
                    {saved ? 'Enregistré !' : 'Enregistrer le voyage'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── ADD PHOTOS ─── */}
          {tab === 'add-photo' && (
            <motion.div
              key="add-photo"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl"
            >
              <div className="flex flex-col gap-6">
                {/* Voyage selector */}
                <FieldGroup label="Voyage associé">
                  <select className="w-full bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 text-sm px-4 py-3 outline-none appearance-none transition-colors">
                    {VOYAGES.map((v) => (
                      <option key={v.id} value={v.id}>{v.title} — {v.country}</option>
                    ))}
                  </select>
                </FieldGroup>

                {/* Drop zone */}
                <div className="border-2 border-dashed border-white/10 hover:border-or/40 transition-colors p-12 flex flex-col items-center justify-center gap-4 cursor-pointer">
                  <Camera size={28} className="text-creme/20" />
                  <div className="text-sm text-creme/30">
                    Glissez vos photos ici ou cliquez pour sélectionner
                  </div>
                  <div className="text-[11px] text-creme/20">JPG, PNG, WEBP — max 10 Mo par fichier</div>
                </div>

                {/* Alt text + location */}
                <FieldGroup label="Description / Alt text">
                  <AdminInput placeholder="Toucan perché dans la canopée du Costa Rica" value="" onChange={() => {}} />
                </FieldGroup>
                <FieldGroup label="Lieu de prise de vue">
                  <AdminInput placeholder="Parc National Arenal, Costa Rica" value="" onChange={() => {}} />
                </FieldGroup>
                <FieldGroup label="Date">
                  <AdminInput type="date" value="" onChange={() => {}} />
                </FieldGroup>

                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-8 py-4 bg-or text-noir text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-or-light transition-colors"
                  >
                    <Save size={14} />
                    {saved ? 'Enregistré !' : 'Ajouter les photos'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.2em] uppercase text-or mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function AdminInput({
  placeholder,
  value,
  onChange,
  type = 'text',
  serif = false,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  serif?: boolean;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 px-4 py-3 outline-none transition-colors ${
        serif ? 'font-serif italic text-lg' : 'text-sm'
      }`}
    />
  );
}
