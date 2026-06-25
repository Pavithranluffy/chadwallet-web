"use client";

import { useToken } from "@/lib/client";
import { TrendingList } from "./TrendingList";
import { TokenHeader } from "./TokenHeader";
import { ChartCard } from "./ChartCard";
import { ActivityTabs } from "./ActivityTabs";
import { SwapPanel } from "./SwapPanel";
import { Positions } from "./Positions";
import { MobileTradeBar } from "./MobileTradeBar";

export function TradeView({ mint }: { mint: string }) {
  const { token } = useToken(mint);

  return (
    <>
      <div className="mx-auto grid max-w-[1600px] flex-1 grid-cols-1 gap-px bg-line pb-20 lg:grid-cols-[280px_1fr_340px] lg:pb-0">
        {/* Left — trending tokens (desktop column; mobile uses the search sheet) */}
        <aside className="hidden bg-base lg:block lg:h-[calc(100vh-6.5rem)]">
          <TrendingList activeMint={mint} />
        </aside>

        {/* Middle — token info, chart, trades/holders */}
        <section className="flex min-w-0 flex-col bg-base lg:h-[calc(100vh-6.5rem)]">
          <TokenHeader token={token} />
          <div className="min-h-[340px] flex-1 lg:min-h-0 lg:basis-3/5">
            <ChartCard mint={mint} />
          </div>
          <div className="min-h-[300px] border-t border-line lg:min-h-0 lg:basis-2/5">
            <ActivityTabs mint={mint} />
          </div>
        </section>

        {/* Right — swap (desktop) + positions */}
        <aside className="flex flex-col bg-base lg:h-[calc(100vh-6.5rem)] lg:overflow-y-auto lg:scroll-thin">
          <div className="hidden lg:block">
            <SwapPanel token={token} />
          </div>
          <div className="lg:border-t lg:border-line">
            <Positions />
          </div>
        </aside>
      </div>

      {/* Mobile-only sticky Buy / Sell / Search bar */}
      <MobileTradeBar token={token} mint={mint} />
    </>
  );
}
