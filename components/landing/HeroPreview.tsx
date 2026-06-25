"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { useOhlcv, useToken, useTrades } from "@/lib/client";
import { SOL_MINT } from "@/lib/constants";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { Sparkline } from "@/components/ui/Sparkline";
import { formatUsd, formatPct, shortAddr, timeAgo } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * A live, self-contained trading-terminal preview for the hero — the real
 * product, powered by the same server-seeded data as the trade page, with a
 * subtle mouse-tilt. No charting library: the sparkline is plain SVG so the
 * landing page stays light.
 */
export function HeroPreview() {
  const { token } = useToken(SOL_MINT);
  const { candles } = useOhlcv(SOL_MINT, "1H", 160);
  const { trades } = useTrades(SOL_MINT, 6);
  const root = useRef<HTMLDivElement>(null);

  // Subtle 3D tilt that follows the cursor (desktop, motion-safe). Plain CSS
  // transform + transition — no animation library.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const card = el.querySelector<HTMLElement>("[data-tilt]");
    if (!card) return;
    card.style.transition = "transform 0.4s cubic-bezier(0.2,0.7,0.2,1)";
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(1400px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
    };
    const onLeave = () => {
      card.style.transform = "perspective(1400px) rotateY(0deg) rotateX(0deg)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const up = (token?.priceChange24h ?? 0) >= 0;
  const closes = candles.slice(-44).map((c) => c.close);

  return (
    <div ref={root} className="relative max-w-full [perspective:1400px]">
      <div className="chad-glow pointer-events-none absolute -inset-8" />
      <div
        data-tilt
        className="border-grad relative max-w-full overflow-hidden rounded-2xl border border-line-2 bg-panel/70 shadow-2xl backdrop-blur-xl [transform-style:preserve-3d]"
      >
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs font-medium text-ink-dim">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-up opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-up" />
            </span>
            Live
          </div>
          <span className="font-display text-xs font-semibold text-ink-faint">ChadWallet</span>
        </div>

        {/* token + price + sparkline */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <TokenLogo symbol={token?.symbol ?? "SOL"} src={token?.logoURI} size={36} />
              <div>
                <div className="font-display text-sm font-bold text-ink">{token?.symbol ?? "SOL"}</div>
                <div className="text-[11px] text-ink-faint">Solana</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display tnum text-lg font-bold text-ink">
                {formatUsd(token?.price ?? 0)}
              </div>
              <div className={cn("tnum text-xs font-semibold", up ? "text-up" : "text-down")}>
                {formatPct(token?.priceChange24h ?? 0)}
              </div>
            </div>
          </div>
          <div className="mt-3 -mx-1">
            <Sparkline values={closes} up={up} draw width={340} height={88} className="w-full" />
          </div>
        </div>

        {/* live trades */}
        <div className="mt-2 border-t border-line px-4 py-3">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-faint">
            Live trades
          </div>
          <div className="space-y-1.5">
            {trades.slice(0, 3).map((t, i) => (
              <div
                key={t.txHash + i}
                className={cn(
                  "flex items-center gap-2 rounded-md px-1 py-0.5 text-xs",
                  i === 0 && "row-flash",
                )}
              >
                <span className={cn("w-7 font-semibold", t.side === "buy" ? "text-up" : "text-down")}>
                  {t.side === "buy" ? "Buy" : "Sell"}
                </span>
                <span className="tnum flex-1 text-ink">{formatUsd(t.amountUsd, { compact: true })}</span>
                <span className="font-mono text-[10px] text-ink-faint">{shortAddr(t.owner, 3)}</span>
                <span className="tnum w-7 text-right text-ink-faint" suppressHydrationWarning>
                  {timeAgo(t.time)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* mini buy panel */}
        <div className="border-t border-line p-4">
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-base p-1 text-xs font-semibold">
            <span className="rounded-md bg-up py-1.5 text-center text-base">Buy</span>
            <span className="py-1.5 text-center text-ink-dim">Sell</span>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg border border-line-2 bg-base px-3 py-2">
            <div>
              <div className="text-[10px] text-ink-faint">You pay</div>
              <span className="tnum text-base font-semibold text-ink">1.0</span>
            </div>
            <span className="rounded-md bg-panel px-2 py-1 text-xs font-semibold text-ink-dim">SOL</span>
          </div>
          <div className="my-1.5 flex justify-center text-ink-faint">
            <ArrowDown className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-line-2 bg-base px-3 py-2">
            <div>
              <div className="text-[10px] text-ink-faint">Value</div>
              <span className="tnum text-base font-semibold text-ink">{formatUsd(token?.price ?? 0)}</span>
            </div>
            <span className="rounded-md bg-panel px-2 py-1 text-xs font-semibold text-ink-dim">USD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
