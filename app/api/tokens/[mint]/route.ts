import { NextResponse } from "next/server";
import { getTokenOverview } from "@/lib/birdeye";
import { CACHE } from "@/lib/constants";

export const revalidate = 15;

export async function GET(_req: Request, { params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;
  const { data, source } = await getTokenOverview(mint);
  return NextResponse.json(
    { data, source, fetchedAt: Date.now() },
    { headers: { "Cache-Control": `public, s-maxage=${CACHE.token}, stale-while-revalidate=30` } },
  );
}
