"use client";

import React from "react";
import { Mail, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="py-24 px-6 md:px-24 bg-white text-black">
      <div className="max-w-4xl">
        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8">
          Let's Talk.
        </h2>
        <div className="flex flex-wrap gap-8 text-lg font-medium">
          <a
            href="mailto:grahaphics@gmail.com"
            className="flex items-center gap-2 hover:underline"
          >
            <Mail className="w-5 h-5" /> Email
          </a>
          <a
            href="https://www.linkedin.com/in/grahaphics/"
            className="flex items-center gap-2 hover:underline"
          >
            <Linkedin className="w-5 h-5" /> LinkedIn
          </a>
          <a
            href="https://twitter.com/grahaphics"
            className="flex items-center gap-2 hover:underline"
          >
            <Twitter className="w-5 h-5" /> Twitter / X
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
