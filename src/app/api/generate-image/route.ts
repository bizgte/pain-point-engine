import { NextResponse } from 'next/server';
import { generateWaveSpeedImage } from '@/lib/providers/wavespeed';

export const dynamic = 'force-dynamic';

const NO_TEXT_RULES = 'no text, no words, no typography, no writing, no letters, no labels, no signs, no captions, no watermarks, no overlays';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { industryName, prompt, size } = body;

    if (!industryName && !prompt) {
      return NextResponse.json({ error: 'Missing industryName or prompt' }, { status: 400 });
    }

    const fullPrompt = prompt
      ? `${prompt}, ${NO_TEXT_RULES}`
      : `Cinematic photorealistic scene representing ${industryName}. Professional, modern, high quality. ${NO_TEXT_RULES}`;

    // Try WaveSpeed first (best quality, requires API key)
    const result = await generateWaveSpeedImage(fullPrompt, size ?? '1024x576');

    if (result.imageUrl) {
      return NextResponse.json({ imageUrl: result.imageUrl });
    }

    // Fallback: picsum with deterministic seed from prompt
    const seed = Math.abs(
      (industryName ?? prompt ?? 'default')
        .split('')
        .reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)
    ) % 1000;
    const fallbackUrl = `https://picsum.photos/seed/${seed}/1200/630`;
    return NextResponse.json({ imageUrl: fallbackUrl, fallback: true });

  } catch (error) {
    console.error('generate-image error:', error);
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
  }
}
