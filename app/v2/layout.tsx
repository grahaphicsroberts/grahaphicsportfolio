import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graham Roberts — Scroll Experience (Preview)",
  description:
    "A scroll-driven overview of the career, work, and recognition of Graham Roberts.",
  // Preview of a possible homepage: keep it out of search until it ships.
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

export default function ScrollHomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
