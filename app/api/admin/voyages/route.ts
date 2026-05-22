// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { getVoyages, setVoyages } from '@/lib/kv';

export const dynamic = 'force-dynamic';

// GET — list all voyages
export async function GET() {
  try {
    const voyages = await getVoyages();
    return NextResponse.json({ voyages }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST — add new voyage
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const voyages = await getVoyages();
    const slug = body.slug || body.id || body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newVoyage = {
      slug, id: slug,
      title: body.title || '',
      country: body.country || '',
      city: body.city || '',
      startDate: body.startDate || body.date || '',
      date: body.startDate || body.date || '',
      description: body.description || '',
      heroImage: body.heroImage || body.coverImage || '',
      coverImage: body.heroImage || body.coverImage || '',
      photos: (body.photos || []).map((p: any) => typeof p === 'string' ? { src: p, caption: '' } : { src: p.src || '', caption: p.caption || '' }),
      lat: body.lat || null,
      lng: body.lng || null,
      tags: body.tags || [],
      categories: body.categories || [],
      waypoints: body.waypoints || [],
      published: body.published !== false,
    };
    await setVoyages([...voyages, newVoyage]);
    return NextResponse.json({ success: true, voyage: newVoyage });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT — update voyage
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const voyages = await getVoyages();
    const slug = body.slug || body.id;
    const idx = voyages.findIndex((v: any) => (v.slug || v.id) === slug);
    if (idx === -1) return NextResponse.json({ error: 'Voyage not found' }, { status: 404 });
    const updated = {
      ...voyages[idx],
      ...body,
      slug: slug,
      id: slug,
      heroImage: body.heroImage || body.coverImage || voyages[idx].heroImage || '',
      coverImage: body.heroImage || body.coverImage || voyages[idx].coverImage || '',
      photos: (body.photos || voyages[idx].photos || []).map((p: any) =>
        typeof p === 'string' ? { src: p, caption: '' } : { src: p.src || '', caption: p.caption || '' }
      ),
      categories: body.categories || voyages[idx].categories || [],
      waypoints: body.waypoints || voyages[idx].waypoints || [],
    };
    voyages[idx] = updated;
    await setVoyages(voyages);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE — remove voyage
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('id') || searchParams.get('slug');
    if (!slug) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const voyages = await getVoyages();
    const filtered = voyages.filter((v: any) => (v.slug || v.id) !== slug);
    await setVoyages(filtered);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
