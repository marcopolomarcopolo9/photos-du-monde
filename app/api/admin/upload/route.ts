import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function checkAuth(req: NextRequest) {
  const cookie = req.cookies.get('admin_auth')?.value;
  return cookie === (process.env.ADMIN_PASSWORD || 'admin123');
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'doxsjisyx';
  const API_KEY = process.env.CLOUDINARY_API_KEY || '772726494954846';
  const API_SECRET = process.env.CLOUDINARY_API_SECRET || '6YD4mFIMsmSRSbpjpsNR8fWE3KU';

  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'photos-du-monde';
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash('sha256')
    .update(paramsToSign + API_SECRET)
    .digest('hex');

  return NextResponse.json({
    signature,
    timestamp,
    api_key: API_KEY,
    cloud_name: CLOUD_NAME,
    folder,
  });
}
