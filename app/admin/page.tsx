'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Save, Camera, Map, Eye, Lock, LogOut,
  Upload, X, Check, Loader, Pencil, LayoutDashboard,
  Navigation, Image as ImageIcon, ChevronUp, ChevronDown,
  Globe, GripVertical, RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { VOYAGES, HERO_SLIDES, NAV_ITEMS } from '@/lib/data';

type Tab = 'voyages' | 'add-voyage' | 'edit-voyage' | 'hero' | 'navigation' | 'upload';
type Status = 'idle' | 'loading' | 'success' | 'error';

const emptyForm = {
  title: '', subtitle: '', country: '', city: '', region: '',
  continent: 'Amérique Centrale', startDate: '', endDate: '',
  description: '', heroImage: '', lat: '', lng: '',
  tip: '', tips: [] as string[],
  photos: [] as { src: string; alt: string; location: string; date: string }[],
  tags: '',
  slug: '',
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('voyages');
  const [saveStatus, setSaveStatus] = useState<Status>('idle');
  const [saveMsg, setSaveMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Hero slides state
  const [slides, setSlides] = useState(HERO_SLIDES.map(s => ({ ...s })));
  const [editSlideIdx, setEditSlideIdx] = useState<number | null>(null);

  // Nav items state
  const [navItems, setNavItems] = useState(NAV_ITEMS.map(n => ({ ...n })));
  const [newNavHref, setNewNavHref] = useState('');
  const [newNavLabel, setNewNavLabel] = useState('');

  const fileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const slideFileRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    setAuthLoading(true); setAuthError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setAuthLoading(false);
    if (res.ok) setAuthed(true);
    else setAuthError('Mot de passe incorrect');
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const sigRes = await fetch('/api/admin/upload', { method: 'POST' });
    if (!sigRes.ok) return null;
    const { signature, timestamp, api_key, cloud_name, folder } = await sigRes.json();
    const fd = new FormData();
    fd.append('file', file); fd.append('api_key', api_key);
    fd.append('timestamp', String(timestamp)); fd.append('signature', signature);
    fd.append('folder', folder);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd });
    const data = await res.json();
    return data.secure_url || null;
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadStatus(s => ({ ...s, hero: 'uploading' }));
    const url = await uploadToCloudinary(file);
    if (url) { setForm(f => ({ ...f, heroImage: url })); setUploadStatus(s => ({ ...s, hero: 'done' })); }
    else setUploadStatus(s => ({ ...s, hero: 'error' }));
  };

  const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || editSlideIdx === null) return;
    setUploadStatus(s => ({ ...s, slide: 'uploading' }));
    const url = await uploadToCloudinary(file);
    if (url) {
      setSlides(ss => ss.map((s, i) => i === editSlideIdx ? { ...s, image: url } : s));
      setUploadStatus(s => ({ ...s, slide: 'done' }));
    } else setUploadStatus(s => ({ ...s, slide: 'error' }));
  };

  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      setUploadStatus(s => ({ ...s, [file.name]: 'uploading' }));
      const url = await uploadToCloudinary(file);
      if (url) {
        setForm(f => ({ ...f, photos: [...f.photos, { src: url, alt: file.name.replace(/\.[^.]+$/, ''), location: f.city, date: f.startDate || new Date().toISOString().split('T')[0] }] }));
        setUploadStatus(s => ({ ...s, [file.name]: 'done' }));
      } else setUploadStatus(s => ({ ...s, [file.name]: 'error' }));
    }
  };

  const handleSaveVoyage = async (isEdit = false) => {
    if (!form.title || !form.country || !form.startDate) {
      setSaveMsg('Titre, pays et date sont obligatoires'); setSaveStatus('error'); return;
    }
    setSaveStatus('loading'); setSaveMsg('');
    const duration = form.startDate && form.endDate
      ? Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000) : 7;
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/voyages', {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, duration, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }),
    });
    if (res.ok) {
      setSaveStatus('success');
      setSaveMsg(isEdit ? 'Voyage modifié ! Déploiement en cours...' : 'Voyage publié ! Déploiement en cours (2-3 min)...');
      if (!isEdit) { setForm(emptyForm); setTimeout(() => { setSaveStatus('idle'); setSaveMsg(''); setTab('voyages'); }, 3000); }
      else setTimeout(() => { setSaveStatus('idle'); setSaveMsg(''); }, 3000);
    } else {
      const err = await res.json();
      setSaveStatus('error'); setSaveMsg(err.error || 'Erreur');
    }
  };

  const handleDeleteVoyage = async (slug: string) => {
    setSaveStatus('loading');
    const res = await fetch('/api/admin/voyages', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    setSaveStatus('idle');
    setDeleteConfirm(null);
    if (res.ok) { setSaveMsg('Voyage supprimé ! Déploiement en cours...'); setTimeout(() => setSaveMsg(''), 4000); }
  };

  const handleEditVoyage = (voyage: typeof VOYAGES[0]) => {
    setForm({
      title: voyage.title, subtitle: voyage.subtitle, country: voyage.country,
      city: voyage.city, region: voyage.region || '', continent: voyage.continent,
      startDate: voyage.startDate, endDate: voyage.endDate, description: voyage.description,
      heroImage: voyage.heroImage, lat: String(voyage.coordinates.lat), lng: String(voyage.coordinates.lng),
      tip: '', tips: voyage.tips || [],
      photos: voyage.photos.map(p => ({ src: p.src, alt: p.alt, location: p.location, date: p.date })),
      tags: (voyage.tags || []).join(', '),
      slug: voyage.slug,
    });
    setTab('edit-voyage');
  };

  const handleSaveSlides = async () => {
    setSaveStatus('loading'); setSaveMsg('');
    const res = await fetch('/api/admin/slides', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slides }),
    });
    if (res.ok) { setSaveStatus('success'); setSaveMsg('Slides mis à jour ! Déploiement en cours...'); setTimeout(() => { setSaveStatus('idle'); setSaveMsg(''); }, 3000); }
    else { setSaveStatus('error'); setSaveMsg('Erreur lors de la mise à jour'); }
  };

  const addSlide = () => {
    setSlides(ss => [...ss, { id: ss.length + 1, image: '', country: '', location: '', title: 'Nouveau slide', subtitle: '', slug: '', year: new Date().getFullYear().toString() }]);
    setEditSlideIdx(slides.length);
  };

  const removeSlide = (i: number) => {
    setSlides(ss => ss.filter((_, idx) => idx !== i));
    if (editSlideIdx === i) setEditSlideIdx(null);
  };

  const moveSlide = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    setSlides(ss => { const n = [...ss]; [n[i], n[j]] = [n[j], n[i]]; return n; });
    if (editSlideIdx === i) setEditSlideIdx(j);
    else if (editSlideIdx === j) setEditSlideIdx(i);
  };

  const handleSaveNav = async () => {
    setSaveStatus('loading'); setSaveMsg('');
    const res = await fetch('/api/admin/nav', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: navItems }),
    });
    if (res.ok) { setSaveStatus('success'); setSaveMsg('Navigation mise à jour ! Déploiement en cours...'); setTimeout(() => { setSaveStatus('idle'); setSaveMsg(''); }, 3000); }
    else { setSaveStatus('error'); setSaveMsg('Erreur lors de la mise à jour'); }
  };

  const TABS = [
    { id: 'voyages' as Tab, label: 'Voyages', icon: Map },
    { id: 'add-voyage' as Tab, label: 'Nouveau', icon: Plus },
    { id: 'hero' as Tab, label: 'Page d\'accueil', icon: LayoutDashboard },
    { id: 'navigation' as Tab, label: 'Navigation', icon: Navigation },
    { id: 'upload' as Tab, label: 'Upload', icon: Camera },
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
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
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

        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-8 h-px bg-or" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">Interface admin</span>
            </div>
            <h1 className="font-serif font-light text-4xl text-creme italic">Administration</h1>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <Link href="/" className="flex items-center gap-2 text-creme/30 hover:text-creme/60 text-xs tracking-widest uppercase transition-colors">
              <Globe size={13} /> Voir le site
            </Link>
            <button onClick={() => setAuthed(false)} className="flex items-center gap-2 text-creme/30 hover:text-creme/60 text-xs tracking-widest uppercase transition-colors">
              <LogOut size={13} /> Déconnexion
            </button>
          </div>
        </div>

        {/* Global save message */}
        <AnimatePresence>
          {saveMsg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`mb-6 p-4 text-sm flex items-center gap-3 ${saveStatus === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}>
              {saveStatus === 'success' ? <Check size={14} /> : saveStatus === 'error' ? <X size={14} /> : <RefreshCw size={14} className="animate-spin" />}
              {saveMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-0.5 mb-10 border-b border-white/5 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-[10px] tracking-widest uppercase whitespace-nowrap border-b-2 transition-all duration-200 font-poppins ${tab === id || (tab === 'edit-voyage' && id === 'voyages') ? 'border-or text-or' : 'border-transparent text-creme/40 hover:text-creme/70'}`}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ─── VOYAGES LIST ─── */}
          {(tab === 'voyages') && (
            <motion.div key="voyages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col gap-2">
                {VOYAGES.map((v) => (
                  <div key={v.id} className="group relative flex items-center gap-4 p-4 bg-noir-mid border border-white/5 hover:border-white/10 transition-colors">
                    {/* Thumb */}
                    <div className="w-20 h-14 overflow-hidden flex-shrink-0">
                      {v.heroImage
                        ? <img src={v.heroImage} alt={v.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                        : <div className="w-full h-full bg-noir-soft flex items-center justify-center"><ImageIcon size={14} className="text-creme/20" /></div>
                      }
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-serif italic text-creme group-hover:text-or transition-colors truncate">{v.title}</div>
                      <div className="text-xs text-creme/35 mt-0.5 font-poppins">
                        {v.country} · {v.continent} · {new Date(v.startDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' })} · {v.photos.length} photo{v.photos.length > 1 ? 's' : ''}
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Link href={`/voyages/${v.slug}`} target="_blank"
                        className="p-2.5 text-creme/30 hover:text-creme/70 transition-colors" title="Voir">
                        <Eye size={14} />
                      </Link>
                      <button onClick={() => handleEditVoyage(v)}
                        className="p-2.5 text-creme/30 hover:text-or transition-colors" title="Modifier">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteConfirm(v.slug)}
                        className="p-2.5 text-creme/30 hover:text-red-400 transition-colors" title="Supprimer">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Delete confirm overlay */}
                    <AnimatePresence>
                      {deleteConfirm === v.slug && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-noir/95 flex items-center justify-center gap-4 z-10 border border-red-500/30">
                          <span className="text-xs text-creme/60 font-poppins">Supprimer <span className="text-creme italic font-serif">« {v.title} »</span> ?</span>
                          <button onClick={() => handleDeleteVoyage(v.slug)}
                            className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 text-xs tracking-wider hover:bg-red-500/30 transition-colors">
                            Supprimer
                          </button>
                          <button onClick={() => setDeleteConfirm(null)}
                            className="px-4 py-2 border border-white/10 text-creme/40 text-xs tracking-wider hover:text-creme/70 transition-colors">
                            Annuler
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {VOYAGES.length === 0 && (
                  <div className="p-12 text-center text-creme/30 text-sm font-poppins border border-dashed border-white/10">
                    Aucun voyage pour l'instant
                  </div>
                )}
              </div>
              <button onClick={() => setTab('add-voyage')}
                className="mt-4 flex items-center gap-2 px-5 py-3 border border-dashed border-white/15 text-creme/40 hover:text-or hover:border-or text-[11px] tracking-widest uppercase transition-all font-poppins">
                <Plus size={13} /> Ajouter un voyage
              </button>
            </motion.div>
          )}

          {/* ─── ADD / EDIT VOYAGE ─── */}
          {(tab === 'add-voyage' || tab === 'edit-voyage') && (
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl">
              {tab === 'edit-voyage' && (
                <div className="mb-8 flex items-center gap-4">
                  <button onClick={() => setTab('voyages')} className="text-creme/30 hover:text-creme/60 text-xs tracking-widest uppercase flex items-center gap-2 font-poppins transition-colors">
                    ← Retour
                  </button>
                  <span className="text-creme/20">|</span>
                  <span className="text-or text-xs tracking-widest uppercase font-poppins">Modifier : {form.title}</span>
                </div>
              )}
              <VoyageForm
                form={form} setForm={setForm}
                uploadStatus={uploadStatus}
                heroFileRef={heroFileRef} fileRef={fileRef}
                onHeroUpload={handleHeroUpload}
                onPhotosUpload={handlePhotosUpload}
                saveStatus={saveStatus}
                onSave={() => handleSaveVoyage(tab === 'edit-voyage')}
                isEdit={tab === 'edit-voyage'}
              />
            </motion.div>
          )}

          {/* ─── HERO / PAGE D'ACCUEIL ─── */}
          {tab === 'hero' && (
            <motion.div key="hero" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-creme/50 font-poppins">
                  Gérez les slides du hero fullscreen sur la page d'accueil.
                </p>
                <button onClick={handleSaveSlides} disabled={saveStatus === 'loading'}
                  className="flex items-center gap-2 px-6 py-3 bg-or text-noir text-[10px] tracking-widest uppercase font-medium hover:bg-or/90 transition-colors disabled:opacity-50 font-poppins">
                  {saveStatus === 'loading' ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
                  Publier les slides
                </button>
              </div>

              {/* Slides list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {slides.map((slide, i) => (
                  <div key={i}
                    className={`relative border cursor-pointer transition-all ${editSlideIdx === i ? 'border-or' : 'border-white/10 hover:border-white/20'}`}
                    onClick={() => setEditSlideIdx(i === editSlideIdx ? null : i)}>
                    <div className="relative h-36 overflow-hidden">
                      {slide.image
                        ? <img src={slide.image} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-noir-soft flex items-center justify-center"><ImageIcon size={20} className="text-creme/20" /></div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-noir/80 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <p className="text-xs text-or font-poppins truncate">{slide.location || 'Aucun lieu'}</p>
                        <p className="text-creme font-serif italic text-sm truncate">{slide.title?.replace('\\n', ' ') || 'Sans titre'}</p>
                      </div>
                      {/* Controls */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button onClick={e => { e.stopPropagation(); moveSlide(i, -1); }}
                          className="w-6 h-6 bg-noir/70 hover:bg-or/20 flex items-center justify-center transition-colors" title="Monter">
                          <ChevronUp size={11} className="text-creme/70" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); moveSlide(i, 1); }}
                          className="w-6 h-6 bg-noir/70 hover:bg-or/20 flex items-center justify-center transition-colors" title="Descendre">
                          <ChevronDown size={11} className="text-creme/70" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); removeSlide(i); }}
                          className="w-6 h-6 bg-noir/70 hover:bg-red-500/30 flex items-center justify-center transition-colors" title="Supprimer">
                          <X size={11} className="text-red-400" />
                        </button>
                      </div>
                      {/* Slide number */}
                      <div className="absolute top-2 left-2 bg-noir/70 px-2 py-0.5 text-[9px] text-creme/50 font-poppins">
                        {i + 1}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add slide */}
                <button onClick={addSlide}
                  className="h-36 border-2 border-dashed border-white/10 hover:border-or/40 flex flex-col items-center justify-center gap-2 transition-colors text-creme/30 hover:text-or">
                  <Plus size={20} />
                  <span className="text-[10px] tracking-widest uppercase font-poppins">Ajouter un slide</span>
                </button>
              </div>

              {/* Edit panel for selected slide */}
              <AnimatePresence>
                {editSlideIdx !== null && slides[editSlideIdx] && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-4 p-6 border border-or/20 bg-or/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-4 h-px bg-or" />
                      <span className="text-[10px] tracking-widest uppercase text-or font-poppins">Modifier le slide {editSlideIdx + 1}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FG label="Image">
                        <div className="flex gap-2">
                          <input value={slides[editSlideIdx].image} onChange={e => setSlides(ss => ss.map((s, i) => i === editSlideIdx ? { ...s, image: e.target.value } : s))}
                            placeholder="URL de l'image" className="flex-1 bg-noir border border-white/10 focus:border-or/50 text-creme/80 text-xs px-3 py-2.5 outline-none" />
                          <button onClick={() => slideFileRef.current?.click()}
                            className="px-3 py-2.5 bg-or/10 border border-or/30 hover:bg-or/20 text-or transition-colors">
                            {uploadStatus.slide === 'uploading' ? <Loader size={12} className="animate-spin" /> : <Upload size={12} />}
                          </button>
                          <input ref={slideFileRef} type="file" accept="image/*" className="hidden" onChange={handleSlideImageUpload} />
                        </div>
                      </FG>
                      <FG label="Pays">
                        <input value={slides[editSlideIdx].country} onChange={e => setSlides(ss => ss.map((s, i) => i === editSlideIdx ? { ...s, country: e.target.value } : s))}
                          placeholder="France" className="w-full bg-noir border border-white/10 focus:border-or/50 text-creme/80 text-xs px-3 py-2.5 outline-none" />
                      </FG>
                      <FG label="Lieu">
                        <input value={slides[editSlideIdx].location} onChange={e => setSlides(ss => ss.map((s, i) => i === editSlideIdx ? { ...s, location: e.target.value } : s))}
                          placeholder="Paris, France" className="w-full bg-noir border border-white/10 focus:border-or/50 text-creme/80 text-xs px-3 py-2.5 outline-none" />
                      </FG>
                      <FG label="Année">
                        <input value={slides[editSlideIdx].year} onChange={e => setSlides(ss => ss.map((s, i) => i === editSlideIdx ? { ...s, year: e.target.value } : s))}
                          placeholder="2024" className="w-full bg-noir border border-white/10 focus:border-or/50 text-creme/80 text-xs px-3 py-2.5 outline-none" />
                      </FG>
                      <FG label="Titre (\\n pour retour à la ligne)">
                        <input value={slides[editSlideIdx].title} onChange={e => setSlides(ss => ss.map((s, i) => i === editSlideIdx ? { ...s, title: e.target.value } : s))}
                          placeholder="Titre du slide" className="w-full bg-noir border border-white/10 focus:border-or/50 text-creme/80 text-xs px-3 py-2.5 outline-none font-serif italic" />
                      </FG>
                      <FG label="Lien vers le voyage (slug)">
                        <select value={slides[editSlideIdx].slug} onChange={e => setSlides(ss => ss.map((s, i) => i === editSlideIdx ? { ...s, slug: e.target.value } : s))}
                          className="w-full bg-noir border border-white/10 focus:border-or/50 text-creme/80 text-xs px-3 py-2.5 outline-none appearance-none">
                          <option value="">— Aucun —</option>
                          {VOYAGES.map(v => <option key={v.slug} value={v.slug}>{v.title}</option>)}
                        </select>
                      </FG>
                      <FG label="Sous-titre" className="md:col-span-2">
                        <input value={slides[editSlideIdx].subtitle} onChange={e => setSlides(ss => ss.map((s, i) => i === editSlideIdx ? { ...s, subtitle: e.target.value } : s))}
                          placeholder="Sous-titre descriptif..." className="w-full bg-noir border border-white/10 focus:border-or/50 text-creme/80 text-xs px-3 py-2.5 outline-none" />
                      </FG>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ─── NAVIGATION ─── */}
          {tab === 'navigation' && (
            <motion.div key="navigation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-creme/50 font-poppins">Gérez les liens du menu de navigation.</p>
                <button onClick={handleSaveNav} disabled={saveStatus === 'loading'}
                  className="flex items-center gap-2 px-6 py-3 bg-or text-noir text-[10px] tracking-widest uppercase font-medium hover:bg-or/90 transition-colors disabled:opacity-50 font-poppins">
                  {saveStatus === 'loading' ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
                  Publier
                </button>
              </div>

              {/* Items list */}
              <div className="flex flex-col gap-2 mb-4">
                {navItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-noir-mid border border-white/5 group">
                    <GripVertical size={14} className="text-creme/20 flex-shrink-0" />
                    <input value={item.label}
                      onChange={e => setNavItems(ns => ns.map((n, j) => j === i ? { ...n, label: e.target.value } : n))}
                      className="flex-1 bg-transparent text-creme/80 text-sm outline-none border-b border-transparent focus:border-or/40 pb-0.5 min-w-0 font-poppins" />
                    <input value={item.href}
                      onChange={e => setNavItems(ns => ns.map((n, j) => j === i ? { ...n, href: e.target.value } : n))}
                      className="flex-1 bg-transparent text-creme/40 text-xs outline-none border-b border-transparent focus:border-or/40 pb-0.5 min-w-0 font-poppins" />
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { const n = [...navItems]; if (i > 0) { [n[i-1], n[i]] = [n[i], n[i-1]]; setNavItems(n); }}} className="p-1.5 hover:text-or text-creme/30 transition-colors"><ChevronUp size={12} /></button>
                      <button onClick={() => { const n = [...navItems]; if (i < n.length-1) { [n[i], n[i+1]] = [n[i+1], n[i]]; setNavItems(n); }}} className="p-1.5 hover:text-or text-creme/30 transition-colors"><ChevronDown size={12} /></button>
                      <button onClick={() => setNavItems(ns => ns.filter((_, j) => j !== i))} className="p-1.5 hover:text-red-400 text-creme/30 transition-colors"><X size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add item */}
              <div className="flex gap-2 p-4 border border-dashed border-white/10">
                <input value={newNavLabel} onChange={e => setNewNavLabel(e.target.value)}
                  placeholder="Label (ex: À propos)" className="flex-1 bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 text-xs px-3 py-2.5 outline-none font-poppins" />
                <input value={newNavHref} onChange={e => setNewNavHref(e.target.value)}
                  placeholder="/a-propos" className="flex-1 bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 text-xs px-3 py-2.5 outline-none font-poppins" />
                <button onClick={() => { if (newNavLabel && newNavHref) { setNavItems(ns => [...ns, { label: newNavLabel, href: newNavHref }]); setNewNavLabel(''); setNewNavHref(''); }}}
                  className="px-4 py-2.5 bg-or/10 border border-or/30 hover:bg-or/20 text-or transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── UPLOAD ─── */}
          {tab === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl">
              <div className="flex flex-col gap-6">
                <div className="p-4 bg-or/5 border border-or/20 text-sm text-creme/50 font-poppins">
                  Uploadez des photos ici pour obtenir leurs URLs Cloudinary, puis ajoutez-les à un voyage.
                </div>
                <div onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-or/40 transition-colors p-16 flex flex-col items-center gap-4 cursor-pointer">
                  <Camera size={28} className="text-creme/20" />
                  <p className="text-sm text-creme/30 font-poppins">Cliquer pour uploader</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotosUpload} />
                {form.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {form.photos.map((p, i) => (
                      <div key={i}>
                        <img src={p.src} alt="" className="w-full h-28 object-cover" />
                        <p className="text-[9px] text-creme/25 mt-1 break-all font-poppins">{p.src}</p>
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

// ─── Shared form for add/edit voyage ───
function VoyageForm({ form, setForm, uploadStatus, heroFileRef, fileRef, onHeroUpload, onPhotosUpload, saveStatus, onSave, isEdit }: {
  form: ReturnType<typeof useState<typeof emptyForm>>[0];
  setForm: (f: (prev: typeof emptyForm) => typeof emptyForm) => void;
  uploadStatus: Record<string, string>;
  heroFileRef: React.RefObject<HTMLInputElement>;
  fileRef: React.RefObject<HTMLInputElement>;
  onHeroUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveStatus: Status;
  onSave: () => void;
  isEdit: boolean;
}) {
  if (!form) return null;
  const f = form as typeof emptyForm;

  const addTip = () => {
    if (f.tip.trim()) setForm(prev => ({ ...prev, tips: [...prev.tips, prev.tip.trim()], tip: '' }));
  };

  return (
    <div className="flex flex-col gap-5">
      <FG label="Titre *"><AI serif placeholder="Sous les nuages tropicaux d'Hawaï" value={f.title} onChange={v => setForm(p => ({ ...p, title: v }))} /></FG>
      <FG label="Sous-titre"><AI placeholder="Big Island, Hawaii" value={f.subtitle} onChange={v => setForm(p => ({ ...p, subtitle: v }))} /></FG>
      <div className="grid grid-cols-2 gap-4">
        <FG label="Pays *"><AI placeholder="États-Unis" value={f.country} onChange={v => setForm(p => ({ ...p, country: v }))} /></FG>
        <FG label="Ville"><AI placeholder="Hilo" value={f.city} onChange={v => setForm(p => ({ ...p, city: v }))} /></FG>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FG label="Continent">
          <select value={f.continent} onChange={e => setForm(p => ({ ...p, continent: e.target.value }))}
            className="w-full bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 text-sm px-4 py-3 outline-none appearance-none font-poppins">
            {['Amérique Centrale','Amérique du Sud','Amérique du Nord','Europe','Asie','Afrique','Océanie'].map(c => <option key={c}>{c}</option>)}
          </select>
        </FG>
        <FG label="Tags (virgules)"><AI placeholder="Volcan, Lave" value={f.tags} onChange={v => setForm(p => ({ ...p, tags: v }))} /></FG>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FG label="Date départ *"><AI type="date" value={f.startDate} onChange={v => setForm(p => ({ ...p, startDate: v }))} /></FG>
        <FG label="Date retour"><AI type="date" value={f.endDate} onChange={v => setForm(p => ({ ...p, endDate: v }))} /></FG>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FG label="Latitude"><AI placeholder="9.7489" value={f.lat} onChange={v => setForm(p => ({ ...p, lat: v }))} /></FG>
        <FG label="Longitude"><AI placeholder="-83.7534" value={f.lng} onChange={v => setForm(p => ({ ...p, lng: v }))} /></FG>
      </div>
      <FG label="Description">
        <textarea rows={4} placeholder="Décrivez ce voyage..." value={f.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          className="w-full bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 text-sm px-4 py-3 outline-none resize-none leading-relaxed font-poppins" />
      </FG>
      <FG label="Image principale">
        <div className="flex flex-col gap-3">
          {f.heroImage && (
            <div className="relative h-36 overflow-hidden">
              <img src={f.heroImage} alt="" className="w-full h-full object-cover" />
              <button onClick={() => setForm(p => ({ ...p, heroImage: '' }))} className="absolute top-2 right-2 bg-noir/80 p-1 hover:bg-red-500/80 transition-colors"><X size={11} className="text-creme" /></button>
            </div>
          )}
          <div className="flex gap-2">
            <input type="text" placeholder="URL ou uploader →" value={f.heroImage} onChange={e => setForm(p => ({ ...p, heroImage: e.target.value }))}
              className="flex-1 bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 text-sm px-4 py-3 outline-none font-poppins" />
            <button onClick={() => heroFileRef.current?.click()}
              className="px-4 py-3 bg-or/10 border border-or/30 hover:bg-or/20 text-or transition-colors flex items-center gap-2 text-xs whitespace-nowrap font-poppins">
              {uploadStatus.hero === 'uploading' ? <Loader size={13} className="animate-spin" /> : <Upload size={13} />} Upload
            </button>
            <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={onHeroUpload} />
          </div>
        </div>
      </FG>
      <FG label="Photos du voyage">
        <div onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-white/10 hover:border-or/40 transition-colors p-8 flex flex-col items-center gap-3 cursor-pointer">
          <Camera size={22} className="text-creme/20" />
          <p className="text-xs text-creme/30 font-poppins">Cliquez pour uploader des photos</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onPhotosUpload} />
        {f.photos.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {f.photos.map((p, i) => (
              <div key={i} className="relative group">
                <img src={p.src} alt="" className="w-full h-20 object-cover" />
                <button onClick={() => setForm(prev => ({ ...prev, photos: prev.photos.filter((_, j) => j !== i) }))}
                  className="absolute top-1 right-1 bg-noir/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"><X size={9} className="text-creme" /></button>
              </div>
            ))}
          </div>
        )}
      </FG>
      <FG label="Conseils pratiques">
        <div className="flex gap-2">
          <input value={f.tip} onChange={e => setForm(p => ({ ...p, tip: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addTip()}
            placeholder="Ajouter un conseil..." className="flex-1 bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 text-sm px-4 py-3 outline-none font-poppins" />
          <button onClick={addTip} className="px-4 py-3 bg-or/10 border border-or/30 hover:bg-or/20 text-or"><Plus size={14} /></button>
        </div>
        {f.tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-creme/50 bg-noir-mid p-3 border border-white/5 mt-1.5 font-poppins">
            <span className="text-or">·</span><span className="flex-1">{tip}</span>
            <button onClick={() => setForm(p => ({ ...p, tips: p.tips.filter((_, j) => j !== i) }))} className="text-creme/30 hover:text-red-400"><Trash2 size={11} /></button>
          </div>
        ))}
      </FG>
      <div className="pt-4">
        <button onClick={onSave} disabled={saveStatus === 'loading'}
          className="flex items-center gap-2 px-8 py-4 bg-or text-noir text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-or/90 transition-colors disabled:opacity-50 font-poppins">
          {saveStatus === 'loading' ? <Loader size={14} className="animate-spin" /> : saveStatus === 'success' ? <Check size={14} /> : <Save size={14} />}
          {saveStatus === 'loading' ? 'Publication...' : saveStatus === 'success' ? 'Publié !' : isEdit ? 'Enregistrer les modifications' : 'Publier le voyage'}
        </button>
      </div>
    </div>
  );
}

function FG({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[10px] tracking-[0.2em] uppercase text-or mb-2 font-poppins">{label}</label>
      {children}
    </div>
  );
}

function AI({ placeholder, value, onChange, type = 'text', serif = false }: {
  placeholder?: string; value: string; onChange: (v: string) => void; type?: string; serif?: boolean;
}) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      className={`w-full bg-noir-mid border border-white/10 focus:border-or/50 text-creme/80 px-4 py-3 outline-none transition-colors ${serif ? 'font-serif italic text-lg' : 'text-sm font-poppins'}`} />
  );
}
