// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VoyagesPage() {
  const [voyages, setVoyages] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/voyages').then(r=>r.json()).then(d => {
      setVoyages(d.voyages||[]);
      setLoading(false);
    });
  }, []);

  const countries = [...new Set(voyages.map(v=>v.country).filter(Boolean))];
  const filtered = filter ? voyages.filter(v=>v.country===filter) : voyages;

  return (
    <div style={{minHeight:'100vh',background:'#080808',color:'rgba(255,255,255,0.85)',paddingTop:'80px'}}>
      <div style={{padding:'clamp(48px,8vw,100px) clamp(24px,6vw,80px) 48px',maxWidth:'1400px',margin:'0 auto'}}>
        <span style={{fontSize:'9px',letterSpacing:'0.3em',textTransform:'uppercase',color:'rgba(212,175,55,0.6)',display:'block',marginBottom:'12px'}}>Explorations photographiques</span>
        <h1 style={{fontFamily:'"Cormorant Garamond","Playfair Display",Georgia,serif',fontSize:'clamp(36px,6vw,72px)',fontWeight:300,color:'rgba(255,255,255,0.88)',letterSpacing:'-0.02em',lineHeight:1.05,marginBottom:'8px'}}>Destinations</h1>
        <p style={{fontSize:'12px',color:'rgba(255,255,255,0.3)',letterSpacing:'0.08em'}}>{voyages.length} voyage{voyages.length!==1?'s':''} documentes</p>
      </div>

      {countries.length > 1 && (
        <div style={{padding:'0 clamp(24px,6vw,80px) 48px',maxWidth:'1400px',margin:'0 auto',display:'flex',gap:'4px',flexWrap:'wrap'}}>
          <button onClick={()=>setFilter('')} style={{padding:'7px 18px',fontSize:'10px',letterSpacing:'0.15em',textTransform:'uppercase',cursor:'pointer',border:'1px solid',borderColor:!filter?'rgba(212,175,55,0.5)':'rgba(255,255,255,0.08)',background:!filter?'rgba(212,175,55,0.08)':'transparent',color:!filter?'rgba(212,175,55,0.9)':'rgba(255,255,255,0.35)',borderRadius:'2px'}}>Tous</button>
          {countries.map(c=>(
            <button key={c} onClick={()=>setFilter(c)} style={{padding:'7px 18px',fontSize:'10px',letterSpacing:'0.15em',textTransform:'uppercase',cursor:'pointer',border:'1px solid',borderColor:filter===c?'rgba(212,175,55,0.5)':'rgba(255,255,255,0.08)',background:filter===c?'rgba(212,175,55,0.08)':'transparent',color:filter===c?'rgba(212,175,55,0.9)':'rgba(255,255,255,0.35)',borderRadius:'2px'}}>{c}</button>
          ))}
        </div>
      )}

      {loading && <p style={{textAlign:'center',color:'rgba(255,255,255,0.25)',fontSize:'13px',padding:'60px 0'}}>Chargement...</p>}

      {!loading && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,380px),1fr))',gap:'3px',padding:'0 clamp(24px,6vw,80px) 80px',maxWidth:'1400px',margin:'0 auto'}}>
          {filtered.length===0 && <div style={{textAlign:'center',padding:'80px 0',gridColumn:'1/-1'}}><p style={{fontSize:'14px',color:'rgba(255,255,255,0.25)'}}>Aucun voyage</p></div>}
          {filtered.map(v => (
            <Link
              key={v.id}
              href={'/voyages/'+v.id}
              style={{position:'relative',overflow:'hidden',aspectRatio:'3/4',display:'block',textDecoration:'none',cursor:'pointer'}}
              onMouseOver={e=>{const img=e.currentTarget.querySelector('img');if(img){img.style.transform='scale(1.06)';img.style.filter='brightness(0.85)';}}}
              onMouseOut={e=>{const img=e.currentTarget.querySelector('img');if(img){img.style.transform='scale(1)';img.style.filter='brightness(0.7)';}}}
            >
              {v.coverImage ? (
                <img src={v.coverImage} alt={v.title} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.7)',transition:'transform 0.7s ease,filter 0.4s ease'}}/>
              ) : (
                <div style={{width:'100%',height:'100%',background:'#1a1a1a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px'}}>&#127760;</div>
              )}
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.1) 60%)'}}/>
              <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'28px 24px'}}>
                <span style={{fontSize:'9px',letterSpacing:'0.25em',textTransform:'uppercase',color:'rgba(212,175,55,0.7)',display:'block',marginBottom:'6px'}}>{v.country}</span>
                <h2 style={{fontFamily:'"Cormorant Garamond","Playfair Display",Georgia,serif',fontSize:'clamp(20px,3vw,26px)',fontWeight:300,color:'rgba(255,255,255,0.92)',lineHeight:1.2,margin:'0 0 6px 0'}}>{v.title}</h2>
                <p style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em'}}>{v.date} &middot; {(v.photos||[]).length} photos</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
