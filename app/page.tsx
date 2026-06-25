import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TokenBanner } from "@/components/TokenBanner";
import { DemoNotice } from "@/components/DemoNotice";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { TrendingShowcase } from "@/components/landing/TrendingShowcase";
import { CtaSection } from "@/components/landing/CtaSection";

export default function HomePage() {
  return (
    <>
      <DemoNotice />
      <Header />
      <TokenBanner direction="left" />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <TrendingShowcase />
        <CtaSection />
      </main>
      <TokenBanner direction="right" />
      <Footer />
    </>
  );
}
