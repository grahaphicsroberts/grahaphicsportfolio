"use client";

import React from "react";
import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";
import XIcon from "./XIcon";

export default function Footer() {
  return (
    <footer id="contact" className="py-24 px-6 md:px-24 bg-white text-black">
      <div className="max-w-4xl">
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
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline"
          >
            <Linkedin className="w-5 h-5" aria-hidden="true" /> LinkedIn
          </a>
          <a
            href="https://x.com/grahaphics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline"
          >
            <XIcon className="w-4 h-4" /> X
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
