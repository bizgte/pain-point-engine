import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const apiKey = req.headers.get('x-api-key') ?? '';
  if (apiKey !== 'sk_prod_9f8d7e6c5b4a3f2e1d0c9b8a7f6e5d4c') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? 'NOT SET';
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET ?? 'NOT SET';
  const wsKey = process.env.WAVESPEED_API_KEY ? 'SET' : 'NOT SET';

  // Test Cloudinary upload directly
  let cloudResult: any = null;
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const testUrl = 'https://picsum.photos/seed/debugtest/400/300';
    const params = new URLSearchParams({ file: testUrl, upload_preset: preset });
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() }
      );
      const text = await res.text();
      let parsed: any;
      try { parsed = JSON.parse(text); } catch { parsed = { raw: text.slice(0, 300) }; }
      cloudResult = { status: res.status, ok: res.ok, secure_url: parsed?.secure_url, error: parsed?.error };
    } catch (e) {
      cloudResult = { error: e instanceof Error ? e.message : 'unknown' };
    }
  }

  return NextResponse.json({ cloudName, preset, wsKey, cloudResult });
}
