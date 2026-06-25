"use client";

import { useSyncExternalStore } from "react";

// Lightweight client-side position ledger. Records fills (real swaps in live
// mode, simulated fills in demo mode) so the "Your position" panel reflects the
// full buy/sell loop. Keyed in localStorage.

export interface PositionRecord {
  mint: string;
  symbol: string;
  logoURI?: string;
  amount: number; // net token units held
  costUsd: number; // net USD cost basis
}

const KEY = "chadwallet:positions:v1";
const EVT = "chadwallet:positions:changed";

function read(): Record<string, PositionRecord> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function write(data: Record<string, PositionRecord>) {
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(EVT));
}

// useSyncExternalStore requires a snapshot that keeps the SAME reference when
// the data hasn't changed — otherwise React loops. We cache the parsed array
// against the raw localStorage string and only recompute when that string
// changes.
const EMPTY: PositionRecord[] = [];
let snapStr: string | null = null;
let snapVal: PositionRecord[] = EMPTY;

function getSnapshot(): PositionRecord[] {
  if (typeof window === "undefined") return EMPTY;
  const str = localStorage.getItem(KEY) || "{}";
  if (str !== snapStr) {
    snapStr = str;
    try {
      snapVal = Object.values(JSON.parse(str) as Record<string, PositionRecord>);
    } catch {
      snapVal = EMPTY;
    }
  }
  return snapVal;
}

export function recordFill(fill: {
  mint: string;
  symbol: string;
  logoURI?: string;
  side: "buy" | "sell";
  amountToken: number;
  amountUsd: number;
}) {
  const data = read();
  const cur = data[fill.mint] ?? {
    mint: fill.mint,
    symbol: fill.symbol,
    logoURI: fill.logoURI,
    amount: 0,
    costUsd: 0,
  };
  if (fill.side === "buy") {
    cur.amount += fill.amountToken;
    cur.costUsd += fill.amountUsd;
  } else {
    const sellRatio = cur.amount > 0 ? Math.min(1, fill.amountToken / cur.amount) : 1;
    cur.costUsd = Math.max(0, cur.costUsd * (1 - sellRatio));
    cur.amount = Math.max(0, cur.amount - fill.amountToken);
  }
  cur.logoURI = fill.logoURI ?? cur.logoURI;
  if (cur.amount <= 1e-9) delete data[fill.mint];
  else data[fill.mint] = cur;
  write(data);
}

export function usePositions(): PositionRecord[] {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const onChange = () => callback();
      window.addEventListener(EVT, onChange);
      window.addEventListener("storage", onChange);
      return () => {
        window.removeEventListener(EVT, onChange);
        window.removeEventListener("storage", onChange);
      };
    },
    getSnapshot,
    () => EMPTY,
  );
}
