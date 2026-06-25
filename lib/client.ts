"use client";

import useSWR from "swr";
import type { Candle, DataSource, Holder, Token, Trade } from "./types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

interface Env<T> {
  data: T;
  source: DataSource;
  fetchedAt: number;
}

export function useTrending(limit = 20) {
  const { data, error, isLoading } = useSWR<Env<Token[]>>(
    `/api/tokens/trending?limit=${limit}`,
    fetcher,
    { refreshInterval: 30_000, revalidateOnFocus: false },
  );
  return { tokens: data?.data ?? [], source: data?.source, error, isLoading };
}

export function useToken(mint?: string) {
  const { data, error, isLoading } = useSWR<Env<Token>>(
    mint ? `/api/tokens/${mint}` : null,
    fetcher,
    { refreshInterval: 15_000, revalidateOnFocus: false },
  );
  return { token: data?.data, source: data?.source, error, isLoading };
}

export function useOhlcv(mint?: string, resolution = "1H", count = 160) {
  const { data, error, isLoading } = useSWR<Env<Candle[]>>(
    mint ? `/api/tokens/${mint}/ohlcv?resolution=${resolution}&count=${count}` : null,
    fetcher,
    { refreshInterval: 30_000, revalidateOnFocus: false },
  );
  return { candles: data?.data ?? [], source: data?.source, error, isLoading };
}

export function useTrades(mint?: string, limit = 40) {
  const { data, error, isLoading } = useSWR<Env<Trade[]>>(
    mint ? `/api/tokens/${mint}/trades?limit=${limit}` : null,
    fetcher,
    { refreshInterval: 8_000, revalidateOnFocus: false },
  );
  return { trades: data?.data ?? [], source: data?.source, error, isLoading };
}

export function useHolders(mint?: string, limit = 20) {
  const { data, error, isLoading } = useSWR<Env<Holder[]>>(
    mint ? `/api/tokens/${mint}/holders?limit=${limit}` : null,
    fetcher,
    { refreshInterval: 60_000, revalidateOnFocus: false },
  );
  return { holders: data?.data ?? [], source: data?.source, error, isLoading };
}

export function useAppConfig() {
  const { data } = useSWR<{ birdeye: boolean; privy: boolean; rpc: boolean }>(
    "/api/config",
    fetcher,
    { revalidateOnFocus: false },
  );
  return data;
}
