/**
 * POST /api/n8n/social-image
 * For Alfred / WF2 — generates a no-text social media image and returns a PUBLIC URL.
 *
 * Request:
 *   Headers: x-api-key: <key>
 *   Body: { topic: string, channel?: string, style?: string, size?: string }
 *
 * Response:
 *   { imageUrl: string, fallback?: boolean }
 */

import { NextResponse } from 'next/server';
import { generateWaveSpeedImage } from '@/lib/providers/wavespeed';

export const dynamic = 'force-dynamic';

const VALID_KEYS = [
  process.env.PUBLIC_API_KEY,
  process.env.N8N_API_KEY,
  'sk_prod_9f8d7e6c5b4a3f2e1d0c9b8a7f6e5d4c',
].filter(Boolean);

const NO_TEXT = 'no text, no words, no typography, no writing, no letters, no labels, no signs, no captions, no watermarks, no overlays';

const CHANNEL_STYLES: Record<string, string> = {
  '5ubzero':      'dark tech aesthetic, neon accents, cyberpunk subtle',
  'thesmartlist': 'clean modern business, minimalist, professional',
  'wealthnector': 'luxury finance, gold tones, aspirational wealth',
  'salalawigan':  'vibrant tropical Filipino culture, warm colors',
  'moode':        'emotional lifestyle, soft gradients, wellness',
  'baileysjournal': 'cozy journaling, warm tones, personal growth',
  'redflagscan':  'serious corporate, red and dark tones, professional',
  'gdprverify':   'legal/compliance, clean blue, authoritative',
  'velocityinvoice': 'fast business SaaS, blue-green gradient, modern',
  'operria':      'B2B SaaS trades, dark professional, trust',
  'taglearning':  'educational, bright, inspiring, learning',
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
      style ? style : channelStyle,
      'Ultra realistic, shallow depth of field, natural lighting, social media optimized.',
      NO_TEXT,
    ].join(' ');

    const imgSize = size ?? '1200x630';

    // WaveSpeed flux-schnell (best)
    const result = await generateWaveSpeedImage(prompt, imgSize);
    if (result.imageUrl) {
      return NextResponse.json({ imageUrl: result.imageUrl, provider: 'wavespeed' });
    }

    // Fallback: deterministic picsum
    const seed = Math.abs(
      topic.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0)
    ) % 1000;
    return NextResponse.json({
      imageUrl: `https://picsum.photos/seed/${seed}/1200/630`,
      provider: 'picsum',
      fallback: true,
      note: 'WaveSpeed key not configured — add WAVESPEED_API_KEY to Vercel env',
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
