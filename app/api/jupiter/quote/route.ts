import { NextResponse } from "next/server";
import { getQuote } from "@/lib/jupiter";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const inputMint = sp.get("inputMint");
  const outputMint = sp.get("outputMint");
  const amount = sp.get("amount");
  const slippageBps = Number(sp.get("slippageBps") ?? 100);
  if (!inputMint || !outputMint || !amount) {
    return NextResponse.json({ error: "inputMint, outputMint and amount are required" }, { status: 400 });
  }
  try {
    const quote = await getQuote({ inputMint, outputMint, amount, slippageBps });
    return NextResponse.json({ data: quote });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
