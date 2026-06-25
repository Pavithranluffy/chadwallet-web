"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Globe, AtSign } from "lucide-react";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { SafetyBadge } from "./SafetyBadge";
import { changeColor, compact, formatPct, formatUsd, shortAddr } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Token } from "@/lib/types";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[88px]">
      <div className="text-[11px] uppercase tracking-wide text-ink-faint">{label}</div>
      <div className="tnum mt-0.5 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

export function TokenHeader({ token }: { token?: Token }) {
  const [copied, setCopied] = useState(false);
  if (!token) {
    return <div className="h-[104px] animate-pulse border-b border-line bg-panel/30" />;
  }
  return (
    <div className="border-b border-line px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex items-center gap-3">
          <TokenLogo symbol={token.symbol} src={token.logoURI} size={48} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold text-ink">{token.symbol}</h1>
              <span className="truncate text-sm text-ink-faint">{token.name}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(token.address);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }}
                className="flex items-center gap-1 rounded-md bg-panel px-2 py-0.5 font-mono text-xs text-ink-dim hover:text-ink"
              >
                {shortAddr(token.address, 4)}
                {copied ? <Check className="h-3 w-3 text-up" /> : <Copy className="h-3 w-3" />}
              </button>
              <a
                href={`https://solscan.io/token/${token.address}`}
                target="_blank"
                rel="noreferrer"
                className="text-ink-faint hover:text-ink"
                aria-label="View on Solscan"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              {token.website && (
                <a href={token.website} target="_blank" rel="noreferrer" className="text-ink-faint hover:text-ink">
                  <Globe className="h-3.5 w-3.5" />
                </a>
              )}
              {token.twitter && (
                <a href={token.twitter} target="_blank" rel="noreferrer" className="text-ink-faint hover:text-ink">
                  <AtSign className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-display tnum text-2xl font-bold text-ink">{formatUsd(token.price)}</div>
          <div className={cn("tnum text-sm font-semibold", changeColor(token.priceChange24h))}>
            {formatPct(token.priceChange24h)}
          </div>
          <SafetyBadge token={token} />
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-x-6 gap-y-3">
          <Stat label="Market cap" value={"$" + compact(token.marketCap)} />
          <Stat label="24h Vol" value={"$" + compact(token.volume24h)} />
          <Stat label="Liquidity" value={"$" + compact(token.liquidity)} />
          {token.holders ? <Stat label="Holders" value={compact(token.holders)} /> : null}
        </div>
      </div>
    </div>
  );
}
