import { NextResponse } from "next/server";
import { getHolders } from "@/lib/birdeye";
import { CACHE } from "@/lib/constants";

export const revalidate = 60;

export async function GET(req: Request, { params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;
  const limit = Math.min(Math.max(Number(new URL(req.url).searchParams.get("limit") ?? 20), 5), 100);
  const { data, source } = await getHolders(mint, limit);
  return NextResponse.json(
    { data, source, fetchedAt: Date.now() },
    { headers: { "Cache-Control": `public, s-maxage=${CACHE.holders}, stale-while-revalidate=120` } },
  );
}
