"use client";

import { useRef } from "react";
import { Search, LineChart, Rocket, Trophy, type LucideIcon } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Reveal } from "@/components/motion/Reveal";
import { StartTradingButton } from "./StartTradingButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Step = { n: string; icon: LucideIcon; title: string; body: string };

const STEPS: Step[] = [
  {
    n: "01",
    icon: Search,
    title: "Discover",
    body: "Trending tokens stream in live the moment they start moving — straight from Solana DEX flow.",
  },
  {
    n: "02",
    icon: LineChart,
    title: "Analyze",
    body: "Live chart, holder breakdown and real-time trades on every token, so you ape with conviction.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Buy in one tap",
    body: "Best-price routing through Jupiter across every Solana DEX. Fills land in under a second.",
  },
  {
    n: "04",
    icon: Trophy,
    title: "Track P&L",
    body: "Every position, cost basis and profit updates the instant your swap confirms on-chain.",
  },
];

function StepCard({ step }: { step: Step }) {
  return (
    <article className="border-grad relative flex h-full min-h-[260px] flex-col justify-between rounded-3xl border border-line bg-panel/50 p-7 lg:h-[300px]">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-chad/10 text-chad ring-1 ring-chad/20">
          <step.icon className="h-5 w-5" />
        </div>
        <span className="font-display text-5xl font-bold text-line-2">{step.n}</span>
      </div>
      <div>
        <h3 className="font-display text-2xl font-bold text-ink">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-dim">{step.body}</p>
      </div>
    </article>
  );
}

function CtaCard() {
  return (
    <article className="border-grad relative flex h-full min-h-[200px] flex-col items-start justify-center gap-4 rounded-3xl border border-chad/30 bg-chad/[0.06] p-7 lg:h-[300px]">
      <h3 className="font-display text-2xl font-bold text-ink">
        Your turn to <span className="text-chad">print.</span>
      </h3>
      <StartTradingButton size="md" />
    </article>
  );
}

export function TradeFlow() {
  const section = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  // Signature scroll moment (desktop, motion-safe only): the section pins and
  // the rail scrubs horizontally with scroll. gsap.matchMedia scopes + reverts
  // it cleanly. Mobile/tablet use a separate stacked, scroll-revealed layout.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const vp = viewport.current;
        const tr = track.current;
        const sec = section.current;
        if (!vp || !tr || !sec) return;
        const distance = () => Math.max(0, tr.scrollWidth - vp.clientWidth + 8);
        gsap.to(tr, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} className="relative overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-chad">
            From signal to fill
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-[2.75rem]">
            Four taps from <span className="text-chad">scroll to printing</span>
          </h2>
          <p className="mt-4 text-ink-dim">
            The whole loop — discover, analyze, buy, track — without leaving the app.
          </p>
        </Reveal>
      </div>

      {/* Mobile / tablet: stacked + scroll-revealed */}
      <Reveal
        stagger={0.1}
        className="mx-auto mt-10 grid max-w-md gap-4 px-4 sm:max-w-xl sm:grid-cols-2 sm:px-6 lg:hidden"
      >
        {STEPS.map((s) => (
          <StepCard key={s.n} step={s} />
        ))}
        <CtaCard />
      </Reveal>

      {/* Desktop: pinned horizontal scrub */}
      <div ref={viewport} className="mt-12 hidden overflow-hidden px-6 lg:block">
        <div ref={track} className="flex w-max gap-5">
          {STEPS.map((s) => (
            <div key={s.n} className="w-[360px] shrink-0">
              <StepCard step={s} />
            </div>
          ))}
          <div className="w-[360px] shrink-0">
            <CtaCard />
          </div>
        </div>
      </div>
    </section>
  );
}
