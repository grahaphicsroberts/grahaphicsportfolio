import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recognition — Pulitzer, Emmy & Murrow-Honored Work",
  description:
    "Work recognized by the Pulitzer Prize, a News & Documentary Emmy, Edward R. Murrow and World Press Photo awards, and the Museum of Modern Art collection.",
  alternates: { canonical: "/recognition" },
};

export default function RecognitionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
