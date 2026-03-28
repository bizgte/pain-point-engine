export interface KieJobRequest {
  model: string;
  prompt: string;
  imageUrl?: string;
  durationSeconds?: number;
}

export interface KieJobResponse {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  videoUrl?: string;
  error?: string;
}

const BASE_URL = "https://api.kie.ai";

export async function submitKieJob(req: KieJobRequest): Promise<KieJobResponse> {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) {
    return { jobId: "stub", status: "failed", error: "Kie API key not configured" };
  }

  const body: Record<string, unknown> = {
    model: req.model,
    prompt: req.prompt,
    n: 1,
  };
  if (req.imageUrl) {
    body.image = req.imageUrl;
  }
  if (req.durationSeconds) {
    body.duration = req.durationSeconds;
  }

  const res = await fetch(`${BASE_URL}/v1/videos/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return { jobId: "", status: "failed", error: await res.text() };
  }

  const data = await res.json();
  return {
    jobId: data.id ?? data.data?.id ?? "",
    status: "queued",
  };
}

export async function pollKieJob(jobId: string): Promise<KieJobResponse> {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) {
    return { jobId, status: "failed", error: "Kie API key not configured" };
  }

  const res = await fetch(`${BASE_URL}/v1/videos/generations/${jobId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    return { jobId, status: "failed", error: await res.text() };
  }

  const data = await res.json();
  const raw = data.data ?? data;
  const status =
    raw.status === "completed" || raw.state === "completed"
      ? "completed"
      : raw.status === "failed" || raw.state === "failed"
      ? "failed"
      : "processing";

  return {
    jobId,
    status,
    videoUrl: raw.url ?? raw.video_url ?? raw.output,
    error: raw.error,
  };
}
