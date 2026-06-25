import { NextResponse } from "next/server";
import { getTrades } from "@/lib/birdeye";
import { CACHE } from "@/lib/constants";

export const revalidate = 8;

export async function GET(req: Request, { params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;
  const limit = Math.min(Math.max(Number(new URL(req.url).searchParams.get("limit") ?? 40), 5), 100);
  const { data, source } = await getTrades(mint, limit);
  return NextResponse.json(
    { data, source, fetchedAt: Date.now() },
    { headers: { "Cache-Control": `public, s-maxage=${CACHE.trades}, stale-while-revalidate=15` } },
  );
}
