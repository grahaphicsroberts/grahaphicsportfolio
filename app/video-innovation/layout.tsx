import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Innovation in Video & Motion — Data Visualization & VFX",
  description:
    "Motion capture, data sonification, and procedural VFX at The New York Times: video made to explain reality, not just capture it.",
  alternates: { canonical: "/video-innovation" },
};

export default function VideoInnovationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
