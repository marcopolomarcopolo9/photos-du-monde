'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Camera, Map, BookOpen, Eye, Lock, LogOut, Upload, X, Check, Loader } from 'lucide-react';
import Link from 'next/link';
import { VOYAGES } from '@/lib/data';

type Tab = 'voyages' | 'add-voyage' | 'add-photo';
type Status = 'idle' | 'loading' | 'success' | 'error';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('voyages');
  const [saveStatus, setSaveStatus] = useState<Status>('idle');
  const [saveMsg, setSaveMsg] = useState('');

  const [form, setForm] = useState({
    title: '', subtitle: '', country: '', city: '', region: '',
    continent: 'Amérique Centrale', startDate: '', endDate: '',
    description: '', heroImage: '', tip: '', tips: [] as string[],
    anecdoteTitle: '', anecdoteContent: '', anecdoteLocation: '',
    anecdotes: [] as { title: string; content: string; location: string }[],
    photos: [] as { src: string; alt: string; location: string; date: string }[],
    tags: '',
  });

  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    setAuthLoading(true);
    setAuthError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setAuthLoading(false);
    if (res.ok) { setAuthed(true); }
    else { setAuthError('Mot de passe incorrect'); }
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const sigRes = await fetch('/api/admin/upload', { method: 'POST' });
    if (!sigRes.ok) return null;
    const { signature, timestamp, api_key, cloud_name, folder } = await sigRes.json();
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', api_key);
    fd.append('timestamp', String(timestamp));
    fd.append('signature', signature);
    fd.append('folder', folder);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd });
    const data = await res.json();
    return data.secure_url || null;
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadStatus((s) => ({ ...s, hero: 'uploading' }));
    const url = await uploadToCloudinary(file);
    if (url) { setForm((f) => ({ ...f, heroImage: url })); setUploadStatus((s) => ({ ...s, hero: 'done' })); }
    else { setUploadStatus((s) => ({ ...s, hero: 'error' })); }
  };

  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      setUploadStatus((s) => ({ ...s, [file.name]: 'uploading' }));
      const url = await uploadToCloudinary(file);
      if (url) {
        setForm((f) => ({ ...f, photos: [...f.photos, { src: url, alt: file.name.replace(/\.[^.]+$/, ''), location: f.city, date: f.startDate || new Date().toISOString().split('T')[0] }] }));
        setUploadStatus((s) => ({ ...s, [file.name]: 'done' }));
      } else { setUploadStatus((s) => ({ ...s, [file.name]: 'error' })); }
    }
  };

  const addTip = () => {
    if (form.tip.trim()) { setForm((f) => ({ ...f, tips: [...f.tips, f.tip.trim()], tip: '' })); }
  };

  const addAnecdote = () => {
    if (form.anecdoteTitle.trim() && form.anecdoteContent.trim()) {
      setForm((f) => ({ ...f, anecdotes: [...f.anecdotes, { title: f.anecdoteTitle, content: f.anecdoteContent, location: f.anecdoteLocation }], anecdoteTitle: '', anecdoteContent: '', anecdoteLocation: '' }));
    }
  };

  const handleSaveVoyage = async () => {
    if (!form.title || !form.country || !form.startDate) {
      setSaveMsg('Titre, pays et date de départ sont obligatoires'); setSaveStatus('error'); return;
    }
    setSaveStatus('loading'); setSaveMsg('');
    const duration = form.startDate && form.endDate
      ? Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000) : 7;
    const res = await fetch('/api/admin/voyages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, duration, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) }),
    });
    if (res.ok) {
      setSaveStatus('success');
      setSaveMsg('Voyage publié ! Déploiement Vercel en cours (2-3 min)...');
      setForm({ title: '', subtitle: '', country: '', city: '', region: '', continent: 'Amérique Centrale', startDate: '', endDate: '', description: '', heroImage: '', tip: '', tips: [], anecdoteTitle: '', anecdoteContent: '', anecdoteLocation: '', anecdotes: [], photos: [], tags: '' });
      setTimeout(() => { setSaveStatus('idle'); setSaveMsg(''); setTab('voyages'); }, 4000);
    } else {
      const err = await res.json();
      setSaveStatus('error'); setSaveMsg(err.error || 'Erreur lors de la sauvegarde');
    }
  };

  const TABS = [
    { id: 'voyages' as Tab, label: 'Voyages', icon: Map },
    { id: 'add-voyage' as Tab, label: 'Nouveau voyage', icon: BookOpen },
    { id: 'add-photo' as Tab, label: 'Upload photos', icon: Camera },
  ];

  if (!authed) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center">
            <div className="w-12 h-12 bg-or/10 border border-or/30 flex items-center justify-center mx-auto mb-6">
              <Lock size={20} className="text-or" />
            </div>
            <h1 className="font-serif font-light text-3xl text-creme italic">Administration</h1>
            <p className="text-creme/40 text-sm mt-2">Accès sécurisé</p>
          </div>
          <div className="flex flex-col gap-4">
            <input type="password" placeholder="Mot de passe" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 px-4 py-3 outline-none text-sm"
            />
            {authError && <p className="text-red-400 text-xs">{authError}</p>}
            <button onClick={handleLogin} disabled={authLoading}
              className="flex items-center justify-center gap-2 w-full py-3 bg-or text-noir text-xs tracking-widest uppercase font-medium hover:bg-or/90 transition-colors disabled:opacity-50">
              {authLoading ? <Loader size={14} className="animate-spin" /> : <Lock size={14} />}
              {authLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
          <p className="text-center text-creme/20 text-xs mt-6">Mot de passe par défaut : admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir pt-24 pb-20">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        <div className="mb-12 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-or" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-or">Interface admin</span>
            </div>
            <h1 className="font-serif font-light text-4xl text-creme italic">Administration</h1>
          </div>
          <button onClick={() => setAuthed(false)} className="flex items-center gap-2 text-creme/30 hover:text-creme/60 text-xs tracking-widest uppercase transition-colors mt-2">
            <LogOut size={13} /> Déconnexion
          </button>
        </div>

        <div className="flex gap-1 mb-10 border-b border-white/5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-[11px] tracking-widest uppercase border-b-2 transition-all duration-200 ${tab === id ? 'border-or text-or' : 'border-transparent text-creme/40 hover:text-creme/70'}`}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'voyages' && (
            <motion.div key="voyages" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col gap-3">
                {VOYAGES.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-5 bg-noir-mid border border-white/5 hover:border-white/10 transition-colors group">
                    <div className="flex items-center gap-5">
                      {v.heroImage && <img src={v.heroImage} alt={v.title} className="w-16 h-12 object-cover opacity-70 group-hover:opacity-100 transition-opacity" />}
                      <div className="w-1 h-12 bg-or/30 group-hover:bg-or transition-colors" />
                      <div>
                        <div className="font-serif italic text-lg text-creme group-hover:text-or transition-colors">{v.title}</div>
                        <div className="text-xs text-creme/40 mt-0.5">{v.country} · {new Date(v.startDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })} · {v.photos.length} photos</div>
                      </div>
                    </div>
                    <Link href={`/voyages/${v.slug}`} className="p-2 text-creme/40 hover:text-or transition-colors"><Eye size={15} /></Link>
                  </div>
                ))}
              </div>
              <button onClick={() => setTab('add-voyage')} className="mt-6 flex items-center gap-2 px-5 py-3 border border-dashed border-white/15 text-creme/40 hover:text-or hover:border-or text-[11px] tracking-widest uppercase transition-all">
                <Plus size={13} /> Ajouter un voyage
              </button>
            </motion.div>
          )}

          {tab === 'add-voyage' && (
            <motion.div key="add-voyage" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl">
              <div className="flex flex-col gap-6">
                <FG label="Titre *"><AI serif placeholder="Sous les nuages tropicaux d'Hawaï" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} /></FG>
                <FG label="Sous-titre"><AI placeholder="Big Island, Hawaii" value={form.subtitle} onChange={(v) => setForm((f) => ({ ...f, subtitle: v }))} /></FG>
                <div className="grid grid-cols-2 gap-4">
                  <FG label="Pays *"><AI placeholder="États-Unis" value={form.country} onChange={(v) => setForm((f) => ({ ...f, country: v }))} /></FG>
                  <FG label="Ville"><AI placeholder="Hilo" value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v }))} /></FG>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FG label="Continent">
                    <select value={form.continent} onChange={(e) => setForm((f) => ({ ...f, continent: e.target.value }))}
                      className="w-full bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 text-sm px-4 py-3 outline-none appearance-none">
                      {['Amérique Centrale','Amérique du Sud','Amérique du Nord','Europe','Asie','Afrique','Océanie'].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </FG>
                  <FG label="Tags (virgules)"><AI placeholder="Volcan, Lave" value={form.tags} onChange={(v) => setForm((f) => ({ ...f, tags: v }))} /></FG>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FG label="Date départ *"><AI type="date" value={form.startDate} onChange={(v) => setForm((f) => ({ ...f, startDate: v }))} /></FG>
                  <FG label="Date retour"><AI type="date" value={form.endDate} onChange={(v) => setForm((f) => ({ ...f, endDate: v }))} /></FG>
                </div>
                <FG label="Description">
                  <textarea rows={5} placeholder="Décrivez ce voyage..." value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 text-sm px-4 py-3 outline-none resize-none leading-relaxed" />
                </FG>

                <FG label="Image principale">
                  <div className="flex flex-col gap-3">
                    {form.heroImage && (
                      <div className="relative w-full h-40 overflow-hidden">
                        <img src={form.heroImage} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => setForm((f) => ({ ...f, heroImage: '' }))} className="absolute top-2 right-2 bg-noir/80 p-1 hover:bg-red-500/80 transition-colors"><X size={12} className="text-creme" /></button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input type="text" placeholder="URL ou uploader →" value={form.heroImage} onChange={(e) => setForm((f) => ({ ...f, heroImage: e.target.value }))}
                        className="flex-1 bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 text-sm px-4 py-3 outline-none" />
                      <button onClick={() => heroFileRef.current?.click()}
                        className="px-4 py-3 bg-or/10 border border-or/30 hover:bg-or/20 text-or transition-colors flex items-center gap-2 text-xs whitespace-nowrap">
                        {uploadStatus.hero === 'uploading' ? <Loader size={13} className="animate-spin" /> : <Upload size={13} />} Uploader
                      </button>
                      <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
                    </div>
                  </div>
                </FG>

                <FG label="Photos du voyage">
                  <div onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-white/10 hover:border-or/40 transition-colors p-8 flex flex-col items-center gap-3 cursor-pointer">
                    <Camera size={24} className="text-creme/20" />
                    <p className="text-sm text-creme/30">Cliquez pour uploader des photos</p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotosUpload} />
                  {form.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {form.photos.map((p, i) => (
                        <div key={i} className="relative group">
                          <img src={p.src} alt="" className="w-full h-24 object-cover" />
                          <button onClick={() => setForm((f) => ({ ...f, photos: f.photos.filter((_, j) => j !== i) }))}
                            className="absolute top-1 right-1 bg-noir/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} className="text-creme" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </FG>

                <FG label="Anecdotes">
                  <div className="flex flex-col gap-3 p-4 bg-noir-mid border border-white/5">
                    <AI placeholder="Titre de l'anecdote" value={form.anecdoteTitle} onChange={(v) => setForm((f) => ({ ...f, anecdoteTitle: v }))} />
                    <textarea rows={3} placeholder="Contenu..." value={form.anecdoteContent}
                      onChange={(e) => setForm((f) => ({ ...f, anecdoteContent: e.target.value }))}
                      className="w-full bg-noir border border-white/10 focus:border-or/50 text-creme/80 text-sm px-4 py-3 outline-none resize-none" />
                    <AI placeholder="Lieu" value={form.anecdoteLocation} onChange={(v) => setForm((f) => ({ ...f, anecdoteLocation: v }))} />
                    <button onClick={addAnecdote} className="flex items-center gap-2 px-4 py-2 border border-or/30 hover:bg-or/10 text-or text-xs tracking-wider uppercase transition-colors self-start">
                      <Plus size={12} /> Ajouter
                    </button>
                    {form.anecdotes.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 border border-white/5 text-xs text-creme/50">
                        <span className="text-or">·</span><span className="flex-1 font-medium text-creme/70">{a.title}</span>
                        <button onClick={() => setForm((f) => ({ ...f, anecdotes: f.anecdotes.filter((_, j) => j !== i) }))} className="text-creme/30 hover:text-red-400"><Trash2 size={11} /></button>
                      </div>
                    ))}
                  </div>
                </FG>

                <FG label="Conseils pratiques">
                  <div className="flex gap-2">
                    <input value={form.tip} onChange={(e) => setForm((f) => ({ ...f, tip: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && addTip()}
                      placeholder="Ajouter un conseil..." className="flex-1 bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 text-sm px-4 py-3 outline-none" />
                    <button onClick={addTip} className="px-4 py-3 bg-or/10 border border-or/30 hover:bg-or/20 text-or"><Plus size={14} /></button>
                  </div>
                  {form.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-creme/50 bg-noir-mid p-3 border border-white/5 mt-2">
                      <span className="text-or">·</span><span className="flex-1">{tip}</span>
                      <button onClick={() => setForm((f) => ({ ...f, tips: f.tips.filter((_, j) => j !== i) }))} className="text-creme/30 hover:text-red-400"><Trash2 size={11} /></button>
                    </div>
                  ))}
                </FG>

                {saveMsg && (
                  <div className={`p-3 text-xs ${saveStatus === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}>
                    {saveMsg}
                  </div>
                )}
                <div className="pt-4">
                  <button onClick={handleSaveVoyage} disabled={saveStatus === 'loading'}
                    className="flex items-center gap-2 px-8 py-4 bg-or text-noir text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-or/90 transition-colors disabled:opacity-50">
                    {saveStatus === 'loading' ? <Loader size={14} className="animate-spin" /> : saveStatus === 'success' ? <Check size={14} /> : <Save size={14} />}
                    {saveStatus === 'loading' ? 'Publication...' : saveStatus === 'success' ? 'Publié !' : 'Publier le voyage'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'add-photo' && (
            <motion.div key="add-photo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl">
              <div className="flex flex-col gap-6">
                <div className="p-6 bg-or/5 border border-or/20 text-sm text-creme/60">
                  Uploadez des photos ici pour obtenir leurs URLs Cloudinary, puis ajoutez-les à un voyage via <span className="text-or cursor-pointer" onClick={() => setTab('add-voyage')}>Nouveau voyage</span>.
                </div>
                <FG label="Upload vers Cloudinary">
                  <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-white/10 hover:border-or/40 transition-colors p-12 flex flex-col items-center gap-4 cursor-pointer">
                    <Camera size={28} className="text-creme/20" />
                    <p className="text-sm text-creme/30">Cliquez pour sélectionner des photos</p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotosUpload} />
                </FG>
                {form.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {form.photos.map((p, i) => (
                      <div key={i}>
                        <img src={p.src} alt="" className="w-full h-32 object-cover" />
                        <p className="text-[10px] text-creme/30 mt-1 break-all">{p.src}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FG({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.2em] uppercase text-or mb-2">{label}</label>
      {children}
    </div>
  );
}

function AI({ placeholder, value, onChange, type = 'text', serif = false }: {
  placeholder?: string; value: string; onChange: (v: string) => void; type?: string; serif?: boolean;
}) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 px-4 py-3 outline-none transition-colors ${serif ? 'font-serif italic text-lg' : 'text-sm'}`} />
  );
}
