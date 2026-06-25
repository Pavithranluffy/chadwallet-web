// Server-only BirdEye Data API client. Every call degrades gracefully to the
// mock generator when no key is set or the upstream request fails, so the app
// is always functional. Docs: https://docs.birdeye.so/

import "server-only";
import { hasBirdeyeKey, SEED_MINTS } from "./constants";
import { mockCandles, mockHolders, mockToken, mockTokens, mockTrades } from "./mock";
import type { Candle, Holder, Token, Trade } from "./types";

const BASE = "https://public-api.birdeye.so";

async function be<T = unknown>(
  path: string,
  params: Record<string, string | number> = {},
): Promise<T | null> {
  if (!hasBirdeyeKey()) return null;
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": process.env.BIRDEYE_API_KEY as string,
        "x-chain": "solana",
        accept: "application/json",
      },
      // Routes apply their own revalidate; this is a network-level guard.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { success?: boolean; data?: T };
    if (json && json.success === false) return null;
    return (json?.data ?? null) as T | null;
  } catch {
    return null;
  }
}

type SourceTag = "birdeye" | "mock";
export interface Sourced<T> {
  data: T;
  source: SourceTag;
}

function num(v: unknown, fallback = 0): number {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return typeof n === "number" && isFinite(n) ? n : fallback;
}

interface BeTokenRaw {
  address?: string;
  symbol?: string;
  name?: string;
  decimals?: number;
  price?: number;
  priceChange24hPercent?: number;
  price24hChangePercent?: number;
  volume24hUSD?: number;
  v24hUSD?: number;
  liquidity?: number;
  marketcap?: number;
  mc?: number;
  logoURI?: string;
  logo_uri?: string;
}

function mapToken(raw: BeTokenRaw, fallbackMint?: string): Token {
  const address = raw.address ?? fallbackMint ?? "";
  const base = address ? mockToken(address) : mockToken(SEED_MINTS[0].address);
  return {
    address,
    symbol: raw.symbol ?? base.symbol,
    name: raw.name ?? base.name,
    decimals: raw.decimals ?? base.decimals,
    logoURI: raw.logoURI ?? raw.logo_uri,
    price: num(raw.price, base.price),
    priceChange24h: num(raw.priceChange24hPercent ?? raw.price24hChangePercent, base.priceChange24h),
    volume24h: num(raw.volume24hUSD ?? raw.v24hUSD, base.volume24h),
    liquidity: num(raw.liquidity, base.liquidity),
    marketCap: num(raw.marketcap ?? raw.mc, base.marketCap),
  };
}

export async function getTrending(limit = 20): Promise<Sourced<Token[]>> {
  const data = await be<{ tokens?: BeTokenRaw[] }>("/defi/token_trending", {
    sort_by: "rank",
    sort_type: "asc",
    offset: 0,
    limit,
  });
  const tokens = data?.tokens;
  if (tokens && tokens.length) {
    return { data: tokens.map((t) => mapToken(t)), source: "birdeye" };
  }
  return { data: mockTokens().slice(0, limit), source: "mock" };
}

export async function getTokenOverview(mint: string): Promise<Sourced<Token>> {
  const data = await be<BeTokenRaw & {
    extensions?: { website?: string; twitter?: string; telegram?: string };
    holder?: number;
  }>("/defi/token_overview", { address: mint });
  if (data && (data.price || data.symbol)) {
    const token = mapToken(data, mint);
    token.holders = num(data.holder, token.holders ?? 0) || undefined;
    token.website = data.extensions?.website;
    token.twitter = data.extensions?.twitter;
    token.telegram = data.extensions?.telegram;
    return { data: token, source: "birdeye" };
  }
  return { data: mockToken(mint), source: "mock" };
}

const RESOLUTION_TO_BE: Record<string, { type: string; sec: number }> = {
  "1m": { type: "1m", sec: 60 },
  "5m": { type: "5m", sec: 300 },
  "15m": { type: "15m", sec: 900 },
  "1H": { type: "1H", sec: 3600 },
  "4H": { type: "4H", sec: 14400 },
  "1D": { type: "1D", sec: 86400 },
};

export async function getOhlcv(
  mint: string,
  resolution = "1H",
  count = 160,
): Promise<Sourced<Candle[]>> {
  const r = RESOLUTION_TO_BE[resolution] ?? RESOLUTION_TO_BE["1H"];
  const now = Math.floor(Date.now() / 1000);
  const data = await be<{ items?: Array<{ unixTime: number; o: number; h: number; l: number; c: number; v: number }> }>(
    "/defi/ohlcv",
    { address: mint, type: r.type, time_from: now - r.sec * count, time_to: now },
  );
  const items = data?.items;
  if (items && items.length) {
    return {
      data: items.map((i) => ({
        time: i.unixTime,
        open: i.o,
        high: i.h,
        low: i.l,
        close: i.c,
        volume: i.v,
      })),
      source: "birdeye",
    };
  }
  return { data: mockCandles(mint, r.sec, count), source: "mock" };
}

export async function getTrades(mint: string, limit = 40): Promise<Sourced<Trade[]>> {
  const data = await be<{ items?: Array<Record<string, unknown>> }>("/defi/txs/token", {
    address: mint,
    tx_type: "swap",
    sort_type: "desc",
    limit,
  });
  const items = data?.items;
  if (items && items.length) {
    const trades: Trade[] = items.map((i) => {
      const side = (i.side as string) === "buy" || (i.txType as string) === "buy" ? "buy" : "sell";
      const amountUsd = num(i.volumeUSD ?? i.volume_usd ?? i.uiAmountUSD);
      const price = num(i.pricePair ?? i.priceUSD ?? i.price);
      return {
        txHash: (i.txHash as string) ?? (i.tx_hash as string) ?? "",
        side,
        priceUsd: price,
        amountToken: num(i.uiAmount ?? i.amount) || (price ? amountUsd / price : 0),
        amountUsd,
        owner: (i.owner as string) ?? (i.from as string) ?? "",
        time: num(i.blockUnixTime ?? i.unixTime ?? i.time),
      };
    });
    return { data: trades, source: "birdeye" };
  }
  return { data: mockTrades(mint, limit), source: "mock" };
}

export async function getHolders(mint: string, limit = 20): Promise<Sourced<Holder[]>> {
  const data = await be<{ items?: Array<{ owner?: string; amount?: string | number; ui_amount?: number; percentage?: number }> }>(
    "/defi/v3/token/holder",
    { address: mint, offset: 0, limit },
  );
  const items = data?.items;
  if (items && items.length) {
    const total = items.reduce((s, i) => s + num(i.ui_amount ?? i.amount), 0) || 1;
    const holders: Holder[] = items.map((i, idx) => {
      const amount = num(i.ui_amount ?? i.amount);
      return {
        rank: idx + 1,
        owner: i.owner ?? "",
        amount,
        percent: i.percentage != null ? num(i.percentage) : (amount / total) * 100,
      };
    });
    return { data: holders, source: "birdeye" };
  }
  return { data: mockHolders(mint, limit), source: "mock" };
}
