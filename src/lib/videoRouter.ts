export type VideoMode =
  | "pain_point_reel"
  | "product_showcase"
  | "ugc_ad"
  | "vfx_ad"
  | "commercial_ad"
  | "short_story"
  | "children_story"
  | "brand_story"
  | "testimonial"
  | "explainer"
  | "educational"
  | "motivational"
  | "entertainment"
  | "news_recap"
  | "documentary"
  | "youtube_short"
  | "tiktok_native"
  | "instagram_reel"
  | "linkedin_video";

export type VideoProvider = "wavespeed" | "kie";

export interface VideoRoute {
  provider: VideoProvider;
  model: string;
  endpoint: string;
  estimatedCostUsd: number;
  label: string;
}

export interface VideoRouteRequest {
  mode: VideoMode;
  hasImageInput?: boolean;
  quality?: "budget" | "standard" | "premium";
  durationSeconds?: number;
}

export function routeVideo(req: VideoRouteRequest): VideoRoute {
  const { mode, hasImageInput, quality } = req;

  // Social reels with audio
  if (["pain_point_reel", "tiktok_native", "instagram_reel", "youtube_short", "motivational", "entertainment"].includes(mode)) {
    return {
      provider: "wavespeed",
      model: "short-video-generator",
      endpoint: "/v1/wavespeed-ai/short-video-generator",
      estimatedCostUsd: 0.80,
      label: "WaveSpeed Short Video",
    };
  }

  // Cinematic / VFX / commercial
  if (["vfx_ad", "commercial_ad", "brand_story"].includes(mode)) {
    return {
      provider: "wavespeed",
      model: "cinematic-video-generator",
      endpoint: "/v1/wavespeed-ai/cinematic-video-generator",
      estimatedCostUsd: 0.80,
      label: "WaveSpeed Cinematic",
    };
  }

  // Testimonial / UGC with image input
  if (mode === "testimonial" || (mode === "ugc_ad" && hasImageInput)) {
    const dur = req.durationSeconds ?? 5;
    return {
      provider: "wavespeed",
      model: "infinitetalk",
      endpoint: "/v1/wavespeed-ai/wan2.6/infinitetalk",
      estimatedCostUsd: 0.30 * Math.ceil(dur / 5),
      label: "WaveSpeed InfiniteTalk",
    };
  }

  // Product image-to-video
  if (mode === "product_showcase" && hasImageInput) {
    if (quality === "budget") {
      return {
        provider: "kie",
        model: "hailuo-2.3/standard",
        endpoint: "/v1/images/generations",
        estimatedCostUsd: 0.15,
        label: "Kie Hailuo 2.3 (Budget)",
      };
    }
    return {
      provider: "wavespeed",
      model: "wan-2.6/image-to-video",
      endpoint: "/v1/wavespeed-ai/wan2.6/i2v-720p",
      estimatedCostUsd: 0.50,
      label: "WaveSpeed WAN 2.6 i2v",
    };
  }

  // LinkedIn
  if (mode === "linkedin_video") {
    return {
      provider: "kie",
      model: "kling-2.5-turbo",
      endpoint: "/v1/videos/generations",
      estimatedCostUsd: 0.35,
      label: "Kie Kling 2.5 Turbo",
    };
  }

  // Documentary / educational premium
  if (mode === "documentary" || (mode === "educational" && quality === "premium")) {
    return {
      provider: "kie",
      model: "veo-3.1/fast",
      endpoint: "/v1/videos/generations",
      estimatedCostUsd: 0.30,
      label: "Kie Veo 3.1 Fast",
    };
  }

  // Story / educational balanced
  if (["short_story", "children_story", "explainer"].includes(mode)) {
    if (quality === "premium") {
      return {
        provider: "kie",
        model: "sora-2-pro/standard",
        endpoint: "/v1/videos/generations",
        estimatedCostUsd: 0.75,
        label: "Kie Sora-2 Pro",
      };
    }
    return {
      provider: "kie",
      model: "sora-2/standard",
      endpoint: "/v1/videos/generations",
      estimatedCostUsd: 0.15,
      label: "Kie Sora-2",
    };
  }

  // News recap — budget fallback
  if (mode === "news_recap") {
    return {
      provider: "kie",
      model: "wan-2.5/text-to-video",
      endpoint: "/v1/videos/generations",
      estimatedCostUsd: 0.45,
      label: "Kie WAN 2.5 t2v",
    };
  }

  // Default
  return {
    provider: "wavespeed",
    model: "short-video-generator",
    endpoint: "/v1/wavespeed-ai/short-video-generator",
    estimatedCostUsd: 0.80,
    label: "WaveSpeed Short Video",
  };
}
