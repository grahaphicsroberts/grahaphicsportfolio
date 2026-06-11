import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NYT Virtual Reality — VR Filmmaking & 3D Interface Design",
  description:
    "Bringing virtual reality to the newsroom at The New York Times: VR filmmaking, real-time 3D environments, and immersive interface design for journalism at scale.",
};

export default function NYTVRLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
