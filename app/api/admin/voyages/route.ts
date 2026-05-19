import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = 'marcopolomarcopolo9';
const GITHUB_REPO = 'photos-du-monde';
const FILE_PATH = 'lib/data.ts';

function checkAuth(req: NextRequest) {
  const cookie = req.cookies.get('admin_auth')?.value;
  return cookie === (process.env.ADMIN_PASSWORD || 'admin123');
}

async function getFileFromGitHub() {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { content, sha: data.sha };
}

async function pushFileToGitHub(content: string, sha: string, message: string) {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content, 'utf-8').toString('base64'),
        sha,
      }),
    }
  );
  return res.json();
}

// GET: list voyages
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { content } = await getFileFromGitHub();
    // Extract VOYAGES array as JSON by parsing the TS file
    const match = content.match(/export const VOYAGES[^=]+=\s*(\[[\s\S]*?\]);\s*\nexport/);
    if (!match) return NextResponse.json({ voyages: [] });
    // Return raw content for display
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST: add a new voyage
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const voyage = await req.json();
    const { content, sha } = await getFileFromGitHub();

    // Build new voyage entry
    const slug = voyage.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const id = Date.now().toString();

    const photos = (voyage.photos || [])
      .map((p: { src: string; alt?: string; location?: string; date?: string }, i: number) => `      {
        id: '${id}-p${i}',
        src: '${p.src}',
        alt: '${(p.alt || '').replace(/'/g, "\\'")}',
        location: '${(p.location || voyage.city || '').replace(/'/g, "\\'")}',
        country: '${voyage.country.replace(/'/g, "\\'")}',
        continent: '${voyage.continent}',
        date: '${p.date || voyage.startDate}',
        width: 1200,
        height: 800,
        voyageSlug: '${slug}',
      }`)
      .join(',\n');

    const tips = (voyage.tips || [])
      .map((t: string) => `      '${t.replace(/'/g, "\\'")}'`)
      .join(',\n');

    const anecdotes = (voyage.anecdotes || [])
      .map((a: { title: string; content: string; location?: string }, i: number) => `      {
        id: '${id}-a${i}',
        title: '${(a.title || '').replace(/'/g, "\\'")}',
        content: '${(a.content || '').replace(/'/g, "\\'").replace(/\n/g, ' ')}',
        location: '${(a.location || '').replace(/'/g, "\\'")}',
      }`)
      .join(',\n');

    const newVoyageCode = `  {
    id: '${id}',
    slug: '${slug}',
    title: '${voyage.title.replace(/'/g, "\\'")}',
    subtitle: '${(voyage.subtitle || '').replace(/'/g, "\\'")}',
    description: '${(voyage.description || '').replace(/'/g, "\\'").replace(/\n/g, ' ')}',
    country: '${voyage.country.replace(/'/g, "\\'")}',
    continent: '${voyage.continent}',
    city: '${(voyage.city || '').replace(/'/g, "\\'")}',
    region: '${(voyage.region || voyage.city || '').replace(/'/g, "\\'")}',
    startDate: '${voyage.startDate}',
    endDate: '${voyage.endDate}',
    duration: ${voyage.duration || 7},
    heroImage: '${(voyage.heroImage || '').replace(/'/g, "\\'")}',
    heroImageAlt: '${(voyage.title || '').replace(/'/g, "\\'")}',
    featured: true,
    coordinates: { lat: 0, lng: 0 },
    tags: ${JSON.stringify(voyage.tags || [])},
    categories: ['Paysages'],
    photos: [
${photos}
    ],
    anecdotes: [
${anecdotes}
    ],
    tips: [
${tips}
    ],
  }`;

    // Insert new voyage into VOYAGES array
    const updatedContent = content.replace(
      /export const VOYAGES[^=]+=\s*\[/,
      `export const VOYAGES: Voyage[] = [\n${newVoyageCode},`
    );

    await pushFileToGitHub(updatedContent, sha, `Admin: Ajout du voyage "${voyage.title}"`);

    return NextResponse.json({ success: true, slug });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE: remove a voyage by slug
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { slug } = await req.json();
    const { content, sha } = await getFileFromGitHub();

    // Simple approach: remove the voyage block by slug
    // This is tricky with pure regex on TS; for now just update heroImage
    const updatedContent = content.replace(
      new RegExp(`\\s*\\{[^{}]*slug:\\s*'${slug}'[^}]*(?:\\{[^}]*\\}[^}]*)*\\},?`, 'g'),
      ''
    );

    await pushFileToGitHub(updatedContent, sha, `Admin: Suppression du voyage "${slug}"`);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
