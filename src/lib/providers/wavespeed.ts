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

const BASE_URL = "https://api.wavespeed.ai";

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
  if (req.imageUrl) {
    body.image_url = req.imageUrl;
  }

  const res = await fetch(`${BASE_URL}${req.endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    return { jobId: "", status: "failed", error: err };
  }

  const data = await res.json();
  return {
    jobId: data.id ?? data.job_id ?? "",
    status: "queued",
  };
}

export async function pollWaveSpeedJob(jobId: string): Promise<WaveSpeedJobResponse> {
  const apiKey = process.env.WAVESPEED_API_KEY;
  if (!apiKey) {
    return { jobId, status: "failed", error: "WaveSpeed API key not configured" };
  }

  const res = await fetch(`${BASE_URL}/v1/predictions/${jobId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    return { jobId, status: "failed", error: await res.text() };
  }

  const data = await res.json();
  const status = data.status === "completed"
    ? "completed"
    : data.status === "failed"
    ? "failed"
    : "processing";

  return {
    jobId,
    status,
    videoUrl: data.output?.[0] ?? data.video_url,
    error: data.error,
  };
}
