"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { useSignAndSendTransaction, useWallets } from "@privy-io/react-auth/solana";

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
    }),
    [ready, authenticated, walletAddress, user, login, logout, signAndSendBase64],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function DemoAuthBridge({ children }: { children: React.ReactNode }) {
  const notice = useCallback(() => {
    if (typeof window !== "undefined") {
      window.alert(
        "Sign-in is wired through Privy. Add NEXT_PUBLIC_PRIVY_APP_ID in .env.local to enable Apple / Google sign-in and the embedded Solana wallet.",
      );
    }
  }, []);
  const value = useMemo<ChadAuth>(
    () => ({
      enabled: false,
      ready: true,
      authenticated: false,
      login: notice,
      logout: () => {},
    }),
    [notice],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
