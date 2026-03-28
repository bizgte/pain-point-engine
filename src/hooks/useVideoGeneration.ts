"use client";

import { useState, useCallback, useRef } from "react";

export type VideoGenStatus = "idle" | "submitting" | "processing" | "completed" | "failed";

export interface VideoGenState {
  status: VideoGenStatus;
  jobId: string;
  videoUrl: string;
  provider: string;
  label: string;
  error: string;
}

export interface UseVideoGenerationOptions {
  pollIntervalMs?: number;
}

export function useVideoGeneration(opts: UseVideoGenerationOptions = {}) {
  const { pollIntervalMs = 4000 } = opts;
  const [state, setState] = useState<VideoGenState>({
    status: "idle",
    jobId: "",
    videoUrl: "",
    provider: "",
    label: "",
    error: "",
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState({ status: "idle", jobId: "", videoUrl: "", provider: "", label: "", error: "" });
  }, []);

  const generate = useCallback(
    async (params: {
      mode: string;
      prompt: string;
      quality?: string;
      imageUrl?: string;
      durationSeconds?: number;
    }) => {
      setState((s) => ({ ...s, status: "submitting", error: "", videoUrl: "" }));

      try {
        const res = await fetch("/api/video/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });
        const data = await res.json();

        if (!res.ok || data.error) {
          setState((s) => ({ ...s, status: "failed", error: data.error ?? "Failed" }));
          return;
        }

        setState((s) => ({
          ...s,
          status: "processing",
          jobId: data.jobId,
          provider: data.provider,
          label: data.label,
        }));

        // Start polling
        const poll = async () => {
          const r = await fetch(
            `/api/video/status/${data.jobId}?provider=${data.provider}`
          );
          const s = await r.json();

          if (s.status === "completed") {
            setState((prev) => ({ ...prev, status: "completed", videoUrl: s.videoUrl ?? "" }));
          } else if (s.status === "failed") {
            setState((prev) => ({ ...prev, status: "failed", error: s.error ?? "Video failed" }));
          } else {
            timerRef.current = setTimeout(poll, pollIntervalMs);
          }
        };

        timerRef.current = setTimeout(poll, pollIntervalMs);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Network error";
        setState((s) => ({ ...s, status: "failed", error: msg }));
      }
    },
    [pollIntervalMs]
  );

  return { state, generate, reset };
}
