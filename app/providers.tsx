"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import {
  useFundWallet,
  useSignAndSendTransaction,
  useWallets,
} from "@privy-io/react-auth/solana";
import { Apple, Mail, X } from "lucide-react";
import { DepositProvider } from "@/components/deposit/Deposit";
import { DEMO_WALLET } from "@/lib/constants";

// ---- Unified auth surface consumed by the UI ----
export interface ChadAuth {
  enabled: boolean; // Privy configured?
  ready: boolean;
  authenticated: boolean;
  walletAddress?: string;
  email?: string;
  login: () => void;
  logout: () => void;
  /** Sign + send a base64 (v0) transaction with the embedded wallet. Returns the signature. */
  signAndSendBase64?: (b64: string) => Promise<string>;
  /** Open Privy's funding flow (card on-ramp / transfer) for the embedded wallet. */
  fund?: () => Promise<void>;
}

const AuthContext = createContext<ChadAuth | null>(null);

export function useAuth(): ChadAuth {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <Providers>");
  return ctx;
}

const APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export function Providers({ children }: { children: React.ReactNode }) {
  if (!APP_ID) {
    return <DemoAuthBridge>{children}</DemoAuthBridge>;
  }
  return (
    <PrivyProvider
      appId={APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#ccff00",
          logo: "/brand/logo.png",
          walletChainType: "solana-only",
        },
        loginMethods: ["google", "apple", "email"],
        embeddedWallets: {
          solana: { createOnLogin: "users-without-wallets" },
          showWalletUIs: true,
        },
      }}
    >
      <LiveAuthBridge>{children}</LiveAuthBridge>
    </PrivyProvider>
  );
}

function LiveAuthBridge({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const { fundWallet } = useFundWallet();

  const wallet = wallets[0];
  const walletAddress = wallet?.address;

  const signAndSendBase64 = useCallback(
    async (b64: string) => {
      if (!wallet) throw new Error("No Solana wallet connected");
      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      const { signature } = await signAndSendTransaction({ transaction: bytes, wallet });
      return btoa(String.fromCharCode(...signature));
    },
    [wallet, signAndSendTransaction],
  );

  const fund = useCallback(async () => {
    if (!walletAddress) return;
    await fundWallet({ address: walletAddress });
  }, [fundWallet, walletAddress]);

  const value = useMemo<ChadAuth>(
    () => ({
      enabled: true,
      ready,
      authenticated,
      walletAddress,
      email: (user?.email?.address as string | undefined) ?? undefined,
      login,
      logout,
      signAndSendBase64,
      fund,
    }),
    [ready, authenticated, walletAddress, user, login, logout, signAndSendBase64, fund],
  );

  return (
    <AuthContext.Provider value={value}>
      <DepositProvider>{children}</DepositProvider>
    </AuthContext.Provider>
  );
}

function DemoAuthBridge({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo<ChadAuth>(
    () => ({
      enabled: false,
      ready: true,
      authenticated: false,
      walletAddress: DEMO_WALLET,
      login: () => setOpen(true),
      logout: () => {},
    }),
    [],
  );
  return (
    <AuthContext.Provider value={value}>
      <DepositProvider>{children}</DepositProvider>
      {open && <DemoSignInModal onClose={() => setOpen(false)} />}
    </AuthContext.Provider>
  );
}

// A polished stand-in for the Privy modal when no app ID is configured — the
// real Privy sheet (Apple / Google / email) renders here once the key is set.
function DemoSignInModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to ChadWallet"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-line-2 bg-panel p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-panel-2 hover:text-ink"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="text-center">
          <div className="font-display text-lg font-bold text-ink">
            Sign in to <span className="text-chad">ChadWallet</span>
          </div>
          <p className="mt-1.5 text-sm text-ink-dim">
            Create a secure, self-custodial Solana wallet in seconds — no seed phrase.
          </p>
        </div>
        <div className="mt-5 space-y-2">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-semibold text-base transition-opacity hover:opacity-90">
            <Apple className="h-4 w-4" /> Continue with Apple
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-line-2 bg-base py-3 text-sm font-semibold text-ink transition-colors hover:border-chad/50">
            <GoogleGlyph /> Continue with Google
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-line-2 bg-base py-3 text-sm font-semibold text-ink-dim transition-colors hover:border-chad/50 hover:text-ink">
            <Mail className="h-4 w-4" /> Continue with email
          </button>
        </div>
        <p className="mt-5 rounded-lg border border-chad/20 bg-chad/[0.05] px-3 py-2 text-center text-[11px] leading-relaxed text-chad/90">
          Demo mode — add <span className="font-mono">NEXT_PUBLIC_PRIVY_APP_ID</span> to{" "}
          <span className="font-mono">.env.local</span> to enable real Apple / Google sign-in and
          the embedded wallet.
        </p>
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
