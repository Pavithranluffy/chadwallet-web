import "server-only";
import { getHolders, getOhlcv, getTokenOverview, getTrades } from "./birdeye";

// Builds an SWR fallback map for the active token on the trade page so the
// token header, chart, live trades and holders are all populated server-side on
// first paint — matching the exact SWR urls the client hooks use.
export async function buildTradeSeed(mint: string): Promise<Record<string, unknown>> {
  const fetchedAt = Date.now();
  const [token, trades, holders, ohlcv] = await Promise.all([
    getTokenOverview(mint),
    getTrades(mint, 50),
    getHolders(mint, 30),
    getOhlcv(mint, "1H", 160),
  ]);
  return {
    [`/api/tokens/${mint}`]: { data: token.data, source: token.source, fetchedAt },
    [`/api/tokens/${mint}/trades?limit=50`]: {
      data: trades.data,
      source: trades.source,
      fetchedAt,
    },
    [`/api/tokens/${mint}/holders?limit=30`]: {
      data: holders.data,
      source: holders.source,
      fetchedAt,
    },
    [`/api/tokens/${mint}/ohlcv?resolution=1H&count=160`]: {
      data: ohlcv.data,
      source: ohlcv.source,
      fetchedAt,
    },
  };
}
