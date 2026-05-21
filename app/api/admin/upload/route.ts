import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'doxsjisyx';
  const API_KEY = process.env.CLOUDINARY_API_KEY || '772726494954846';
  const API_SECRET = process.env.CLOUDINARY_API_SECRET || '6YD4mFIMsmSRSbpjpsNR8fWE3KU';

  try {
    const body = await req.formData().catch(() => null);
    
    // Mode signature seule (GET signature puis upload client-side)
    if (!body || !body.get('file')) {
      const timestamp = Math.round(Date.now() / 1000);
      const folder = 'photos-du-monde';
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
      const signature = crypto
        .createHash('sha256')
        .update(paramsToSign + API_SECRET)
        .digest('hex');
      return NextResponse.json({ signature, timestamp, api_key: API_KEY, cloud_name: CLOUD_NAME, folder });
    }

    // Mode upload direct (fichier envoyé à cette API, on relaie à Cloudinary)
    const file = body.get('file') as File;
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'photos-du-monde';
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash('sha256')
      .update(paramsToSign + API_SECRET)
      .digest('hex');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', API_KEY);
    fd.append('timestamp', String(timestamp));
    fd.append('signature', signature);
    fd.append('folder', folder);

    const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: fd,
    });
    const data = await cloudRes.json();
    
    if (data.secure_url) {
      return NextResponse.json({ url: data.secure_url, success: true });
    }
    return NextResponse.json({ error: data.error?.message || 'Upload failed' }, { status: 500 });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
