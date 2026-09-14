import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "./lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Every relative URL in the metadata below, and in each page's canonical,
  // resolves against this rather than the deployment's own hostname.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Graham Roberts | Design Leader & Founder of Grahaphics",
    template: "%s | Graham Roberts",
  },
  description:
    "Graham Roberts is a design leader specializing in information design, data visualization, and immersive experiences. Through Grahaphics, his independent practice, he helps teams make complex information clear.",
  alternates: { canonical: "/" },
  // No title or description here on purpose: Next fills those per route from
  // each page's own, and setting them once here would freeze every share card
  // at the homepage's wording.
  openGraph: {
    type: "website",
    siteName: "Graham Roberts",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@grahaphics",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
