import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NYT Augmented Reality — Spatial Computing & Product Design",
  description:
    "Pioneering augmented reality journalism at The New York Times: spatial computing, AR product design, and immersive storytelling that placed readers inside the news.",
};

export default function NYTARLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
