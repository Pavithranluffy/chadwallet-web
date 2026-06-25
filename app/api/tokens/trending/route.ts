import { NextResponse } from "next/server";
import { getTrending } from "@/lib/birdeye";
import { CACHE } from "@/lib/constants";

export const revalidate = 30;

export async function GET(req: Request) {
  const limit = Number(new URL(req.url).searchParams.get("limit") ?? 20);
  const { data, source } = await getTrending(Math.min(Math.max(limit, 1), 50));
  return NextResponse.json(
    { data, source, fetchedAt: Date.now() },
    { headers: { "Cache-Control": `public, s-maxage=${CACHE.trending}, stale-while-revalidate=60` } },
  );
}
