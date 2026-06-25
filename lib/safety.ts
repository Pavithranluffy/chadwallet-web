import type { Token } from "./types";

export type RiskLevel = "low" | "medium" | "high";

export interface Safety {
  score: number; // 0-100, higher = safer
  level: RiskLevel;
  label: string;
  factors: { label: string; ok: boolean }[];
}

/**
 * A transparent 0–100 safety score derived from on-page market signals
 * (liquidity depth, liquidity-to-mcap, volume, holder spread). Heuristic, not
 * financial advice — but it gives traders an at-a-glance risk read and is fully
 * deterministic, so it works in demo mode too.
 */
export function tokenSafety(t: Token): Safety {
  let score = 50;
  const factors: { label: string; ok: boolean }[] = [];

  const liqOk = t.liquidity >= 50_000;
  factors.push({ label: liqOk ? "Healthy liquidity" : "Thin liquidity", ok: liqOk });
  score += liqOk ? 18 : -14;

  const ratio = t.marketCap > 0 ? t.liquidity / t.marketCap : 0;
  const ratioOk = ratio >= 0.025;
  factors.push({ label: ratioOk ? "Liquidity vs mcap solid" : "Low liquidity vs mcap", ok: ratioOk });
  score += ratioOk ? 12 : -8;

  const volOk = t.volume24h >= 100_000;
  factors.push({ label: volOk ? "Active 24h volume" : "Low 24h volume", ok: volOk });
  score += volOk ? 12 : -6;

  const holders = t.holders ?? 0;
  const holdersOk = holders >= 5_000;
  factors.push({ label: holdersOk ? "Broad holder base" : "Concentrated holders", ok: holdersOk });
  score += holdersOk ? 12 : -6;

  score = Math.max(3, Math.min(98, Math.round(score)));
  const level: RiskLevel = score >= 70 ? "low" : score >= 45 ? "medium" : "high";
  const label = level === "low" ? "Looks solid" : level === "medium" ? "Trade with caution" : "High risk";
  return { score, level, label, factors };
}
