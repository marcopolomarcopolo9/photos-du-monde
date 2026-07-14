// @ts-nocheck
import Hero from '../components/home/Hero';
import ScrollTopOnReload from '../components/util/ScrollTopOnReload';
import FeaturedVoyages from '../components/home/FeaturedVoyages';
import WorldGlobe from '../components/home/WorldGlobe';

export default function HomePage() {
  return (
    <main>
      <ScrollTopOnReload />
      <Hero />
      <WorldGlobe />
      <FeaturedVoyages />
    </main>
  );
}
