import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const maxDuration = 60;

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'doxsjisyx';
const API_KEY = process.env.CLOUDINARY_API_KEY || '772726494954846';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || '6YD4mFIMsmSRSbpjpsNR8fWE3KU';
const FOLDER = 'photos-du-monde';

function makeSignature(params: Record<string, string | number>) {
  const sorted = Object.keys(params).sort()
    .map(k => `${k}=${params[k]}`)
    .join('&');
  return crypto.createHash('sha256').update(sorted + API_SECRET).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    // No file = return signature for client-side upload
    if (!file) {
      const timestamp = Math.round(Date.now() / 1000);
      const signature = makeSignature({ folder: FOLDER, timestamp });
      return NextResponse.json({ signature, timestamp, api_key: API_KEY, cloud_name: CLOUD_NAME, folder: FOLDER });
    }

    // Server-side upload to Cloudinary
    const timestamp = Math.round(Date.now() / 1000);
    const signature = makeSignature({ folder: FOLDER, timestamp });

    const bytes = await file.arrayBuffer();
    const blob = new Blob([bytes], { type: file.type || 'image/jpeg' });

    const fd = new FormData();
    fd.append('file', blob, file.name || 'upload.jpg');
    fd.append('api_key', API_KEY);
    fd.append('timestamp', String(timestamp));
    fd.append('signature', signature);
    fd.append('folder', FOLDER);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: fd,
    });

    const data = await res.json();

    if (data.secure_url) {
      // Return optimized URL with f_auto,q_auto
      const optimizedUrl = data.secure_url.replace(
        '/image/upload/',
        '/image/upload/f_auto,q_auto/'
      );
      return NextResponse.json({ url: optimizedUrl, success: true });
    }

    return NextResponse.json({ error: data.error?.message || 'Upload échoué' }, { status: 500 });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
