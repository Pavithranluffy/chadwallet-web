import { Users, Zap, LineChart, Crown, ShieldCheck, Flame } from "lucide-react";

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
    title: "Lightning fast & safe",
    body: "Self-custody by default with secure deposits and instant withdrawals. Your keys, your coins.",
  },
  {
    icon: Flame,
    title: "Catch launches early",
    body: "Buy top tokens the moment they launch and ride the momentum before everyone else piles in.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to <span className="text-chad">ape responsibly</span>
        </h2>
        <p className="mt-4 text-ink-dim">
          A fast, social-first trading experience built for Solana degens who don&apos;t want to miss out.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-line bg-panel/50 p-6 transition-colors hover:border-chad/40 hover:bg-panel"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-chad/10 text-chad ring-1 ring-chad/20">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-ink">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-dim">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
