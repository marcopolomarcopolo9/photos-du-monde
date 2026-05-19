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
              cache: 'no-store',
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

function escStr(s: string) {
    return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ');
}

// GET: list voyages (just checks auth)
export async function GET(req: NextRequest) {
    if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    return NextResponse.json({ ok: true });
}

// POST: add a new voyage
export async function POST(req: NextRequest) {
    if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
        const voyage = await req.json();
        const { content, sha } = await getFileFromGitHub();

      const slug = voyage.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 50);

      const id = Date.now().toString();
        const lat = parseFloat(voyage.lat) || 0;
        const lng = parseFloat(voyage.lng) || 0;

      const photos = (voyage.photos || [])
          .map((p: { src: string; alt?: string; location?: string; date?: string }, i: number) => `    {
                id: '${id}-p${i}',
                      src: '${escStr(p.src)}',
                            alt: '${escStr(p.alt || '')}',
                                  location: '${escStr(p.location || voyage.city || '')}',
                                        country: '${escStr(voyage.country)}',
                                              continent: '${escStr(voyage.continent)}',
                                                    date: '${p.date || voyage.startDate}',
                                                          width: 1200,
                                                                height: 800,
                                                                      voyageSlug: '${slug}',
                                                                          }`)
          .join(',\n');

      const tips = (voyage.tips || [])
          .map((t: string) => `      '${escStr(t)}'`)
        .join(',\n');

      const anecdotes = (voyage.anecdotes || [])
          .map((a: { title: string; content: string; location?: string }, i: number) => `    {
                id: '${id}-a${i}',
            title: '${escStr(a.title)}',
                  content: '${escStr(a.content)}',
                        location: '${escStr(a.location || '')}',
                            }`)
          .join(',\n');

      const newVoyageCode = `  {
          id: '${id}',
              slug: '${slug}',
                  title: '${escStr(voyage.title)}',
                      subtitle: '${escStr(voyage.subtitle || '')}',
                          description: '${escStr(voyage.description || '')}',
                              country: '${escStr(voyage.country)}',
                                  continent: '${escStr(voyage.continent)}',
                                      city: '${escStr(voyage.city || '')}',
                                          region: '${escStr(voyage.region || voyage.city || '')}',
                                              startDate: '${voyage.startDate}',
                                                  endDate: '${voyage.endDate || voyage.startDate}',
                                                      duration: ${voyage.duration || 7},
                                                          heroImage: '${escStr(voyage.heroImage || '')}',
                                                              heroImageAlt: '${escStr(voyage.title)}',
                                                                  featured: true,
                                                                      coordinates: { lat: ${lat}, lng: ${lng} },
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

// PUT: update/edit a voyage by slug
export async function PUT(req: NextRequest) {
    if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
        const voyage = await req.json();
        const { slug } = voyage;
        const { content, sha } = await getFileFromGitHub();

      const lat = parseFloat(voyage.lat) || 0;
        const lng = parseFloat(voyage.lng) || 0;

      // Find the voyage block by slug and replace key fields
      // We update title, subtitle, description, country, continent, city, heroImage, coordinates
      let updatedContent = content;

      // Replace title
      updatedContent = updatedContent.replace(
              new RegExp(`(slug:\\s*'${slug}',[\\s\\S]*?title:\\s*)'[^']*'`),
              `$1'${escStr(voyage.title)}'`
            );
        // Replace subtitle
      updatedContent = updatedContent.replace(
              new RegExp(`(slug:\\s*'${slug}',[\\s\\S]*?subtitle:\\s*)'[^']*'`),
              `$1'${escStr(voyage.subtitle || '')}'`
            );
        // Replace description
      updatedContent = updatedContent.replace(
              new RegExp(`(slug:\\s*'${slug}',[\\s\\S]*?description:\\s*)'[^']*'`),
              `$1'${escStr(voyage.description || '')}'`
            );
        // Replace heroImage
      updatedContent = updatedContent.replace(
              new RegExp(`(slug:\\s*'${slug}',[\\s\\S]*?heroImage:\\s*)'[^']*'`),
              `$1'${escStr(voyage.heroImage || '')}'`
            );
        // Replace coordinates
      updatedContent = updatedContent.replace(
              new RegExp(`(slug:\\s*'${slug}',[\\s\\S]*?coordinates:\\s*)\\{[^}]*\\}`),
              `$1{ lat: ${lat}, lng: ${lng} }`
            );

      await pushFileToGitHub(updatedContent, sha, `Admin: Modification du voyage "${slug}"`);
        return NextResponse.json({ success: true });
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

      // Find and remove the voyage object block for this slug
      // Strategy: find the block between { ... } that contains the slug
      const lines = content.split('\n');
        const newLines: string[] = [];
        let depth = 0;
        let inTarget = false;
        let skipNext = false;

      for (let i = 0; i < lines.length; i++) {
              const line = lines[i];

          if (!inTarget && line.includes(`slug: '${slug}'`)) {
                    // Found the slug line — we need to remove back to the opening brace
                // Remove last added lines back to opening brace of this block
                while (newLines.length > 0) {
                            const last = newLines[newLines.length - 1];
                            newLines.pop();
                            if (last.trim() === '{') break;
                }
                    inTarget = true;
                    depth = 1;
                    skipNext = true;
                    continue;
          }

          if (inTarget) {
                    for (const ch of line) {
                                if (ch === '{') depth++;
                                if (ch === '}') depth--;
                    }
                    if (depth <= 0) {
                                inTarget = false;
                                // Also skip a trailing comma line
                      skipNext = true;
                    }
                    continue;
          }

          if (skipNext && line.trim() === ',') {
                    skipNext = false;
                    continue;
          }
              skipNext = false;

          newLines.push(line);
      }

      const updatedContent = newLines.join('\n');
        await pushFileToGitHub(updatedContent, sha, `Admin: Suppression du voyage "${slug}"`);
        return NextResponse.json({ success: true });
  } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
