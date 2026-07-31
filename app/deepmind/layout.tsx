import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grahaphics × DeepMind — Proposal",
  description:
    "Proposal for the Economics of AGI microsite. A private presentation.",
  // Hidden + password-gated: keep it out of search engines entirely.
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

export default function DeepmindLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
