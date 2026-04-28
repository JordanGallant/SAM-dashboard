import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the dev server to accept requests proxied from these hosts.
  // Caddy reverse-proxies test.jgsleepy.xyz → localhost:3100, so the dev
  // server otherwise rejects cross-origin auth/HMR requests.
  allowedDevOrigins: ["test.jgsleepy.xyz", "localhost", "127.0.0.1"],
};

export default nextConfig;
