import type { Metadata } from "next";

// One song's page, named after the song. What is true of every one of these —
// the name of the act, and that none of them is in search yet — is said once in
// the layout above this one.
export const metadata: Metadata = {
  title: "A Sharp Knife Is A Safe Knife",
  description:
    "Every part of A Sharp Knife Is A Safe Knife drawn as a ring that turns once for each pass of its loop. Click a ring to hear that part alone; drag one to wind the tape.",
  alternates: { canonical: "/snkrwavs/sharp-knife" },
};

export default function SharpKnifeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
