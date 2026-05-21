// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';

export default function GaleriePage() {
  const [voyages, setVoyages] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [lbIndex, setLbIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/voyages').then(r=>r.json()).then(d => {
      const vs = d.voyages||[];
      setVoyages(vs);
      const photos = [];
      vs.forEach(v => {
        (v.photos||[]).forEach((url, i) => {
          photos.push({ url, voyageId: v.id, voyageTitle: v.title, country: v.country, index: i });
        });
        if (v.coverImage && !(v.photos||[]).includes(v.coverImage)) {
          photos.push({ url: v.coverImage, voyageId: v.id, voyageTitle: v.title, country: v.country, index: -1 });
        }
      });
      setAllPhotos(photos);
      setLoading(false);
    });
  }, []);

  const filtered = filter==='all' ? allPhotos : allPhotos.filter(p=>p.voyageId===filter);

  const openLb = (idx) => { setLbIndex(idx); setLightbox(filtered[idx]); };
  const closeLb = () => setLightbox(null);
  const prevLb = () => { const i=(lbIndex-1+filtered.length)%filtered.length; setLbIndex(i); setLightbox(filtered[i]); };
  const nextLb = () => { const i=(lbIndex+1)%filtered.length; setLbIndex(i); setLightbox(filtered[i]); };

  useEffect(() => {
    if (!lightbox) return;
    const h = (e) => {
      if (e.key==='Escape') closeLb();
      if (e.key==='ArrowLeft') prevLb();
      if (e.key==='ArrowRight') nextLb();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lightbox, lbIndex]);

  return (
    <div style={{minHeight:'100vh',background:'#080808',color:'rgba(255,255,255,0.85)',paddingTop:'80px'}}>
      {lightbox && (
        <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.97)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={closeLb}>
          <button style={{position:'fixed',top:'20px',right:'28px',background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:'28px',cursor:'pointer',zIndex:1001}} onClick={closeLb}>&#10005;</button>
          <button style={{position:'fixed',left:'20px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(255,255,255,0.4)',fontSize:'40px',cursor:'pointer',zIndex:1001,padding:'8px'}} onClick={e=>{e.stopPropagation();prevLb();}}>&#8249;</button>
          <img src={lightbox.url} alt={lightbox.voyageTitle} style={{maxWidth:'90vw',maxHeight:'90vh',objectFit:'contain'}} onClick={e=>e.stopPropagation()}/>
          <button style={{position:'fixed',right:'20px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(255,255,255,0.4)',fontSize:'40px',cursor:'pointer',zIndex:1001,padding:'8px'}} onClick={e=>{e.stopPropagation();nextLb();}}>&#8250;</button>
          <div style={{position:'fixed',bottom:'24px',left:'50%',transform:'translateX(-50%)',textAlign:'center',zIndex:1001}}>
            <p style={{fontSize:'12px',letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(255,255,255,0.5)',marginBottom:'4px'}}>{lightbox.voyageTitle} &middot; {lightbox.country}</p>
            <p style={{fontSize:'10px',color:'rgba(255,255,255,0.25)'}}>{lbIndex+1} / {filtered.length}</p>
          </div>
        </div>
      )}

      <div style={{padding:'clamp(48px,8vw,100px) clamp(24px,6vw,80px) 48px',maxWidth:'1400px',margin:'0 auto'}}>
        <span style={{fontSize:'9px',letterSpacing:'0.3em',textTransform:'uppercase',color:'rgba(212,175,55,0.6)',display:'block',marginBottom:'12px'}}>Collection photographique</span>
        <h1 style={{fontFamily:'"Cormorant Garamond","Playfair Display",Georgia,serif',fontSize:'clamp(36px,6vw,72px)',fontWeight:300,color:'rgba(255,255,255,0.88)',letterSpacing:'-0.02em',lineHeight:1.05}}>Galerie</h1>
      </div>

      <div style={{padding:'0 clamp(24px,6vw,80px) 40px',maxWidth:'1400px',margin:'0 auto',display:'flex',gap:'4px',flexWrap:'wrap'}}>
        {[{k:'all',l:'Tout ('+allPhotos.length+')'},...voyages.map(v=>({k:v.id,l:v.title+' ('+(v.photos||[]).length+')'}))].map(f=>(
          <button key={f.k} onClick={()=>setFilter(f.k)} style={{padding:'7px 18px',fontSize:'10px',letterSpacing:'0.15em',textTransform:'uppercase',cursor:'pointer',border:'1px solid',borderColor:filter===f.k?'rgba(212,175,55,0.5)':'rgba(255,255,255,0.08)',background:filter===f.k?'rgba(212,175,55,0.08)':'transparent',color:filter===f.k?'rgba(212,175,55,0.9)':'rgba(255,255,255,0.35)',borderRadius:'2px'}}>{f.l}</button>
        ))}
      </div>

      {loading && <p style={{textAlign:'center',color:'rgba(255,255,255,0.25)',fontSize:'13px',padding:'60px 0'}}>Chargement...</p>}

      {!loading && filtered.length>0 && (
        <div style={{columns:'3 300px',columnGap:'6px',padding:'0 clamp(24px,6vw,80px) 80px',maxWidth:'1400px',margin:'0 auto'}}>
          {filtered.map((photo, idx) => (
            <div key={idx} style={{breakInside:'avoid',marginBottom:'6px',overflow:'hidden',cursor:'pointer',position:'relative'}} onClick={()=>openLb(idx)}
              onMouseOver={e=>{const img=e.currentTarget.querySelector('img');if(img){img.style.transform='scale(1.04)';img.style.filter='brightness(1)';}}}
              onMouseOut={e=>{const img=e.currentTarget.querySelector('img');if(img){img.style.transform='scale(1)';img.style.filter='brightness(0.9)';}}}
            >
              <img src={photo.url} alt={photo.voyageTitle} style={{width:'100%',display:'block',transition:'transform 0.6s ease,filter 0.4s ease',filter:'brightness(0.9)'}} loading="lazy"/>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length===0 && <div style={{textAlign:'center',padding:'80px 0'}}><p style={{fontSize:'14px',color:'rgba(255,255,255,0.3)'}}>Aucune photo</p></div>}
    </div>
  );
}
