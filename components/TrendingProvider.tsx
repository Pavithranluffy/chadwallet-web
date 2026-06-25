"use client";

import { SWRConfig } from "swr";
import type { DataSource, Token } from "@/lib/types";

// Seeds SWR's cache with trending tokens fetched on the server, so the banner,
// hero movers and "Live on Solana" grid are populated in the first HTML byte —
// no loading flash, and no dependency on the client fetch succeeding. SWR still
// revalidates in the background on its normal interval.
const LIMITS = [3, 8, 12, 14, 20, 30];

export function TrendingProvider({
  initial,
  source,
  seed,
  children,
}: {
  initial: Token[];
  source: DataSource;
  /** Extra SWR cache entries to seed (e.g. the active token, its trades,
   *  holders and candles on the trade page), keyed by their exact SWR url. */
  seed?: Record<string, unknown>;
  children: React.ReactNode;
}) {
  // fetchedAt is never rendered (SWR uses it only as cache metadata), so a
  // constant keeps this render pure and avoids a server/client mismatch.
  const fallback: Record<string, unknown> = { ...seed };
  for (const limit of LIMITS) {
    fallback[`/api/tokens/trending?limit=${limit}`] = {
      data: initial.slice(0, limit),
      source,
      fetchedAt: 0,
    };
  }
  return <SWRConfig value={{ fallback }}>{children}</SWRConfig>;
}
