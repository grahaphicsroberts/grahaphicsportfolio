import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snow Fall",
  description:
    "A case study on Snow Fall: The Avalanche at Tunnel Creek, from The New York Times.",
  // Superseded by the category pages and no longer linked from the site.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function SnowfallLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
