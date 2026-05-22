// @ts-nocheck
import { NextResponse } from 'next/server';
import { getVoyages } from '@/lib/kv';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const voyages = await getVoyages();
    const published = voyages.filter((v: any) => v.published !== false);
    return NextResponse.json({ voyages: published }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
