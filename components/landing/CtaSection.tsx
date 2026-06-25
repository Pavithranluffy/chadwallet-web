"use client";

import Link from "next/link";
import Image from "next/image";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP } from "@/lib/constants";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-[1100px] px-4 py-20 sm:px-6">
      <div className="chad-glow relative overflow-hidden rounded-3xl border border-chad/20 bg-panel/60 px-6 py-16 text-center">
        <h2 className="mx-auto max-w-2xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
          Don&apos;t wanna <span className="text-chad">miss out?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-ink-dim">
          Get started in seconds. Sign in with Apple or Google — no seed phrase, no friction.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/trade">
            <Button size="lg">
              <Rocket className="h-5 w-5" /> Launch the app
            </Button>
          </Link>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href={APP.appStore} target="_blank" aria-label="Download on the App Store">
            <Image src="/brand/app-store.png" alt="App Store" width={150} height={48} className="h-11 w-auto" />
          </Link>
          <Link href={APP.playStore} target="_blank" aria-label="Get it on Google Play">
            <Image src="/brand/google-play.png" alt="Google Play" width={150} height={48} className="h-11 w-auto" />
          </Link>
        </div>
      </div>
    </section>
  );
}
