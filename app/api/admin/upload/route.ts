import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';


const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'doxsjisyx';
const API_KEY = process.env.CLOUDINARY_API_KEY || '772726494954846';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || '6YD4mFIMsmSRSbpjpsNR8fWE3KU';
const folder = 'photos-du-monde';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    // No file = return signature for legacy calls
    if (!file) {
      const timestamp = Math.round(Date.now() / 1000);
      const sig = crypto.createHash('sha256')
        .update(`folder=${folder}&timestamp=${timestamp}` + API_SECRET)
        .digest('hex');
      return NextResponse.json({ signature: sig, timestamp, api_key: API_KEY, cloud_name: CLOUD_NAME, folder });
    }

    // Server-side upload to Cloudinary
    const timestamp = Math.round(Date.now() / 1000);
    const sig = crypto.createHash('sha256')
      .update(`folder=${folder}&timestamp=${timestamp}` + API_SECRET)
      .digest('hex');

    const bytes = await file.arrayBuffer();
    const blob = new Blob([bytes], { type: file.type || 'image/jpeg' });

    const fd = new FormData();
    fd.append('file', blob, file.name || 'upload.jpg');
    fd.append('api_key', API_KEY);
    fd.append('timestamp', String(timestamp));
    fd.append('signature', sig);
    fd.append('folder', folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: fd }
    );

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
    console.error('Upload error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
