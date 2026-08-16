import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Studio — Grahaphics",
  description:
    "Grahaphics is the independent practice of Graham Roberts: advisory, strategy sprints, working prototypes, and data visualization for teams with complex information to communicate.",
};

export default function StudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
