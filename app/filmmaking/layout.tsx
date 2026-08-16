import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experiments in Filmmaking",
  description:
    "Experiments in filmmaking: short films and motion work by Graham Roberts.",
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

export default function FilmmakingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
