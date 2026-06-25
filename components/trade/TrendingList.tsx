"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { useTrending } from "@/lib/client";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { changeColor, compact, formatPct, formatUsd } from "@/lib/format";
import { cn } from "@/lib/cn";

export function TrendingList({ activeMint }: { activeMint: string }) {
  const { tokens, isLoading } = useTrending(30);
  const [q, setQ] = useState("");
  const filtered = tokens.filter(
    (t) =>
      !q ||
      t.symbol.toLowerCase().includes(q.toLowerCase()) ||
      t.name.toLowerCase().includes(q.toLowerCase()) ||
      t.address.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <TrendingUp className="h-4 w-4 text-chad" />
        <span className="text-sm font-semibold">Trending</span>
      </div>
      <div className="border-b border-line p-3">
        <div className="flex items-center gap-2 rounded-lg border border-line-2 bg-base px-3 py-2">
          <Search className="h-4 w-4 text-ink-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search token or paste mint"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
          />
        </div>
      </div>

      <div className="scroll-thin flex-1 overflow-y-auto">
        {isLoading && !tokens.length
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-[58px] animate-pulse border-b border-line/60 bg-panel/30" />
            ))
          : filtered.map((t) => {
              const active = t.address === activeMint;
              return (
                <Link
                  key={t.address}
                  href={`/trade/${t.address}`}
                  className={cn(
                    "flex items-center gap-3 border-b border-line/60 px-4 py-3 transition-colors",
                    active ? "bg-chad/[0.07]" : "hover:bg-panel/60",
                  )}
                >
                  <TokenLogo symbol={t.symbol} src={t.logoURI} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("truncate text-sm font-semibold", active ? "text-chad" : "text-ink")}>
                        {t.symbol}
                      </span>
                      <span className="tnum text-sm text-ink">{formatUsd(t.price)}</span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-ink-faint">${compact(t.volume24h)} vol</span>
                      <span className={cn("tnum text-xs font-medium", changeColor(t.priceChange24h))}>
                        {formatPct(t.priceChange24h)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
        {!isLoading && !filtered.length && (
          <div className="p-6 text-center text-sm text-ink-faint">No tokens match “{q}”.</div>
        )}
      </div>
    </div>
  );
}
