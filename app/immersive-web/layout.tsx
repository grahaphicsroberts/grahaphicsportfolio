import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Immersive Web — Immersive Storytelling & Information Design",
  description:
    "A decade of immersive web storytelling at The New York Times: information design, interactive graphics, and narrative experiences that reshaped digital journalism.",
};

export default function ImmersiveWebLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
