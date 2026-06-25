import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TokenBanner } from "@/components/TokenBanner";
import { DemoNotice } from "@/components/DemoNotice";
import { TrendingProvider } from "@/components/TrendingProvider";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { TradeFlow } from "@/components/landing/TradeFlow";
import { TrendingShowcase } from "@/components/landing/TrendingShowcase";
import { CtaSection } from "@/components/landing/CtaSection";
import { getTrending } from "@/lib/birdeye";
import { buildTradeSeed } from "@/lib/seed";
import { SOL_MINT } from "@/lib/constants";

// Revalidate the server-seeded trending data periodically (ISR).
export const revalidate = 30;

export default async function HomePage() {
  // Seed trending + SOL's chart/trades so the banner, "Live on Solana" grid and
  // the hero's live product preview are all populated server-side on first paint.
  const [{ data, source }, seed] = await Promise.all([
    getTrending(30),
    buildTradeSeed(SOL_MINT),
  ]);
  return (
    <TrendingProvider initial={data} source={source} seed={seed}>
      <DemoNotice />
      <Header />
      <TokenBanner direction="left" />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <TradeFlow />
        <TrendingShowcase />
        <CtaSection />
      </main>
      <TokenBanner direction="right" />
      <Footer />
    </TrendingProvider>
  );
}
