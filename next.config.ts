import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // 90 is for the hero's copper gradient, where 75 brings back banding in the dark areas
  // Project covers uploaded from the admin (its own deployment) live on Vercel Blob
  images: {
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Drive thumbnails on the industry portfolio pages (src/components/site/work-gallery.tsx)
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/d/**" },
    ],
  },
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/:lang/services", destination: "/:lang/industries", permanent: true },
      // The standalone Work page was removed (brief, 11 Nov 2026): the work now lives in each
      // industry's portfolio, behind its enquiry form
      { source: "/:lang/work", destination: "/:lang/industries", permanent: false },
      // Hospitality and Services became one page (5 Nov 2026 brief)
      { source: "/:lang/industries/:old(hospitality|services)", destination: "/:lang/industries/hospitality-services", permanent: true },
      { source: "/:lang/industries/:old(hospitality|services)/:rest*", destination: "/:lang/industries/hospitality-services/:rest*", permanent: true },
    ];
  },
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
