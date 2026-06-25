"use client";

import Link from "next/link";
import Image from "next/image";
import { Rocket, ArrowRight } from "lucide-react";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/Button";
import { APP } from "@/lib/constants";

export function Hero() {
  const auth = useAuth();
  return (
    <section className="relative overflow-hidden">
      <div className="chad-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1100px] px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-line-2 bg-panel/60 px-4 py-1.5 text-xs font-medium text-ink-dim">
          <span className="h-1.5 w-1.5 rounded-full bg-chad" />
          The #1 meme coin trading app on Solana
        </div>

        <h1 className="mx-auto max-w-4xl text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
          Hunt every memecoin.
          <br />
          <span className="text-chad">Print on Solana.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-ink-dim">
          Snipe trending tokens at lightning speed, copy the wallets that are actually printing, and
          trade any Solana asset in seconds.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/trade">
            <Button size="lg" className="w-full sm:w-auto">
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

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href={APP.appStore} target="_blank" aria-label="Download on the App Store">
            <Image src="/brand/app-store.png" alt="Download on the App Store" width={150} height={48} className="h-11 w-auto transition-opacity hover:opacity-80" />
          </Link>
          <Link href={APP.playStore} target="_blank" aria-label="Get it on Google Play">
            <Image src="/brand/google-play.png" alt="Get it on Google Play" width={150} height={48} className="h-11 w-auto transition-opacity hover:opacity-80" />
          </Link>
        </div>

        <p className="mt-8 text-sm text-ink-faint">
          Join <span className="font-semibold text-ink">500,000+</span> traders making their name on ChadWallet
        </p>
      </div>
    </section>
  );
}
