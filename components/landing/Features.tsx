import { Users, Zap, LineChart, Crown, ShieldCheck, Flame } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const FEATURES = [
  {
    icon: Users,
    title: "Copy the wallets that print",
    body: "See what top traders are buying in real time and mirror the wallets that are actually making money.",
  },
  {
    icon: Zap,
    title: "Trade instantly",
    body: "Buy trending tokens in seconds with best-price routing through Jupiter across every Solana DEX.",
  },
  {
    icon: LineChart,
    title: "Research smarter",
    body: "Built-in analytics, live charts, holder breakdowns and detailed profit tracking on every token.",
  },
  {
    icon: Crown,
    title: "Earn $CHAD points",
    body: "Get rewarded to ape — earn $CHAD points on every fill and climb the leaderboard.",
  },
  {
    icon: ShieldCheck,
    title: "Self-custody, zero friction",
    body: "Sign in with Apple or Google and get a secure embedded Solana wallet. Your keys, your coins.",
  },
  {
    icon: Flame,
    title: "Catch launches early",
    body: "Buy top tokens the moment they launch and ride the momentum before everyone else piles in.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <div className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-chad">
          Built for degens
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-[2.75rem]">
          Everything you need to <span className="text-chad">ape responsibly</span>
        </h2>
        <p className="mt-4 text-ink-dim">
          A fast, social-first trading experience built for Solana traders who don&apos;t want to
          miss out.
        </p>
      </Reveal>

      <Reveal stagger={0.08} className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="border-grad group relative overflow-hidden rounded-2xl border border-line bg-panel/40 p-6 transition-colors hover:border-chad/30 hover:bg-panel/70"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-chad/10 text-chad ring-1 ring-chad/20 transition-transform duration-300 group-hover:scale-110">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display mt-5 text-lg font-semibold text-ink">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-dim">{f.body}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
