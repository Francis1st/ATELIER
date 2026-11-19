import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export for Cloudflare Pages (local-first app, no Node server).
  output: "export",
  images: { unoptimized: true },
  // Allow LAN / loopback preview during local development (HMR / assets).
  allowedDevOrigins: ["127.0.0.1", "172.16.31.157", "198.18.0.0"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
