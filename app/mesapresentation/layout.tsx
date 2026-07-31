import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graham Roberts — Presentation",
  description: "A guided walkthrough of the work and career of Graham Roberts.",
  // Hidden page: keep it out of search engines. Accessible only via direct link.
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

export default function MesaPresentationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
