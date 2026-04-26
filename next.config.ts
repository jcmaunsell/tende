import type { NextConfig } from "next";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
  // The Vercel adapter is required for Next.js 16 routing to work on Vercel.
  // Gated on process.env.VERCEL so it doesn't run locally (where @vercel/build-utils
  // isn't available outside the Vercel build environment).
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
