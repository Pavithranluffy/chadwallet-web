import { Info } from "lucide-react";
import { hasBirdeyeKey } from "@/lib/constants";

// Server component. The BirdEye key is a server-side env var, so we already know
// at render time whether market data is live or simulated. Rendering this into
// the initial HTML — instead of after a client-side /api/config fetch — means it
// paints with the rest of the page on first load, with no late pop-in or layout
// shift (the jarring "it suddenly appears" effect).
export function DemoNotice() {
  if (hasBirdeyeKey()) return null;
  return (
    <div className="border-b border-chad/15 bg-chad/[0.06] px-4 py-2 text-center text-xs text-chad/90">
      <Info className="mr-1.5 inline h-3.5 w-3.5 align-text-bottom" />
      <span>
        Showing realistic simulated market data. Add a BirdEye API key to stream live Solana prices,
        trades and charts.
      </span>
    </div>
  );
}
