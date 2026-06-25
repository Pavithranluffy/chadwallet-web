"use client";

import { useEffect, useRef } from "react";

type FormatKind = "kplus" | "billion" | "mplus" | "seconds";

function formatValue(value: number, kind: FormatKind) {
  switch (kind) {
    case "kplus":
      return `${Math.round(value)}K+`;
    case "billion":
      return `$${value.toFixed(1)}B`;
    case "mplus":
      return `${value.toFixed(1)}M+`;
    case "seconds":
      return `<${Math.max(1, Math.round(value))}s`;
    default:
      return String(value);
  }
}

/**
 * Counts from 0 to `to` the first time it scrolls into view, using
 * IntersectionObserver + requestAnimationFrame (no animation library). The final
 * value is always rendered even if the animation is skipped.
 */
export function CountUp({
  to,
  formatKind,
  duration = 1.7,
  className,
}: {
  to: number;
  formatKind: FormatKind;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const finish = () => {
      el.textContent = formatValue(to, formatKind);
    };

    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      finish();
      return;
    }

    let raf = 0;
    let startTs: number | null = null;
    const durationMs = duration * 1000;

    const step = (ts: number) => {
      if (startTs === null) startTs = ts;
      const p = Math.min(1, (ts - startTs) / durationMs);
      const eased = 1 - Math.pow(1 - p, 2); // ease-out
      el.textContent = formatValue(to * eased, formatKind);
      if (p < 1) raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          raf = requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, formatKind, duration]);

  return (
    <span ref={ref} className={className}>
      {formatValue(0, formatKind)}
    </span>
  );
}
