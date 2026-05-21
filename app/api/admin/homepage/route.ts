// @ts-nocheck
import { NextResponse } from 'next/server';
import { HOMEPAGE_CONFIG } from '../../../../lib/homepage';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'marcopolomarcopolo9/photos-du-monde';
const FILE_PATH = 'lib/homepage.ts';

export async function GET() {
  return NextResponse.json({ config: HOMEPAGE_CONFIG });
}

export async function PUT(req) {
  try {
    const { config } = await req.json();
    
    // Get current file SHA from GitHub
    const shaRes = await fetch('https://api.github.com/repos/' + REPO + '/contents/' + FILE_PATH, {
      headers: { Authorization: 'Bearer ' + GITHUB_TOKEN, Accept: 'application/vnd.github.v3+json' }
    });
    const shaData = await shaRes.json();
    const sha = shaData.sha;
    
    if (!sha) {
      return NextResponse.json({ success: false, error: 'Could not get file SHA' }, { status: 500 });
    }
    
    // Build new file content
    const newContent = '// @ts-nocheck\n// Configuration page accueil — modifiable depuis admin CMS\n\nexport const HOMEPAGE_CONFIG = ' + JSON.stringify(config, null, 2) + ';\n';
    
    // Convert to base64
    const encoded = Buffer.from(newContent).toString('base64');
    
    // Push to GitHub
    const updateRes = await fetch('https://api.github.com/repos/' + REPO + '/contents/' + FILE_PATH, {
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + GITHUB_TOKEN, 'Content-Type': 'application/json', Accept: 'application/vnd.github.v3+json' },
      body: JSON.stringify({ message: 'CMS: Update homepage config', content: encoded, sha })
    });
    
    if (!updateRes.ok) {
      const err = await updateRes.text();
      return NextResponse.json({ success: false, error: err }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
