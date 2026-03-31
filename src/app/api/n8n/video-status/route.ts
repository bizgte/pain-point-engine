/**
 * GET /api/n8n/video-status?jobId=xxx&provider=wavespeed|kie
 * For Alfred / WF2 — polls video job status.
 *
 * Response:
 *   { status: "queued"|"processing"|"completed"|"failed", videoUrl?, error? }
 */

import { NextResponse } from 'next/server';
import { pollWaveSpeedJob } from '@/lib/providers/wavespeed';
import { pollKieJob } from '@/lib/providers/kie';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId    = searchParams.get('jobId') ?? '';
  const provider = searchParams.get('provider') ?? 'wavespeed';

  if (!jobId) return NextResponse.json({ error: 'jobId required' }, { status: 400 });

  const result = provider === 'kie'
    ? await pollKieJob(jobId)
    : await pollWaveSpeedJob(jobId);

  return NextResponse.json(result);
}
