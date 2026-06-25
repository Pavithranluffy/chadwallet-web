"use client";

import { useState } from "react";
import { ShieldCheck, ShieldAlert, ShieldX, Check, X, ChevronDown } from "lucide-react";
import { tokenSafety } from "@/lib/safety";
import { cn } from "@/lib/cn";
import type { Token } from "@/lib/types";

const STYLES = {
  low: { ring: "border-up/40 bg-up-soft text-up", Icon: ShieldCheck },
  medium: { ring: "border-amber/40 bg-amber/10 text-amber", Icon: ShieldAlert },
  high: { ring: "border-down/40 bg-down-soft text-down", Icon: ShieldX },
} as const;

/** Compact, transparent token safety score with an expandable factor breakdown. */
export function SafetyBadge({ token }: { token: Token }) {
  const [open, setOpen] = useState(false);
  const s = tokenSafety(token);
  const st = STYLES[s.level];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors",
          st.ring,
        )}
        aria-expanded={open}
        aria-label={`Safety score ${s.score} of 100 — ${s.label}`}
      >
        <st.Icon className="h-3.5 w-3.5" />
        <span className="tnum">{s.score}</span>
        <span className="hidden font-medium opacity-80 sm:inline">· {s.label}</span>
        <ChevronDown className={cn("h-3 w-3 opacity-60 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-50 mt-2 w-64 rounded-xl border border-line-2 bg-panel p-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Safety score
              </span>
              <span className={cn("tnum text-sm font-bold", st.ring.split(" ").pop())}>
                {s.score}/100
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line-2">
              <div
                className={cn(
                  "h-full rounded-full",
                  s.level === "low" ? "bg-up" : s.level === "medium" ? "bg-amber" : "bg-down",
                )}
                style={{ width: `${s.score}%` }}
              />
            </div>
            <ul className="mt-3 space-y-1.5">
              {s.factors.map((f) => (
                <li key={f.label} className="flex items-center gap-2 text-xs text-ink-dim">
                  {f.ok ? (
                    <Check className="h-3.5 w-3.5 shrink-0 text-up" />
                  ) : (
                    <X className="h-3.5 w-3.5 shrink-0 text-down" />
                  )}
                  {f.label}
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-line pt-2 text-[10px] leading-relaxed text-ink-faint">
              Heuristic read of liquidity, volume &amp; holder spread. Not financial advice.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
