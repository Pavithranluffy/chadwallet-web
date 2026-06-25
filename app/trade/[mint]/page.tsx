import { Header } from "@/components/Header";
import { TokenBanner } from "@/components/TokenBanner";
import { TradeView } from "@/components/trade/TradeView";

export default async function TradeMintPage({ params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <TokenBanner direction="left" className="h-10" />
      <TradeView mint={mint} />
      <TokenBanner direction="right" className="h-10" />
    </div>
  );
}
