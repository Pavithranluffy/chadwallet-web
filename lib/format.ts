// Display formatters shared across the UI. Kept dependency-free and pure.

export function formatUsd(value: number, opts: { compact?: boolean } = {}): string {
  if (!isFinite(value)) return "$0";
  const abs = Math.abs(value);
  if (opts.compact && abs >= 1000) return "$" + compact(value);
  if (abs > 0 && abs < 0.000001)
    return "$" + value.toExponential(2);
  if (abs < 1) {
    // Show enough significant digits for sub-dollar memecoin prices.
    return "$" + value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: abs < 0.01 ? 8 : 6,
    });
  }
  return "$" + value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function compact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e9) return sign + (abs / 1e9).toFixed(2) + "B";
  if (abs >= 1e6) return sign + (abs / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return sign + (abs / 1e3).toFixed(1) + "K";
  return sign + abs.toFixed(0);
}

export function formatPct(value: number): string {
  if (!isFinite(value)) return "0.0%";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatAmount(value: number): string {
  if (!isFinite(value)) return "0";
  if (Math.abs(value) >= 1000) return compact(value);
  return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export function shortAddr(addr: string, chars = 4): string {
  if (!addr) return "";
  if (addr.length <= chars * 2 + 1) return addr;
  return `${addr.slice(0, chars)}…${addr.slice(-chars)}`;
}

export function timeAgo(unixSeconds: number): string {
  const diff = Math.max(0, Math.floor(Date.now() / 1000 - unixSeconds));
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export function changeColor(pct: number): string {
  if (pct > 0) return "text-up";
  if (pct < 0) return "text-down";
  return "text-ink-dim";
}
