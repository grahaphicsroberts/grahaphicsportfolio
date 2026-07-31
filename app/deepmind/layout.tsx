import type { Metadata, Viewport } from "next";

// This route is a full-screen, viewport-locked slide deck. Pinning the scale
// stops iOS (Safari/Chrome) from pinch-zooming and then panning the "zoomed"
// visual viewport around, which reads as the deck being draggable / cut off.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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
