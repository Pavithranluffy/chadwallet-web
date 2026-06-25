"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

// Deterministic gradient from a string so each token has a stable avatar.
function gradient(seed: string): { from: string; to: string } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return { from: `hsl(${h} 70% 45%)`, to: `hsl(${(h + 48) % 360} 80% 35%)` };
}

export function TokenLogo({
  symbol,
  src,
  size = 32,
  className,
}: {
  symbol: string;
  src?: string;
  size?: number;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const showImg = src && !broken;
  const g = gradient(symbol || "?");
  const initials = (symbol || "?").replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase();

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-line-2/60",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={symbol}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
          loading="lazy"
        />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center font-semibold text-white"
          style={{
            background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
            fontSize: size * 0.36,
          }}
        >
          {initials}
        </span>
      )}
    </span>
  );
}
