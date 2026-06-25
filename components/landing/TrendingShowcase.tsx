"use client";

import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { useTrending } from "@/lib/client";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { Reveal } from "@/components/motion/Reveal";
import { changeColor, compact, formatPct, formatUsd } from "@/lib/format";
import { cn } from "@/lib/cn";

export function TrendingShowcase() {
  const { tokens, isLoading } = useTrending(12);
  const display = isLoading && !tokens.length ? Array.from({ length: 8 }) : tokens.slice(0, 8);

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-chad">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chad opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-chad" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">Trending now</span>
          </div>
          <h2 className="font-display mt-3 flex items-center gap-2 text-3xl font-bold tracking-tight sm:text-[2.75rem]">
            <TrendingUp className="hidden h-8 w-8 text-ink-faint sm:block" />
            Live on Solana
          </h2>
        </div>
        <Link
          href="/trade"
          className="hidden items-center gap-1.5 rounded-lg border border-line-2 px-3.5 py-2 text-sm font-medium text-ink-dim transition-colors hover:border-chad/40 hover:text-chad sm:flex"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>

      <Reveal stagger={0.06} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {display.map((t, i) =>
          t ? (
            <Link
              key={(t as { address: string }).address}
              href={`/trade/${(t as { address: string }).address}`}
              className="border-grad group rounded-2xl border border-line bg-panel/40 p-4 transition-all hover:-translate-y-1 hover:border-chad/40 hover:bg-panel"
            >
              <div className="flex items-center gap-3">
                <TokenLogo
                  symbol={(t as { symbol: string }).symbol}
                  src={(t as { logoURI?: string }).logoURI}
                  size={40}
                />
                <div className="min-w-0">
                  <div className="truncate font-semibold text-ink">
                    {(t as { symbol: string }).symbol}
                  </div>
                  <div className="truncate text-xs text-ink-faint">
                    {(t as { name: string }).name}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div className="tnum text-lg font-semibold text-ink">
                  {formatUsd((t as { price: number }).price)}
                </div>
                <div
                  className={cn(
                    "tnum text-sm font-semibold",
                    changeColor((t as { priceChange24h: number }).priceChange24h),
                  )}
                >
                  {formatPct((t as { priceChange24h: number }).priceChange24h)}
                </div>
              </div>
              <div className="mt-1.5 text-xs text-ink-faint">
                Vol ${compact((t as { volume24h: number }).volume24h)} · MC $
                {compact((t as { marketCap: number }).marketCap)}
              </div>
            </Link>
          ) : (
            <div
              key={i}
              className="h-[132px] animate-pulse rounded-2xl border border-line bg-panel/40"
            />
          ),
        )}
      </Reveal>

      <div className="mt-8 flex justify-center sm:hidden">
        <Link
          href="/trade"
          className="flex items-center gap-1.5 rounded-lg border border-line-2 px-4 py-2 text-sm font-medium text-ink-dim"
        >
          View all tokens <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
