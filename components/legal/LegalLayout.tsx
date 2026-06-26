import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function LegalLayout({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-line">
          <div className="chad-glow pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-14 sm:px-6 sm:pb-14 sm:pt-20">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-ink-dim transition-colors hover:text-chad"
            >
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
            <h1 className="font-display mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-ink-faint">Last updated: {updated}</p>
            {intro && <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-dim">{intro}</p>}
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="space-y-9">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-ink sm:text-xl">{heading}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-dim">{children}</div>
    </section>
  );
}
