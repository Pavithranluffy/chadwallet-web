"use client";

import { CountUp } from "@/components/motion/CountUp";

type Stat = {
  to: number;
  formatKind: "kplus" | "billion" | "mplus" | "seconds";
  label: string;
};

const STATS: Stat[] = [
  { to: 500, formatKind: "kplus", label: "Traders" },
  { to: 2.4, formatKind: "billion", label: "24h volume" },
  { to: 1.2, formatKind: "mplus", label: "Tokens tradable" },
  { to: 1, formatKind: "seconds", label: "Avg. fill time" },
];

export function Stats() {
  return (
    <section className="border-y border-line bg-base-2">
      <div className="mx-auto grid max-w-[1100px] grid-cols-2 divide-x divide-y divide-line/70 px-4 sm:grid-cols-4 sm:divide-y-0 sm:px-6">
        {STATS.map((s) => (
          <div key={s.label} className="py-9 text-center">
            <CountUp
              to={s.to}
              formatKind={s.formatKind}
              className="font-display tnum block text-3xl font-bold text-ink sm:text-[2.5rem]"
            />
            <div className="mt-1.5 text-xs font-medium uppercase tracking-wider text-ink-faint">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
