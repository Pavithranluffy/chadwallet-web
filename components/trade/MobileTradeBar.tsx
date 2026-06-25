"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { SwapPanel } from "./SwapPanel";
import { TrendingList } from "./TrendingList";
import type { Token } from "@/lib/types";

type SheetKind = "buy" | "sell" | "tokens";

/**
 * Mobile-only sticky action bar so Buy/Sell and token search are always one tap
 * away — no scrolling to the bottom of the page. Hidden on lg+ where the full
 * three-pane terminal is shown instead.
 */
export function MobileTradeBar({ token, mint }: { token?: Token; mint: string }) {
  const [sheet, setSheet] = useState<SheetKind | null>(null);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-line bg-base/95 px-3 py-2.5 backdrop-blur-lg lg:hidden">
        <button
          onClick={() => setSheet("tokens")}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line-2 bg-panel text-ink-dim"
          aria-label="Search tokens"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          onClick={() => setSheet("buy")}
          className="h-12 flex-1 rounded-xl bg-up text-sm font-bold text-base"
        >
          Buy {token?.symbol ?? ""}
        </button>
        <button
          onClick={() => setSheet("sell")}
          className="h-12 flex-1 rounded-xl bg-down text-sm font-bold text-white"
        >
          Sell
        </button>
      </div>

      {sheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSheet(null)} />
          <div className="relative max-h-[88vh] overflow-hidden rounded-t-2xl border-t border-line-2 bg-base">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="text-sm font-semibold text-ink">
                {sheet === "tokens" ? "Search & browse tokens" : sheet === "buy" ? `Buy ${token?.symbol ?? ""}` : `Sell ${token?.symbol ?? ""}`}
              </span>
              <button
                onClick={() => setSheet(null)}
                className="rounded-lg p-1.5 text-ink-faint hover:bg-panel hover:text-ink"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="scroll-thin max-h-[78vh] overflow-y-auto">
              {sheet === "tokens" ? (
                <div className="h-[70vh]" onClick={() => setSheet(null)}>
                  <TrendingList activeMint={mint} />
                </div>
              ) : (
                <SwapPanel token={token} initialSide={sheet} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
