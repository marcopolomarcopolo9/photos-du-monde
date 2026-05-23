import { MetadataRoute } from 'next';

const BASE = 'https://photos-du-monde-7zog.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  
  let voyageUrls: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${BASE}/api/voyages`, { cache: 'no-store' });
    const d = await res.json();
    voyageUrls = (d.voyages || []).map((v: any) => ({
      url: `${BASE}/voyages/${v.slug || v.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch {}

  return [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/voyages`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/galerie`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/a-propos`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    ...voyageUrls,
  ];
}
