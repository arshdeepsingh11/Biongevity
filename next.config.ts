import type { NextConfig } from "next";

/**
 * Static export so the same build runs on the web (any static host / Vercel)
 * and inside Capacitor (iOS / Android). All commerce goes through the Shopify
 * Storefront API from the client, so no Node server is required.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
