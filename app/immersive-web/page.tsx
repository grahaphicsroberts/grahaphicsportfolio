"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowLeft, Trophy, Menu, X, ArrowUpRight, Landmark } from "lucide-react";
import Link from "next/link";

// --- DATA: ARCHIVE CAROUSEL ---
const ARCHIVE = [
  {
    title: "Hudson Yards",
    category: "2019 — Interactive 3D",
    image: "/hudson-bts-1.jpg",
    link: "https://www.nytimes.com/interactive/2019/03/14/arts/design/hudson-yards-nyc.html",
  },
  {
    title: "Apollo 11: As They Shot It",
    category: "2019 — Computational Photography",
    image: "/apollo-bts-1.jpg",
    link: "https://www.nytimes.com/interactive/2019/07/18/science/apollo-11-moon-landing-photos-ul.html",
  },
  {
    title: "The Jockey",
    category: "2013 — Interactive Feature",
    image: "/jockey-bts-1.jpg",
    link: "http://www.nytimes.com/projects/2013/the-jockey/",
  },
  {
    title: "A New Whitney",
    category: "2015 — Architectural Review",
    image: "/whitney-bts-1.jpg",
    link: "https://www.nytimes.com/interactive/2015/04/19/arts/artsspecial/new-whitney-museum.html",
  },
  {
    title: "Intermission for the Large Hadron Collider",
    category: "2018 — Augmented Reality",
    image: "/hadron-bts-1.jpg",
    link: "https://www.nytimes.com/interactive/2018/12/21/science/cern-large-hadron-collider-ar-ul.html?rref=collection%2Fspotlightcollection%2Faugmented-reality&action=click&contentCollection=multimedia&region=rank&module=package&version=highlights&contentPlacement=1&pgtype=collection",
  },
  {
    title: "Winter Tales of Speed",
    category: "2014 — Olympics Visual Storytelling",
    image: "/winter-bts-1.jpg",
    link: "https://www.nytimes.com/newsgraphics/2014/sochi-olympics/giant-slalom.html",
  },
];

export default function ImmersiveWebPage() {
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
      {/* --- CUSTOM NAV (Back + Hamburger) --- */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference text-white">
        {/* Left: Back to Index */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold tracking-tight">BACK TO INDEX</span>
        </Link>

        {/* Right: Desktop Menu */}
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

      {/* Mobile Menu Overlay */}
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
            src="/immersive-hero.jpg"
            alt="Immersive Web Design"
            className="w-full h-full object-cover opacity-50 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
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
              2012 — 2019
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 leading-[0.9]">
            The Infinite <br /> Scroll
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl leading-relaxed">
            Pioneering the format of "scrollytelling"—integrating video, data,
            and design into a seamless narrative flow that shaped the future of
            digital journalism.
          </p>
        </motion.div>
      </section>

      {/* --- INTRO --- */}
      <section className="py-24 px-6 md:px-24 border-b border-neutral-800 bg-neutral-900/30">
        <div className="max-w-4xl">
          <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-6">
            The Philosophy
          </h3>
          <p className="text-2xl md:text-3xl text-white font-light leading-relaxed">
            "The web is not a series of pages, but a canvas for continuity. By
            breaking the grid and merging code with cinema, we created stories
            that didn't just inform readers—they transported them."
          </p>
        </div>
      </section>

      {/* --- PROJECT 1: SNOW FALL --- */}
      <section className="py-32 bg-neutral-950 border-b border-neutral-800">
        <div className="px-6 md:px-24 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="font-mono text-blue-500 text-sm uppercase tracking-widest mb-3">
                01 — The Breakthrough
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Snow Fall
              </h2>
              {/* Award Strip */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-900/20 border border-yellow-700/50 rounded-full text-yellow-500 text-xs font-mono uppercase tracking-wide">
                  <Trophy className="w-3 h-3" /> Pulitzer Prize Winner
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-full text-neutral-400 text-xs font-mono uppercase tracking-wide">
                  Peabody Award
                </div>
              </div>
            </div>
            <div className="text-right text-neutral-500 font-mono text-sm hidden md:block">
              2012 <br /> Feature Design
            </div>
          </div>

          {/* Hero Video */}
          <div className="relative aspect-[16/9] bg-black rounded-[2rem] border-[8px] border-neutral-800 overflow-hidden shadow-2xl mb-16">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/snowfall-desktop.mp4" type="video/mp4" />
            </video>
            <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-xs font-mono text-white border border-white/10 z-20">
              Desktop Experience
            </div>
          </div>

          {/* BTS & Story Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                The Avalanche at Tunnel Creek
              </h3>
              <p className="text-neutral-400 text-lg leading-relaxed mb-6">
                Snow Fall was the project that coined the term "scrollytelling."
                We wanted to break the rigid CMS templates of the time to create
                a reading experience that felt as fluid as the events being
                described. The result was a seamless blend of text, video, and
                interactive graphics that moved with the reader.
              </p>

              {/* LAUNCH BUTTON */}
              <a
                href="http://www.nytimes.com/projects/2012/snow-fall/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors mb-8"
              >
                <span>Launch Experience</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
                <img
                  src="/snowfall-bts-1.jpg"
                  alt="Snow Fall Wireframes"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <p className="mt-4 text-xs font-mono text-neutral-600 uppercase tracking-widest">
                Original Storyboard Sketches
              </p>
            </div>
            <div className="md:pt-24">
              <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 mb-6">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/snowfall-bts-2.mp4" type="video/mp4" />
                </video>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                <strong className="text-white block mb-1">
                  Technical Innovation
                </strong>
                We built custom fly-throughs of the mountain range using raw
                elevation data, allowing readers to visualize the scale of the
                avalanche in a way photography alone could not convey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PULL QUOTE --- */}
      <section className="py-24 bg-neutral-900 border-y border-neutral-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-3xl md:text-5xl font-serif text-neutral-300 italic leading-tight mb-8">
            "It wasn't just about making it look cool. It was about cognitive
            load—using motion to explain complex spatial events without
            interrupting the reader's flow."
          </p>
          <div className="w-16 h-1 bg-white mx-auto opacity-20" />
        </div>
      </section>

      {/* --- PROJECT 2: NOTRE DAME --- */}
      <section className="py-32 bg-neutral-950 border-b border-neutral-800">
        <div className="px-6 md:px-24 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="font-mono text-orange-500 text-sm uppercase tracking-widest mb-3">
                02 — Forensic Architecture
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Notre Dame
              </h2>
              <div className="flex flex-wrap gap-4 mb-6">
                {/* NEW MOMA BADGE */}
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/20 border border-blue-700/50 rounded-full text-blue-400 text-xs font-mono uppercase tracking-wide">
                  <Landmark className="w-3 h-3" /> MoMA Permanent Collection
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-full text-neutral-400 text-xs font-mono uppercase tracking-wide">
                  Malofiej Gold
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-full text-neutral-400 text-xs font-mono uppercase tracking-wide">
                  SND Best in Show
                </div>
              </div>
            </div>
            <div className="text-right text-neutral-500 font-mono text-sm hidden md:block">
              2019 <br /> 3D Reconstruction
            </div>
          </div>

          {/* Hero Video - 16:10 Aspect Ratio */}
          <div className="relative aspect-[16/10] bg-black rounded-[2rem] border-[8px] border-neutral-800 overflow-hidden shadow-2xl mb-16">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/notredame-desktop.mp4" type="video/mp4" />
            </video>
            <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-xs font-mono text-white border border-white/10 z-20">
              Desktop Experience
            </div>
          </div>

          {/* BTS & Story Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="aspect-[4/3] bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
                <img
                  src="/notredame-bts-1.jpg"
                  alt="Notre Dame Point Cloud"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Modeling the Fire
                </h3>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  To explain how the fire spread, we utilized laser-scan data of
                  the cathedral to build a forensic 3D model. In 2025, this work
                  was acquired by the Museum of Modern Art for its permanent
                  collection, recognizing its significance in the history of
                  digital information design.
                </p>

                {/* LAUNCH BUTTON */}
                <a
                  href="https://www.nytimes.com/interactive/2019/04/17/world/europe/notre-dame-cathedral-fire-spread.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                >
                  <span>Launch Experience</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="space-y-6 md:mt-12">
              <div className="aspect-[4/3] bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
                <img
                  src="/notredame-bts-2.jpg"
                  alt="Notre Dame Wireframe"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Scrollytelling 2.0
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Unlike earlier projects, this piece relied on WebGL to render
                  the cathedral in real-time within the browser, giving readers
                  a seamless, dynamic experience that static video couldn't
                  achieve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROJECT 3: THE POLAR VORTEX --- */}
      <section className="py-32 bg-neutral-950 border-b border-neutral-800">
        <div className="px-6 md:px-24 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="font-mono text-cyan-500 text-sm uppercase tracking-widest mb-3">
                03 — Data Visualization
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
                The Polar Vortex
              </h2>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-full text-neutral-400 text-xs font-mono uppercase tracking-wide">
                  Malofiej Silver
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-full text-neutral-400 text-xs font-mono uppercase tracking-wide">
                  SND Award of Excellence
                </div>
              </div>
            </div>
            <div className="text-right text-neutral-500 font-mono text-sm hidden md:block">
              2019 <br /> Climate Science
            </div>
          </div>

          {/* Hero Video - 16:9 Aspect Ratio */}
          <div className="relative aspect-[16/9] bg-black rounded-[2rem] border-[8px] border-neutral-800 overflow-hidden shadow-2xl mb-16">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/polar-desktop.mp4" type="video/mp4" />
            </video>
            <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-xs font-mono text-white border border-white/10 z-20">
              Desktop Experience
            </div>
          </div>

          {/* BTS & Story Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-neutral-400 text-lg leading-relaxed mb-6">
                The term "Polar Vortex" was often used in the media but rarely
                understood. We set out to create a definitive visual explanation
                of how a disruption in the stratosphere can trigger extreme cold
                snaps on the ground. By visualizing wind patterns and
                temperature data on a planetary scale, we turned a complex
                meteorological phenomenon into a clear, compelling narrative.
              </p>

              {/* LAUNCH BUTTON */}
              <a
                href="https://www.nytimes.com/interactive/2019/01/30/science/polar-vortex-extreme-cold.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors mb-8"
              >
                <span>Launch Experience</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
                <img
                  src="/polar-bts-1.jpg"
                  alt="Atmospheric Data Visualization"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            </div>
            <div className="md:pt-24">
              <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 mb-6">
                <img
                  src="/polar-bts-2.jpg"
                  alt="Global Temperature Map"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                <strong className="text-white block mb-1">Global Scale</strong>
                Using global weather simulation data, we mapped the split of the
                vortex in 3D. The challenge was to maintain scientific accuracy
                while simplifying the visual noise of the atmosphere so readers
                could follow the mechanism of the split.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CAROUSEL: MORE PROJECTS --- */}
      <section className="py-24 bg-neutral-900">
        <div className="px-6 md:px-24 mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">
            More Immersive Stories
          </h2>
          <div className="h-1 w-12 bg-neutral-700" />
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-6 px-6 md:px-24 pb-12 snap-x snap-mandatory hide-scrollbar">
          {ARCHIVE.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="snap-center shrink-0 w-[80vw] md:w-[400px] group cursor-pointer block"
            >
              <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden border border-neutral-800 mb-4 relative">
                <div className="absolute inset-0 bg-neutral-800 animate-pulse group-hover:hidden" />
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-neutral-500 text-sm font-mono">
                {item.category}
              </p>
            </Link>
          ))}
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