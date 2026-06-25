"use client";

import { useToken } from "@/lib/client";
import { TrendingList } from "./TrendingList";
import { TokenHeader } from "./TokenHeader";
import { ChartCard } from "./ChartCard";
import { ActivityTabs } from "./ActivityTabs";
import { SwapPanel } from "./SwapPanel";
import { Positions } from "./Positions";

export function TradeView({ mint }: { mint: string }) {
  const { token } = useToken(mint);

  return (
    <div className="mx-auto grid max-w-[1600px] flex-1 grid-cols-1 gap-px bg-line lg:grid-cols-[280px_1fr_340px] lg:gap-px">
      {/* Left — trending tokens */}
      <aside className="hidden bg-base lg:block lg:h-[calc(100vh-9rem)]">
        <TrendingList activeMint={mint} />
      </aside>

      {/* Middle — token info, chart, trades/holders */}
      <section className="flex min-w-0 flex-col bg-base lg:h-[calc(100vh-9rem)]">
        <TokenHeader token={token} />
        <div className="min-h-[360px] flex-1 lg:min-h-0 lg:basis-3/5">
          <ChartCard mint={mint} />
        </div>
        <div className="min-h-[320px] border-t border-line lg:min-h-0 lg:basis-2/5">
          <ActivityTabs mint={mint} />
        </div>
      </section>

      {/* Right — swap + positions */}
      <aside className="flex flex-col bg-base lg:h-[calc(100vh-9rem)] lg:overflow-y-auto lg:scroll-thin">
        <SwapPanel token={token} />
        <div className="border-t border-line">
          <Positions />
        </div>
      </aside>
    </div>
  );
}
