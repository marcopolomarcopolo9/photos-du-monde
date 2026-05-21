// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [voyages, setVoyages] = useState([]);
  const [voyLoading, setVoyLoading] = useState(false);
  const [notif, setNotif] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [hp, setHp] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const tabs = ["MES VOYAGES", "PAGE D'ACCUEIL", "UPLOAD", "PARAMETRES"];

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setAuth(true); fetchVoyages(); fetchHp();
    }
  }, []);

  const toast = (msg, type) => {
    setNotif({ msg, type: type || 'ok' });
    setTimeout(() => setNotif(null), 5000);
  };

  const login = async () => {
    if (!pw) return;
    setLoading(true); setErr('');
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      });
      const d = await r.json();
      if (d.success) {
        localStorage.setItem('admin_auth', 'true');
        setAuth(true); fetchVoyages(); fetchHp();
      } else {
        setErr('Mot de passe incorrect');
      }
    } catch(e) { setErr('Erreur de connexion'); }
    setLoading(false);
  };

  const logout = () => { localStorage.removeItem('admin_auth'); setAuth(false); };

  const fetchVoyages = async () => {
    setVoyLoading(true);
    try {
      const r = await fetch('/api/admin/voyages');
      const d = await r.json();
      setVoyages(d.voyages || []);
    } catch(e) { toast('Erreur chargement', 'err'); }
    setVoyLoading(false);
  };

  const fetchHp = async () => {
    try {
      const r = await fetch('/api/admin/homepage');
      const d = await r.json();
      if (d.config) setHp(d.config);
    } catch(e) {}
  };

  const deleteVoyage = async (slug) => {
    setConfirm(null);
    toast('Suppression en cours...', 'info');
    try {
      const r = await fetch('/api/admin/voyages?id=' + slug, { method: 'DELETE' });
      const d = await r.json();
      if (d.success) {
        toast('Voyage supprime ! Rebuild en cours...');
        setVoyages(prev => prev.filter(v => (v.slug || v.id) !== slug));
      } else {
        toast('Erreur: ' + (d.error || ''), 'err');
      }
    } catch(e) { toast('Erreur reseau', 'err'); }
  };

  const saveHp = async () => {
    setSaving(true);
    try {
      const r = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: hp })
      });
      const d = await r.json();
      if (d.success) toast('Page mise a jour ! Rebuild...');
      else toast('Erreur: ' + (d.error || ''), 'err');
    } catch(e) { toast('Erreur reseau', 'err'); }
    setSaving(false);
  };

  const updHp = (s, k, v) => setHp(prev => ({ ...prev, [s]: { ...prev[s], [k]: v } }));

  const doUpload = async (file) => {
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    try {
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const d = await r.json();
      if (d.url) { setUploadUrl(d.url); toast('Image uploadee !'); }
      else toast('Erreur upload', 'err');
    } catch(e) { toast('Erreur', 'err'); }
    setUploading(false);
  };

  if (!auth) return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#111', border:'1px solid #222', borderRadius:'16px', padding:'48px', width:'380px', textAlign:'center' }}>
        <div style={{ fontSize:'30px', fontWeight:'300', color:'#f5f0e8', letterSpacing:'0.1em', marginBottom:'8px', fontFamily:'Georgia,serif' }}>Photos du Monde</div>
        <div style={{ color:'#8a7a5a', fontSize:'12px', letterSpacing:'0.3em', marginBottom:'40px' }}>ADMINISTRATION</div>
        <input
          type='password'
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          placeholder='Mot de passe'
          style={{ width:'100%', padding:'14px 18px', background:'#0d0d0d', border:'1px solid #333', borderRadius:'8px', color:'#f5f0e8', fontSize:'15px', outline:'none', boxSizing:'border-box', marginBottom:'12px' }}
        />
        {err && <div style={{ color:'#e53e3e', fontSize:'13px', marginBottom:'12px' }}>{err}</div>}
        <button
          onClick={login}
          disabled={loading}
          style={{ width:'100%', padding:'14px', background: loading ? '#333' : 'linear-gradient(135deg,#8a6a20,#c4962a)', border:'none', borderRadius:'8px', color:'#fff', fontSize:'14px', letterSpacing:'0.2em', cursor:'pointer', fontWeight:'600' }}
        >{loading ? 'CONNEXION...' : 'SE CONNECTER'}</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'#f5f0e8', fontFamily:'system-ui,sans-serif' }}>

      {notif && (
        <div style={{ position:'fixed', top:'20px', right:'20px', zIndex:9999, padding:'14px 20px', borderRadius:'8px', fontSize:'14px', maxWidth:'400px',
          background: notif.type === 'err' ? '#7f1d1d' : notif.type === 'info' ? '#1e3a5f' : '#1a3320',
          border: '1px solid ' + (notif.type === 'err' ? '#dc2626' : notif.type === 'info' ? '#3b82f6' : '#22c55e'),
          color:'#fff' }}>{notif.msg}</div>
      )}

      {confirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#111', border:'1px solid #333', borderRadius:'16px', padding:'40px', width:'420px', textAlign:'center' }}>
            <div style={{ fontSize:'20px', fontWeight:'600', marginBottom:'12px' }}>Supprimer ce voyage ?</div>
            <div style={{ color:'#aaa', fontSize:'14px', marginBottom:'24px' }}>Cette action est irreversible et declenchera un rebuild.</div>
            <div style={{ display:'flex', gap:'12px', justifyContent:'center' }}>
              <button onClick={() => setConfirm(null)} style={{ padding:'12px 28px', background:'#222', border:'1px solid #444', borderRadius:'8px', color:'#fff', cursor:'pointer' }}>Annuler</button>
              <button onClick={() => deleteVoyage(confirm.slug)} style={{ padding:'12px 28px', background:'#dc2626', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontWeight:'600' }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:9000, overflow:'auto', padding:'40px 20px' }}>
          <div style={{ background:'#111', border:'1px solid #2a2a2a', borderRadius:'16px', maxWidth:'700px', margin:'0 auto', padding:'40px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' }}>
              <h2 style={{ margin:0, fontSize:'22px', fontWeight:'400' }}>{editing.isNew ? 'Nouveau voyage' : 'Modifier'}</h2>
              <button onClick={() => setEditing(null)} style={{ background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:'28px', lineHeight:1 }}>x</button>
            </div>
            <EditForm voyage={editing} onSave={async (data) => {
              toast('Enregistrement...', 'info');
              const method = data.isNew ? 'POST' : 'PUT';
              try {
                const r = await fetch('/api/admin/voyages', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                const d = await r.json();
                if (d.success) { toast(data.isNew ? 'Voyage cree !' : 'Voyage mis a jour !'); setEditing(null); setTimeout(fetchVoyages, 1500); }
                else toast('Erreur: ' + (d.error || ''), 'err');
              } catch(e) { toast('Erreur reseau', 'err'); }
            }} onCancel={() => setEditing(null)} />
          </div>
        </div>
      )}

      <div style={{ borderBottom:'1px solid #1a1a1a', padding:'0 40px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'60px', position:'sticky', top:0, background:'#0a0a0a', zIndex:100 }}>
        <div style={{ fontSize:'16px', fontWeight:'300', letterSpacing:'0.15em' }}>Photos du Monde - Admin</div>
        <div style={{ display:'flex', gap:'16px', alignItems:'center' }}>
          <a href='/' target='_blank' style={{ color:'#8a7a5a', fontSize:'13px', textDecoration:'none' }}>Voir le site</a>
          <button onClick={logout} style={{ padding:'8px 20px', background:'transparent', border:'1px solid #333', borderRadius:'6px', color:'#aaa', cursor:'pointer', fontSize:'13px' }}>Deconnexion</button>
        </div>
      </div>

      <div style={{ borderBottom:'1px solid #1a1a1a', padding:'0 40px', display:'flex' }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{ padding:'18px 24px', background:'none', border:'none', cursor:'pointer', fontSize:'12px', letterSpacing:'0.2em', fontWeight:'600', color: tab === i ? '#c4962a' : '#666', borderBottom: tab === i ? '2px solid #c4962a' : '2px solid transparent' }}>{t}</button>
        ))}
      </div>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'40px' }}>

        {tab === 0 && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' }}>
              <div>
                <h1 style={{ fontSize:'28px', fontWeight:'300', margin:0 }}>Mes Voyages</h1>
                <div style={{ color:'#666', fontSize:'13px', marginTop:'6px' }}>{voyages.length} voyage{voyages.length > 1 ? 's' : ''}</div>
              </div>
              <button onClick={() => setEditing({ isNew:true, slug:'', title:'', country:'', city:'', description:'', startDate:'', heroImage:'', photos:[], tags:[], published:true })} style={{ padding:'12px 24px', background:'linear-gradient(135deg,#8a6a20,#c4962a)', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'13px', letterSpacing:'0.15em', fontWeight:'600' }}>+ AJOUTER</button>
            </div>
            {voyLoading ? (
              <div style={{ textAlign:'center', color:'#666', padding:'60px' }}>Chargement...</div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {voyages.map(v => {
                  const slug = v.slug || v.id;
                  const img = v.heroImage || v.coverImage || (Array.isArray(v.photos) && v.photos[0] && (typeof v.photos[0] === 'string' ? v.photos[0] : v.photos[0].src));
                  return (
                    <div key={slug} style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:'12px', padding:'20px 24px', display:'flex', alignItems:'center', gap:'20px' }}>
                      {img && <img src={img} alt='' style={{ width:'80px', height:'56px', objectFit:'cover', borderRadius:'6px', flexShrink:0 }} />}
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
                          <span style={{ fontSize:'17px', fontWeight:'500' }}>{v.title}</span>
                          <span style={{ fontSize:'11px', padding:'2px 10px', borderRadius:'20px', background: v.published ? '#1a3320' : '#2a1a1a', color: v.published ? '#22c55e' : '#ef4444', border: '1px solid ' + (v.published ? '#166534' : '#7f1d1d') }}>
                            {v.published ? 'PUBLIE' : 'BROUILLON'}
                          </span>
                        </div>
                        <div style={{ color:'#666', fontSize:'13px' }}>
                          {[v.country, v.city, v.startDate || v.date].filter(Boolean).join(' - ')}
                          {Array.isArray(v.photos) ? ' - ' + v.photos.length + ' photos' : ''}
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:'10px', flexShrink:0 }}>
                        <a href={'/voyages/' + slug} target='_blank' style={{ padding:'8px 16px', background:'#1a1a1a', border:'1px solid #333', borderRadius:'6px', color:'#aaa', textDecoration:'none', fontSize:'13px' }}>Voir</a>
                        <button onClick={() => setEditing({ ...v, slug, isNew:false })} style={{ padding:'8px 16px', background:'linear-gradient(135deg,#3a2a05,#5a4010)', border:'1px solid #8a6a20', borderRadius:'6px', color:'#c4962a', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>MODIFIER</button>
                        <button onClick={() => setConfirm({ slug })} style={{ padding:'8px 16px', background:'#1a0a0a', border:'1px solid #7f1d1d', borderRadius:'6px', color:'#ef4444', cursor:'pointer', fontSize:'13px' }}>Supprimer</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === 1 && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' }}>
              <div>
                <h1 style={{ fontSize:'28px', fontWeight:'300', margin:0 }}>Page d-accueil</h1>
                <div style={{ color:'#666', fontSize:'13px', marginTop:'6px' }}>Modifier textes et visuels - rebuild automatique</div>
              </div>
              {hp && <button onClick={saveHp} disabled={saving} style={{ padding:'12px 28px', background: saving ? '#333' : 'linear-gradient(135deg,#8a6a20,#c4962a)', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>{saving ? 'ENREGISTREMENT...' : 'ENREGISTRER ET PUBLIER'}</button>}
            </div>
            {!hp ? (
              <div style={{ textAlign:'center', color:'#666', padding:'40px' }}>Chargement config... <button onClick={fetchHp} style={{ marginLeft:'12px', padding:'8px 16px', background:'#222', border:'1px solid #333', borderRadius:'6px', color:'#aaa', cursor:'pointer' }}>Recharger</button></div>
            ) : (
              <div style={{ display:'grid', gap:'20px' }}>

                <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:'12px', padding:'28px' }}>
                  <h3 style={{ margin:'0 0 20px', fontSize:'13px', letterSpacing:'0.2em', color:'#c4962a', fontWeight:'600' }}>SECTION HERO</h3>
                  <div style={{ display:'grid', gap:'14px' }}>
                    <FI label='Titre principal' value={hp.hero && hp.hero.title || ''} onChange={v => updHp('hero','title',v)} />
                    <FI label='Titre italique' value={hp.hero && hp.hero.italicTitle || hp.hero && hp.hero.titleItalic || ''} onChange={v => updHp('hero','italicTitle',v)} />
                    <FI label='Tagline' value={hp.hero && hp.hero.tagline || hp.hero && hp.hero.subtitle || ''} onChange={v => updHp('hero','tagline',v)} />
                    <FI label='Bouton 1' value={hp.hero && hp.hero.cta1 || ''} onChange={v => updHp('hero','cta1',v)} />
                    <FI label='Bouton 2' value={hp.hero && hp.hero.cta2 || ''} onChange={v => updHp('hero','cta2',v)} />
                    <FI label='Image Hero (URL Cloudinary)' value={hp.hero && hp.hero.backgroundImage || ''} onChange={v => updHp('hero','backgroundImage',v)} />
                    {hp.hero && hp.hero.backgroundImage && <img src={hp.hero.backgroundImage} alt='preview hero' style={{ maxHeight:'180px', objectFit:'cover', borderRadius:'8px' }} />}
                  </div>
                </div>

                <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:'12px', padding:'28px' }}>
                  <h3 style={{ margin:'0 0 20px', fontSize:'13px', letterSpacing:'0.2em', color:'#c4962a', fontWeight:'600' }}>SECTION A PROPOS</h3>
                  <div style={{ display:'grid', gap:'14px' }}>
                    <FI label='Texte intro' value={hp.about && (hp.about.intro || hp.about.text) || ''} onChange={v => updHp('about','intro',v)} multi />
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px' }}>
                      <FI label='Pays visites' value={String(hp.about && hp.about.countries || '')} onChange={v => updHp('about','countries',Number(v))} />
                      <FI label='Photos prises' value={String(hp.about && hp.about.photos || '')} onChange={v => updHp('about','photos',Number(v))} />
                      <FI label='Annees exp.' value={String(hp.about && hp.about.years || '')} onChange={v => updHp('about','years',Number(v))} />
                    </div>
                  </div>
                </div>

                <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:'12px', padding:'28px' }}>
                  <h3 style={{ margin:'0 0 20px', fontSize:'13px', letterSpacing:'0.2em', color:'#c4962a', fontWeight:'600' }}>SEO / META</h3>
                  <div style={{ display:'grid', gap:'14px' }}>
                    <FI label='Titre page' value={hp.seo && hp.seo.title || ''} onChange={v => updHp('seo','title',v)} />
                    <FI label='Meta description' value={hp.seo && hp.seo.description || ''} onChange={v => updHp('seo','description',v)} multi />
                    <FI label='Mots-cles' value={hp.seo && hp.seo.keywords || ''} onChange={v => updHp('seo','keywords',v)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 2 && (
          <div>
            <h1 style={{ fontSize:'28px', fontWeight:'300', margin:'0 0 8px' }}>Upload Images</h1>
            <div style={{ color:'#666', fontSize:'13px', marginBottom:'32px' }}>Uploadez sur Cloudinary pour utiliser les URLs dans l-admin</div>
            <div style={{ background:'#111', border:'2px dashed #2a2a2a', borderRadius:'16px', padding:'60px 40px', textAlign:'center' }}>
              <div style={{ color:'#aaa', marginBottom:'24px', fontSize:'15px' }}>Selectionnez une image a uploader</div>
              <input type='file' accept='image/*' onChange={e => { const f = e.target.files && e.target.files[0]; if (f) doUpload(f); }} style={{ display:'none' }} id='fi' />
              <label htmlFor='fi' style={{ padding:'12px 32px', background:'linear-gradient(135deg,#8a6a20,#c4962a)', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'13px', letterSpacing:'0.2em', fontWeight:'600' }}>{uploading ? 'UPLOAD EN COURS...' : 'CHOISIR UNE IMAGE'}</label>
              {uploadUrl && (
                <div style={{ marginTop:'24px', padding:'16px', background:'#0d0d0d', borderRadius:'8px', border:'1px solid #222' }}>
                  <div style={{ color:'#22c55e', marginBottom:'12px' }}>Image uploadee !</div>
                  <img src={uploadUrl} alt='uploaded' style={{ maxWidth:'300px', maxHeight:'200px', objectFit:'cover', borderRadius:'6px', marginBottom:'12px', display:'block', margin:'0 auto 12px' }} />
                  <div style={{ display:'flex', gap:'8px', justifyContent:'center', maxWidth:'400px', margin:'0 auto' }}>
                    <input value={uploadUrl} readOnly style={{ flex:1, padding:'8px 12px', background:'#111', border:'1px solid #333', borderRadius:'6px', color:'#aaa', fontSize:'12px' }} />
                    <button onClick={() => navigator.clipboard.writeText(uploadUrl)} style={{ padding:'8px 16px', background:'#222', border:'1px solid #333', borderRadius:'6px', color:'#fff', cursor:'pointer' }}>Copier</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 3 && (
          <div>
            <h1 style={{ fontSize:'28px', fontWeight:'300', margin:'0 0 8px' }}>Parametres</h1>
            <div style={{ color:'#666', fontSize:'13px', marginBottom:'32px' }}>Informations sur l-administration</div>
            <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:'12px', padding:'24px' }}>
              <h3 style={{ margin:'0 0 16px', fontSize:'13px', color:'#c4962a', letterSpacing:'0.2em' }}>COMMENT CA MARCHE</h3>
              <div style={{ color:'#666', fontSize:'14px', lineHeight:'1.8' }}>Chaque modification dans cet admin ecrit directement dans GitHub et declenche un rebuild automatique Vercel. Vos changements sont en ligne en 1-2 minutes.</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function FI({ label, value, onChange, multi }) {
  const s = { width:'100%', padding:'12px 16px', background:'#0d0d0d', border:'1px solid #2a2a2a', borderRadius:'8px', color:'#f5f0e8', fontSize:'14px', outline:'none', boxSizing:'border-box', fontFamily:'inherit', resize:'vertical' };
  return (
    <div>
      <label style={{ display:'block', color:'#888', fontSize:'11px', letterSpacing:'0.15em', marginBottom:'6px', textTransform:'uppercase' }}>{label}</label>
      {multi
        ? <textarea value={value} onChange={e => onChange(e.target.value)} style={{ ...s, minHeight:'80px' }} />
        : <input type='text' value={value} onChange={e => onChange(e.target.value)} style={s} />}
    </div>
  );
}

function EditForm({ voyage, onSave, onCancel }) {
  const [f, setF] = useState({ ...voyage });
  const [photos, setPhotos] = useState((voyage.photos || []).map(p => typeof p === 'string' ? p : (p.src || '')).join('\n'));
  const [tags, setTags] = useState((voyage.tags || []).join(', '));
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const s = { width:'100%', padding:'10px 14px', background:'#0d0d0d', border:'1px solid #2a2a2a', borderRadius:'8px', color:'#f5f0e8', fontSize:'14px', outline:'none', boxSizing:'border-box', fontFamily:'inherit' };
  const l = { display:'block', color:'#888', fontSize:'11px', letterSpacing:'0.1em', marginBottom:'4px', textTransform:'uppercase' };
  return (
    <div style={{ display:'grid', gap:'14px' }}>
      {f.isNew && <div><label style={l}>SLUG URL (ex: japon-2024)</label><input value={f.slug} onChange={e=>set('slug',e.target.value)} style={s} /></div>}
      <div><label style={l}>TITRE</label><input value={f.title} onChange={e=>set('title',e.target.value)} style={s} /></div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
        <div><label style={l}>PAYS</label><input value={f.country||''} onChange={e=>set('country',e.target.value)} style={s} /></div>
        <div><label style={l}>VILLE</label><input value={f.city||''} onChange={e=>set('city',e.target.value)} style={s} /></div>
      </div>
      <div><label style={l}>DATE (AAAA/MM)</label><input value={f.startDate||f.date||''} onChange={e=>set('startDate',e.target.value)} style={s} /></div>
      <div><label style={l}>DESCRIPTION</label><textarea value={f.description||''} onChange={e=>set('description',e.target.value)} style={{ ...s, minHeight:'80px', resize:'vertical' }} /></div>
      <div><label style={l}>IMAGE HERO (URL)</label><input value={f.heroImage||f.coverImage||''} onChange={e=>set('heroImage',e.target.value)} style={s} /></div>
      <div><label style={l}>PHOTOS (1 URL par ligne)</label><textarea value={photos} onChange={e=>setPhotos(e.target.value)} style={{ ...s, minHeight:'100px', resize:'vertical', fontFamily:'monospace', fontSize:'12px' }} /></div>
      <div><label style={l}>TAGS (virgules)</label><input value={tags} onChange={e=>setTags(e.target.value)} style={s} /></div>
      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        <input type='checkbox' id='pub' checked={f.published||false} onChange={e=>set('published',e.target.checked)} />
        <label htmlFor='pub' style={{ color:'#aaa', fontSize:'14px', cursor:'pointer' }}>Publie (visible sur le site)</label>
      </div>
      <div style={{ display:'flex', gap:'12px', justifyContent:'flex-end', marginTop:'8px' }}>
        <button onClick={onCancel} style={{ padding:'12px 24px', background:'#1a1a1a', border:'1px solid #333', borderRadius:'8px', color:'#aaa', cursor:'pointer' }}>Annuler</button>
        <button onClick={() => onSave({ ...f, photos: photos.split('\n').map(s=>s.trim()).filter(Boolean), tags: tags.split(',').map(s=>s.trim()).filter(Boolean) })} style={{ padding:'12px 28px', background:'linear-gradient(135deg,#8a6a20,#c4962a)', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontWeight:'600' }}>ENREGISTRER</button>
      </div>
    </div>
  );
}