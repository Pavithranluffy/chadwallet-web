"use client";

import { useId } from "react";

/**
 * Dependency-free SVG sparkline with a soft gradient fill. Used in the hero
 * product preview so we don't ship a charting library on the landing page.
 */
export function Sparkline({
  values,
  width = 320,
  height = 96,
  up = true,
  className,
}: {
  values: number[];
  width?: number;
  height?: number;
  up?: boolean;
  className?: string;
}) {
  const id = useId();
  if (!values.length) return <svg width={width} height={height} className={className} />;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 4;
  const w = width;
  const h = height;
  const stepX = (w - pad * 2) / Math.max(1, values.length - 1);
  const y = (v: number) => pad + (h - pad * 2) * (1 - (v - min) / span);

  const pts = values.map((v, i) => [pad + i * stepX, y(v)] as const);
  const line = pts.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px.toFixed(2)},${py.toFixed(2)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(2)},${h} L${pts[0][0].toFixed(2)},${h} Z`;
  const stroke = up ? "#ccff00" : "#ff4d5e";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${id})`} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
