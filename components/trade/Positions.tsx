"use client";

import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";
import { useToken } from "@/lib/client";
import { usePositions, type PositionRecord } from "@/lib/positions";
import { useDeposit } from "@/components/deposit/Deposit";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { changeColor, formatAmount, formatPct, formatUsd } from "@/lib/format";
import { cn } from "@/lib/cn";

export function Positions() {
  const positions = usePositions();
  const deposit = useDeposit();
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="text-sm font-semibold">Your positions</span>
        <button
          onClick={deposit.open}
          className="flex items-center gap-1.5 rounded-lg border border-line-2 px-2.5 py-1 text-xs font-semibold text-ink-dim transition-colors hover:border-chad/50 hover:text-chad"
        >
          <ArrowDownToLine className="h-3.5 w-3.5" /> Deposit
        </button>
      </div>
      {positions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
          <p className="text-xs text-ink-faint">
            No open positions yet. Deposit SOL to start trading.
          </p>
          <button
            onClick={deposit.open}
            className="inline-flex items-center gap-1.5 rounded-lg bg-chad/[0.1] px-3 py-1.5 text-xs font-semibold text-chad transition-colors hover:bg-chad/[0.16]"
          >
            <ArrowDownToLine className="h-3.5 w-3.5" /> Add funds
          </button>
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
