import { Header } from "@/components/Header";
import { TokenBanner } from "@/components/TokenBanner";
import { TradeView } from "@/components/trade/TradeView";
import { SOL_MINT } from "@/lib/constants";

export default function TradePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <TokenBanner direction="left" className="h-10" />
      <TradeView mint={SOL_MINT} />
      <TokenBanner direction="right" className="h-10" />
    </div>
  );
}
