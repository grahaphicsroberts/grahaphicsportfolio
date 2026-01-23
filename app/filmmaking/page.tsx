"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Play, Glasses, Mic, Scan, Activity } from "lucide-react";
import Link from "next/link";

// --- DATA: FILMMAKING PROJECTS ---
const SECTIONS = [
  {
    category: "Virtual Reality",
    icon: Glasses,
    title: "The Birth of NYT VR",
    description:
      "Defining a new grammar for immersion. We launched the NYT VR app and distributed over 1 million Google Cardboard headsets, creating a mass moment for virtual reality journalism.",
    video: "/nyt-vr.mp4",
    stat: "1M+ Headsets Distributed",
    tags: ["Immersive Video", "App Design", "Strategy"],
  },
  {
    category: "Music Visualization",
    icon: Mic,
    title: "Make a Hit & Kronos Quartet",
    description:
      "Visualizing the invisible patterns of music. From the pop mechanics of Justin Bieber to the avant-garde strings of the Kronos Quartet, these projects use motion capture and particle systems to make sound visible.",
    video: "/make-a-hit.mp4",
    // Note: You might want to combine Make a Hit + Kronos into one montage video for this slot, or we can add a second slot.
    stat: "Motion Capture Systems",
    tags: ["Particles", "WebGL", "Audio Analysis"],
  },
  {
    category: "Volumetric Video",
    icon: Scan,
    title: "Lakeith Stanfield",
    description:
      "Capturing performance in three dimensions. Using advanced volumetric capture stages to record actors not as flat video, but as 3D geometry that can be explored from any angle.",
    video: "/lakeith.mp4",
    stat: "Volumetric Capture",
    tags: ["3D Scanning", "Performance", "Spatial"],
  },
  {
    category: "Data Cinema",
    icon: Activity,
    title: "All the Medalists",
    description:
      "When data visualization meets cinematography. Using code to generate thousands of unique videos for the Olympics, allowing us to visualize the margin of victory for every single event in history.",
    video: "/olympics-video.mp4",
    stat: "Procedural Video",
    tags: ["Generative Video", "Olympics", "Data Viz"],
  },
];

export default function FilmmakingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);

  return (
    <div
      ref={containerRef}
      className="bg-neutral-950 text-neutral-200 min-h-screen font-sans selection:bg-white selection:text-black"
    >
      {/* --- NAV --- */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference text-white">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold tracking-tight">BACK TO INDEX</span>
        </Link>
        <span className="hidden md:block font-mono text-sm opacity-50">
          EXPERIMENTS IN FILMMAKING
        </span>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center border-b border-neutral-900">
        {/* Background Image */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/NYTVR_studioimage.png"
            alt="Filmmaking Studio"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        </motion.div>

        {/* Hero Text */}
        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-9xl font-bold tracking-tighter text-white mb-6">
              Experiments <br className="hidden md:block" /> in Filmmaking
            </h1>
            <div className="h-1 w-24 bg-red-600 mx-auto mb-8 rounded-full" />
            <p className="text-xl md:text-2xl text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed">
              Pushing the boundaries of the frame through Virtual Reality,
              Volumetric Capture, and Generative Video.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- PROJECT CHAPTERS --- */}
      <div className="py-24 space-y-32">
        {SECTIONS.map((section, index) => (
          <section key={index} className="px-6 md:px-12 max-w-[1600px] mx-auto">
            {/* Category Header (Sticky ish look) */}
            <div className="flex items-center gap-3 mb-8 text-neutral-500 border-b border-neutral-800 pb-4">
              <section.icon className="w-5 h-5" />
              <span className="font-mono text-sm uppercase tracking-widest">
                {section.category}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
              {/* Text Side (Alternates) */}
              <div
                className={`lg:col-span-4 ${
                  index % 2 === 1 ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-none">
                  {section.title}
                </h2>
                <p className="text-lg text-neutral-400 leading-relaxed mb-8">
                  {section.description}
                </p>

                {/* Stats / Tags */}
                <div className="space-y-4">
                  <div className="block">
                    <span className="text-xs font-mono text-neutral-600 uppercase tracking-widest">
                      Key Metric
                    </span>
                    <p className="text-xl text-white font-medium">
                      {section.stat}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {section.tags.map((tag, t) => (
                      <span
                        key={t}
                        className="px-3 py-1 border border-neutral-800 rounded-full text-xs text-neutral-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video Side */}
              <div
                className={`lg:col-span-8 ${
                  index % 2 === 1 ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="relative aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 shadow-2xl group">
                  {/* The Video */}
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    <source src={section.video} type="video/mp4" />
                  </video>

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50 group-hover:opacity-0 transition-opacity" />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* --- FOOTER --- */}
      <section className="py-24 px-6 text-center border-t border-neutral-900 mt-24">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors font-mono text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Selected Works
        </Link>
      </section>
    </div>
  );
}
