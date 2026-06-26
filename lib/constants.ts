// App-wide configuration and well-known Solana mints.

export const APP = {
  name: "ChadWallet",
  tagline: "The #1 meme coin trading app",
  description:
    "Discover, track, buy, and trade Solana assets through a fast, social-first experience.",
  twitter: "https://twitter.com/chadwallet",
  youtube: "https://www.youtube.com/channel/UCbL5EiysnddtrA1u1i9jnPg",
  appStore: "https://apps.apple.com/us/app/chadwallet/id6757367474",
  playStore: "https://play.google.com/store/apps/details?id=xyz.chadwallet.www",
};

// Solana native mint (wrapped SOL) — used as the default quote asset for swaps.
export const SOL_MINT = "So11111111111111111111111111111111111111112";
export const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

// A clearly-labelled placeholder address so the Deposit sheet is fully
// demonstrable with zero config (no Privy key). Replaced by the user's real
// embedded-wallet address as soon as Privy is wired and they sign in.
export const DEMO_WALLET = "Chadw4LLetDemo5oLanaAddre55Preview11111111";

// Tokens we seed the trending banner + list with when BirdEye returns nothing
// (or no key is configured). These are real, well-known Solana mints.
export const SEED_MINTS: { address: string; symbol: string; name: string }[] = [
  { address: SOL_MINT, symbol: "SOL", name: "Solana" },
  { address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", symbol: "BONK", name: "Bonk" },
  { address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", symbol: "WIF", name: "dogwifhat" },
  { address: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ", symbol: "W", name: "Wormhole" },
  { address: "6ogzHhzdrQr9Pgv6hZ2MNze7UrzBMAFyBBWUYp1Fhitx", symbol: "RENDER", name: "Render" },
  { address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3", symbol: "PYTH", name: "Pyth" },
  { address: "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC", symbol: "POPCAT", name: "Popcat" },
  { address: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5", symbol: "MEW", name: "cat in a dogs world" },
  { address: "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ7i3Hd", symbol: "BOME", name: "BOOK OF MEME" },
  { address: "A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump", symbol: "FWOG", name: "Fwog" },
  { address: "63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9", symbol: "GIGA", name: "Gigachad" },
  { address: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump", symbol: "PNUT", name: "Peanut the Squirrel" },
];

// Cache windows (seconds) for server route responses.
export const CACHE = {
  trending: 30,
  token: 15,
  ohlcv: 30,
  trades: 8,
  holders: 60,
};

export const hasBirdeyeKey = () => Boolean(process.env.BIRDEYE_API_KEY);
