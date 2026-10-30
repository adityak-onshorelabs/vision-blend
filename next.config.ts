import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // 90 is for the hero's copper gradient, where 75 brings back banding in the dark areas
  // Project covers uploaded from the admin (its own deployment) live on Vercel Blob
  images: { qualities: [75, 90], remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }] },
  partialPrefetching: true,
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
