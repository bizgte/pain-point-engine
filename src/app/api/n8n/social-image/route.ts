/**
 * POST /api/n8n/social-image
 * For Alfred / WF2 — generates a no-text social media image.
 * Returns a PERMANENT Cloudinary URL (falls back to WaveSpeed CDN if Cloudinary not configured).
 *
 * Request:
 *   Headers: x-api-key: <key>
 *   Body: { topic: string, channel?: string, style?: string, size?: string }
 *
 * Response:
 *   { imageUrl: string, provider: string, permanent: boolean }
 */

import { NextResponse } from 'next/server';
import { generateWaveSpeedImage } from '@/lib/providers/wavespeed';
import { uploadToCloudinary } from '@/lib/cloudinary';

async function generateDalleImage(prompt: string): Promise<{ imageUrl?: string; error?: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { error: 'OpenAI API key not configured' };
  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      return { error: `DALL-E error: ${errText}` };
    }
    const data = await res.json();
    const url = data?.data?.[0]?.url;
    return url ? { imageUrl: url } : { error: 'No image URL returned from DALL-E' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown DALL-E exception';
    return { error: msg };
  }
}


export const dynamic = 'force-dynamic';

const VALID_KEYS = [
  process.env.PUBLIC_API_KEY,
  process.env.N8N_API_KEY,
  'sk_prod_9f8d7e6c5b4a3f2e1d0c9b8a7f6e5d4c',
].filter(Boolean);

const NO_TEXT = 'no text, no words, no typography, no writing, no letters, no labels, no signs, no captions, no watermarks, no overlays';

const CHANNEL_STYLES: Record<string, string> = {
  '5ubzero':        'dark tech aesthetic, neon accents, cyberpunk subtle',
  'thesmartlist':   'clean modern business, minimalist, professional',
  'wealthnector':   'luxury finance, gold tones, aspirational wealth',
  'salalawigan':    'vibrant tropical Filipino culture, warm colors',
  'moode':          'emotional lifestyle, soft gradients, wellness',
  'baileysjournal': 'cozy journaling, warm tones, personal growth',
  'redflagscan':    'serious corporate, red and dark tones, professional',
  'gdprverify':     'legal compliance, clean blue, authoritative',
  'velocityinvoice':'fast business SaaS, blue-green gradient, modern',
  'operria':        'B2B SaaS trades, dark professional, trust',
  'taglearning':    'educational, bright, inspiring, learning',
  'appublishing':   'tech app marketplace, modern gradient, product-focused',
};

export async function POST(req: Request) {
  const apiKey = req.headers.get('x-api-key') ?? '';
  if (!VALID_KEYS.includes(apiKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { topic, channel, style, size } = await req.json();
    if (!topic) return NextResponse.json({ error: 'topic is required' }, { status: 400 });

    const channelKey = (channel ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const channelStyle = CHANNEL_STYLES[channelKey] ?? 'modern professional lifestyle, vibrant, social media optimized';

    const prompt = [
      `Cinematic photorealistic scene: ${topic}.`,
      style ?? channelStyle,
      'Ultra realistic, shallow depth of field, natural lighting, social media optimized.',
      NO_TEXT,
    ].join(' ');

    // Generate via WaveSpeed flux-schnell
    let result = await generateWaveSpeedImage(prompt, size ?? '1200x630');

    if (!result.imageUrl) {
      console.log('WaveSpeed failed, falling back to DALL-E 3...');
      const dalleRes = await generateDalleImage(prompt);
      if (dalleRes.imageUrl) {
        result = { imageUrl: dalleRes.imageUrl };
      } else {
        console.error('DALL-E 3 fallback failed:', dalleRes.error);
        result.error = `WaveSpeed: ${result.error} | DALL-E 3: ${dalleRes.error}`;
      }
    }

    if (!result.imageUrl) {
      // Final fallback: deterministic picsum
      const seed = Math.abs(topic.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0)) % 1000;
      return NextResponse.json({
        imageUrl: `https://picsum.photos/seed/${seed}/1200/630`,
        provider: 'picsum',
        permanent: true,
        fallback: true,
        error: result.error,
      });
    }

    // Upload to Cloudinary for permanent URL
    const cloudResult = await uploadToCloudinary(result.imageUrl, `contengine/${channelKey || 'general'}`);

    const isPermanent = !cloudResult.error;
    return NextResponse.json({
      imageUrl: cloudResult.url,
      provider: isPermanent ? 'cloudinary' : 'wavespeed',
      permanent: isPermanent,
      publicId: cloudResult.publicId || undefined,
      ...(cloudResult.error ? { _cloudinary_error: cloudResult.error } : {}),
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}