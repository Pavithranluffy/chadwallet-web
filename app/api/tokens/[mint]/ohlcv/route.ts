import { NextResponse } from "next/server";
import { getOhlcv } from "@/lib/birdeye";
import { CACHE } from "@/lib/constants";

export const revalidate = 30;

export async function GET(req: Request, { params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;
  const sp = new URL(req.url).searchParams;
  const resolution = sp.get("resolution") ?? "1H";
  const count = Math.min(Math.max(Number(sp.get("count") ?? 160), 20), 1000);
  const { data, source } = await getOhlcv(mint, resolution, count);
  return NextResponse.json(
    { data, source, fetchedAt: Date.now() },
    { headers: { "Cache-Control": `public, s-maxage=${CACHE.ohlcv}, stale-while-revalidate=60` } },
  );
}
