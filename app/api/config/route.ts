import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Lets the client know which integrations are live (without leaking secrets),
// so it can show a "demo data" badge when running keyless.
export async function GET() {
  return NextResponse.json({
    birdeye: Boolean(process.env.BIRDEYE_API_KEY),
    privy: Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID),
    rpc: Boolean(process.env.NEXT_PUBLIC_SOLANA_RPC_URL),
  });
}
