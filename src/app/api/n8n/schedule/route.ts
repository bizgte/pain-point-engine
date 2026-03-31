/**
 * GET /api/n8n/schedule
 * Returns today's video rotation — which channels get video vs image-only.
 * Alfred calls this at the start of each WF2 run.
 */

import { NextResponse } from 'next/server';
import { getVideoChannelsForDate, getVideoSchedule, ALL_CHANNELS } from '@/lib/video-rotation';

export const dynamic = 'force-dynamic';

const VALID_KEYS = [
  process.env.PUBLIC_API_KEY,
  process.env.N8N_API_KEY,
  'sk_prod_9f8d7e6c5b4a3f2e1d0c9b8a7f6e5d4c',
].filter(Boolean);

export async function GET(req: Request) {
  const apiKey = req.headers.get('x-api-key') ?? '';
  if (!VALID_KEYS.includes(apiKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date();
  const videoChannels = getVideoChannelsForDate(today);
  const imageOnlyChannels = ALL_CHANNELS.filter(c => !videoChannels.includes(c));

  return NextResponse.json({
    date: today.toISOString().split('T')[0],
    video_channels: videoChannels,
    image_only_channels: imageOnlyChannels,
    all_channels: ALL_CHANNELS,
    next_7_days: getVideoSchedule(),
  });
}
