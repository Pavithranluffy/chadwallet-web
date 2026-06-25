"use client";

import { useState } from "react";
import { useHolders, useTrades } from "@/lib/client";
import { compact, formatAmount, formatUsd, shortAddr, timeAgo } from "@/lib/format";
import { cn } from "@/lib/cn";

type Tab = "trades" | "holders";

export function ActivityTabs({ mint }: { mint: string }) {
  const [tab, setTab] = useState<Tab>("trades");
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-line px-3 py-2">
        {(["trades", "holders"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              tab === t ? "bg-panel text-chad" : "text-ink-dim hover:text-ink",
            )}
          >
            {t === "trades" ? "Live trades" : "Top holders"}
          </button>
        ))}
      </div>
      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
        {tab === "trades" ? <TradesTable mint={mint} /> : <HoldersTable mint={mint} />}
      </div>
    </div>
  );
}

function TradesTable({ mint }: { mint: string }) {
  const { trades, isLoading } = useTrades(mint, 50);
  if (isLoading && !trades.length) return <SkeletonRows />;
  return (
    <table className="w-full text-sm">
      <thead className="sticky top-0 z-10 bg-base text-[11px] uppercase tracking-wide text-ink-faint">
        <tr className="border-b border-line">
          <th className="px-4 py-2 text-left font-medium">Type</th>
          <th className="px-4 py-2 text-right font-medium">Price</th>
          <th className="px-4 py-2 text-right font-medium">Total</th>
          <th className="hidden px-4 py-2 text-right font-medium sm:table-cell">Trader</th>
          <th className="px-4 py-2 text-right font-medium">Age</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((t, i) => (
          <tr key={t.txHash + i} className="border-b border-line/40 hover:bg-panel/40">
            <td className={cn("px-4 py-2 font-semibold", t.side === "buy" ? "text-up" : "text-down")}>
              {t.side === "buy" ? "Buy" : "Sell"}
            </td>
            <td className="tnum px-4 py-2 text-right text-ink-dim">{formatUsd(t.priceUsd)}</td>
            <td className="tnum px-4 py-2 text-right font-medium text-ink">{formatUsd(t.amountUsd, { compact: true })}</td>
            <td className="hidden px-4 py-2 text-right font-mono text-xs text-ink-faint sm:table-cell">
              {shortAddr(t.owner, 4)}
            </td>
            <td className="tnum px-4 py-2 text-right text-ink-faint" suppressHydrationWarning>
              {timeAgo(t.time)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function HoldersTable({ mint }: { mint: string }) {
  const { holders, isLoading } = useHolders(mint, 30);
  if (isLoading && !holders.length) return <SkeletonRows />;
  return (
    <table className="w-full text-sm">
      <thead className="sticky top-0 z-10 bg-base text-[11px] uppercase tracking-wide text-ink-faint">
        <tr className="border-b border-line">
          <th className="px-4 py-2 text-left font-medium">#</th>
          <th className="px-4 py-2 text-left font-medium">Holder</th>
          <th className="px-4 py-2 text-right font-medium">Amount</th>
          <th className="px-4 py-2 text-right font-medium">Share</th>
        </tr>
      </thead>
      <tbody>
        {holders.map((h) => (
          <tr key={h.owner + h.rank} className="border-b border-line/40 hover:bg-panel/40">
            <td className="px-4 py-2 text-ink-faint">{h.rank}</td>
            <td className="px-4 py-2 font-mono text-xs text-ink-dim">
              {shortAddr(h.owner, 4)}
              {h.isInsider && (
                <span className="ml-2 rounded bg-down-soft px-1.5 py-0.5 text-[10px] font-medium text-down">insider</span>
              )}
            </td>
            <td className="tnum px-4 py-2 text-right text-ink">{compact(h.amount)}</td>
            <td className="tnum px-4 py-2 text-right font-medium text-ink">{formatAmount(h.percent)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-px p-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-9 animate-pulse rounded bg-panel/30" />
      ))}
    </div>
  );
}
