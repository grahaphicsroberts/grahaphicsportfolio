import type { Metadata } from "next";

// Keep this bespoke presentation route private/unlisted from search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Spatial Design Deep Dive",
};

export default function SpatialDesignLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
