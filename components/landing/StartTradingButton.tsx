"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * "Start trading" CTA with a real rocket launch: on click the rocket crouches,
 * blasts up and off the button with an exhaust trail, then navigates. Respects
 * prefers-reduced-motion (navigates immediately) and prefetches the route so the
 * page is ready by the time the animation finishes.
 */
export function StartTradingButton({
  label = "Start trading",
  size = "lg",
  className,
}: {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const router = useRouter();
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    router.prefetch("/trade");
  }, [router]);

  function launch() {
    if (launching) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push("/trade");
      return;
    }
    setLaunching(true);
    window.setTimeout(() => router.push("/trade"), 520);
  }

  return (
    <Button
      onClick={launch}
      size={size}
      className={cn(
        "btn-shine group",
        size === "lg" && "w-full sm:w-auto",
        launching && "btn-recoil",
        className,
      )}
    >
      <span className="relative inline-flex h-5 w-5 items-center justify-center">
        <Rocket
          className={cn(
            "h-5 w-5 transition-transform duration-300 ease-out",
            launching
              ? "rocket-launch"
              : "group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:-rotate-12",
          )}
        />
        {launching && <span className="rocket-exhaust" aria-hidden="true" />}
      </span>
      {launching ? "Launching…" : label}
    </Button>
  );
}
