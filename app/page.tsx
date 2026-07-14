// @ts-nocheck
import Hero from '../components/home/Hero';
import FeaturedVoyages from '../components/home/FeaturedVoyages';
import WorldGlobe from '../components/home/WorldGlobe';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WorldGlobe />
      <FeaturedVoyages />
    </main>
  );
}
