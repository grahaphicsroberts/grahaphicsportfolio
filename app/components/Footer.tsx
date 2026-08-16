"use client";

import React from "react";
import Link from "next/link";
import { Mail, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="py-24 px-6 md:px-24 bg-white text-black">
      <div className="max-w-4xl">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-black/15 bg-black/5 px-4 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-700">
            Grahaphics &middot; Taking on select engagements for 2026
          </span>
        </div>

        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
          Let's Talk.
        </h2>
        <p className="mb-10 max-w-xl text-lg text-neutral-600">
          Advisory, strategy sprints, and prototype builds for teams with
          complex information to communicate.{" "}
          <Link href="/studio" className="text-black underline hover:no-underline">
            How the studio works
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-8 text-lg font-medium">
          <a
            href="mailto:grahaphics@gmail.com"
            className="flex items-center gap-2 hover:underline"
          >
            <Mail className="w-5 h-5" aria-hidden="true" /> Email
          </a>
          <a
            href="https://www.linkedin.com/in/grahaphics/"
            className="flex items-center gap-2 hover:underline"
          >
            <Linkedin className="w-5 h-5" aria-hidden="true" /> LinkedIn
          </a>
          <a
            href="https://twitter.com/grahaphics"
            className="flex items-center gap-2 hover:underline"
          >
            <Twitter className="w-5 h-5" aria-hidden="true" /> Twitter / X
          </a>
        </div>
        <p className="mt-24 text-sm text-neutral-500">
          © {new Date().getFullYear()} Graham Roberts. Built with Next.js &
          React.
        </p>
      </div>
    </footer>
  );
}
