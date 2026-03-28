"use client";

import { useState } from "react";
import { CONTENT_MODES } from "@/lib/modeInputSchemas";
import type { VideoMode } from "@/lib/videoRouter";
import { routeVideo } from "@/lib/videoRouter";

const VIDEO_MODES: VideoMode[] = [
  "pain_point_reel", "product_showcase", "ugc_ad", "vfx_ad", "commercial_ad",
  "short_story", "brand_story", "testimonial", "explainer", "educational",
  "youtube_short", "tiktok_native", "instagram_reel", "linkedin_video",
];

const MODE_LABELS: Record<VideoMode, string> = {
  pain_point_reel: "Pain-Point Reel",
  product_showcase: "Product Showcase",
  ugc_ad: "UGC Ad",
  vfx_ad: "VFX Ad",
  commercial_ad: "Commercial Ad",
  short_story: "Short Story",
  children_story: "Children Story",
  brand_story: "Brand Story",
  testimonial: "Testimonial",
  explainer: "Explainer",
  educational: "Educational",
  motivational: "Motivational",
  entertainment: "Entertainment",
  news_recap: "News Recap",
  documentary: "Documentary",
  youtube_short: "YouTube Short",
  tiktok_native: "TikTok Native",
  instagram_reel: "Instagram Reel",
  linkedin_video: "LinkedIn Video",
};

export default function VideoPage() {
  const [mode, setMode] = useState<VideoMode>("pain_point_reel");
  const [prompt, setPrompt] = useState("");
  const [quality, setQuality] = useState<"budget" | "standard" | "premium">("standard");
  const [status, setStatus] = useState<"idle" | "submitting" | "processing" | "completed" | "failed">("idle");
  const [jobId, setJobId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  const route = routeVideo({ mode, quality });

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setStatus("submitting");
    setError("");
    setVideoUrl("");

    try {
      const res = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, prompt, quality }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Generation failed");
        setStatus("failed");
        return;
      }

      setJobId(data.jobId);
      setStatus("processing");

      // Poll for status
      const poll = async () => {
        const r = await fetch(`/api/video/status/${data.jobId}`);
        const s = await r.json();
        if (s.status === "completed") {
          setVideoUrl(s.videoUrl ?? "");
          setStatus("completed");
        } else if (s.status === "failed") {
          setError(s.error ?? "Video generation failed");
          setStatus("failed");
        } else {
          setTimeout(poll, 4000);
        }
      };
      setTimeout(poll, 4000);
    } catch {
      setError("Network error — please try again");
      setStatus("failed");
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Video Generator</h1>
        <p className="text-white/50">AI-powered video routing — best model selected automatically.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
        {/* Mode selector */}
        <div className="mb-5">
          <label className="block text-sm text-white/70 mb-2">Video Mode</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {VIDEO_MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                  mode === m
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400"
                    : "border border-white/10 text-white/50 hover:border-white/20 hover:text-white"
                }`}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>
        </div>

        {/* Quality */}
        <div className="mb-5">
          <label className="block text-sm text-white/70 mb-2">Quality</label>
          <div className="flex gap-2">
            {(["budget", "standard", "premium"] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  quality === q
                    ? "bg-cyan-500 text-black"
                    : "border border-white/10 text-white/60 hover:border-white/30"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Route preview */}
        <div className="mb-5 rounded-xl bg-white/[0.05] border border-white/10 p-4 text-sm">
          <div className="text-white/40 text-xs mb-2 uppercase tracking-wide">Routed to</div>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-white">{route.label}</span>
              <span className="text-white/40 ml-2 text-xs">({route.provider})</span>
            </div>
            <span className="text-cyan-400 font-mono text-xs">${route.estimatedCostUsd.toFixed(2)}</span>
          </div>
        </div>

        {/* Prompt */}
        <div className="mb-5">
          <label className="block text-sm text-white/70 mb-2">Prompt / Brief</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what the video should show..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={status === "submitting" || status === "processing" || !prompt.trim()}
          className="w-full py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "idle" ? "Generate Video" :
           status === "submitting" ? "Submitting..." :
           status === "processing" ? "Processing... (this may take a minute)" :
           status === "completed" ? "✓ Done — Generate Another" :
           "Try Again"}
        </button>
      </div>

      {/* Status / Output */}
      {status === "processing" && (
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6 text-center">
          <div className="text-2xl mb-2 animate-spin">⚙️</div>
          <div className="text-white font-semibold">Video generating...</div>
          <div className="text-white/40 text-sm mt-1">Job ID: {jobId}</div>
        </div>
      )}

      {status === "completed" && videoUrl && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <h3 className="font-bold text-white mb-4">Video Ready</h3>
          <video src={videoUrl} controls className="w-full rounded-xl" />
          <a href={videoUrl} download className="mt-3 inline-block text-sm text-cyan-400 hover:text-cyan-300">
            Download →
          </a>
        </div>
      )}

      {status === "failed" && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <div className="text-red-400 font-semibold mb-1">Generation failed</div>
          <div className="text-white/60 text-sm">{error}</div>
          {error.includes("not configured") && (
            <div className="mt-3 text-sm text-white/40">
              Add <code className="text-cyan-400">WAVESPEED_API_KEY</code> or <code className="text-cyan-400">KIE_API_KEY</code> to your .env to enable video generation.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
