import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/ui/CustomCursor';

export const metadata: Metadata = {
  title: {
    default: 'Photos du Monde — Voyage Photographique',
    template: '%s | Photos du Monde',
  },
  description:
    'Un carnet visuel de voyages au cœur des volcans, jungles et sanctuaires d\'oiseaux du monde. Photographies immersives de Costa Rica, Galápagos, Amazonie, Islande et Hawaii.',
  keywords: ['photographie voyage', 'volcan', 'jungle', 'oiseaux', 'Costa Rica', 'Galápagos', 'Amazonie', 'Islande'],
  authors: [{ name: 'Photos du Monde' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://photosdumonde.fr',
    siteName: 'Photos du Monde',
    title: 'Photos du Monde — Voyage Photographique',
    description: 'Photographies immersives de voyages au cœur de la nature sauvage.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Photos du Monde',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photos du Monde',
    description: 'Voyages photographiques au cœur des volcans et jungles du monde.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="bg-noir text-creme antialiased">
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
