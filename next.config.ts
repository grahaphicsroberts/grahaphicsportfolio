import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // The snkrwavs share card carries the Grahaphics mark, read off disk when the
  // card is made. Say so here, so the file travels with the code that reads it
  // rather than being left behind in the repository.
  outputFileTracingIncludes: {
    "/snkrwavs/**": ["./public/logos/**"],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;