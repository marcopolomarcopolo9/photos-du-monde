// @ts-nocheck
import Hero from '../components/home/Hero';
import { VOYAGES } from '../lib/data';
import { HOMEPAGE_CONFIG } from '../lib/homepage';
import Link from 'next/link';

export default function HomePage() {
  const published = VOYAGES.filter(v => v.published !== false).slice(0, 6);
  const config = HOMEPAGE_CONFIG;

  return (
    <main>
      <Hero config={config} />
      <section style={{ background: '#0a0a0a', padding: '100px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
            <div>
              <p style={{ fontSize: '10px', letterSpacing: '0.22em', color: 'rgba(212,175,55,0.7)', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'Inter,sans-serif' }}>
                Destinations
              </p>
              <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '42px', fontWeight: 300, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                Voyages récents
              </h2>
            </div>
            <Link href="/voyages" style={{ fontSize: '11px', letterSpacing: '0.16em', color: 'rgba(212,175,55,0.7)', textDecoration: 'none', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif' }}>
              Tout voir →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2px' }}>
            {published.map(v => (
              <Link key={v.slug} href={'/voyages/' + v.slug} style={{ display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'url(' + (v.heroImage || (v.photos[0] && v.photos[0].src) || '') + ')',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  transition: 'transform 0.6s ease',
                }} className="voyage-img" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(212,175,55,0.7)', textTransform: 'uppercase', margin: '0 0 6px', fontFamily: 'Inter,sans-serif' }}>
                    {v.country}
                  </p>
                  <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '22px', fontWeight: 300, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                    {v.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
