// Shared domain types for ChadWallet trading surfaces.

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  price: number;
  priceChange24h: number; // percent, e.g. 12.4 or -3.1
  volume24h: number;
  liquidity: number;
  marketCap: number;
  holders?: number;
  // social / meta
  website?: string;
  twitter?: string;
  telegram?: string;
}

export interface Candle {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Trade {
  txHash: string;
  side: "buy" | "sell";
  priceUsd: number;
  amountToken: number;
  amountUsd: number;
  owner: string;
  time: number; // unix seconds
}

export interface Holder {
  rank: number;
  owner: string;
  amount: number;
  percent: number; // 0-100
  isInsider?: boolean;
}

export interface Position {
  token: Token;
  amount: number; // token units held
  valueUsd: number;
}

export type DataSource = "birdeye" | "jupiter" | "mock";

export interface ApiEnvelope<T> {
  data: T;
  source: DataSource;
  fetchedAt: number;
}
