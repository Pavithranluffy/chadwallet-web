"use client";

import Link from "next/link";
import Image from "next/image";
import { Rocket, ArrowRight, ShieldCheck, Zap, Star } from "lucide-react";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/Button";
import { HeroPreview } from "./HeroPreview";
import { APP } from "@/lib/constants";

const TRUST = [
  { icon: ShieldCheck, label: "Non-custodial" },
  { icon: Zap, label: "Jupiter best-price routing" },
  { icon: Star, label: "4.8★ on App Store" },
];

export function Hero() {
  const auth = useAuth();

  return (
    <section className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="chad-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-24 lg:pt-24">
        {/* Left — copy */}
        <div className="text-center lg:text-left">
          <div
            className="anim-up inline-flex items-center gap-2 rounded-full border border-chad/25 bg-chad/[0.06] px-4 py-1.5 text-xs font-medium text-chad"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chad opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-chad" />
            </span>
            The #1 meme coin trading app on Solana
          </div>

          <h1 className="font-display mt-6 text-[2.75rem] font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-[4.25rem]">
            <span className="block overflow-hidden pb-1">
              <span className="anim-line block" style={{ animationDelay: "0.15s" }}>
                Hunt every
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="anim-line block" style={{ animationDelay: "0.27s" }}>
                memecoin.
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span
                className="anim-line block text-chad text-glow"
                style={{ animationDelay: "0.39s" }}
              >
                Print on Solana.
              </span>
            </span>
          </h1>

          <p
            className="anim-up mx-auto mt-6 max-w-md text-balance text-base text-ink-dim sm:text-lg lg:mx-0"
            style={{ animationDelay: "0.5s" }}
          >
            Snipe trending tokens at lightning speed, copy the wallets that print, and trade any
            Solana asset in seconds — no seed phrase required.
          </p>

          <div
            className="anim-up mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
            style={{ animationDelay: "0.6s" }}
          >
            <Link href="/trade" className="w-full sm:w-auto">
              <Button size="lg" className="btn-shine w-full sm:w-auto">
                <Rocket className="h-5 w-5" />
                Start trading
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={auth.authenticated ? undefined : auth.login}
            >
              {auth.authenticated ? "Wallet connected" : "Sign in with Apple / Google"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Trust signals — research: surface trust at the hero, not the footer */}
          <div
            className="anim-up mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start"
            style={{ animationDelay: "0.7s" }}
          >
            {TRUST.map((t) => (
              <div key={t.label} className="flex items-center gap-1.5 text-xs text-ink-faint">
                <t.icon className="h-3.5 w-3.5 text-chad/70" />
                {t.label}
              </div>
            ))}
          </div>

          <div
            className="anim-up mt-7 flex flex-col items-center gap-3 sm:flex-row sm:items-center lg:justify-start"
            style={{ animationDelay: "0.78s" }}
          >
            <div className="flex items-center gap-3">
              <Link href={APP.appStore} target="_blank" aria-label="Download on the App Store">
                <Image
                  src="/brand/app-store.png"
                  alt="Download on the App Store"
                  width={140}
                  height={44}
                  className="h-10 w-auto transition-opacity hover:opacity-80"
                />
              </Link>
              <Link href={APP.playStore} target="_blank" aria-label="Get it on Google Play">
                <Image
                  src="/brand/google-play.png"
                  alt="Get it on Google Play"
                  width={140}
                  height={44}
                  className="h-10 w-auto transition-opacity hover:opacity-80"
                />
              </Link>
            </div>
            <p className="text-xs text-ink-faint">
              <span className="font-semibold text-ink">500,000+</span> traders onboard
            </p>
          </div>
        </div>

        {/* Right — live product preview */}
        <div
          className="anim-side mx-auto w-full max-w-[400px] lg:max-w-none"
          style={{ animationDelay: "0.35s" }}
        >
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}
