import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'doxsjisyx';
const API_KEY = process.env.CLOUDINARY_API_KEY || '772726494954846';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || '6YD4mFIMsmSRSbpjpsNR8fWE3KU';
const folder = 'photos-du-monde';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    // If no file — return signature for direct upload (legacy)
    if (!file) {
      const timestamp = Math.round(Date.now() / 1000);
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
      const signature = crypto.createHash('sha256').update(paramsToSign + API_SECRET).digest('hex');
      return NextResponse.json({ signature, timestamp, api_key: API_KEY, cloud_name: CLOUD_NAME, folder });
    }

    // Upload file server-side to Cloudinary — no CORS issues
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto.createHash('sha256').update(paramsToSign + API_SECRET).digest('hex');

    const bytes = await file.arrayBuffer();
    const blob = new Blob([bytes], { type: file.type });

    const fd = new FormData();
    fd.append('file', blob, file.name);
    fd.append('api_key', API_KEY);
    fd.append('timestamp', String(timestamp));
    fd.append('signature', signature);
    fd.append('folder', folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: fd,
    });

    const data = await res.json();
    if (data.secure_url) {
      return NextResponse.json({ url: data.secure_url, success: true });
    }
    return NextResponse.json({ error: data.error?.message || 'Upload échoué' }, { status: 500 });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
