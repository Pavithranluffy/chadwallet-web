import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray lockfile in a parent dir otherwise makes
  // Next infer the wrong root.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  images: {
    // Token logos can come from arbitrary CDNs when using live BirdEye data.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
