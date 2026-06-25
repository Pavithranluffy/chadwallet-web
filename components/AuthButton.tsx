"use client";

import { useState } from "react";
import { Wallet, ChevronDown, Copy, LogOut, Check } from "lucide-react";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/Button";
import { shortAddr } from "@/lib/format";

export function AuthButton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!auth.ready) {
    return <div className="h-10 w-28 animate-pulse rounded-xl bg-panel" />;
  }

  if (!auth.authenticated) {
    return (
      <Button size={size} onClick={auth.login} className="gap-2">
        <Wallet className="h-4 w-4" />
        Sign in
      </Button>
    );
  }

  const label = auth.walletAddress ? shortAddr(auth.walletAddress, 4) : auth.email ?? "Account";

  return (
    <div className="relative">
      <Button variant="outline" size={size} onClick={() => setOpen((o) => !o)} className="gap-2 font-mono">
        <span className="h-2 w-2 rounded-full bg-up" />
        {label}
        <ChevronDown className="h-4 w-4 opacity-60" />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-line-2 bg-panel p-1.5 shadow-2xl">
            {auth.walletAddress && (
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-dim hover:bg-panel-2 hover:text-ink"
                onClick={() => {
                  navigator.clipboard?.writeText(auth.walletAddress!);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }}
              >
                {copied ? <Check className="h-4 w-4 text-up" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied address" : "Copy wallet address"}
              </button>
            )}
            <button
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-down hover:bg-down-soft"
              onClick={() => {
                setOpen(false);
                auth.logout();
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
