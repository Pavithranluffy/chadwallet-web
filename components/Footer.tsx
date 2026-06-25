import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import { APP } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-base-2">
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-48 opacity-40" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, #ccff000f 0%, transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-[1600px] px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm text-ink-dim">
              {APP.tagline}. {APP.description}
            </p>
            <div className="mt-5 flex gap-3">
              <Link href={APP.appStore} target="_blank" aria-label="Download on the App Store">
                <Image src="/brand/app-store.png" alt="App Store" width={130} height={40} className="h-10 w-auto" />
              </Link>
              <Link href={APP.playStore} target="_blank" aria-label="Get it on Google Play">
                <Image src="/brand/google-play.png" alt="Google Play" width={135} height={40} className="h-10 w-auto" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol
              title="Product"
              links={[
                { label: "Trade", href: "/trade" },
                { label: "iOS app", href: APP.appStore },
                { label: "Android app", href: APP.playStore },
              ]}
            />
            <FooterCol
              title="Community"
              links={[
                { label: "Twitter / X", href: APP.twitter },
                { label: "YouTube", href: APP.youtube },
              ]}
            />
            <FooterCol
              title="Legal"
              links={[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
              ]}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Chad Wallet L.L.C. All rights reserved.</p>
          <p>Not financial advice. Crypto trading involves substantial risk.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-faint">{title}</h4>
      <ul className="mt-3 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              className="text-sm text-ink-dim transition-colors hover:text-chad"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
