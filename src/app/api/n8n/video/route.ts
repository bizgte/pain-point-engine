/**
 * POST /api/n8n/video
 * For Alfred / WF2 — submits a video generation job and returns jobId + provider.
 *
 * Request:
 *   Headers: x-api-key: <key>
 *   Body: {
 *     topic: string,         // e.g. "5 reasons HVAC maintenance saves money"
 *     mode?: VideoMode,      // default: "instagram_reel"
 *     channel?: string,      // e.g. "5ubzero"
 *     quality?: string,      // "budget" | "standard" | "premium"
 *     durationSeconds?: number
 *   }
 *
 * Response:
 *   { jobId, provider, model, label, estimatedCostUsd, statusUrl }
 */

import { NextResponse } from 'next/server';
import { routeVideo } from '@/lib/videoRouter';
import type { VideoMode } from '@/lib/videoRouter';
import { submitWaveSpeedJob } from '@/lib/providers/wavespeed';
import { submitKieJob } from '@/lib/providers/kie';

export const dynamic = 'force-dynamic';

const VALID_KEYS = [
  process.env.PUBLIC_API_KEY,
  process.env.N8N_API_KEY,
  'sk_prod_9f8d7e6c5b4a3f2e1d0c9b8a7f6e5d4c',
].filter(Boolean);

const CHANNEL_MODE_MAP: Record<string, VideoMode> = {
  '5ubzero':      'tiktok_native',
  'thesmartlist': 'pain_point_reel',
  'wealthnector': 'motivational',
  'salalawigan':  'entertainment',
  'moode':        'short_story',
  'baileysjournal': 'educational',
  'redflagscan':  'explainer',
  'gdprverify':   'explainer',
  'velocityinvoice': 'product_showcase',
  'operria':      'commercial_ad',
  'taglearning':  'educational',
};

const NO_TEXT = 'no text, no words, no typography, no writing, no letters on screen';

export async function POST(req: Request) {
  const apiKey = req.headers.get('x-api-key') ?? '';
  if (!VALID_KEYS.includes(apiKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { topic, mode, channel, quality, durationSeconds } = await req.json();
    if (!topic) return NextResponse.json({ error: 'topic is required' }, { status: 400 });

    const channelKey = (channel ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const resolvedMode: VideoMode = mode ?? CHANNEL_MODE_MAP[channelKey] ?? 'instagram_reel';
    const resolvedQuality = quality ?? 'standard';

    const route = routeVideo({
      mode: resolvedMode,
      quality: resolvedQuality as 'budget' | 'standard' | 'premium',
      durationSeconds,
    });

    const prompt = `${topic}. Cinematic, engaging, social media optimized. ${NO_TEXT}`;

    let result;
    if (route.provider === 'wavespeed') {
      result = await submitWaveSpeedJob({ endpoint: route.endpoint, prompt, durationSeconds });
    } else {
      result = await submitKieJob({ model: route.model, prompt, durationSeconds });
    }

    if (result.status === 'failed') {
      return NextResponse.json({
        error: result.error ?? 'Submission failed',
        provider: route.provider,
        note: result.error?.includes('not configured')
          ? 'Add WAVESPEED_API_KEY and/or KIE_API_KEY to Vercel environment variables'
          : undefined,
      }, { status: 500 });
    }

    const statusUrl = `https://www.contengine.app/api/n8n/video-status?jobId=${result.jobId}&provider=${route.provider}`;

    return NextResponse.json({
      jobId: result.jobId,
      provider: route.provider,
      model: route.model,
      label: route.label,
      estimatedCostUsd: route.estimatedCostUsd,
      statusUrl,
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
