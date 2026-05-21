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

// PUT: replace NAV_ITEMS
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const { items } = await req.json();
    const { content, sha } = await getFile();

    const itemsCode = items.map((item: { href: string; label: string }) =>
      `  { href: '${item.href}', label: '${item.label}' }`
    ).join(',\n');

    let updated: string;
    if (content.includes('export const NAV_ITEMS')) {
      updated = content.replace(
        /export const NAV_ITEMS\s*=\s*\[[\s\S]*?\];/,
        `export const NAV_ITEMS = [\n${itemsCode},\n];`
      );
    } else {
      // Append at end of file
      updated = content + `\nexport const NAV_ITEMS = [\n${itemsCode},\n];\n`;
    }

    await pushFile(updated, sha, 'Admin: Mise à jour de la navigation');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
