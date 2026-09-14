import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Senior Design Leader & Founder of Grahaphics",
  description:
    "Senior design leader at the frontier of AI, information design, and digital storytelling — from The New York Times and Google to Havas, and now Grahaphics.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
