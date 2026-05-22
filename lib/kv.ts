// @ts-nocheck
// KV store — works with Upstash Redis REST API
// Set KV_REST_API_URL and KV_REST_API_TOKEN in Vercel env vars
import { HOMEPAGE_CONFIG } from './homepage';
import { VOYAGES as STATIC_VOYAGES } from './data';

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

const isKvAvailable = () => !!(KV_URL && KV_TOKEN);

async function kvGet(key: string) {
  if (!isKvAvailable()) return null;
  try {
    const res = await fetch(`${KV_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.result === null || data.result === undefined) return null;
    return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
  } catch { return null; }
}

async function kvSet(key: string, value: any) {
  if (!isKvAvailable()) {
    console.warn('KV not configured — set KV_REST_API_URL and KV_REST_API_TOKEN');
    return false;
  }
  try {
    const res = await fetch(`${KV_URL}/set/${key}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(value)),
    });
    return res.ok;
  } catch { return false; }
}

// ── Voyages ──────────────────────────────────────────────
export async function getVoyages(): Promise<any[]> {
  const cached = await kvGet('voyages');
  if (cached && Array.isArray(cached) && cached.length > 0) return cached;
  // First run: seed KV from static data
  if (isKvAvailable() && STATIC_VOYAGES.length > 0) {
    await kvSet('voyages', STATIC_VOYAGES);
  }
  return STATIC_VOYAGES as any[];
}

export async function setVoyages(voyages: any[]): Promise<boolean> {
  return kvSet('voyages', voyages);
}

// ── Homepage config ───────────────────────────────────────
export async function getHomepageConfig(): Promise<any> {
  const cached = await kvGet('homepage');
  if (cached) return cached;
  // First run: seed from static config
  if (isKvAvailable()) {
    await kvSet('homepage', HOMEPAGE_CONFIG);
  }
  return HOMEPAGE_CONFIG;
}

export async function setHomepageConfig(config: any): Promise<boolean> {
  return kvSet('homepage', config);
}
