"use client";

import { Info } from "lucide-react";
import { useAppConfig } from "@/lib/client";

export function DemoNotice() {
  const cfg = useAppConfig();
  // Only show once we know the server has no BirdEye key configured.
  if (!cfg || cfg.birdeye) return null;
  return (
    <div className="flex items-center justify-center gap-2 border-b border-chad/15 bg-chad/[0.06] px-4 py-2 text-center text-xs text-chad/90">
      <Info className="h-3.5 w-3.5 shrink-0" />
      <span>
        Showing realistic simulated market data. Add a BirdEye API key to stream live Solana prices, trades and charts.
      </span>
    </div>
  );
}
