// @ts-nocheck
/**
 * Upstash Redis REST API — command format
 * Env vars: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */
import { HOMEPAGE_CONFIG } from './homepage';
import { VOYAGES as STATIC_VOYAGES } from './data';

const KV_URL   = process.env.UPSTASH_REDIS_REST_URL   || process.env.KV_REST_API_URL   || '';
const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN  || process.env.KV_REST_API_TOKEN || '';

const ok = () => !!(KV_URL && KV_TOKEN);

async function cmd(...args: any[]) {
  if (!ok()) return null;
  try {
    const res = await fetch(KV_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result ?? null;
  } catch { return null; }
}

async function kvGet(key: string) {
  const result = await cmd('GET', key);
  if (result === null || result === undefined) return null;
  try { return JSON.parse(result); } catch { return result; }
}

async function kvSet(key: string, value: any): Promise<boolean> {
  if (!ok()) { console.warn('KV not configured'); return false; }
  const result = await cmd('SET', key, JSON.stringify(value));
  return result === 'OK';
}

// ── Voyages ──────────────────────────────────────────────
export async function getVoyages(): Promise<any[]> {
  const cached = await kvGet('voyages');
  if (cached && Array.isArray(cached) && cached.length > 0) return cached;
  if (ok() && STATIC_VOYAGES.length > 0) await kvSet('voyages', STATIC_VOYAGES);
  return STATIC_VOYAGES as any[];
}

export async function setVoyages(voyages: any[]): Promise<boolean> {
  return kvSet('voyages', voyages);
}

// ── Homepage ──────────────────────────────────────────────
export async function getHomepageConfig(): Promise<any> {
  const cached = await kvGet('homepage');
  if (cached && typeof cached === 'object') return cached;
  if (ok()) await kvSet('homepage', HOMEPAGE_CONFIG);
  return HOMEPAGE_CONFIG;
}

export async function setHomepageConfig(config: any): Promise<boolean> {
  return kvSet('homepage', config);
}
