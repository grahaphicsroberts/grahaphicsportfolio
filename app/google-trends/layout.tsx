import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Google Brand Studio — Visualizing the World’s Curiosity",
  description:
    "As digital design lead at Google Brand Studio: data-driven discovery, global web platforms, and interactive installations built from Google Trends search data.",
  alternates: { canonical: "/google-trends" },
};

export default function GoogleTrendsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
