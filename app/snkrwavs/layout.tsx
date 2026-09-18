import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "snkrwavs",
  description:
    "A way to see music loops: each stem drawn as a circular staff that turns once for every pass of its loop.",
  // In progress and linked from nowhere, so it stays out of search until it is
  // something worth finding.
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

export default function SnkrwavsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
