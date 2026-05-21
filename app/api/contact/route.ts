import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'marcopolomarcopolo9/photos-du-monde';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    // Store message as a GitHub issue
    const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        title: `Contact: ${name} — ${subject || 'Sans sujet'}`,
        body: `**De:** ${name} <${email}>\n**Date:** ${new Date().toLocaleString('fr-FR')}\n\n---\n\n${message}`,
        labels: ['contact'],
      }),
    });

    if (res.ok) return NextResponse.json({ success: true });
    return NextResponse.json({ error: 'Erreur envoi' }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
