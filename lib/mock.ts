// Deterministic, realistic mock data so the entire app is alive without any
// API keys. Real BirdEye/Jupiter data transparently replaces this when keys
// are configured. Trades/candles are anchored to the current time so the UI
// always looks live.

import { SEED_MINTS } from "./constants";
import type { Candle, Holder, Token, Trade } from "./types";

// --- seeded PRNG (mulberry32) for stable per-mint data ---
function seedFrom(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASE: Record<string, { price: number; mc: number; vol: number }> = {
  SOL: { price: 152.4, mc: 71_000_000_000, vol: 2_400_000_000 },
  BONK: { price: 0.0000241, mc: 1_700_000_000, vol: 180_000_000 },
  WIF: { price: 2.47, mc: 2_460_000_000, vol: 320_000_000 },
  W: { price: 0.312, mc: 760_000_000, vol: 64_000_000 },
  RENDER: { price: 7.12, mc: 3_700_000_000, vol: 120_000_000 },
  PYTH: { price: 0.398, mc: 1_440_000_000, vol: 88_000_000 },
  POPCAT: { price: 1.22, mc: 1_190_000_000, vol: 96_000_000 },
  MEW: { price: 0.00812, mc: 720_000_000, vol: 41_000_000 },
  BOME: { price: 0.0124, mc: 870_000_000, vol: 73_000_000 },
  FWOG: { price: 0.0513, mc: 51_000_000, vol: 12_000_000 },
  GIGA: { price: 0.0431, mc: 410_000_000, vol: 38_000_000 },
  PNUT: { price: 1.09, mc: 1_090_000_000, vol: 210_000_000 },
};

function randAddr(r: () => number): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let s = "";
  for (let i = 0; i < 44; i++) s += chars[Math.floor(r() * chars.length)];
  return s;
}

export function mockToken(mint: string): Token {
  const seed = SEED_MINTS.find((m) => m.address === mint) ?? {
    address: mint,
    symbol: "TOKEN",
    name: "Unknown Token",
  };
  const b = BASE[seed.symbol] ?? { price: 0.00042, mc: 24_000_000, vol: 3_400_000 };
  const r = rng(seedFrom(mint));
  // Slowly drifting 24h change, stable per mint.
  const change = (r() * 2 - 0.6) * 28; // skew slightly positive, -16% .. +39%
  return {
    address: mint,
    symbol: seed.symbol,
    name: seed.name,
    decimals: seed.symbol === "SOL" ? 9 : 6,
    price: b.price,
    priceChange24h: round(change, 2),
    volume24h: Math.round(b.vol * (0.7 + r() * 0.6)),
    liquidity: Math.round(b.mc * 0.04 * (0.6 + r())),
    marketCap: b.mc,
    holders: Math.round(2000 + r() * 240000),
    website: "https://www.chadwallet.xyz",
    twitter: "https://twitter.com/chadwallet",
  };
}

export function mockTokens(): Token[] {
  return SEED_MINTS.map((m) => mockToken(m.address));
}

// resolutionSec: candle width in seconds (e.g. 900 for 15m, 3600 for 1H)
export function mockCandles(mint: string, resolutionSec = 3600, count = 160): Candle[] {
  const token = mockToken(mint);
  const r = rng(seedFrom(mint + ":candles"));
  const now = Math.floor(Date.now() / 1000);
  const start = now - resolutionSec * count;
  const candles: Candle[] = [];
  // Walk price backwards from current price using a stable random walk, then
  // emit forward so the last candle closes ~ at the live price.
  const vol = 0.012 + r() * 0.02; // per-candle volatility
  let price = token.price;
  const closes: number[] = [];
  for (let i = 0; i < count; i++) {
    closes.unshift(price);
    const drift = (r() - 0.5) * vol * 2;
    price = price / (1 + drift);
  }
  for (let i = 0; i < count; i++) {
    const close = closes[i];
    const open = i === 0 ? close * (1 + (r() - 0.5) * vol) : closes[i - 1];
    const hi = Math.max(open, close) * (1 + r() * vol);
    const lo = Math.min(open, close) * (1 - r() * vol);
    candles.push({
      time: start + i * resolutionSec,
      open: open,
      high: hi,
      low: lo,
      close: close,
      volume: Math.round(token.volume24h / count * (0.4 + r() * 1.6)),
    });
  }
  return candles;
}

export function mockTrades(mint: string, count = 40): Trade[] {
  const token = mockToken(mint);
  const r = rng(seedFrom(mint + ":trades:" + Math.floor(Date.now() / 8000)));
  const now = Math.floor(Date.now() / 1000);
  const trades: Trade[] = [];
  let t = now;
  for (let i = 0; i < count; i++) {
    t -= Math.floor(r() * 14) + 1;
    const side: "buy" | "sell" = r() > 0.42 ? "buy" : "sell";
    const amountUsd = Math.round((20 + r() * r() * 9000) * 100) / 100;
    trades.push({
      txHash: randAddr(r),
      side,
      priceUsd: token.price * (1 + (r() - 0.5) * 0.01),
      amountToken: amountUsd / token.price,
      amountUsd,
      owner: randAddr(r),
      time: t,
    });
  }
  return trades;
}

export function mockHolders(mint: string, count = 20): Holder[] {
  const r = rng(seedFrom(mint + ":holders"));
  const holders: Holder[] = [];
  let remaining = 62; // top holders hold ~62% combined
  for (let i = 0; i < count; i++) {
    const share = i === 0 ? 4 + r() * 6 : remaining * (0.04 + r() * 0.16);
    remaining = Math.max(0.3, remaining - share);
    holders.push({
      rank: i + 1,
      owner: randAddr(r),
      amount: Math.round((share / 100) * 1e9),
      percent: round(share, 2),
      isInsider: r() > 0.82,
    });
  }
  return holders.sort((a, b) => b.percent - a.percent).map((h, i) => ({ ...h, rank: i + 1 }));
}

function round(n: number, d: number) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}
