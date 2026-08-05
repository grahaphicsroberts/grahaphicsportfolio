import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Havas — The Art of Complex Data",
  description:
    "Building a global information design practice at Havas: 3D animation, AI-driven visualization, and interactive prototypes that make complex health data human and actionable.",
};

export default function HavasLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
