import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speaking — Talks on Design, Technology & Journalism",
  description:
    "Sharing insights on the intersection of design, technology, and journalism at stages around the world, plus teaching and academic work.",
  alternates: { canonical: "/speaking" },
};

export default function SpeakingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
