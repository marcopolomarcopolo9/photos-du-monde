import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'doxsjisyx';
  const API_KEY = process.env.CLOUDINARY_API_KEY || '772726494954846';
  const API_SECRET = process.env.CLOUDINARY_API_SECRET || '6YD4mFIMsmSRSbpjpsNR8fWE3KU';

  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'photos-du-monde';

  // Include quality params in signature
  const paramsToSign = `fetch_format=auto&folder=${folder}&quality=auto:good&timestamp=${timestamp}`;
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
