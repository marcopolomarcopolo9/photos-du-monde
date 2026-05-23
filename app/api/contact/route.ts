import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_KEY) {
      return NextResponse.json({ error: 'Email non configuré' }, { status: 500 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Photos du Monde <onboarding@resend.dev>',
        to: ['marcetter983@gmail.com'],
        reply_to: email,
        subject: `[Contact] ${subject || 'Nouveau message'} — ${name}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px;background:#f9f7f4;">
            <h2 style="color:#c4962a;font-weight:300;font-style:italic;font-size:24px;margin:0 0 8px;">Nouveau message</h2>
            <p style="color:#888;font-size:12px;letter-spacing:0.1em;margin:0 0 32px;">Photos du Monde — Formulaire de contact</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4de;color:#888;font-size:13px;width:100px;">De</td><td style="padding:10px 0;border-bottom:1px solid #e8e4de;font-size:13px;">${name}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4de;color:#888;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e8e4de;font-size:13px;"><a href="mailto:${email}" style="color:#c4962a;">${email}</a></td></tr>
              ${subject ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e8e4de;color:#888;font-size:13px;">Sujet</td><td style="padding:10px 0;border-bottom:1px solid #e8e4de;font-size:13px;">${subject}</td></tr>` : ''}
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4de;color:#888;font-size:13px;">Date</td><td style="padding:10px 0;border-bottom:1px solid #e8e4de;font-size:13px;">${new Date().toLocaleString('fr-FR')}</td></tr>
            </table>
            <div style="background:#fff;padding:24px;border-left:3px solid #c4962a;">
              <p style="margin:0;font-size:14px;line-height:1.8;color:#333;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="margin:24px 0 0;font-size:11px;color:#aaa;text-align:center;">Photos du Monde — photosdumonde.fr</p>
          </div>
        `,
      }),
    });

    if (res.ok) return NextResponse.json({ success: true });
    const err = await res.json();
    return NextResponse.json({ error: err.message || 'Erreur envoi' }, { status: 500 });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
