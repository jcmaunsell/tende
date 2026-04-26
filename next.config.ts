import type { NextConfig } from "next";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
  adapterPath: process.env.VERCEL
    ? require.resolve("@next-community/adapter-vercel")
    : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.squarespace-cdn.com",
      },
    ],
  },
};

export default nextConfig;
