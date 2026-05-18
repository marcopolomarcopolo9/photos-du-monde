import { MetadataRoute } from 'next';
import { VOYAGES } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://photosdumonde.fr';

  const voyageUrls = VOYAGES.map((v) => ({
    url: `${base}/voyages/${v.slug}`,
    lastModified: new Date(v.endDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/voyages`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/galerie`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...voyageUrls,
  ];
}
