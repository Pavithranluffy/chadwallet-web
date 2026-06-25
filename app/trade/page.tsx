import { Header } from "@/components/Header";
import { TokenBanner } from "@/components/TokenBanner";
import { TradeView } from "@/components/trade/TradeView";
import { TrendingProvider } from "@/components/TrendingProvider";
import { SOL_MINT } from "@/lib/constants";
import { getTrending } from "@/lib/birdeye";
import { buildTradeSeed } from "@/lib/seed";

export const revalidate = 30;

export default async function TradePage() {
  const [{ data, source }, seed] = await Promise.all([
    getTrending(30),
    buildTradeSeed(SOL_MINT),
  ]);
  return (
    <TrendingProvider initial={data} source={source} seed={seed}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <TokenBanner direction="left" className="h-10" />
        <TradeView mint={SOL_MINT} />
      </div>
    </TrendingProvider>
  );
}
