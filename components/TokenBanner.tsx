"use client";

import Link from "next/link";
import { useState } from "react";
import { useTrending } from "@/lib/client";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { changeColor, formatPct, formatUsd } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Token } from "@/lib/types";

function TickerItem({ t }: { t: Token }) {
  return (
    <Link
      href={`/trade/${t.address}`}
      className="group flex items-center gap-2.5 whitespace-nowrap px-4 py-2 transition-colors hover:bg-panel/70"
    >
      <TokenLogo symbol={t.symbol} src={t.logoURI} size={22} />
      <span className="text-sm font-semibold text-ink">{t.symbol}</span>
      <span className="tnum text-sm text-ink-dim">{formatUsd(t.price)}</span>
      <span className={cn("tnum text-xs font-medium", changeColor(t.priceChange24h))}>
        {formatPct(t.priceChange24h)}
      </span>
    </Link>
  );
}

export function TokenBanner({
  direction = "left",
  className,
}: {
  direction?: "left" | "right";
  className?: string;
}) {
  const { tokens } = useTrending(14);
  const [paused, setPaused] = useState(false);
  const list = tokens.length ? tokens : [];
  if (!list.length) {
    return <div className={cn("h-10 border-y border-line bg-base-2", className)} />;
  }
  // Duplicate the list so the marquee can loop seamlessly (-50% translate).
  const doubled = [...list, ...list];

  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-line bg-base-2/80 backdrop-blur",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-base to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-base to-transparent" />
      <div
        className={cn(
          "flex w-max divide-x divide-line/60",
          direction === "left" ? "animate-marquee" : "animate-marquee-rev",
        )}
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {doubled.map((t, i) => (
          <TickerItem key={`${t.address}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}
