"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useOhlcv } from "@/lib/client";
import { cn } from "@/lib/cn";

// Code-split the charting library (lightweight-charts) into its own chunk so it
// never blocks the rest of the trade page's JS.
const PriceChart = dynamic(() => import("./PriceChart").then((m) => m.PriceChart), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-panel/20" />,
});

const RESOLUTIONS = ["5m", "15m", "1H", "4H", "1D"] as const;

export function ChartCard({ mint }: { mint: string }) {
  const [res, setRes] = useState<(typeof RESOLUTIONS)[number]>("1H");
  const { candles, isLoading, source } = useOhlcv(mint, res, 160);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-line px-3 py-2">
        {RESOLUTIONS.map((r) => (
          <button
            key={r}
            onClick={() => setRes(r)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              res === r ? "bg-panel text-chad" : "text-ink-dim hover:text-ink",
            )}
          >
            {r}
          </button>
        ))}
        {source === "mock" && (
          <span className="ml-auto rounded bg-panel px-2 py-0.5 text-[10px] text-ink-faint">simulated</span>
        )}
      </div>
      <div className="relative min-h-0 flex-1">
        {isLoading && !candles.length && (
          <div className="absolute inset-0 animate-pulse bg-panel/20" />
        )}
        <PriceChart candles={candles} />
      </div>
    </div>
  );
}
