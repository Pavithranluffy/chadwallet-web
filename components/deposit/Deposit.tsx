"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  X,
  Copy,
  Check,
  CreditCard,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { useAuth } from "@/app/providers";
import { shortAddr } from "@/lib/format";

// ---------------------------------------------------------------------------
// Deposit context — any component can pop the "Add funds" sheet via useDeposit().
// open() is auth-aware: if the user isn't signed in yet, it routes them through
// login first (a wallet address only exists after sign-in).
// ---------------------------------------------------------------------------

interface DepositApi {
  open: () => void;
}

const DepositContext = createContext<DepositApi | null>(null);

export function useDeposit(): DepositApi {
  const ctx = useContext(DepositContext);
  if (!ctx) throw new Error("useDeposit must be used within <DepositProvider>");
  return ctx;
}

export function DepositProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [open, setOpen] = useState(false);

  const api = useMemo<DepositApi>(
    () => ({
      // Open straight to the sheet when we already have an address (signed-in,
      // or the zero-config demo). Otherwise send the user through sign-in first.
      open: () => {
        if (auth.walletAddress) {
          setOpen(true);
          return;
        }
        auth.login();
      },
    }),
    [auth],
  );

  // Deep link: /trade?deposit opens the funding sheet directly (once).
  const linked = useRef(false);
  useEffect(() => {
    if (linked.current || typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).has("deposit")) {
      linked.current = true;
      api.open();
    }
  }, [api]);

  return (
    <DepositContext.Provider value={api}>
      {children}
      {open && <DepositModal onClose={() => setOpen(false)} />}
    </DepositContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// The sheet itself — bottom sheet on phones, centered dialog on sm+.
// ---------------------------------------------------------------------------

function DepositModal({ onClose }: { onClose: () => void }) {
  const auth = useAuth();
  const address = auth.walletAddress;
  const [copied, setCopied] = useState(false);
  const [funding, setFunding] = useState(false);

  // Esc to close + lock background scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const copy = useCallback(() => {
    if (!address) return;
    navigator.clipboard?.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }, [address]);

  const buyWithCard = useCallback(async () => {
    if (!auth.fund) return;
    setFunding(true);
    try {
      await auth.fund();
    } finally {
      setFunding(false);
    }
  }, [auth]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Deposit funds"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex max-h-[92dvh] w-full flex-col overflow-y-auto rounded-t-2xl border border-line-2 bg-panel shadow-2xl sm:max-w-sm sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-bold text-ink">Deposit</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-chad/25 bg-chad/[0.06] px-2 py-0.5 text-[11px] font-semibold text-chad">
              <span className="h-1.5 w-1.5 rounded-full bg-chad" /> Solana
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-panel-2 hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5">
          <p className="text-center text-sm leading-relaxed text-ink-dim">
            Send <span className="font-semibold text-ink">SOL</span> or any Solana token to your
            ChadWallet address to start trading.
          </p>

          {!auth.enabled && (
            <p className="rounded-lg border border-chad/20 bg-chad/[0.05] px-3 py-2 text-center text-[11px] leading-relaxed text-chad/90">
              Demo mode — this is a sample address. Connect Privy and sign in to use your real
              embedded wallet.
            </p>
          )}

          {/* QR card */}
          <div className="mx-auto flex flex-col items-center gap-3">
            <div className="relative rounded-2xl bg-white p-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]">
              {address ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/qr?data=${address}`}
                  alt="Wallet address QR code"
                  width={192}
                  height={192}
                  className="h-44 w-44 sm:h-48 sm:w-48"
                />
              ) : (
                <div className="h-44 w-44 animate-pulse rounded-lg bg-black/10 sm:h-48 sm:w-48" />
              )}
              <div className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-inset ring-black/5" />
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-faint">
              <ShieldCheck className="h-3.5 w-3.5 text-up" /> Self-custodial · secured by Privy
            </span>
          </div>

          {/* Address + copy */}
          <button
            onClick={copy}
            className="group flex w-full items-center gap-3 rounded-xl border border-line-2 bg-base p-3 text-left transition-colors hover:border-chad/40"
          >
            <div className="min-w-0 flex-1">
              <div className="text-[11px] uppercase tracking-wide text-ink-faint">
                Your wallet address
              </div>
              <div className="mt-0.5 break-all font-mono text-sm text-ink">
                {address ? (
                  <>
                    <span className="sm:hidden">{shortAddr(address, 8)}</span>
                    <span className="hidden sm:inline">{address}</span>
                  </>
                ) : (
                  "—"
                )}
              </div>
            </div>
            <span
              className={cnState(
                copied,
                "shrink-0 rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors",
              )}
            >
              {copied ? (
                <span className="flex items-center gap-1 text-up">
                  <Check className="h-3.5 w-3.5" /> Copied
                </span>
              ) : (
                <span className="flex items-center gap-1 text-ink-dim group-hover:text-chad">
                  <Copy className="h-3.5 w-3.5" /> Copy
                </span>
              )}
            </span>
          </button>

          {/* Buy with card — only when Privy funding is wired (live app) */}
          {auth.fund && (
            <button
              onClick={buyWithCard}
              disabled={funding}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-chad py-3 text-sm font-semibold text-base shadow-[0_0_24px_-6px_#ccff0066] transition-all hover:bg-chad/90 active:scale-[0.98] disabled:opacity-60"
            >
              <CreditCard className="h-4 w-4" />
              {funding ? "Opening…" : "Buy SOL with card or transfer"}
            </button>
          )}

          {/* Network warning */}
          <div className="flex items-start gap-2 rounded-xl border border-amber/20 bg-amber/[0.06] p-3">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
            <p className="text-[12px] leading-relaxed text-ink-dim">
              Only send assets on the <span className="font-semibold text-ink">Solana</span> network
              to this address. Funds sent on other networks may be lost.
            </p>
          </div>
        </div>

        {/* Powered-by footer */}
        <div className="flex items-center justify-center gap-1.5 border-t border-line px-5 py-3 text-[11px] text-ink-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-chad" />
          Powered by ChadWallet on Solana
        </div>
      </div>
    </div>
  );
}

// Small helper so the copied/idle pill swaps border colour without pulling cn().
function cnState(active: boolean, base: string): string {
  return `${base} ${active ? "border-up/40 bg-up-soft" : "border-line-2 bg-panel-2"}`;
}
