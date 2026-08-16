import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Making a Hit",
  description:
    "A case study on Making a Hit, an anatomy of a pop song for The New York Times.",
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

export default function BieberLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
