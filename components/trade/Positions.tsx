"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { useToken } from "@/lib/client";
import { usePositions, type PositionRecord } from "@/lib/positions";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { changeColor, formatAmount, formatPct, formatUsd } from "@/lib/format";
import { cn } from "@/lib/cn";

export function Positions() {
  const positions = usePositions();
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="text-sm font-semibold">Your positions</span>
        <Wallet className="h-4 w-4 text-ink-faint" />
      </div>
      {positions.length === 0 ? (
        <div className="px-4 py-6 text-center text-xs text-ink-faint">
          No open positions yet. Your fills will show up here.
        </div>
      ) : (
        <div className="divide-y divide-line/50">
          {positions.map((p) => (
            <PositionRow key={p.mint} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function PositionRow({ p }: { p: PositionRecord }) {
  const { token } = useToken(p.mint);
  const price = token?.price ?? (p.amount > 0 ? p.costUsd / p.amount : 0);
  const value = p.amount * price;
  const pnl = value - p.costUsd;
  const pnlPct = p.costUsd > 0 ? (pnl / p.costUsd) * 100 : 0;
  return (
    <Link href={`/trade/${p.mint}`} className="flex items-center gap-3 px-4 py-3 hover:bg-panel/50">
      <TokenLogo symbol={p.symbol} src={p.logoURI ?? token?.logoURI} size={30} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-ink">{p.symbol}</span>
          <span className="tnum text-sm font-medium text-ink">{formatUsd(value, { compact: true })}</span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span className="tnum truncate text-xs text-ink-faint">{formatAmount(p.amount)} {p.symbol}</span>
          <span className={cn("tnum text-xs font-medium", changeColor(pnlPct))}>{formatPct(pnlPct)}</span>
        </div>
      </div>
    </Link>
  );
}
