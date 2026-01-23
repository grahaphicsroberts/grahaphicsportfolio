"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const WORKS = [
  // 1. Current Role (This will be PINNED)
  {
    title: "Havas Global Design",
    category: "Network Level Design Leadership",
    year: "2023 — Present",
    image: "/havas-hero.jpg",
    link: "/havas",
  },
  // --- EVERYTHING BELOW THIS WILL BE SHUFFLED ---
  {
    title: "Google Search Trends",
    category: "Digital & Experiential Design",
    year: "2019 — 2023",
    image: "/google-hero.jpg",
    link: "/google-trends",
  },
  {
    title: "NYT Immersive AR",
    category: "Product Strategy & Design",
    year: "2014 — 2019",
    image: "/AR-hero.jpg",
    link: "/nyt-ar",
    featured: true,
  },
  {
    title: "The New York Times VR",
    category: "Editorial Leadership and Product Design",
    year: "2016 — 2019",
    image: "/NYTVR_studioimage.png",
    link: "/nyt-vr",
    featured: true,
  },
  {
    title: "Immersive Web Design",
    category: "Visual Journalism & Innovation",
    year: "2012 — 2019",
    image: "/immersive-hero.jpg",
    link: "/immersive-web",
    featured: true,
  },
  {
    title: "Innovation in Video",
    category: "Motion Design & Data Cinema",
    year: "2006 — 2019",
    image: "/video-hero.jpg",
    link: "/video-innovation",
    featured: true,
  },
];

export default function SelectedWorks() {
  const [displayWorks, setDisplayWorks] = useState(WORKS);

  useEffect(() => {
    // Separate the first item (Pinned) from the rest
    const [pinnedWork, ...restOfWorks] = WORKS;

    // Shuffle only the 'rest'
    for (let i = restOfWorks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [restOfWorks[i], restOfWorks[j]] = [restOfWorks[j], restOfWorks[i]];
    }

    // Recombine: Pinned item first, then the shuffled rest
    setDisplayWorks([pinnedWork, ...restOfWorks]);
  }, []);

  return (
    <section id="work" className="py-32 px-6 md:px-12 bg-neutral-950">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-2">
        <h2 className="text-4xl font-bold tracking-tight text-white">
          Selected Works
        </h2>
        <span className="text-neutral-500 font-mono text-xs uppercase tracking-widest mt-4 md:mt-0">
          Curated Projects
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {displayWorks.map((work, i) => (
          <Link href={work.link} key={i} className="group block">
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900 rounded-sm mb-6 border border-neutral-800">
              <div className="absolute inset-0 bg-neutral-800 animate-pulse group-hover:hidden" />
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              />

              {/* Hover Overlay */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Typography */}
            <div className="flex justify-between items-start border-b border-neutral-800 pb-4 group-hover:border-white/50 transition-colors">
              <div>
                <h3 className="text-2xl font-bold text-neutral-200 group-hover:text-white transition-colors mb-1">
                  {work.title}
                </h3>
                <p className="text-neutral-500 font-mono text-sm uppercase tracking-wider">
                  {work.category}
                </p>
              </div>
              <span className="text-neutral-600 font-mono text-sm">
                {work.year}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
