import { toString } from "qrcode";

// Renders a high-contrast SVG QR code for a Solana wallet address so users can
// scan it from another wallet / exchange to deposit. Generated on the server so
// the (node-oriented) `qrcode` lib never ships to the client bundle.

export const runtime = "nodejs";

// Base58, 32–44 chars — the shape of a Solana public key. We refuse anything
// else so the endpoint can't be used to render arbitrary payloads.
const ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export async function GET(req: Request) {
  const data = new URL(req.url).searchParams.get("data")?.trim() ?? "";
  if (!ADDRESS_RE.test(data)) {
    return new Response("Invalid address", { status: 400 });
  }

  const svg = await toString(data, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#0a0a0a", light: "#ffffff" },
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // Address → QR is a pure function, so cache aggressively & immutably.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
