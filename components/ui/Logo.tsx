import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, withWordmark = true }: { className?: string; withWordmark?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/brand/logo.png"
        alt="ChadWallet"
        width={32}
        height={32}
        priority
        className="h-8 w-8"
      />
      {withWordmark && (
        <span className="text-lg font-bold tracking-tight text-ink">
          Chad<span className="text-chad">Wallet</span>
        </span>
      )}
    </Link>
  );
}
