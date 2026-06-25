"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-reveal wrapper using IntersectionObserver + CSS transitions. Fades and
 * lifts itself (or, with `stagger`, its direct children) into view. No animation
 * library, so content can never get stuck hidden, and if IntersectionObserver
 * is unavailable it simply shows everything immediately.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  stagger,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Per-child delay in seconds when revealing children in sequence. */
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets: HTMLElement[] = stagger
      ? (Array.from(el.children) as HTMLElement[])
      : [el];

    // Prime the resting (hidden) state + per-element delay.
    targets.forEach((t, i) => {
      t.classList.add("reveal");
      t.style.transitionDelay = `${delay + (stagger ?? 0) * i}s`;
    });

    const reveal = () => targets.forEach((t) => t.classList.add("is-in"));

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
