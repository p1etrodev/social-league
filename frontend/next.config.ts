import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Angular app still living at the repo root has its own
  // package-lock.json during the migration; pin the workspace root
  // explicitly so Turbopack doesn't guess wrong.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [new URL("https://ddragon.leagueoflegends.com/cdn/**")],
  },
};

export default nextConfig;
