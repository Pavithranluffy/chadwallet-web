"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Check, ExternalLink, Settings2, ArrowDown } from "lucide-react";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/Button";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { SOL_MINT } from "@/lib/constants";
import { formatAmount } from "@/lib/format";
import { recordFill } from "@/lib/positions";
import { cn } from "@/lib/cn";
import type { Token } from "@/lib/types";

type Side = "buy" | "sell";
interface Quote {
  inAmount: string;
  outAmount: string;
  priceImpactPct: string;
  [k: string]: unknown;
}

const BUY_PRESETS = [0.1, 0.5, 1, 5];
const SELL_PRESETS = [25, 50, 100];

export function SwapPanel({ token, initialSide = "buy" }: { token?: Token; initialSide?: Side }) {
  const auth = useAuth();
  const [side, setSide] = useState<Side>(initialSide);
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(1);
  const [showSlip, setShowSlip] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteErr, setQuoteErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ sig: string; simulated: boolean } | null>(null);
  const seq = useRef(0);

  const SOL_DECIMALS = 9;
  const inDecimals = side === "buy" ? SOL_DECIMALS : token?.decimals ?? 6;
  const outDecimals = side === "buy" ? token?.decimals ?? 6 : SOL_DECIMALS;
  const inSymbol = side === "buy" ? "SOL" : token?.symbol ?? "";
  const outSymbol = side === "buy" ? token?.symbol ?? "" : "SOL";

  // Debounced live quote from Jupiter.
  useEffect(() => {
    let quoteId: number | undefined;
    const id = window.setTimeout(() => {
      setDone(null);
      const amt = parseFloat(amount);
      if (!token || !amt || amt <= 0) {
        setQuote(null);
        setQuoteErr(null);
        return;
      }
      const inputMint = side === "buy" ? SOL_MINT : token.address;
      const outputMint = side === "buy" ? token.address : SOL_MINT;
      const base = Math.round(amt * 10 ** inDecimals).toString();
      const mySeq = ++seq.current;
      setQuoting(true);
      setQuoteErr(null);
      quoteId = window.setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/jupiter/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${base}&slippageBps=${Math.round(
              slippage * 100,
            )}`,
          );
          const json = await res.json();
          if (mySeq !== seq.current) return;
          if (!res.ok) {
            setQuote(null);
            setQuoteErr(json.error?.slice(0, 80) || "No route found");
          } else {
            setQuote(json.data);
          }
        } catch {
          if (mySeq === seq.current) setQuoteErr("Quote failed");
        } finally {
          if (mySeq === seq.current) setQuoting(false);
        }
      }, 350);
    }, 0);
    return () => {
      window.clearTimeout(id);
      if (quoteId !== undefined) window.clearTimeout(quoteId);
    };
  }, [amount, side, slippage, token, inDecimals]);

  const outAmount = quote ? Number(quote.outAmount) / 10 ** outDecimals : 0;
  const priceImpact = quote ? parseFloat(quote.priceImpactPct) * 100 : 0;

  async function execute() {
    if (!token) return;
    if (!auth.authenticated) {
      auth.login();
      return;
    }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    setBusy(true);
    try {
      let sig = "";
      let simulated = false;
      if (auth.walletAddress && auth.signAndSendBase64 && quote) {
        const res = await fetch("/api/jupiter/swap", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ quoteResponse: quote, userPublicKey: auth.walletAddress }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Swap build failed");
        sig = await auth.signAndSendBase64(json.data.swapTransaction);
      } else {
        // No embedded wallet available (e.g. demo build) — simulate the fill.
        await new Promise((r) => setTimeout(r, 700));
        simulated = true;
      }
      // Record into the local position ledger so the right panel updates.
      const tokenAmount = side === "buy" ? outAmount : amt;
      const usd = tokenAmount * token.price;
      recordFill({
        mint: token.address,
        symbol: token.symbol,
        logoURI: token.logoURI,
        side,
        amountToken: tokenAmount,
        amountUsd: usd,
      });
      setDone({ sig, simulated });
      setAmount("");
      setQuote(null);
    } catch (e) {
      setQuoteErr((e as Error).message?.slice(0, 100) || "Transaction failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Buy / Sell toggle */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-base p-1">
        {(["buy", "sell"] as Side[]).map((s) => (
          <button
            key={s}
            onClick={() => {
              setSide(s);
              setAmount("");
            }}
            className={cn(
              "rounded-lg py-2 text-sm font-semibold capitalize transition-colors",
              side === s
                ? s === "buy"
                  ? "bg-up text-base"
                  : "bg-down text-white"
                : "text-ink-dim hover:text-ink",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Amount input */}
      <div className="rounded-xl border border-line-2 bg-base p-3">
        <div className="flex items-center justify-between text-xs text-ink-faint">
          <span>You pay</span>
          <button onClick={() => setShowSlip((v) => !v)} className="flex items-center gap-1 hover:text-ink">
            <Settings2 className="h-3.5 w-3.5" /> {slippage}% slippage
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            className="tnum w-full bg-transparent text-2xl font-semibold text-ink outline-none placeholder:text-ink-faint"
          />
          <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-panel px-2.5 py-1.5">
            <TokenLogo symbol={inSymbol} src={side === "sell" ? token?.logoURI : undefined} size={20} />
            <span className="text-sm font-semibold">{inSymbol}</span>
          </div>
        </div>
        {showSlip && (
          <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3">
            {[0.5, 1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => setSlippage(s)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium",
                  slippage === s ? "bg-chad text-base" : "bg-panel text-ink-dim hover:text-ink",
                )}
              >
                {s}%
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Presets */}
      <div className="flex gap-1.5">
        {(side === "buy" ? BUY_PRESETS : SELL_PRESETS).map((p) => (
          <button
            key={p}
            onClick={() => setAmount(side === "buy" ? String(p) : amount)}
            className="flex-1 rounded-lg border border-line-2 py-1.5 text-xs font-medium text-ink-dim transition-colors hover:border-chad/40 hover:text-chad"
          >
            {side === "buy" ? `${p} SOL` : `${p}%`}
          </button>
        ))}
      </div>

      {/* Quote / receive */}
      <div className="flex items-center justify-center">
        <div className="rounded-full border border-line bg-panel p-1.5 text-ink-faint">
          <ArrowDown className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="rounded-xl border border-line-2 bg-base p-3">
        <div className="text-xs text-ink-faint">You receive (est.)</div>
        <div className="mt-2 flex items-center gap-2">
          <div className="tnum flex-1 text-2xl font-semibold text-ink">
            {quoting ? <span className="text-ink-faint">…</span> : outAmount ? formatAmount(outAmount) : "0.00"}
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-panel px-2.5 py-1.5">
            <TokenLogo symbol={outSymbol} src={side === "buy" ? token?.logoURI : undefined} size={20} />
            <span className="text-sm font-semibold">{outSymbol}</span>
          </div>
        </div>
        {quote && (
          <div className="mt-2 flex items-center justify-between border-t border-line pt-2 text-xs text-ink-faint">
            <span>Price impact</span>
            <span className={cn("tnum", priceImpact > 3 ? "text-down" : "text-ink-dim")}>
              {priceImpact < 0.01 ? "<0.01" : priceImpact.toFixed(2)}%
            </span>
          </div>
        )}
        {quoteErr && <div className="mt-2 text-xs text-down">{quoteErr}</div>}
      </div>

      {/* Execute */}
      <Button
        onClick={execute}
        disabled={busy || (auth.authenticated && (!amount || parseFloat(amount) <= 0))}
        className={cn("w-full", side === "sell" && auth.authenticated && "bg-down text-white hover:bg-down/90")}
        size="lg"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Confirming…
          </>
        ) : !auth.authenticated ? (
          "Sign in to trade"
        ) : side === "buy" ? (
          `Buy ${token?.symbol ?? ""}`
        ) : (
          `Sell ${token?.symbol ?? ""}`
        )}
      </Button>

      {done && (
        <div className="flex items-start gap-2 rounded-xl border border-up/30 bg-up-soft p-3 text-sm">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-up" />
          <div>
            <div className="font-medium text-ink">
              {done.simulated ? "Order filled (simulated)" : "Swap confirmed"}
            </div>
            {done.sig ? (
              <a
                href={`https://solscan.io/tx/${done.sig}`}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 flex items-center gap-1 text-xs text-chad hover:underline"
              >
                View on Solscan <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <div className="mt-0.5 text-xs text-ink-faint">Recorded in your positions below.</div>
            )}
          </div>
        </div>
      )}

      <p className="text-center text-[11px] leading-relaxed text-ink-faint">
        Best-price routing via Jupiter across Solana DEXs. {auth.walletAddress ? "" : "Quotes are live; "}
        trading involves risk.
      </p>
    </div>
  );
}
