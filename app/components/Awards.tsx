"use client";

import React from "react";
import { ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";

export default function Awards() {
  return (
    <section
      id="awards"
      className="py-32 px-6 md:px-24 border-b border-neutral-800 bg-neutral-900/20"
    >
      <div className="max-w-6xl">
        {" "}
        {/* Increased max-width for better spacing */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h2 className="text-4xl font-bold tracking-tight text-white">
              Recognition
            </h2>
          </div>

          <Link
            href="/recognition"
            className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mt-4 md:mt-0 font-mono text-sm uppercase tracking-widest"
          >
            View Full Archive
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {/* 3 Columns on Large Screens, 2 on Medium, 1 on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AwardCard
            title="Pulitzer Prize"
            project="Snowfall"
            detail="Feature Writing"
          />
          {/* UPDATED: Edward R. Murrow Award */}
          <AwardCard
            title="Edward R. Murrow"
            project="Making a Hit"
            detail="Winner: Innovation"
          />
          <AwardCard
            title="News & Doc Emmy"
            project="One Building, One Bomb"
            detail="Winner: New Approaches"
          />
          <AwardCard
            title="World Press Photo"
            project="Under a Cracked Sky"
            detail="Immersive Storytelling"
          />
          <AwardCard
            title="Cooper Hewitt"
            project="National Design Award"
            detail="Communication Design"
          />
          <AwardCard
            title="Anthem Award"
            project="Space to Belong"
            detail="Gold: Diversity & Inclusion"
          />
        </div>
      </div>
    </section>
  );
}

// Helper Sub-component
const AwardCard = ({
  title,
  project,
  detail,
}: {
  title: string;
  project: string;
  detail: string;
}) => (
  <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-sm hover:border-neutral-600 transition-colors group cursor-default">
    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
      {title}
    </h3>
    <div className="text-neutral-300 font-medium mb-4">{project}</div>
    <div className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
      {detail}
    </div>
  </div>
);
