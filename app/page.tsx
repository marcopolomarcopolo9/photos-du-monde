// @ts-nocheck
import Hero from '../components/home/Hero';
import FeaturedVoyages from '../components/home/FeaturedVoyages';
import WorldMap from '../components/home/WorldMap';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WorldMap />
      <FeaturedVoyages />
    </main>
  );
}
