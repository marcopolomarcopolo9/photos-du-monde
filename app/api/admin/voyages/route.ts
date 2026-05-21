// @ts-nocheck
import { NextResponse } from 'next/server';
import { VOYAGES } from '../../../../lib/data';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'marcopolomarcopolo9/photos-du-monde';
const BRANCH = 'main';
const DATA_PATH = 'lib/data.ts';

async function getFileSha() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${DATA_PATH}?ref=${BRANCH}`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' }
  });
  const json = await res.json();
  return json.sha;
}

async function writeDataFile(voyages, sha, message) {
  const content = buildDataTs(voyages);
  const encoded = Buffer.from(content).toString('base64');
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${DATA_PATH}`, {
    method: 'PUT',
    headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json', Accept: 'application/vnd.github.v3+json' },
    body: JSON.stringify({ message, content: encoded, sha, branch: BRANCH })
  });
  return await res.json();
}

function buildDataTs(voyages) {
  const lines = voyages.map(v => {
    const photos = (v.photos||[]).map(p => {
      const src = typeof p === 'string' ? p : p.src;
      return `    { src: ${JSON.stringify(src)} }`;
    }).join(',\n');
    const tags = (v.tags||[]).map(t => JSON.stringify(t)).join(', ');
    return `  {
    slug: ${JSON.stringify(v.slug||v.id||'')},
    title: ${JSON.stringify(v.title||'')},
    country: ${JSON.stringify(v.country||'')},
    city: ${JSON.stringify(v.city||'')},
    startDate: ${JSON.stringify(v.startDate||v.date||'')},
    description: ${JSON.stringify(v.description||'')},
    heroImage: ${JSON.stringify(v.heroImage||v.coverImage||'')},
    photos: [
${photos}
    ],
    lat: ${v.lat !== undefined ? v.lat : null},
    lng: ${v.lng !== undefined ? v.lng : null},
    tags: [${tags}],
    published: ${v.published !== false}
  }`;
  }).join(',\n');
  return `// @ts-nocheck
// Data managed via admin — do not edit manually
export type Voyage = {
  slug: string;
  title: string;
  country: string;
  city: string;
  startDate: string;
  description: string;
  heroImage: string;
  photos: { src: string }[];
  lat: number | null;
  lng: number | null;
  tags: string[];
  published: boolean;
};

export const VOYAGES = [
${lines}
];
`;
}

export async function GET() {
  try {
    const voyages = VOYAGES.map(v => ({
      id: v.slug,
      title: v.title,
      country: v.country,
      city: v.city,
      date: v.startDate,
      description: v.description,
      coverImage: v.heroImage,
      photos: (v.photos||[]).map(p => typeof p === 'string' ? p : p.src),
      lat: v.lat,
      lng: v.lng,
      tags: v.tags,
      published: v.published !== false
    }));
    return NextResponse.json({ voyages });
  } catch(e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const sha = await getFileSha();
    const voyages = [...VOYAGES];
    const id = body.id || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const photos = typeof body.photos === 'string' 
      ? body.photos.split('\n').map(s=>s.trim()).filter(Boolean)
      : (body.photos||[]);
    const tags = typeof body.tags === 'string'
      ? body.tags.split(',').map(s=>s.trim()).filter(Boolean)
      : (body.tags||[]);
    voyages.unshift({
      slug: id, title: body.title||'', country: body.country||'',
      city: body.city||'', startDate: body.date||'', description: body.description||'',
      heroImage: body.coverImage||'', photos: photos.map(src=>({src})),
      lat: body.lat||null, lng: body.lng||null, tags, published: body.published!==false
    });
    const result = await writeDataFile(voyages, sha, 'Admin: Ajout voyage ' + body.title);
    if (result.content) return NextResponse.json({ success: true, id });
    return NextResponse.json({ error: result.message||'Write failed' }, { status: 500 });
  } catch(e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const sha = await getFileSha();
    const voyages = [...VOYAGES];
    const idx = voyages.findIndex(v => v.slug === body.id || v.slug === body.slug);
    if (idx === -1) return NextResponse.json({ error: 'Not found: '+body.id }, { status: 404 });
    const photos = typeof body.photos === 'string'
      ? body.photos.split('\n').map(s=>s.trim()).filter(Boolean)
      : (body.photos||[]);
    const tags = typeof body.tags === 'string'
      ? body.tags.split(',').map(s=>s.trim()).filter(Boolean)
      : (body.tags||[]);
    voyages[idx] = {
      ...voyages[idx],
      title: body.title ?? voyages[idx].title,
      country: body.country ?? voyages[idx].country,
      city: body.city ?? voyages[idx].city,
      startDate: body.date ?? voyages[idx].startDate,
      description: body.description ?? voyages[idx].description,
      heroImage: body.coverImage ?? voyages[idx].heroImage,
      photos: photos.length > 0 ? photos.map(src=>typeof src==='string'?{src}:src) : voyages[idx].photos,
      lat: body.lat !== undefined ? body.lat : voyages[idx].lat,
      lng: body.lng !== undefined ? body.lng : voyages[idx].lng,
      tags: tags.length > 0 ? tags : voyages[idx].tags,
      published: body.published ?? voyages[idx].published
    };
    const result = await writeDataFile(voyages, sha, 'Admin: Modification voyage ' + voyages[idx].title);
    if (result.content) return NextResponse.json({ success: true });
    return NextResponse.json({ error: result.message||'Write failed' }, { status: 500 });
  } catch(e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const sha = await getFileSha();
    const voyages = [...VOYAGES];
    const filtered = voyages.filter(v => v.slug !== id);
    if (filtered.length === voyages.length) return NextResponse.json({ error: 'Not found: '+id }, { status: 404 });
    const result = await writeDataFile(filtered, sha, 'Admin: Suppression voyage ' + id);
    if (result.content) return NextResponse.json({ success: true });
    return NextResponse.json({ error: result.message||'Write failed' }, { status: 500 });
  } catch(e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
