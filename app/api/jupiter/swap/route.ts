import { NextResponse } from "next/server";
import { buildSwap, type JupQuote } from "@/lib/jupiter";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { quoteResponse?: JupQuote; userPublicKey?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  if (!body.quoteResponse || !body.userPublicKey) {
    return NextResponse.json({ error: "quoteResponse and userPublicKey are required" }, { status: 400 });
  }
  try {
    const swap = await buildSwap({ quoteResponse: body.quoteResponse, userPublicKey: body.userPublicKey });
    return NextResponse.json({ data: swap });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
