// Jupiter swap helpers. Uses the free, keyless lite-api endpoint by default;
// set JUPITER_API_KEY + JUPITER_BASE to use the paid tier. Quotes are real
// even with no other keys configured.
// Docs: https://dev.jup.ag/docs/swap-api/

const JUP_BASE = process.env.JUPITER_BASE || "https://lite-api.jup.ag";

function jupHeaders(): HeadersInit {
  const h: Record<string, string> = { accept: "application/json", "content-type": "application/json" };
  if (process.env.JUPITER_API_KEY) h["x-api-key"] = process.env.JUPITER_API_KEY;
  return h;
}

export interface JupQuote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  priceImpactPct: string;
  slippageBps: number;
  routePlan: Array<{ swapInfo?: { label?: string }; percent?: number }>;
  [k: string]: unknown;
}

export async function getQuote(params: {
  inputMint: string;
  outputMint: string;
  amount: string; // base units of inputMint
  slippageBps?: number;
}): Promise<JupQuote> {
  const url = new URL(JUP_BASE + "/swap/v1/quote");
  url.searchParams.set("inputMint", params.inputMint);
  url.searchParams.set("outputMint", params.outputMint);
  url.searchParams.set("amount", params.amount);
  url.searchParams.set("slippageBps", String(params.slippageBps ?? 100));
  url.searchParams.set("restrictIntermediateTokens", "true");
  const res = await fetch(url, { headers: jupHeaders(), signal: AbortSignal.timeout(8000) });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Jupiter quote failed (${res.status}): ${txt.slice(0, 200)}`);
  }
  return (await res.json()) as JupQuote;
}

export async function buildSwap(params: {
  quoteResponse: JupQuote;
  userPublicKey: string;
}): Promise<{ swapTransaction: string; lastValidBlockHeight?: number }> {
  const res = await fetch(JUP_BASE + "/swap/v1/swap", {
    method: "POST",
    headers: jupHeaders(),
    body: JSON.stringify({
      quoteResponse: params.quoteResponse,
      userPublicKey: params.userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: { priorityLevelWithMaxLamports: { priorityLevel: "high", maxLamports: 2_000_000 } },
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Jupiter swap build failed (${res.status}): ${txt.slice(0, 200)}`);
  }
  return (await res.json()) as { swapTransaction: string; lastValidBlockHeight?: number };
}
