# ChadWallet — Web

A fomo.family-style landing page **and** a full Solana trading terminal for the
ChadWallet brand. Built with Next.js 16 (App Router) + Tailwind v4, and powered by
live data from BirdEye, Jupiter and an RPC of your choice — with a deterministic
mock layer so the whole app is alive even with no keys set.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build && npm start
```

> Works immediately with **zero configuration** — it renders realistic simulated
> market data and shows a small "Demo mode" banner. Add the keys below to go fully live.

## Environment variables

Create `.env.local` in the project root:

```bash
# BirdEye Data API — trending tokens, prices, OHLCV, trades, holders
# https://birdeye.so/data-api  (free tier available)
BIRDEYE_API_KEY=

# Privy — Sign in with Apple / Google + embedded Solana wallet
# https://privy.io  (free tier available)
NEXT_PUBLIC_PRIVY_APP_ID=

# Solana RPC — used by the embedded wallet to send swap transactions
# https://www.alchemy.com/rpc-api  (free tier available)
NEXT_PUBLIC_SOLANA_RPC_URL=

# Jupiter — optional. Quotes/swaps work keyless on the free lite-api by default.
# JUPITER_API_KEY=
# JUPITER_BASE=https://lite-api.jup.ag
```

All integrations degrade gracefully: any missing key or failed upstream call
falls back to the mock layer, so the UI is never empty.

## Requirements coverage

| Requirement | Status |
| --- | --- |
| ChadWallet brand (logo, palette, app links) | ✅ |
| Sign in with Apple / Google via Privy | ✅ `app/providers.tsx` |
| Solana support | ✅ |
| Rotating token banners top **and** bottom; tap a token → trade page | ✅ `components/TokenBanner.tsx` |
| Trading UI — left: trending list | ✅ `components/trade/TrendingList.tsx` |
| Trading UI — middle: token info, price chart, holders, live trades | ✅ `ChartCard`, `TokenHeader`, `ActivityTabs` |
| Trading UI — right: buy & sell, user positions | ✅ `SwapPanel`, `Positions` |
| Live charts | ✅ TradingView Lightweight Charts |
| Real data (BirdEye / Jupiter / RPC) | ✅ with mock fallback |
| Deposit / add funds (QR + address + Privy on-ramp) | ✅ `components/deposit/Deposit.tsx`, `app/api/qr` |
| Privacy Policy & Terms of Service | ✅ `/privacy`, `/terms` |

## Architecture notes

- **Data is server-rendered on first paint.** The landing and trade pages fetch
  trending tokens (and, on the trade page, the active token's chart / trades /
  holders) on the server and seed SWR's cache via `TrendingProvider`. The banner,
  "Live on Solana" grid and trade panels are populated in the first HTML byte —
  no loading flash and no dependency on a client fetch succeeding. SWR then
  revalidates in the background. Pages are ISR-cached (`revalidate = 30`).
- **Motion** is a hybrid by design: critical content (hero text, buttons, scroll
  reveals, stat count-ups) uses pure **CSS animations + IntersectionObserver**, so
  it always ends visible and ships almost no JS. The one **signature** moment — the
  pinned, horizontally-scrubbed "trade flow" rail — uses **GSAP ScrollTrigger**,
  scoped via `gsap.matchMedia` to large, motion-safe screens (swipeable fallback
  elsewhere). All motion respects `prefers-reduced-motion`.
- **Swaps** are routed through Jupiter; transactions are signed and sent by the
  Privy embedded Solana wallet. Without a wallet (demo), fills are simulated and
  recorded to a local position ledger so the buy/sell loop is fully demonstrable.
- **Funding** (`Deposit`) is reachable from the header menu, the positions panel,
  and `?deposit` deep links. It shows a scannable QR + the wallet address (served
  by `/api/qr` as an SVG generated server-side) and, when Privy is live, a
  card / transfer on-ramp via `useFundWallet`. It is fully demoable with zero
  config — a clearly-labelled sample address renders in demo mode.

## Deploy

`.env.local` is gitignored, so set the keys in your host's dashboard. Because
`NEXT_PUBLIC_*` values are inlined at build time, they must be present **before**
the build runs. The app degrades to demo mode if any are missing, so it deploys
and renders even with none set.

### Netlify (recommended for this repo)

A `netlify.toml` is included. Import the repo into Netlify (the official
`@netlify/plugin-nextjs` runtime is wired up — SSR, API routes and ISR all work
with no extra config), add the env vars under **Site settings → Environment
variables**, and deploy. Node version is pinned to 22 via `netlify.toml` / `.nvmrc`.

### Vercel

Import the repo, add the env vars under **Project → Settings → Environment
Variables**, and deploy. No further config needed.
