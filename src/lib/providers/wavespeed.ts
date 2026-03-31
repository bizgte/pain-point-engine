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

const BASE_URL = "https://api.wavespeed.ai";

// ── Image generation (flux-schnell) ─────────────────────────────────────────
export async function generateWaveSpeedImage(
  prompt: string,
  size: string = "1024x576"
): Promise<WaveSpeedImageResponse> {
  const apiKey = process.env.WAVESPEED_API_KEY;
  if (!apiKey) return { imageUrl: "", error: "WaveSpeed API key not configured" };

  const res = await fetch(`${BASE_URL}/v1/wavespeed-ai/flux-schnell`, {
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

  if (!res.ok) {
    const text = await res.text();
    return { imageUrl: "", error: `WaveSpeed error: ${text}` };
  }

  const data = await res.json();

  // WaveSpeed returns outputs array or data array
  const url =
    data?.outputs?.[0] ??
    data?.data?.[0]?.url ??
    data?.images?.[0]?.url ??
    data?.url ?? "";

  if (!url) return { imageUrl: "", error: "No image URL in response" };
  return { imageUrl: url };
}

// ── Video generation ─────────────────────────────────────────────────────────
export async function submitWaveSpeedJob(
  req: WaveSpeedJobRequest
): Promise<WaveSpeedJobResponse> {
  const apiKey = process.env.WAVESPEED_API_KEY;
  if (!apiKey) {
    return { jobId: "stub", status: "failed", error: "WaveSpeed API key not configured" };
  }

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
  const jobId = data?.data?.task_id ?? data?.task_id ?? data?.id ?? "";
  return { jobId, status: "queued" };
}

export async function pollWaveSpeedJob(jobId: string): Promise<WaveSpeedJobResponse> {
  const apiKey = process.env.WAVESPEED_API_KEY;
  if (!apiKey) return { jobId, status: "failed", error: "WaveSpeed API key not configured" };

  const res = await fetch(`${BASE_URL}/v1/query/result/?task_id=${jobId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) return { jobId, status: "failed", error: `Status check failed: ${res.status}` };

  const data = await res.json();
  const taskData = data?.data ?? data;
  const status = taskData?.status ?? "";

  if (status === "completed" || status === "succeed") {
    const videoUrl = taskData?.outputs?.[0] ?? taskData?.video_url ?? "";
    return { jobId, status: "completed", videoUrl };
  }
  if (status === "failed" || status === "error") {
    return { jobId, status: "failed", error: taskData?.error ?? "Failed" };
  }
  return { jobId, status: "processing" };
}
