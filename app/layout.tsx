// @ts-nocheck
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import NavbarWrapper from '@/components/layout/NavbarWrapper';
import FooterWrapper from '@/components/layout/FooterWrapper';
import AmbientSound from '@/components/ui/AmbientSound';
import PageLoader from '@/components/ui/PageLoader';
import CustomCursor from '@/components/ui/CustomCursor';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-poppins',
  display: 'swap',
});

const BASE_URL = 'https://photos-du-monde-7zog.vercel.app';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Photos du Monde — Voyage Photographique par Rolf Etter',
    template: '%s | Photos du Monde',
  },
  description: 'Portfolio photographique de voyages — volcans, forêts tropicales, faune sauvage. Costa Rica, Japon, Chine et plus. Par Rolf Etter.',
  keywords: [
    'photographie voyage', 'photographe nature', 'portfolio photo',
    'Costa Rica', 'Japon', 'Chine', 'volcans', 'forêt tropicale',
    'faune sauvage', 'Rolf Etter', 'Photos du Monde'
  ],
  authors: [{ name: 'Rolf Etter', url: BASE_URL }],
  creator: 'Rolf Etter',
  publisher: 'Photos du Monde',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'Photos du Monde',
    title: 'Photos du Monde — Voyage Photographique par Rolf Etter',
    description: 'Portfolio photographique de voyages — volcans, forêts tropicales, faune sauvage.',
    images: [{
      url: `${BASE_URL}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: 'Photos du Monde — Voyage Photographique',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photos du Monde — Voyage Photographique',
    description: 'Portfolio photographique de voyages — volcans, forêts tropicales, faune sauvage. Par Rolf Etter.',
    images: [`${BASE_URL}/og-image.jpg`],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={poppins.variable}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="bg-noir text-creme antialiased">
        <PageLoader />
        <CustomCursor />
        <NavbarWrapper />
        <main>{children}</main>
        <FooterWrapper />
        <AmbientSound />
      </body>
    </html>
  );
}
