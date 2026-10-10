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
  // Clips out of public/ are served `max-age=0, must-revalidate` by default, so
  // every appearance costs a round trip before a frame can be drawn — which the
  // homepage banner pays each time a lockup comes back around. An hour is long
  // enough that a visit only fetches a clip once, and short enough that
  // replacing a file under the same name is not a day-long mystery.
  async headers() {
    return [
      {
        source: "/:clip*.mp4",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;