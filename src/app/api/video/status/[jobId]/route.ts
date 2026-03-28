import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { pollWaveSpeedJob } from "@/lib/providers/wavespeed";
import { pollKieJob } from "@/lib/providers/kie";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  if (!jobId) {
    return NextResponse.json({ error: "jobId required" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider") ?? "wavespeed";

  const result =
    provider === "kie"
      ? await pollKieJob(jobId)
      : await pollWaveSpeedJob(jobId);

  return NextResponse.json(result);
}
