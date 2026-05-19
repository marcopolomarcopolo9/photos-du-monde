import { MetadataRoute } from 'next';
import { VOYAGES } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://photosdumonde.fr';
  const now = new Date().toISOString();

  const voyageUrls = VOYAGES.map((v) => ({
    url: `${base}/voyages/${v.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/voyages`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/galerie`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...voyageUrls,
  ];
}
