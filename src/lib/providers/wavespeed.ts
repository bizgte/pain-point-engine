const BASE_URL = "https://api.wavespeed.ai/api/v1";
const RESULT_BASE = "https://api.wavespeed.ai/api/v2/predictions";

// ── Types ────────────────────────────────────────────────────────────────────
export interface WaveSpeedJobRequest {
  endpoint: string;
  prompt: string;
  imageUrl?: string;
  durationSeconds?: number;
}

export interface WaveSpeedJobResponse {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  videoUrl?: string;
  error?: string;
}

export interface WaveSpeedImageResponse {
  imageUrl: string;
  error?: string;
}

// ── Image generation (flux-schnell, async with poll) ─────────────────────────
export async function generateWaveSpeedImage(
  prompt: string,
  size: string = "1024x576"
): Promise<WaveSpeedImageResponse> {
  const apiKey = process.env.WAVESPEED_API_KEY;
  if (!apiKey) return { imageUrl: "", error: "WaveSpeed API key not configured" };

  // Submit job
  const submitRes = await fetch(`${BASE_URL}/wavespeed-ai/flux-schnell`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      num_images: 1,
      size,
      enable_safety_checker: false,
    }),
  });

  if (!submitRes.ok) {
    const text = await submitRes.text();
    return { imageUrl: "", error: `WaveSpeed submit error: ${text}` };
  }

  const submitData = await submitRes.json();
  const predictionId = submitData?.data?.id ?? submitData?.id ?? "";
  const resultUrl = submitData?.data?.urls?.get ?? `${RESULT_BASE}/${predictionId}/result`;

  if (!predictionId) return { imageUrl: "", error: "No prediction ID returned" };

  // Poll for result (max 30s)
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 3000));

    const pollRes = await fetch(resultUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!pollRes.ok) continue;

    const pollData = await pollRes.json();
    const outputs: string[] = pollData?.data?.outputs ?? pollData?.outputs ?? [];
    const status = pollData?.data?.status ?? pollData?.status ?? "";
    const err = pollData?.data?.error ?? pollData?.error ?? "";

    if (outputs.length > 0 && outputs[0]) {
      return { imageUrl: outputs[0] };
    }
    if (err && err !== "" && status === "failed") {
      return { imageUrl: "", error: err };
    }
  }

  return { imageUrl: "", error: "WaveSpeed image generation timed out" };
}

// ── Video generation ─────────────────────────────────────────────────────────
export async function submitWaveSpeedJob(
  req: WaveSpeedJobRequest
): Promise<WaveSpeedJobResponse> {
  const apiKey = process.env.WAVESPEED_API_KEY;
  if (!apiKey) return { jobId: "stub", status: "failed", error: "WaveSpeed API key not configured" };

  const body: Record<string, unknown> = {
    prompt: req.prompt,
    duration: req.durationSeconds ?? 5,
  };
  if (req.imageUrl) body.image_url = req.imageUrl;

  const res = await fetch(`${BASE_URL}${req.endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    return { jobId: "", status: "failed", error: text };
  }

  const data = await res.json();
  const jobId = data?.data?.id ?? data?.id ?? "";
  return { jobId, status: "queued" };
}

export async function pollWaveSpeedJob(jobId: string): Promise<WaveSpeedJobResponse> {
  const apiKey = process.env.WAVESPEED_API_KEY;
  if (!apiKey) return { jobId, status: "failed", error: "WaveSpeed API key not configured" };

  const res = await fetch(`${RESULT_BASE}/${jobId}/result`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) return { jobId, status: "failed", error: `Status check failed: ${res.status}` };

  const data = await res.json();
  const taskData = data?.data ?? data;
  const status = taskData?.status ?? "";
  const outputs: string[] = taskData?.outputs ?? [];

  if (outputs.length > 0 && outputs[0]) {
    return { jobId, status: "completed", videoUrl: outputs[0] };
  }
  if (status === "failed" || status === "error") {
    return { jobId, status: "failed", error: taskData?.error ?? "Failed" };
  }
  return { jobId, status: "processing" };
}
