import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = 'marcopolomarcopolo9';
const GITHUB_REPO = 'photos-du-monde';
const FILE_PATH = 'lib/data.ts';

function checkAuth(req: NextRequest) {
  const cookie = req.cookies.get('admin_auth')?.value;
  return cookie === (process.env.ADMIN_PASSWORD || 'admin123');
}

async function getFile() {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' }, cache: 'no-store' }
  );
  const data = await res.json();
  return { content: Buffer.from(data.content, 'base64').toString('utf-8'), sha: data.sha };
}

async function pushFile(content: string, sha: string, message: string) {
  return fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, content: Buffer.from(content, 'utf-8').toString('base64'), sha }),
    }
  );
}

function esc(s: string) {
  return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ');
}

// PUT: replace HERO_SLIDES array with new slides
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const { slides } = await req.json();
    const { content, sha } = await getFile();

    const slidesCode = slides.map((s: { id: number; image: string; country: string; location: string; title: string; subtitle: string; slug: string; year: string }, i: number) => `  {
    id: ${i + 1},
    image: \`${s.image}\`,
    country: '${esc(s.country)}',
    location: '${esc(s.location)}',
    title: \`${s.title.replace(/`/g, '\\`')}\`,
    subtitle: \`${s.subtitle.replace(/`/g, '\\`')}\`,
    slug: '${esc(s.slug)}',
    year: '${esc(s.year)}',
  }`).join(',\n');

    const updated = content.replace(
      /export const HERO_SLIDES\s*=\s*\[[\s\S]*?\];/,
      `export const HERO_SLIDES = [\n${slidesCode},\n];`
    );

    await pushFile(updated, sha, 'Admin: Mise à jour des slides hero');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
