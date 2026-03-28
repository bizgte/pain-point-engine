import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routeVideo } from "@/lib/videoRouter";
import type { VideoMode } from "@/lib/videoRouter";
import { submitWaveSpeedJob } from "@/lib/providers/wavespeed";
import { submitKieJob } from "@/lib/providers/kie";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, prompt, quality, imageUrl, durationSeconds } = body as {
      mode: VideoMode;
      prompt: string;
      quality?: "budget" | "standard" | "premium";
      imageUrl?: string;
      durationSeconds?: number;
    };

    if (!mode || !prompt) {
      return NextResponse.json({ error: "mode and prompt are required" }, { status: 400 });
    }

    const route = routeVideo({ mode, quality, hasImageInput: !!imageUrl, durationSeconds });

    let result;
    if (route.provider === "wavespeed") {
      result = await submitWaveSpeedJob({
        endpoint: route.endpoint,
        prompt,
        imageUrl,
        durationSeconds,
      });
    } else {
      result = await submitKieJob({
        model: route.model,
        prompt,
        imageUrl,
        durationSeconds,
      });
    }

    if (result.status === "failed") {
      return NextResponse.json(
        { error: result.error ?? "Video submission failed", provider: route.provider, model: route.model },
        { status: 500 }
      );
    }

    return NextResponse.json({
      jobId: result.jobId,
      provider: route.provider,
      model: route.model,
      label: route.label,
      estimatedCostUsd: route.estimatedCostUsd,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
