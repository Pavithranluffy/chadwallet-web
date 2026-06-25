const STATS = [
  { value: "500K+", label: "Traders" },
  { value: "$2.4B", label: "24h volume" },
  { value: "1.2M+", label: "Tokens tradable" },
  { value: "<1s", label: "Avg. fill time" },
];

export function Stats() {
  return (
    <section className="border-y border-line bg-base-2">
      <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-px px-4 sm:grid-cols-4 sm:px-6">
        {STATS.map((s) => (
          <div key={s.label} className="py-8 text-center">
            <div className="tnum text-3xl font-extrabold text-ink sm:text-4xl">{s.value}</div>
            <div className="mt-1 text-sm text-ink-dim">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
