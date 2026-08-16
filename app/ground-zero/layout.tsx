import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ground Zero",
  description:
    "A case study on the Ground Zero visual investigation for The New York Times.",
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

export default function GroundZeroLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
