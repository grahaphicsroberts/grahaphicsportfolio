"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// --- DATA: RECENT SPEAKING ENGAGEMENTS ---
const SPEAKING_ENGAGEMENTS = [
  {
    year: "2025",
    event: "Bridge Summit",
    location: "Abu Dhabi, UAE",
    role: "Keynote",
  },
  {
    year: "2025",
    event: "XPerts Series: Data Visualization",
    location: "Virtual",
    role: "Speaker",
  },
  {
    year: "2024",
    event: "Novartis Panel",
    location: "New York, NY",
    role: "Panelist",
  },
  {
    year: "2024",
    event: "Havas Data Different(ly)",
    location: "New York, NY",
    role: "Speaker",
  },
];

export default function Speaking() {
  return (
    <section
      id="speaking"
      className="py-32 px-6 md:px-24 border-b border-neutral-800"
    >
      <div className="max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-white">Speaking</h2>

          {/* Link to the full archive page */}
          <Link
            href="/speaking"
            className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mt-4 md:mt-0 font-mono text-sm uppercase tracking-widest"
          >
            View Full Archive
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <ul className="space-y-6">
          {SPEAKING_ENGAGEMENTS.map((item, index) => (
            <SpeakingItem
              key={index}
              event={item.event}
              location={item.location}
              year={item.year}
              role={item.role}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

// --- SUB-COMPONENT ---
const SpeakingItem = ({
  event,
  location,
  year,
  role,
}: {
  event: string;
  location: string;
  year: string;
  role: string;
}) => (
  <li className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-neutral-800 hover:border-neutral-600 hover:pl-4 transition-all cursor-default group">
    <span className="text-xl font-medium text-neutral-300 group-hover:text-white transition-colors">
      {event}
    </span>
    
    <div className="flex items-center gap-4 md:gap-8 mt-2 md:mt-0 text-neutral-500 font-mono text-sm group-hover:text-neutral-400 transition-colors">
      <span className="text-neutral-400">{role}</span>
      <span className="hidden md:inline w-1 h-1 bg-neutral-800 rounded-full" />
      <span>{location}</span>
      <span className="hidden md:inline w-1 h-1 bg-neutral-800 rounded-full" />
      <span>{year}</span>
    </div>
  </li>
);