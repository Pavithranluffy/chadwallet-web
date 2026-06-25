"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LineChart, Play } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AppleLogo } from "@/components/ui/AppleLogo";
import { AuthButton } from "@/components/AuthButton";
import { APP } from "@/lib/constants";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/trade", label: "Trade" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-base/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-0.5">
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active ? "text-chad" : "text-ink-dim hover:text-ink",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href={APP.appStore}
            target="_blank"
            className="hidden h-9 items-center gap-1.5 rounded-lg border border-line-2 px-3 text-sm text-ink-dim transition-colors hover:border-chad/40 hover:text-ink lg:flex"
            aria-label="Download on the App Store"
          >
            <AppleLogo className="h-4 w-4" /> iOS
          </Link>
          <Link
            href={APP.playStore}
            target="_blank"
            className="hidden h-9 items-center gap-1.5 rounded-lg border border-line-2 px-3 text-sm text-ink-dim transition-colors hover:border-chad/40 hover:text-ink lg:flex"
            aria-label="Get it on Google Play"
          >
            <Play className="h-4 w-4" /> Android
          </Link>
          <Link
            href="/trade"
            className="hidden h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink-dim transition-colors hover:text-chad sm:flex"
          >
            <LineChart className="h-4 w-4" /> Launch app
          </Link>
          <AuthButton size="sm" />
        </div>
      </div>
    </header>
  );
}
