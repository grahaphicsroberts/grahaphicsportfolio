"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowLeft,
  Play,
  ArrowRight,
  Image as ImageIcon,
  Layers,
  Music,
  Activity,
  Video,
  Trophy,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

// --- DATA: FEATURED VIDEO PROJECTS ---
const HIGHLIGHTS = [
  {
    title: "Bieber, Skrillex & Diplo",
    subtitle: "Make a Hit",
    description:
      "Deconstructing the sound design of a global pop hit. We visualized the isolated audio stems of 'Where Are Ü Now' to show how a Justin Bieber ballad was transformed into an EDM masterpiece.",
    video: "/bieber-motion.mp4",
    link: "https://www.youtube.com/watch?v=1mY5FNRh0h4",
    awards: ["Edward R. Murrow Award", "Malofiej: Gold Medal"],
    btsStory:
      "We worked directly with Skrillex and Diplo to get the raw project files. The challenge was to make sound visible. We didn't just want standard waveforms; we created a visual language where the distorted dolphin sound, the bass drop, and the vocals each had a distinct motion identity, creating a 'music video for the ears.'",
    images: ["/bieber-1.jpg", "/bieber-2.jpg"],
  },
  {
    title: "Inside the Quartet",
    subtitle: "Kronos Quartet",
    description:
      "Visualizing the invisible communication between musicians. Using motion capture and particle systems to reveal how the Kronos Quartet stays in sync without a conductor.",
    video: "/quartet-motion.mp4",
    link: "https://www.youtube.com/watch?v=cCcxYrISN9E",
    awards: ["News & Doc Emmy Nomination", "SND: Best of Digital Design"],
    btsStory:
      "We set up a motion capture stage to record the bow movements of the quartet. By mapping this data to particle systems in WebGL, we could show the precise timing and 'breathing' of the group. The result is a visualization where you can see the music's structure in the physical gestures of the performers.",
    images: ["/quartet-1.jpg", "/quartet-2.jpg"],
  },
  {
    title: "All the Medalists",
    subtitle: "Data Cinema",
    description:
      "A generative video engine for the Olympics. Instead of one video, we wrote code to generate thousands of unique clips, visualizing the margin of victory for every single event in Olympic history.",
    video: "/medalists-motion.mp4",
    link: "https://www.youtube.com/watch?v=_L_vq5JYQlE",
    seriesThumbnails: ["/medalists-part2.jpg", "/medalists-part3.jpg"],
    awards: ["News & Doc Emmy Nomination", "Edward R. Murrow Award"],
    btsStory:
      "This was an experiment in 'Data Cinema.' We didn't edit these videos; we coded them. The system took the raw timing data from 100 years of Olympic races and procedurally generated a race visualization for each one, rendering thousands of videos overnight to create a comprehensive archive of human speed.",
    images: ["/medalists-1.jpg", "/medalists-2.jpg"],
  },
];

// --- DATA: MORE VIDEOS (CAROUSEL) ---
const ARCHIVE = [
  {
    title: "Ed Sheeran: Shape of You",
    image: "/video-sheeran.jpg",
    link: "https://www.youtube.com/watch?v=ZpMNJbt3QDE",
  },
  {
    title: "Mariano Rivera",
    image: "/video-rivera.jpg",
    link: "https://www.youtube.com/watch?v=dMVXjRGTtG0",
  },
  {
    title: "Ground Zero",
    image: "/video-groundzero.jpg",
    link: "https://www.youtube.com/watch?v=fqdkOLnZWZM",
  },
  {
    title: "Great Performers: Lakeith",
    image: "/video-lakeith.jpg",
    // No link
  },
  {
    title: "A New Whitney",
    image: "/video-whitney.jpg",
    // No link
  },
  {
    title: "Connecting Music and Gesture",
    image: "/video-gesture.jpg",
    link: "https://www.youtube.com/watch?v=hGwhmjqnGOY",
  },
];

export default function VideoInnovationPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.3], [1, 0]);

  // Mobile Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      ref={containerRef}
      className="bg-neutral-950 text-neutral-200 min-h-screen font-sans selection:bg-white selection:text-black"
    >
      {/* --- NAV --- */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference text-white">
        {/* Left: Home Link */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold tracking-tight">BACK TO INDEX</span>
        </Link>

        {/* Right: Desktop Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/about" className="hover:opacity-50 transition-opacity">
            About
          </Link>
          <Link href="/#work" className="hover:opacity-50 transition-opacity">
            Work
          </Link>
          <Link
            href="/recognition"
            className="hover:opacity-50 transition-opacity"
          >
            Recognition
          </Link>
          <Link
            href="/speaking"
            className="hover:opacity-50 transition-opacity"
          >
            Speaking
          </Link>
        </div>

        {/* Right: Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-neutral-950 z-40 flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            <Link
              href="/about"
              className="text-3xl font-bold text-white hover:text-neutral-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/#work"
              className="text-3xl font-bold text-white hover:text-neutral-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Work
            </Link>
            <Link
              href="/recognition"
              className="text-3xl font-bold text-white hover:text-neutral-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Recognition
            </Link>
            <Link
              href="/speaking"
              className="text-3xl font-bold text-white hover:text-neutral-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Speaking
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen overflow-hidden flex items-end pb-24 px-6 md:px-24 border-b border-neutral-800">
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/video-hero.jpg"
            alt="Video Innovation Abstract"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        </motion.div>

        <motion.div
          style={{ opacity: textOpacity }}
          className="relative z-10 max-w-5xl"
        >
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono uppercase tracking-widest bg-black/50 backdrop-blur-md">
              The New York Times
            </span>
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono uppercase tracking-widest bg-black/50 backdrop-blur-md">
              2016 — 2020
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 leading-[0.9]">
            Innovation in <br /> Video & Motion
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl leading-relaxed">
            Blurring the lines between data visualization, cinematography, and
            sound design.
          </p>
        </motion.div>
      </section>

      {/* --- INTRO --- */}
      <section className="py-24 px-6 md:px-24 border-b border-neutral-800 bg-neutral-900/30">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 space-y-8">
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Focus
              </h3>
              <p className="text-lg text-white">Visual Journalism</p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Techniques
              </h3>
              <p className="text-lg text-white">
                Motion Capture, Data Viz, VFX
              </p>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="prose prose-invert prose-lg text-neutral-300 leading-relaxed">
              <p className="text-2xl text-white font-medium mb-8 leading-tight">
                Video is not just for capturing reality; it's for explaining it.
              </p>
              <p className="mb-6">
                This collection represents a shift in how we approached video at
                The Times. Moving beyond traditional documentary, we employed
                techniques from motion graphics, data sonification, and
                procedural generation to reveal layers of a story that the
                camera alone couldn't see.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED PROJECTS --- */}
      <section className="py-32 bg-neutral-900">
        <div className="px-6 md:px-24 mb-24 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Signature Series
          </h2>
          <p className="text-xl text-neutral-400 leading-relaxed">
            Explorations into music, movement, and data.
          </p>
        </div>

        <div className="space-y-48">
          {HIGHLIGHTS.map((project, index) => (
            <div
              key={index}
              className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12"
            >
              {/* Header */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12 items-end">
                <div className="md:col-span-8">
                  <div className="font-mono text-orange-500 text-sm uppercase tracking-widest mb-3">
                    0{index + 1} — {project.subtitle}
                  </div>
                  <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                    {project.title}
                  </h3>
                </div>
                <div className="md:col-span-4 md:text-right flex flex-col items-end">
                  <p className="text-neutral-400 leading-relaxed mb-6">
                    {project.description}
                  </p>
                  {/* PROJECT LINK BUTTON */}
                  {project.link && (
                    <Link
                      href={project.link}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-white border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors text-sm font-mono uppercase tracking-wider"
                    >
                      Watch Film <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* SERIES THUMBNAILS (Conditional) */}
              {project.seriesThumbnails && (
                <div className="grid grid-cols-2 gap-4 mb-4 md:w-2/3">
                  {project.seriesThumbnails.map((thumb, tIndex) => (
                    <div
                      key={tIndex}
                      className="relative aspect-video bg-neutral-800 rounded-lg overflow-hidden border border-neutral-800 group"
                    >
                      <img
                        src={thumb}
                        alt={`Part ${tIndex + 2}`}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono uppercase text-white border border-white/10">
                        Part {tIndex + 2}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Hero Motion Video */}
              <div className="relative aspect-video bg-black rounded-t-xl overflow-hidden border border-neutral-800 shadow-2xl mb-1">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                >
                  <source src={project.video} type="video/mp4" />
                </video>
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-mono text-white border border-white/20 flex items-center gap-2">
                  <Video className="w-3 h-3" /> Motion Analysis
                </div>
              </div>

              {/* Awards Strip */}
              {project.awards && (
                <div className="bg-neutral-950 border-x border-b border-neutral-800 p-4 flex flex-wrap items-center gap-6">
                  {project.awards.map((award, aIndex) => (
                    <div key={aIndex} className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-orange-500" />
                      <span className="font-mono text-xs uppercase tracking-wider text-neutral-400">
                        {award}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Substantial BTS Panel */}
              <div className="bg-neutral-800/30 rounded-b-xl border border-t-0 border-neutral-800 p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                  {/* Story */}
                  <div>
                    <div className="flex items-center gap-3 mb-6 text-orange-500">
                      <Layers className="w-5 h-5" />
                      <h4 className="font-mono text-sm uppercase tracking-widest">
                        The Process
                      </h4>
                    </div>
                    <p className="text-lg text-neutral-300 leading-relaxed">
                      {project.btsStory}
                    </p>
                  </div>

                  {/* Images */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square bg-neutral-800 rounded-lg overflow-hidden relative group">
                      <img
                        src={project.images[0]}
                        alt="Detail 1"
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    </div>
                    <div className="aspect-square bg-neutral-800 rounded-lg overflow-hidden relative group">
                      <img
                        src={project.images[1]}
                        alt="Detail 2"
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- CAROUSEL: ARCHIVE (LINKED TILES) --- */}
      <section className="py-24 bg-neutral-950 border-t border-neutral-900 overflow-hidden">
        <div className="px-6 md:px-12 mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">More Videos</h2>
            <p className="text-neutral-500">
              Selected visual investigations and features
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-neutral-600 font-mono text-xs uppercase tracking-widest">
            Scroll <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-12 px-6 md:px-12 scrollbar-hide">
          {ARCHIVE.map((film, i) => {
            // CONDITIONAL RENDERING: Link vs Div
            const Wrapper = film.link ? Link : "div";
            const props = film.link
              ? { href: film.link, target: "_blank" }
              : {};

            return (
              <Wrapper
                key={i}
                {...props}
                className={`shrink-0 group relative w-[300px] aspect-[16/9] bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 ${
                  film.link ? "cursor-pointer" : "cursor-default"
                }`}
              >
                {/* Image */}
                <img
                  src={film.image}
                  alt={film.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Gradient & Text Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h4
                    className={`text-white font-bold text-lg leading-tight ${
                      film.link
                        ? "group-hover:underline decoration-orange-500 underline-offset-4"
                        : ""
                    }`}
                  >
                    {film.title}
                  </h4>

                  {/* Only show "Watch" if there is a link */}
                  {film.link && (
                    <div className="flex items-center gap-2 mt-2 text-xs font-mono text-neutral-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Watch <ArrowUpRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <section className="py-24 px-6 text-center border-t border-neutral-900 bg-neutral-950">
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
