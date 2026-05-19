import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import StatsSection from '@/components/home/StatsSection';
import FeaturedVoyages from '@/components/home/FeaturedVoyages';
import Destinations from '@/components/home/Destinations';
import WorldMap from '@/components/home/WorldMap';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Accueil — Photos du Monde',
  description: "Explorez le monde à travers l'objectif. Galerie photo immersive de voyages au cœur des volcans, jungles et sanctuaires d'oiseaux.",
  openGraph: {
    title: "Photos du Monde — Explorer le monde à travers l'objectif",
    description: 'Galerie photo immersive de voyages nature. Costa Rica, Hawaï, Amazonie, Galápagos.',
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <FeaturedVoyages />
      <Destinations />
      <WorldMap />

      {/* À propos */}
      <section className="bg-noir-soft py-24 md:py-32">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-px bg-or" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">À propos</span>
              </div>
              <h2 className="font-serif font-light text-4xl md:text-5xl text-creme italic leading-snug mb-8">
                Explorer le monde
                <br />
                à travers <em>l&apos;objectif</em>
              </h2>
              <p className="text-creme/55 leading-relaxed mb-4 text-sm font-poppins font-light">
                Photos du Monde est une galerie photographique dédiée aux paysages
                volcaniques, aux forêts primaires et aux espèces d&apos;oiseaux les
                plus rares de la planète.
              </p>
              <p className="text-creme/45 leading-relaxed text-sm font-poppins font-light">
                Les photos sont réalisées avec un respect total de la faune sauvage
                — aucun animal n&apos;a été perturbé pour ces clichés.
              </p>
              <div className="mt-10">
                <Link
                  href="/galerie"
                  className="inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-creme/70 border border-creme/20 hover:border-or hover:text-or px-6 py-3.5 transition-all duration-300 group font-poppins"
                >
                  Voir la galerie
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.15}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Volcans actifs', value: '8', sub: 'observés de près' },
                  { label: "Espèces d'oiseaux", value: '312', sub: 'photographiées' },
                  { label: 'km parcourus', value: '48 000', sub: 'en tout terrain' },
                  { label: 'Forêts primaires', value: '6', sub: 'traversées' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-noir-mid border border-white/5 p-6">
                    <div className="font-serif text-3xl text-or font-light mb-1">{stat.value}</div>
                    <div className="text-xs font-poppins font-medium text-creme/70 mb-0.5">{stat.label}</div>
                    <div className="text-[11px] text-creme/35 font-poppins">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
