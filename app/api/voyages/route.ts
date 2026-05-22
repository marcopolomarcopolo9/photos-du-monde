// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { getVoyages } from '@/lib/kv';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all');
    const voyages = await getVoyages();
    // If ?all=1, return everything (for voyage detail page)
    // Otherwise only published
    const result = all ? voyages : voyages.filter((v: any) => v.published !== false);
    return NextResponse.json({ voyages: result }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
