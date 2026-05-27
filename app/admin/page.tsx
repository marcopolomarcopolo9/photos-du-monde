// @ts-nocheck
'use client';
import { useState, useEffect, useRef } from 'react';

const G = '#c4962a';
const GB = 'linear-gradient(135deg,#7a5a18,#c4962a)';
const inp = { width:'100%', padding:'11px 14px', background:'#0d0d0d', border:'1px solid #2a2a2a', borderRadius:'8px', color:'#f5f0e8', fontSize:'14px', outline:'none', boxSizing:'border-box', fontFamily:'inherit' };
const lbl = { display:'block', color:'#888', fontSize:'11px', letterSpacing:'0.12em', marginBottom:'5px', textTransform:'uppercase', fontWeight:'600' };
const cardSt = { background:'#111', border:'1px solid #1e1e1e', borderRadius:'12px', padding:'24px' };

function Btn({ children, onClick, variant, disabled, small, style }) {
  variant = variant || 'primary';
  disabled = disabled || false;
  small = small || false;
  style = style || {};
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: small ? '7px 14px' : '11px 22px',
        background: variant === 'primary' ? GB : variant === 'danger' ? '#7f1d1d' : '#1a1a1a',
        border: variant === 'primary' ? 'none' : variant === 'danger' ? '1px solid #dc2626' : '1px solid #333',
        borderRadius: '8px',
        color: variant === 'ghost' ? '#aaa' : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: small ? '12px' : '13px',
        fontWeight: variant === 'primary' ? '600' : '400',
        letterSpacing: '0.1em',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      {children}
    </div>
  );
}

function Inp({ value, onChange, placeholder, type, multiline, rows, style }) {
  placeholder = placeholder || '';
  type = type || 'text';
  multiline = multiline || false;
  rows = rows || 3;
  style = style || {};
  const s = { ...inp, ...style };
  if (multiline) return <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...s, resize: 'vertical' }} />;
  return <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} />;
}

// Compress image before upload — max 1920px, WebP quality 0.82
// Typical result: 4MB photo → 200-400KB, no visible quality loss

// Resize to max 2000px before upload — stays under Vercel 4.5MB body limit
async function resizeImage(file: File): Promise<File> {
  const MAX = 2000;
  try {
    return await new Promise(resolve => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        if (img.width <= MAX && img.height <= MAX) { resolve(file); return; }
        const ratio = Math.min(MAX / img.width, MAX / img.height);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(file); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (!blob || blob.size >= file.size) { resolve(file); return; }
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.88);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  } catch {
    return file; // Always fallback to original if anything fails
  }
}

async function uploadFile(file) {
  const resized = await resizeImage(file);
  const fd = new FormData();
  fd.append('file', resized);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
  const data = await res.json();
  if (data.url) return data.url;
  throw new Error(data.error || 'Upload échoué');
}

/* ─── Lightbox zoom ─── */
function Lightbox({ photos, index, onClose }) {
  const [cur, setCur] = useState(index);
  useEffect(() => {
    const h = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCur(c => Math.min(c + 1, photos.length - 1));
      if (e.key === 'ArrowLeft') setCur(c => Math.max(c - 1, 0));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [photos, onClose]);
  const photo = photos[cur];
  if (!photo) return null;
  const src = typeof photo === 'string' ? photo : photo.src;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.96)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
        <img src={src} alt="" style={{ maxWidth: '88vw', maxHeight: '80vh', objectFit: 'contain', display: 'block', borderRadius: '4px' }} />
        {photos.length > 1 && (
          <>
            <button onClick={() => setCur(c => Math.max(c - 1, 0))} disabled={cur === 0}
              style={{ position: 'absolute', left: '-52px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '22px' }}>&#8249;</button>
            <button onClick={() => setCur(c => Math.min(c + 1, photos.length - 1))} disabled={cur === photos.length - 1}
              style={{ position: 'absolute', right: '-52px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '22px' }}>&#8250;</button>
          </>
        )}
      </div>
      <div style={{ color: 'rgba(255,255,255,.4)', marginTop: '16px', fontSize: '13px' }}>{cur + 1} / {photos.length} &nbsp;·&nbsp; Esc pour fermer</div>
      <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontSize: '30px', lineHeight: 1 }}>&#215;</button>
    </div>
  );
}

/* ─── Photo grid with upload/reorder/delete ─── */
function PhotoGrid({ photos, onChange, onZoom }) {
  const dragIndex = useRef(null);
  const dragOver = useRef(null);

  const handleDragStart = (i) => { dragIndex.current = i; };
  const handleDragEnter = (i) => { dragOver.current = i; };
  const handleDragEnd = () => {
    const from = dragIndex.current;
    const to = dragOver.current;
    if (from === null || to === null || from === to) return;
    const updated = [...photos];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
    dragIndex.current = null;
    dragOver.current = null;
  };
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState([]);

  const addFiles = async files => {
    setUploading(true);
    const arr = Array.from(files);
    const prog = arr.map(f => ({ name: f.name, status: 'uploading', originalSize: f.size }));
    setProgress(prog);
    const newPhotos = [];
    for (let i = 0; i < arr.length; i++) {
      try {
        const url = await uploadFile(arr[i]);
        newPhotos.push({ src: url });
        prog[i].status = 'done';
        prog[i].url = url;
      } catch (e) {
        prog[i].status = 'error';
        prog[i].err = e.message;
      }
      setProgress([...prog]);
    }
    if (newPhotos.length > 0) onChange([...photos, ...newPhotos]);
    setUploading(false);
    setTimeout(() => setProgress([]), 4000);
  };

  const remove = i => onChange(photos.filter((_, j) => j !== i));

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: '10px', marginBottom: '12px' }}>
        {photos.map((p, i) => {
          const src = typeof p === 'string' ? p : p.src;
          return (
            <div key={i}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={e => e.preventDefault()}
              style={{ borderRadius: '8px', overflow: 'hidden', background: '#0d0d0d', border: '1px solid #2a2a2a', cursor: 'grab' }}>
              <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src={src} alt="" onClick={() => onZoom && onZoom(i)} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: onZoom ? 'zoom-in' : 'default', display: 'block' }} />
                <div style={{ position: 'absolute', top: '3px', left: '5px', background: 'rgba(0,0,0,.65)', color: '#aaa', fontSize: '10px', padding: '2px 5px', borderRadius: '3px' }}>{i + 1}</div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', gap: '3px', padding: '5px', justifyContent: 'center', background: 'linear-gradient(to top,rgba(0,0,0,.8),transparent)' }}>
                  <button onClick={() => remove(i)} style={{ background: 'rgba(180,20,20,.8)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>&#215;</button>
                </div>
              </div>
              <input
                value={typeof photos[i] === 'object' ? (photos[i].caption || '') : ''}
                onChange={e => { const u=[...photos]; u[i]={...(typeof u[i]==='object'?u[i]:{src}), src, caption:e.target.value}; onChange(u); }}
                placeholder="Légende (optionnel)..."
                style={{ width:'100%', padding:'6px 8px', background:'#0a0a0a', border:'none', borderTop:'1px solid #1a1a1a', color:'#777', fontSize:'11px', outline:'none', boxSizing:'border-box', fontStyle:'italic', fontFamily:'Georgia,serif' }}
              />
              {/* Per-photo category tags */}
              <div style={{ padding:'6px 8px', background:'#080808', borderTop:'1px solid #111', display:'flex', flexWrap:'wrap', gap:'4px' }}>
                {['volcans','forets','plages','montagnes','deserts','faune','flore','villes','culture','aurores','voitures','svalbard'].map(cat => {
                  const photoObj = typeof photos[i] === 'object' ? photos[i] : { src };
                  const selected = (photoObj.categories || []).includes(cat);
                  const emojis: Record<string,string> = { volcans:'🌋', forets:'🌿', plages:'🏖️', montagnes:'⛰️', deserts:'🏜️', faune:'🦜', flore:'🌸', villes:'🏙️', culture:'🎭', aurores:'🌌', voitures:'🚗', svalbard:'🧊' };
                  return (
                    <button key={cat} type="button"
                      onClick={() => {
                        const u=[...photos];
                        const obj = typeof u[i]==='object' ? u[i] : { src };
                        const cats = obj.categories || [];
                        u[i] = { ...obj, categories: selected ? cats.filter((c: string)=>c!==cat) : [...cats, cat] };
                        onChange(u);
                      }}
                      style={{ padding:'2px 6px', background: selected ? 'rgba(196,150,42,0.2)' : 'transparent', border:`1px solid ${selected?'#c4962a':'#222'}`, borderRadius:'4px', color: selected?'#c4962a':'#444', cursor:'pointer', fontSize:'12px', transition:'all .15s', fontFamily:'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}
                      title={cat}>
                      {emojis[cat]}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div onClick={() => fileRef.current && fileRef.current.click()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }} onDragOver={e => e.preventDefault()} style={{ aspectRatio: '4/3', border: '2px dashed #2a2a2a', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#444' }}>
          <div style={{ fontSize: '28px', marginBottom: '4px' }}>+</div>
          <div style={{ fontSize: '11px', letterSpacing: '.1em' }}>AJOUTER</div>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => addFiles(e.target.files)} />
      {progress.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {progress.map((p, i) => (
            <span key={i} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: p.status === 'done' ? '#1a3320' : p.status === 'error' ? '#3a1010' : '#1a1a3a', color: p.status === 'done' ? '#4ade80' : p.status === 'error' ? '#f87171' : '#93c5fd' }}>
              {p.status === 'uploading' ? '⏳ ' : p.status === 'done' ? '✓ ' : '✗ '}
              {p.name.slice(0, 16)}
              {p.originalSize ? ' · ' + (p.originalSize / 1024 / 1024).toFixed(1) + 'MB' : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN ADMIN COMPONENT
═══════════════════════════════════════════ */
export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [notif, setNotif] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [voyages, setVoyages] = useState([]);
  const [voyLoading, setVoyLoading] = useState(false);
  const [editingVoyage, setEditingVoyage] = useState(null);
  const [savingVoyage, setSavingVoyage] = useState(false);
  const [hp, setHp] = useState(null);
  const [hpSaving, setHpSaving] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const uploadRef = useRef(null);

  const TABS = ['TABLEAU DE BORD', 'VOYAGES', "PAGE D'ACCUEIL", 'À PROPOS', 'GALERIE', 'PARAMETRES'];

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') { setAuth(true); loadAll(); }
  }, []);

  const toast = (msg, type) => {
    type = type || 'ok';
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 5000);
  };

  const loadAll = () => { loadVoyages(); loadHp(); };

  const loadVoyages = async () => {
    setVoyLoading(true);
    try { const r = await fetch('/api/admin/voyages'); const d = await r.json(); setVoyages(d.voyages || []); }
    catch (e) { toast('Erreur chargement', 'err'); }
    setVoyLoading(false);
  };

  const loadHp = async () => {
    try { const r = await fetch('/api/admin/homepage'); const d = await r.json(); if (d.config) setHp(d.config); }
    catch (e) {}
  };

  const login = async () => {
    if (!pw) return;
    setLoginLoading(true); setLoginErr('');
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
      const d = await r.json();
      if (d.success) { localStorage.setItem('admin_auth', 'true'); setAuth(true); loadAll(); }
      else setLoginErr('Mot de passe incorrect');
    } catch (e) { setLoginErr('Erreur réseau'); }
    setLoginLoading(false);
  };

  const logout = () => { localStorage.removeItem('admin_auth'); setAuth(false); };

  const saveVoyage = async () => {
    setSavingVoyage(true);
    const isNew = editingVoyage.isNew;
    const payload = { ...editingVoyage, id: editingVoyage.slug, coverImage: editingVoyage.heroImage, date: editingVoyage.startDate };
    try {
      const r = await fetch('/api/admin/voyages', { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const d = await r.json();
      if (d.success) { toast(isNew ? 'Voyage créé ! Rebuild...' : 'Voyage modifié ! Rebuild...'); setEditingVoyage(null); setTimeout(loadVoyages, 1000); }
      else toast('Erreur: ' + (d.error || ''), 'err');
    } catch (e) { toast('Erreur réseau', 'err'); }
    setSavingVoyage(false);
  };

  const deleteVoyage = async slug => {
    setConfirm(null);
    try {
      const r = await fetch('/api/admin/voyages?id=' + slug, { method: 'DELETE' });
      const d = await r.json();
      if (d.success) { toast('Supprimé ! Rebuild...'); setVoyages(prev => prev.filter(v => (v.slug || v.id) !== slug)); }
      else toast('Erreur: ' + (d.error || ''), 'err');
    } catch (e) { toast('Erreur réseau', 'err'); }
  };

  const togglePublish = async v => {
    const updated = { ...v, slug: v.slug || v.id, id: v.slug || v.id, coverImage: v.heroImage, date: v.startDate, published: !v.published };
    try {
      const r = await fetch('/api/admin/voyages', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
      const d = await r.json();
      if (d.success) { setVoyages(prev => prev.map(x => (x.slug || x.id) === (v.slug || v.id) ? { ...x, published: !x.published } : x)); toast(!v.published ? 'Publié !' : 'Dépublié'); }
    } catch (e) { toast('Erreur', 'err'); }
  };

  const saveHp = async () => {
    setHpSaving(true);
    try {
      const r = await fetch('/api/admin/homepage', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ config: hp }) });
      const d = await r.json();
      if (d.success) toast("Page d'accueil sauvegardée ! Rebuild...");
      else toast('Erreur: ' + (d.error || ''), 'err');
    } catch (e) { toast('Erreur réseau', 'err'); }
    setHpSaving(false);
  };

  const updHp = (section, key, val) => setHp(prev => ({ ...prev, [section]: { ...prev[section], [key]: val } }));

  const doBulkUpload = async files => {
    setBulkUploading(true);
    const results = [];
    for (const file of Array.from(files)) {
      try { const url = await uploadFile(file); results.push({ name: file.name, url, status: 'done' }); }
      catch (e) { results.push({ name: file.name, url: '', status: 'error' }); }
      setUploadFiles([...results]);
    }
    setBulkUploading(false);
    toast(results.filter(r => r.status === 'done').length + ' image(s) uploadée(s) !');
  };

  const openEdit = v => setEditingVoyage({ ...v, slug: v.slug || v.id, id: v.slug || v.id, isNew: false, heroImage: v.heroImage || v.coverImage || '' });
  const openNew = () => setEditingVoyage({ isNew: true, slug: '', title: '', country: '', city: '', startDate: '', description: '', heroImage: '', coverImage: '', photos: [], tags: [], lat: null, lng: null, published: true, waypoints: [] });

  /* ─── LOGIN ─── */
  if (!auth) return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '20px', padding: '52px', width: '400px', textAlign: 'center' }}>
        <div style={{ fontSize: '30px', fontWeight: '200', color: '#f5f0e8', letterSpacing: '.12em', marginBottom: '6px', fontFamily: 'Georgia,serif' }}>Photos du Monde</div>
        <div style={{ color: G, fontSize: '11px', letterSpacing: '.35em', marginBottom: '44px', fontWeight: '600' }}>ADMINISTRATION</div>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="Mot de passe"
          style={{ ...inp, marginBottom: '12px', fontSize: '16px', padding: '14px 18px', textAlign: 'center' }} />
        {loginErr && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{loginErr}</div>}
        <button onClick={login} disabled={loginLoading}
          style={{ width: '100%', padding: '14px', background: loginLoading ? '#333' : GB, border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', letterSpacing: '.2em', cursor: 'pointer', fontWeight: '600' }}>
          {loginLoading ? 'CONNEXION...' : 'SE CONNECTER'}
        </button>
      </div>
    </div>
  );

  /* ─── SHELL ─── */
  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#f5f0e8', fontFamily: 'system-ui,sans-serif' }}>

      {/* Toast */}
      {notif && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 99998, padding: '14px 22px', borderRadius: '10px', fontSize: '14px', maxWidth: '420px', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,.6)', background: notif.type === 'err' ? '#7f1d1d' : notif.type === 'info' ? '#1e3a5f' : '#1a3320', border: '1px solid ' + (notif.type === 'err' ? '#dc2626' : notif.type === 'info' ? '#3b82f6' : '#22c55e') }}>
          {notif.msg}
        </div>
      )}

      {/* Confirm delete */}
      {confirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.88)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '40px', width: '420px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', marginBottom: '10px' }}>Supprimer ce voyage ?</div>
            <div style={{ color: '#666', fontSize: '14px', marginBottom: '28px' }}>Cette action est irréversible.</div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Btn variant="ghost" onClick={() => setConfirm(null)}>Annuler</Btn>
              <Btn variant="danger" onClick={() => deleteVoyage(confirm.slug)}>Supprimer</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && <Lightbox photos={lightbox.photos} index={lightbox.index} onClose={() => setLightbox(null)} />}

      {/* Voyage editor modal */}
      {editingVoyage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.92)', zIndex: 9000, overflow: 'auto', padding: '20px' }}>
          <div style={{ background: '#0f0f0f', border: '1px solid #222', borderRadius: '16px', maxWidth: '780px', margin: '0 auto', padding: '40px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <div style={{ color: G, fontSize: '11px', letterSpacing: '.25em', marginBottom: '4px' }}>{editingVoyage.isNew ? 'NOUVEAU VOYAGE' : 'MODIFIER LE VOYAGE'}</div>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '300', fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>{editingVoyage.title || 'Sans titre'}</h2>
              </div>
              <button onClick={() => setEditingVoyage(null)} style={{ background: 'none', border: '1px solid #333', borderRadius: '8px', color: '#aaa', cursor: 'pointer', width: '36px', height: '36px', fontSize: '20px' }}>&#215;</button>
            </div>

            {/* Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Titre *">
                <Inp value={editingVoyage.title} onChange={v => setEditingVoyage(p => ({ ...p, title: v }))} placeholder="Costa Rica — Forêt tropicale"
                  style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', fontSize: '16px' }} />
              </Field>
              {editingVoyage.isNew && (
                <Field label="Slug URL *">
                  <Inp value={editingVoyage.slug} onChange={v => setEditingVoyage(p => ({ ...p, slug: v.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))} placeholder="costa-rica-2024" />
                </Field>
              )}
              <Field label="Pays">
                <Inp value={editingVoyage.country} onChange={v => setEditingVoyage(p => ({ ...p, country: v }))} placeholder="Costa Rica" />
              </Field>
              <Field label="Ville / Région">
                <Inp value={editingVoyage.city} onChange={v => setEditingVoyage(p => ({ ...p, city: v }))} placeholder="San José, Monteverde" />
              </Field>
              <Field label="Date">
                <Inp value={editingVoyage.startDate || editingVoyage.date || ''} onChange={v => setEditingVoyage(p => ({ ...p, startDate: v, date: v }))} placeholder="2024-03" />
              </Field>

              <Field label="Latitude (centre carte)">
                <Inp value={editingVoyage.lat != null ? String(editingVoyage.lat) : ''} onChange={v => setEditingVoyage(p => ({ ...p, lat: parseFloat(v) || null }))} placeholder="9.7489" />
              </Field>
              <Field label="Longitude (centre carte)">
                <Inp value={editingVoyage.lng != null ? String(editingVoyage.lng) : ''} onChange={v => setEditingVoyage(p => ({ ...p, lng: parseFloat(v) || null }))} placeholder="-83.7534" />
              </Field>
            </div>

            {/* Waypoints */}
            <div style={{ marginTop: '20px', padding: '20px', background: '#0d0d0d', borderRadius: '10px', border: '1px solid #1e1e1e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <label style={lbl}>ÉTAPES DE L'ITINÉRAIRE ({(editingVoyage.waypoints||[]).length})</label>
                <button onClick={() => setEditingVoyage(p => ({ ...p, waypoints: [...(p.waypoints||[]), { lat: '', lng: '', label: '', day: '' }] }))}
                  style={{ padding: '5px 14px', background: 'rgba(196,150,42,.1)', border: '1px solid ' + G, borderRadius: '6px', color: G, cursor: 'pointer', fontSize: '12px' }}>
                  + Ajouter une étape
                </button>
              </div>
              {(editingVoyage.waypoints||[]).length === 0 && (
                <div style={{ color: '#444', fontSize: '13px', textAlign: 'center', padding: '16px' }}>
                  Ajoutez des étapes pour tracer l'itinéraire sur la carte du voyage
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(editingVoyage.waypoints||[]).map((wp, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 100px 100px 60px 28px', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#1a1a1a', border: '1px solid ' + G, display: 'flex', alignItems: 'center', justifyContent: 'center', color: G, fontSize: '10px', fontWeight: '700', flexShrink: 0 }}>{i+1}</div>
                    <input value={wp.label||''} onChange={e => setEditingVoyage(p => { const w=[...p.waypoints]; w[i]={...w[i],label:e.target.value}; return {...p,waypoints:w}; })}
                      placeholder="Nom du lieu (ex: San José)" style={{ ...inp, fontSize: '13px', padding: '8px 12px' }} />
                    <input value={wp.lat||''} onChange={e => setEditingVoyage(p => { const w=[...p.waypoints]; w[i]={...w[i],lat:e.target.value}; return {...p,waypoints:w}; })}
                      placeholder="Latitude" style={{ ...inp, fontSize: '12px', padding: '8px 10px' }} />
                    <input value={wp.lng||''} onChange={e => setEditingVoyage(p => { const w=[...p.waypoints]; w[i]={...w[i],lng:e.target.value}; return {...p,waypoints:w}; })}
                      placeholder="Longitude" style={{ ...inp, fontSize: '12px', padding: '8px 10px' }} />
                    <input value={wp.day||''} onChange={e => setEditingVoyage(p => { const w=[...p.waypoints]; w[i]={...w[i],day:e.target.value}; return {...p,waypoints:w}; })}
                      placeholder="Jour" style={{ ...inp, fontSize: '12px', padding: '8px 8px', textAlign: 'center' }} />
                    <button onClick={() => setEditingVoyage(p => ({ ...p, waypoints: p.waypoints.filter((_,j)=>j!==i) }))}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '18px', padding: '4px' }}>&#215;</button>
                  </div>
                ))}
              </div>
              <p style={{ color: '#444', fontSize: '11px', marginTop: '12px' }}>
                💡 Trouvez les coordonnées sur <a href="https://www.latlong.net" target="_blank" style={{ color: G }}>latlong.net</a> — cliquez sur la carte pour copier lat/lng
              </p>
            </div>

            <div style={{ marginTop: '16px' }}>
              <Field label="Description complète">
                <Inp value={editingVoyage.description} onChange={v => setEditingVoyage(p => ({ ...p, description: v }))} multiline rows={4} placeholder="Décrivez ce voyage..." />
              </Field>
            </div>

            {/* Hero image */}
            <div style={{ marginTop: '16px' }}>
              <Field label="Image principale (hero)">
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Inp value={editingVoyage.heroImage || editingVoyage.coverImage || ''} onChange={v => setEditingVoyage(p => ({ ...p, heroImage: v, coverImage: v }))} placeholder="URL ou uploader →" />
                  <label style={{ padding: '11px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: G, cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>
                    &#8679; Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                      const f = e.target.files[0];
                      if (!f) return;
                      toast('Upload...', 'info');
                      try { const url = await uploadFile(f); setEditingVoyage(p => ({ ...p, heroImage: url, coverImage: url })); toast('Image uploadée !'); }
                      catch (er) { toast('Erreur upload', 'err'); }
                    }} />
                  </label>
                </div>
                {(editingVoyage.heroImage || editingVoyage.coverImage) && (
                  <div style={{ position: 'relative', marginTop: '10px', borderRadius: '8px', overflow: 'hidden', height: '160px' }}>
                    <img src={editingVoyage.heroImage || editingVoyage.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                      onClick={() => setLightbox({ photos: [{ src: editingVoyage.heroImage || editingVoyage.coverImage }], index: 0 })} />
                    <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px' }}>
                      <button onClick={() => setLightbox({ photos: [{ src: editingVoyage.heroImage || editingVoyage.coverImage }], index: 0 })}
                        style={{ background: 'rgba(0,0,0,.7)', border: 'none', color: '#fff', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>&#128269; Zoom</button>
                      <button onClick={() => setEditingVoyage(p => ({ ...p, heroImage: '', coverImage: '' }))}
                        style={{ background: 'rgba(0,0,0,.7)', border: 'none', color: '#f87171', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>&#215; Supprimer</button>
                    </div>
                  </div>
                )}
              </Field>
            </div>

            {/* Photos */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={lbl}>PHOTOS ({(editingVoyage.photos || []).length})</label>
                {(editingVoyage.photos || []).length > 0 && (
                  <button onClick={() => setLightbox({ photos: editingVoyage.photos, index: 0 })}
                    style={{ background: 'none', border: '1px solid #333', borderRadius: '6px', color: '#aaa', cursor: 'pointer', fontSize: '12px', padding: '4px 12px' }}>
                    &#128269; Aperçu galerie
                  </button>
                )}
              </div>
              <PhotoGrid photos={editingVoyage.photos || []} onChange={photos => setEditingVoyage(p => ({ ...p, photos }))} onZoom={i => setLightbox({ photos: editingVoyage.photos, index: i })} />
            </div>

            {/* Publish toggle */}
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: '#0d0d0d', borderRadius: '8px', border: '1px solid #222' }}>
              <div onClick={() => setEditingVoyage(p => ({ ...p, published: !p.published }))}
                style={{ width: '44px', height: '24px', borderRadius: '12px', background: editingVoyage.published ? G : '#333', cursor: 'pointer', position: 'relative', transition: '.2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: '3px', left: editingVoyage.published ? '22px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: '.2s' }} />
              </div>
              <div>
                <div style={{ fontSize: '14px', color: editingVoyage.published ? '#4ade80' : '#f87171', fontWeight: '600' }}>{editingVoyage.published ? 'Publié — visible sur le site' : 'Brouillon — masqué du site'}</div>
                <div style={{ fontSize: '12px', color: '#444' }}>Chaque modification déclenche un rebuild Vercel (~2 min)</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '28px' }}>
              <Btn variant="ghost" onClick={() => setEditingVoyage(null)}>Annuler</Btn>
              <Btn onClick={saveVoyage} disabled={savingVoyage}>{savingVoyage ? 'ENREGISTREMENT...' : '✓ ENREGISTRER'}</Btn>
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '58px', position: 'sticky', top: 0, background: 'rgba(8,8,8,.95)', zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: G }} />
          <span style={{ fontSize: '14px', fontWeight: '300', letterSpacing: '.15em', fontFamily: 'Georgia,serif' }}>Photos du Monde</span>
          <span style={{ color: '#333' }}>/</span>
          <span style={{ color: G, fontSize: '11px', letterSpacing: '.2em' }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href="/" target="_blank" style={{ color: '#555', fontSize: '13px', textDecoration: 'none', padding: '6px 14px', border: '1px solid #222', borderRadius: '6px' }}>Voir le site &#8599;</a>
          <button onClick={logout} style={{ background: 'none', border: '1px solid #222', borderRadius: '6px', color: '#555', cursor: 'pointer', padding: '6px 14px', fontSize: '13px' }}>Déconnexion</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '0 32px', display: 'flex', overflowX: 'auto' }}>
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            style={{ padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', letterSpacing: '.2em', fontWeight: '600', color: tab === i ? G : '#ffffff', fontWeight: 700, borderBottom: tab === i ? '2px solid ' + G : '2px solid transparent', whiteSpace: 'nowrap', transition: '.2s' }}>
            {t}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 32px' }}>

        {/* ═══ DASHBOARD ═══ */}
        {tab === 0 && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '200', fontFamily: 'Georgia,serif', fontStyle: 'italic', margin: '0 0 6px' }}>Tableau de bord</h1>
            <p style={{ color: '#555', fontSize: '13px', marginBottom: '28px' }}>Vue d'ensemble — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px', marginBottom: '28px' }}>
              {[
                { label: 'Voyages publiés', val: voyages.filter(v => v.published !== false).length, c: '#4ade80' },
                { label: 'Brouillons', val: voyages.filter(v => v.published === false).length, c: '#facc15' },
                { label: 'Total photos', val: voyages.reduce((a, v) => a + (v.photos ? v.photos.length : 0), 0), c: G },
                { label: 'Total voyages', val: voyages.length, c: '#a78bfa' },
              ].map(s => (
                <div key={s.label} style={{ ...cardSt, textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '38px', fontWeight: '200', color: s.c, fontFamily: 'Georgia,serif' }}>{s.val}</div>
                  <div style={{ color: '#555', fontSize: '11px', letterSpacing: '.15em', marginTop: '4px', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={cardSt}>
              <h3 style={{ margin: '0 0 16px', color: G, fontSize: '11px', letterSpacing: '.2em' }}>ACCÈS RAPIDE</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Btn onClick={openNew}>+ Nouveau voyage</Btn>
                <Btn variant="ghost" onClick={() => setTab(2)}>Modifier la homepage</Btn>
                <Btn variant="ghost" onClick={() => setTab(4)}>Uploader des photos</Btn>
              </div>
            </div>
          </div>
        )}

        {/* ═══ VOYAGES ═══ */}
        {tab === 1 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: '200', fontFamily: 'Georgia,serif', fontStyle: 'italic', margin: '0 0 4px' }}>Mes Voyages</h1>
                <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>{voyages.length} voyage{voyages.length !== 1 ? 's' : ''}</p>
              </div>
              <Btn onClick={openNew}>+ AJOUTER</Btn>
            </div>
            {voyLoading ? (
              <div style={{ textAlign: 'center', color: '#444', padding: '60px' }}>Chargement...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {voyages.map(v => {
                  const slug = v.slug || v.id;
                  const img = v.heroImage || v.coverImage || (v.photos && v.photos[0] && (typeof v.photos[0] === 'string' ? v.photos[0] : v.photos[0].src));
                  const pub = v.published !== false;
                  return (
                    <div key={slug} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '72px', height: '50px', borderRadius: '6px', overflow: 'hidden', background: '#0d0d0d', flexShrink: 0, cursor: img ? 'zoom-in' : 'default' }}
                        onClick={() => img && setLightbox({ photos: [{ src: img }], index: 0 })}>
                        {img ? <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '20px' }}>&#128247;</div>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '15px', fontWeight: '500', fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>{v.title || 'Sans titre'}</span>
                          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: pub ? '#1a3320' : '#2a1a1a', color: pub ? '#4ade80' : '#f87171', border: '1px solid ' + (pub ? '#166534' : '#7f1d1d'), letterSpacing: '.1em' }}>{pub ? 'PUBLIÉ' : 'BROUILLON'}</span>
                        </div>
                        <div style={{ color: '#555', fontSize: '12px' }}>{[v.country, v.city, v.startDate || v.date].filter(Boolean).join(' · ')}{v.photos && v.photos.length ? ' · ' + v.photos.length + ' photos' : ''}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '7px', flexShrink: 0 }}>
                        <a href={'/voyages/' + slug} target="_blank" style={{ padding: '7px 12px', background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#666', textDecoration: 'none', fontSize: '12px' }}>&#8599;</a>
                        <button onClick={() => togglePublish(v)} style={{ padding: '7px 12px', background: '#0d0d0d', border: '1px solid ' + (pub ? '#166534' : '#7f1d1d'), borderRadius: '6px', color: pub ? '#4ade80' : '#f87171', cursor: 'pointer', fontSize: '11px', letterSpacing: '.1em' }}>{pub ? 'DÉPUBL.' : 'PUBLIER'}</button>
                        <button onClick={() => openEdit(v)} style={{ padding: '7px 14px', background: 'rgba(196,150,42,.1)', border: '1px solid ' + G, borderRadius: '6px', color: G, cursor: 'pointer', fontSize: '12px', fontWeight: '600', letterSpacing: '.08em' }}>&#9998; MODIFIER</button>
                        <button onClick={() => setConfirm({ slug })} style={{ padding: '7px 11px', background: '#1a0a0a', border: '1px solid #7f1d1d', borderRadius: '6px', color: '#ef4444', cursor: 'pointer' }}>&#128465;</button>
                      </div>
                    </div>
                  );
                })}
                {!voyages.length && (
                  <div style={{ textAlign: 'center', color: '#333', padding: '60px', border: '2px dashed #1a1a1a', borderRadius: '12px' }}>
                    Aucun voyage — cliquez sur "+ AJOUTER" pour commencer
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══ PAGE D'ACCUEIL ═══ */}
        {tab === 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: '200', fontFamily: 'Georgia,serif', fontStyle: 'italic', margin: '0 0 4px' }}>Page d'accueil</h1>
                <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>Chaque sauvegarde publie sur le site en ~2 min</p>
              </div>
              {hp && <Btn onClick={saveHp} disabled={hpSaving}>{hpSaving ? 'PUBLICATION...' : '✓ SAUVEGARDER ET PUBLIER'}</Btn>}
            </div>
            {!hp ? (
              <div style={{ textAlign: 'center', color: '#444', padding: '60px' }}>Chargement... <button onClick={loadHp} style={{ marginLeft: '12px', padding: '8px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer' }}>Recharger</button></div>
            ) : (
              <div style={{ display: 'grid', gap: '18px' }}>

                {/* Hero */}
                <div style={cardSt}>
                  <h3 style={{ margin: '0 0 18px', color: G, fontSize: '11px', letterSpacing: '.22em', fontWeight: '700' }}>SECTION HERO (PLEIN ÉCRAN)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <Field label="Titre principal">
                      <Inp value={hp.hero && hp.hero.title || ''} onChange={v => updHp('hero', 'title', v)} placeholder="Explorer le monde" style={{ fontFamily: 'Georgia,serif', fontSize: '16px' }} />
                    </Field>
                    <Field label="Titre italique">
                      <Inp value={hp.hero && hp.hero.italicTitle || ''} onChange={v => updHp('hero', 'italicTitle', v)} placeholder="à travers l'objectif." style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', fontSize: '16px' }} />
                    </Field>
                    <Field label="Tagline">
                      <Inp value={hp.hero && hp.hero.tagline || ''} onChange={v => updHp('hero', 'tagline', v)} placeholder="VOYAGES · NATURE · PHOTOGRAPHIE" />
                    </Field>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <Field label="Bouton 1"><Inp value={hp.hero && hp.hero.cta1 || ''} onChange={v => updHp('hero', 'cta1', v)} placeholder="VOIR LES VOYAGES" /></Field>
                      <Field label="Bouton 2"><Inp value={hp.hero && hp.hero.cta2 || ''} onChange={v => updHp('hero', 'cta2', v)} placeholder="GALERIE" /></Field>
                    </div>
                  </div>
                  <div style={{ marginTop: '14px' }}>
                    <label style={lbl}>4 PHOTOS DE FOND (DIAPORAMA)</label>
                    <p style={{ color: '#555', fontSize: '12px', marginBottom: '14px' }}>Ces 4 photos défilent en boucle dans le hero. Cliquez sur ⬆ pour uploader ou collez une URL Cloudinary.</p>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {[0,1,2,3].map(i => {
                        const slide = (hp.hero?.slides || [])[i] || { image:'', country:'', caption:'' };
                        const handleSlideDragStart = (e) => { e.dataTransfer.setData('slideIndex', String(i)); };
                        const handleSlideDrop = (e) => {
                          e.preventDefault();
                          const from = parseInt(e.dataTransfer.getData('slideIndex'));
                          const to = i;
                          if (from === to) return;
                          const slides = [...(hp.hero?.slides || [{},{},{},{}])];
                          const [moved] = slides.splice(from, 1);
                          slides.splice(to, 0, moved);
                          updHp('hero', 'slides', slides);
                        };
                        return (
                          <div key={i} draggable
                            onDragStart={handleSlideDragStart}
                            onDrop={handleSlideDrop}
                            onDragOver={e => e.preventDefault()}
                            style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '14px', display: 'grid', gridTemplateColumns: slide.image ? '120px 1fr' : '1fr', gap: '14px', alignItems: 'center', cursor: 'grab' }}>
                            {slide.image && (
                              <div style={{ position: 'relative', height: '68px', borderRadius: '6px', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setLightbox({ photos:[{src:slide.image}], index:0 })}>
                                <img src={slide.image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                                <div style={{ position:'absolute', top:'4px', left:'6px', background:'rgba(0,0,0,.7)', color:G, fontSize:'10px', fontWeight:'700', padding:'2px 7px', borderRadius:'3px' }}>Slide {i+1}</div>
                              </div>
                            )}
                            {!slide.image && (
                              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                                <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'#1a1a1a', border:'1px solid #2a2a2a', display:'flex', alignItems:'center', justifyContent:'center', color:'#555', fontSize:'13px', fontWeight:'700', flexShrink:0 }}>{i+1}</div>
                              </div>
                            )}
                            <div style={{ display:'grid', gap:'8px' }}>
                              <div style={{ display:'flex', gap:'8px' }}>
                                <input value={slide.image||''} onChange={e => { const s=[...((hp.hero?.slides)||[{},{},{},{}])]; s[i]={...s[i],image:e.target.value}; updHp('hero','slides',s); }}
                                  placeholder="URL de l'image" style={{ ...inp, fontSize:'12px', padding:'7px 10px', flex:1 }} />
                                <label style={{ padding:'7px 12px', background:'#1a1a1a', border:'1px solid #333', borderRadius:'6px', color:G, cursor:'pointer', fontSize:'12px', whiteSpace:'nowrap', display:'flex', alignItems:'center' }}>
                                  &#8679;
                                  <input type="file" accept="image/*" style={{ display:'none' }} onChange={async e => {
                                    const f=e.target.files[0]; if(!f) return;
                                    toast('Upload slide '+(i+1)+'...','info');
                                    try {
                                      const url = await uploadFile(f);
                                      const s=[...((hp.hero?.slides)||[{},{},{},{}])];
                                      s[i]={...s[i],image:url};
                                      updHp('hero','slides',s);
                                      toast('Slide '+(i+1)+' uploadé !');
                                    } catch(er){ toast('Erreur upload','err'); }
                                  }} />
                                </label>
                                {slide.image && <button onClick={() => { const s=[...((hp.hero?.slides)||[{},{},{},{}])]; s[i]={...s[i],image:''}; updHp('hero','slides',s); }} style={{ padding:'7px 10px', background:'none', border:'1px solid #7f1d1d', borderRadius:'6px', color:'#f87171', cursor:'pointer', fontSize:'12px' }}>&#215;</button>}
                              </div>
                              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                                <input value={slide.country||''} onChange={e => { const s=[...((hp.hero?.slides)||[{},{},{},{}])]; s[i]={...s[i],country:e.target.value}; updHp('hero','slides',s); }}
                                  placeholder="Pays (ex: Costa Rica)" style={{ ...inp, fontSize:'12px', padding:'7px 10px' }} />
                                <input value={slide.caption||''} onChange={e => { const s=[...((hp.hero?.slides)||[{},{},{},{}])]; s[i]={...s[i],caption:e.target.value}; updHp('hero','slides',s); }}
                                  placeholder="Légende (ex: Volcan Arenal)" style={{ ...inp, fontSize:'12px', padding:'7px 10px' }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* À propos */}
                <div style={cardSt}>
                  <h3 style={{ margin: '0 0 18px', color: G, fontSize: '11px', letterSpacing: '.22em', fontWeight: '700' }}>SECTION À PROPOS</h3>
                  <Field label="Texte de présentation">
                    <Inp value={hp.about && hp.about.intro || ''} onChange={v => updHp('about', 'intro', v)} multiline rows={4} placeholder="Photographe voyageur..." />
                  </Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '14px' }}>
                    <Field label="&#127758; Pays visités"><Inp value={String(hp.about && hp.about.countries || '')} onChange={v => updHp('about', 'countries', parseInt(v) || 0)} placeholder="32" /></Field>
                    <Field label="&#128247; Photos prises"><Inp value={String(hp.about && hp.about.photos || '')} onChange={v => updHp('about', 'photos', parseInt(v) || 0)} placeholder="4800" /></Field>
                    <Field label="&#128197; Années exp."><Inp value={String(hp.about && hp.about.years || '')} onChange={v => updHp('about', 'years', parseInt(v) || 0)} placeholder="8" /></Field>
                  </div>
                </div>

                {/* SEO */}
                <div style={cardSt}>
                  <h3 style={{ margin: '0 0 18px', color: G, fontSize: '11px', letterSpacing: '.22em', fontWeight: '700' }}>SEO & MÉTA DONNÉES</h3>
                  <div style={{ display: 'grid', gap: '14px' }}>
                    <Field label="Titre de la page"><Inp value={hp.seo && hp.seo.title || ''} onChange={v => updHp('seo', 'title', v)} /></Field>
                    <Field label="Meta description (160 car. max)"><Inp value={hp.seo && hp.seo.description || ''} onChange={v => updHp('seo', 'description', v)} multiline rows={2} /></Field>
                    <Field label="Mots-clés"><Inp value={hp.seo && hp.seo.keywords || ''} onChange={v => updHp('seo', 'keywords', v)} placeholder="photographie, voyage, nature" /></Field>
                  </div>
                </div>

                {/* Footer */}
                <div style={cardSt}>
                  <h3 style={{ margin: '0 0 18px', color: G, fontSize: '11px', letterSpacing: '.22em', fontWeight: '700' }}>FOOTER & RÉSEAUX SOCIAUX</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <Field label="Instagram URL"><Inp value={hp.footer && hp.footer.instagram || ''} onChange={v => updHp('footer', 'instagram', v)} placeholder="https://instagram.com/..." /></Field>
                    <Field label="Email contact"><Inp value={hp.footer && hp.footer.email || ''} onChange={v => updHp('footer', 'email', v)} placeholder="contact@photosdumonde.fr" /></Field>
                    <Field label="Description footer"><Inp value={hp.footer && hp.footer.description || ''} onChange={v => updHp('footer', 'description', v)} /></Field>
                    <Field label="Citation footer"><Inp value={hp.footer && hp.footer.quote || ''} onChange={v => updHp('footer', 'quote', v)} /></Field>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Btn onClick={saveHp} disabled={hpSaving} style={{ padding: '14px 40px' }}>{hpSaving ? 'PUBLICATION EN COURS...' : '✓ SAUVEGARDER ET PUBLIER'}</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ À PROPOS ═══ */}
        {tab === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: '200', fontFamily: 'Georgia,serif', fontStyle: 'italic', margin: '0 0 4px' }}>Page À propos</h1>
                <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>Modifiez votre présentation et votre photo de profil</p>
              </div>
              {hp && <Btn onClick={saveHp} disabled={hpSaving}>{hpSaving ? 'PUBLICATION...' : '✓ SAUVEGARDER ET PUBLIER'}</Btn>}
            </div>
            {!hp ? (
              <div style={{ textAlign: 'center', color: '#444', padding: '60px' }}>Chargement... <button onClick={loadHp} style={{ marginLeft: '12px', padding: '8px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer' }}>Recharger</button></div>
            ) : (
              <div style={{ display: 'grid', gap: '18px' }}>

                {/* Photo de profil */}
                <div style={cardSt}>
                  <h3 style={{ margin: '0 0 18px', color: G, fontSize: '11px', letterSpacing: '.22em', fontWeight: '700' }}>VOTRE PHOTO</h3>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    {/* Preview */}
                    <div style={{ width: '120px', height: '160px', borderRadius: '6px', overflow: 'hidden', background: '#0d0d0d', border: '1px solid #2a2a2a', flexShrink: 0, cursor: (hp.about?.photo) ? 'zoom-in' : 'default' }}
                      onClick={() => hp.about?.photo && setLightbox({ photos: [{ src: hp.about.photo }], index: 0 })}>
                      {hp.about?.photo
                        ? <img src={hp.about.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '30px' }}>&#128247;</div>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <Field label="URL ou uploader une photo">
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <Inp value={hp.about?.photo || ''} onChange={v => updHp('about', 'photo', v)} placeholder="URL Cloudinary de votre photo" />
                          <label style={{ padding: '11px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: G, cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>
                            &#8679; Upload
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                              const f = e.target.files[0]; if (!f) return;
                              toast('Upload photo...', 'info');
                              try { const url = await uploadFile(f); updHp('about', 'photo', url); toast('Photo uploadée !'); }
                              catch (er) { toast('Erreur upload', 'err'); }
                            }} />
                          </label>
                        </div>
                      </Field>
                      {hp.about?.photo && (
                        <button onClick={() => updHp('about', 'photo', '')}
                          style={{ marginTop: '8px', padding: '6px 14px', background: 'none', border: '1px solid #7f1d1d', borderRadius: '6px', color: '#f87171', cursor: 'pointer', fontSize: '12px' }}>
                          &#215; Supprimer la photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Textes */}
                <div style={cardSt}>
                  <h3 style={{ margin: '0 0 18px', color: G, fontSize: '11px', letterSpacing: '.22em', fontWeight: '700' }}>PRÉSENTATION</h3>
                  <div style={{ display: 'grid', gap: '14px' }}>
                    <Field label="Texte d'introduction (accroche)">
                      <Inp value={hp.about?.intro || ''} onChange={v => updHp('about', 'intro', v)} multiline rows={3} placeholder="Photographe voyageur, je capture..." />
                    </Field>
                    <Field label="Philosophie (paragraphe 1)">
                      <Inp value={hp.about?.philosophy || ''} onChange={v => updHp('about', 'philosophy', v)} multiline rows={3} placeholder="Chaque voyage est une immersion totale..." />
                    </Field>
                    <Field label="Philosophie (paragraphe 2)">
                      <Inp value={hp.about?.philosophy2 || ''} onChange={v => updHp('about', 'philosophy2', v)} multiline rows={3} placeholder="Les meilleurs clichés naissent..." />
                    </Field>
                  </div>
                </div>

                {/* Stats */}
                <div style={cardSt}>
                  <h3 style={{ margin: '0 0 18px', color: G, fontSize: '11px', letterSpacing: '.22em', fontWeight: '700' }}>STATISTIQUES</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <Field label="&#127758; Pays visités"><Inp value={String(hp.about?.countries || '')} onChange={v => updHp('about', 'countries', parseInt(v) || 0)} placeholder="32" /></Field>
                    <Field label="&#128247; Photos prises"><Inp value={String(hp.about?.photos || '')} onChange={v => updHp('about', 'photos', parseInt(v) || 0)} placeholder="4800" /></Field>
                    <Field label="&#128197; Années d'exp."><Inp value={String(hp.about?.years || '')} onChange={v => updHp('about', 'years', parseInt(v) || 0)} placeholder="8" /></Field>
                  </div>
                </div>

                {/* Équipement */}
                <div style={cardSt}>
                  <h3 style={{ margin: '0 0 18px', color: G, fontSize: '11px', letterSpacing: '.22em', fontWeight: '700' }}>ÉQUIPEMENT (séparés par virgules)</h3>
                  <Inp value={hp.about?.equipment || ''} onChange={v => updHp('about', 'equipment', v)} placeholder="Sony A7R V, 200-600mm f/5.6, Trépied Gitzo" />
                </div>

                {/* Destinations favorites */}
                <div style={cardSt}>
                  <h3 style={{ margin: '0 0 18px', color: G, fontSize: '11px', letterSpacing: '.22em', fontWeight: '700' }}>DESTINATIONS FAVORITES</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                    {(hp.about?.favorites || []).map((fav, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: '8px', alignItems: 'center' }}>
                        <input value={fav.name || ''} onChange={e => { const f=[...(hp.about?.favorites||[])]; f[i]={...f[i],name:e.target.value}; updHp('about','favorites',f); }}
                          placeholder="Costa Rica" style={{ ...inp, fontSize:'13px', padding:'8px 12px' }} />
                        <input value={fav.desc || ''} onChange={e => { const f=[...(hp.about?.favorites||[])]; f[i]={...f[i],desc:e.target.value}; updHp('about','favorites',f); }}
                          placeholder="Description courte" style={{ ...inp, fontSize:'13px', padding:'8px 12px' }} />
                        <button onClick={() => { const f=(hp.about?.favorites||[]).filter((_,j)=>j!==i); updHp('about','favorites',f); }}
                          style={{ background:'none', border:'none', color:'#f87171', cursor:'pointer', fontSize:'18px', padding:'4px' }}>&#215;</button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { const f=[...(hp.about?.favorites||[]),{name:'',desc:''}]; updHp('about','favorites',f); }}
                    style={{ padding:'7px 16px', background:'rgba(196,150,42,.1)', border:'1px solid '+G, borderRadius:'6px', color:G, cursor:'pointer', fontSize:'12px' }}>
                    + Ajouter une destination
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Btn onClick={saveHp} disabled={hpSaving} style={{ padding: '14px 40px' }}>{hpSaving ? 'PUBLICATION EN COURS...' : '✓ SAUVEGARDER ET PUBLIER'}</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ GALERIE ═══ */}
        {tab === 4 && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '200', fontFamily: 'Georgia,serif', fontStyle: 'italic', margin: '0 0 6px' }}>Galerie</h1>
            <p style={{ color: '#555', fontSize: '13px', marginBottom: '28px' }}>Toutes les photos — cliquez pour zoomer</p>
            {voyages.map(v => {
              const photos = v.photos || [];
              if (!photos.length) return null;
              return (
                <div key={v.slug || v.id} style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '4px', height: '20px', background: GB, borderRadius: '2px' }} />
                    <h3 style={{ margin: 0, fontSize: '15px', fontFamily: 'Georgia,serif', fontStyle: 'italic', fontWeight: '400' }}>{v.title}</h3>
                    <span style={{ color: '#444', fontSize: '12px' }}>{photos.length} photo{photos.length !== 1 ? 's' : ''}</span>
                    <button onClick={() => openEdit(v)} style={{ marginLeft: 'auto', padding: '5px 14px', background: 'rgba(196,150,42,.1)', border: '1px solid ' + G, borderRadius: '6px', color: G, cursor: 'pointer', fontSize: '12px' }}>&#9998; Modifier</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: '8px' }}>
                    {photos.map((p, i) => {
                      const src = typeof p === 'string' ? p : p.src;
                      return (
                        <div key={i} onClick={() => setLightbox({ photos, index: i })}
                          style={{ aspectRatio: '1', borderRadius: '6px', overflow: 'hidden', cursor: 'zoom-in', position: 'relative', background: '#111' }}>
                          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }}
                            onMouseEnter={e => e.target.style.transform = 'scale(1.06)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                          <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '3px' }}>&#128269;</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {voyages.every(v => !v.photos || !v.photos.length) && <div style={{ textAlign: 'center', color: '#333', padding: '60px', border: '2px dashed #1a1a1a', borderRadius: '12px' }}>Aucune photo — ajoutez des photos depuis l'onglet Voyages</div>}
          </div>
        )}

        {/* ═══ PARAMÈTRES ═══ */}
        {tab === 5 && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '200', fontFamily: 'Georgia,serif', fontStyle: 'italic', margin: '0 0 28px' }}>Paramètres</h1>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={cardSt}>
                <h3 style={{ margin: '0 0 14px', color: G, fontSize: '11px', letterSpacing: '.2em' }}>FONCTIONNEMENT</h3>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.9', margin: 0 }}>Chaque modification écrit dans <span style={{ color: '#ccc' }}>GitHub</span> et déclenche un rebuild automatique <span style={{ color: '#ccc' }}>Vercel</span>. En ligne en <span style={{ color: G }}>1-2 minutes</span>.</p>
              </div>
              <div style={cardSt}>
                <h3 style={{ margin: '0 0 14px', color: G, fontSize: '11px', letterSpacing: '.2em' }}>RACCOURCIS CLAVIER</h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {[['Esc', 'Fermer zoom / fenêtre'], ['← →', 'Photo précédente / suivante dans le zoom'], ['Enter', 'Se connecter']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <kbd style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '4px', padding: '3px 10px', fontSize: '12px', color: '#aaa', fontFamily: 'monospace' }}>{k}</kbd>
                      <span style={{ color: '#666', fontSize: '13px' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
