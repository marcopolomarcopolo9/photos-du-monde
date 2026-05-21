import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://photos-du-monde-7zog.vercel.app';
  const now = new Date().toISOString();

  let voyageUrls: MetadataRoute.Sitemap = [];
  try {
    // Dynamic import to avoid TS issues with @ts-nocheck data file
    const { VOYAGES } = await import('@/lib/data');
    voyageUrls = (VOYAGES as any[]).map((v: any) => ({
      url: `${base}/voyages/${v.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch {}

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/voyages`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/galerie`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/a-propos`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    ...voyageUrls,
  ];
}
