// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { getHomepageConfig, setHomepageConfig } from '@/lib/kv';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await getHomepageConfig();
    return NextResponse.json({ config }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { config } = await req.json();
    await setHomepageConfig(config);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
