import { Header } from "@/components/Header";
import { TokenBanner } from "@/components/TokenBanner";
import { TradeView } from "@/components/trade/TradeView";
import { TrendingProvider } from "@/components/TrendingProvider";
import { getTrending } from "@/lib/birdeye";
import { buildTradeSeed } from "@/lib/seed";

export const revalidate = 30;

export default async function TradeMintPage({ params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;
  const [{ data, source }, seed] = await Promise.all([
    getTrending(30),
    buildTradeSeed(mint),
  ]);
  return (
    <TrendingProvider initial={data} source={source} seed={seed}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <TokenBanner direction="left" className="h-10" />
        <TradeView mint={mint} />
      </div>
    </TrendingProvider>
  );
}
