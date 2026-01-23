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
  Box,
  ArrowRight,
  ArrowUpRight,
  Award,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

// --- DATA: MAIN HIGHLIGHTS (STACKED) ---
const HIGHLIGHTS = [
  {
    title: "Four of the Best Olympians",
    subtitle: "Spatial Analysis",
    description:
      "Analyzing the athletic prowess of Olympic champions using spatial analysis and volumetric video.",
    desktop: "/olympics-desktop.mp4",
    mobile: "/olympics-mobile.mp4",
    link: "https://www.nytimes.com/interactive/2018/02/05/sports/olympics/ar-augmented-reality-olympic-athletes-ul.html",
    awards: ["SND Gold Medal", "Lumiere Award Winner"],
  },
  {
    title: "David Bowie in 3 Dimensions",
    subtitle: "Cultural Heritage",
    description:
      "Exploring the costumes and artifacts of the legendary artist in your own space, in collaboration with the Bowie Archive.",
    desktop: "/bowie-desktop.mp4",
    mobile: "/bowie-mobile.mp4",
    link: "https://www.nytimes.com/interactive/2018/03/20/arts/design/bowie-costumes-ar-3d-ul.html",
    awards: ["Webby Award Winner", "Deadline Club Winner"],
  },
  {
    title: "One Building, One Bomb",
    subtitle: "Forensic Architecture",
    description:
      "Reconstructing a chemical weapons attack in Syria to prove culpability, winning a News & Documentary Emmy.",
    desktop: "/syria-desktop.mp4",
    mobile: "/syria-mobile.mp4",
    link: "https://www.nytimes.com/interactive/2018/06/24/world/middleeast/douma-syria-chemical-attack-augmented-reality-ar-ul.html",
    awards: ["News & Doc Emmy Winner"],
  },
];

// --- DATA: MORE AR PROJECTS (SIDE SCROLL) ---
const MORE_PROJECTS = [
  { title: "Mars Insight Lander", video: "/mars-mobile.mp4" },
  { title: "Ashley Graham Unfiltered", video: "/ashley-mobile.mp4" },
  { title: "Lady Liberty's Torch", video: "/torch-mobile.mp4" },
  { title: "Air Quality Index", video: "/aqi-mobile.mp4" },
  {
    title: "Great Performers: Lakeith Stanfield",
    video: "/lakeith-mobile.mp4",
  },
];

export default function NYTARPage() {
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
            src="/AR-hero.jpg"
            alt="AR Technology Abstract"
            className="w-full h-full object-cover opacity-30 grayscale"
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
              2018 — 2021
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 leading-[0.9]">
            Immersive Storytelling <br /> at The New York Times
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl leading-relaxed">
            Groundbreaking new approaches to visual storytelling through
            augmented reality and 3D web features.
          </p>
        </motion.div>
      </section>

      {/* --- INTRO: THE MANDATE --- */}
      <section className="py-24 px-6 md:px-24 border-b border-neutral-800 bg-neutral-900/30">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 space-y-8">
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Role
              </h3>
              <p className="text-lg text-white">
                Director of Immersive Storytelling
              </p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Team Size
              </h3>
              <p className="text-lg text-white">50+ (Cross-functional)</p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Timeline
              </h3>
              <p className="text-lg text-white">Concept to Launch: 6 Months</p>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="prose prose-invert prose-lg text-neutral-300 leading-relaxed">
              <p className="text-2xl text-white font-medium mb-8 leading-tight">
                As director of immersive storytelling at The New York Times, I
                led a multi-year effort to bring AR to the NYT apps, and produce
                dozens of AR and 3D web features.
              </p>
              <p className="mb-6">
                The immersive storytelling team was founded and led by me, and
                this project went from concept to launch in just 6 months. It
                involved leading a massive project team of over 50 product
                designers, engineers, visual designers, journalists, and
                marketers to define a new grammar for news.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CHAPTER 1: THE LAUNCH (UPDATED ORDER) --- */}
      <section className="py-32 px-6 md:px-24 bg-white text-black border-b border-neutral-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* TEXT COLUMN */}
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 text-blue-600">
              <Box className="w-6 h-6" />
              <span className="font-bold tracking-tight uppercase">
                The Launch
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter leading-tight">
              Hello, World. <br /> Meet the "Honor Box."
            </h2>

            <div className="prose prose-lg text-neutral-600 mb-12">
              <p className="mb-6">
                We launched the feature with an article that explains to users
                why we were building an AR capability. This was also our first
                AR-enabled article.
              </p>
              <p className="mb-6">
                It had a very simple "example" where users could project what is
                called an "honor box" or vintage NYT vending machine into their
                space: a bit of a wink showcasing our newest technology by
                presenting our oldest technology: print.
              </p>
            </div>

            {/* --- MOBILE VIDEO (VISIBLE ONLY ON MOBILE) --- */}
            {/* Placed here to scroll naturally between paragraphs and the footer image */}
            <div className="md:hidden relative flex justify-center py-12">
              <div className="relative w-[300px] aspect-[9/19] bg-black rounded-[3rem] border-8 border-neutral-900 overflow-hidden shadow-2xl shadow-neutral-400/50 ring-1 ring-neutral-950/50">
                <div className="absolute top-0 w-full h-8 z-20 flex justify-center items-center pointer-events-none">
                  <div className="w-20 h-6 bg-black rounded-b-xl" />
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover bg-neutral-900"
                >
                  <source src="/honor-box-mobile.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="absolute -z-10 top-12 -right-12 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50" />
              <div className="absolute -z-10 bottom-12 -left-12 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50" />
            </div>

            {/* Footer Content */}
            <div className="flex flex-row items-start gap-6 border-t border-neutral-200 pt-8">
              <div className="w-1/3 shrink-0">
                <img
                  src="/honorbox-social.JPG"
                  alt="Social media reaction"
                  className="w-full aspect-[3/5] object-cover rounded-lg shadow-lg"
                />
              </div>
              <p className="text-base md:text-lg text-black font-medium leading-relaxed">
                This initial launch was very successful, and we saw the honor
                box appear in living rooms and kitchens across the world,
                driving many new positive camera permissions in the new app, and
                generating a lot of organic sharing on social and in the media.
              </p>
            </div>
          </div>

          {/* --- DESKTOP VIDEO (VISIBLE ONLY ON DESKTOP) --- */}
          {/* Kept sticky for the side-by-side layout */}
          <div className="hidden md:flex relative justify-center pt-12 md:pt-0 sticky top-32">
            <div className="relative w-[350px] aspect-[9/19] bg-black rounded-[3rem] border-8 border-neutral-900 overflow-hidden shadow-2xl shadow-neutral-400/50 ring-1 ring-neutral-950/50">
              <div className="absolute top-0 w-full h-8 z-20 flex justify-center items-center pointer-events-none">
                <div className="w-20 h-6 bg-black rounded-b-xl" />
              </div>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover bg-neutral-900"
              >
                <source src="/honor-box-mobile.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Background Orbs */}
            <div className="absolute -z-10 top-12 -right-12 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50" />
            <div className="absolute -z-10 bottom-12 -left-12 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50" />
          </div>
        </div>
      </section>

      {/* --- CHAPTER 2: STACKED HIGHLIGHTS --- */}
      <section className="py-32 bg-neutral-900">
        {/* Section Header */}
        <div className="px-6 md:px-24 mb-24 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Major Features
          </h2>
          <p className="text-xl text-neutral-400 leading-relaxed">
            Following the launch, we produced a series of high-fidelity
            immersive journalism pieces. These projects set the standard for
            mobile AR, combining volumetric capture, photogrammetry, and spatial
            data analysis.
          </p>
        </div>

        <div className="space-y-32">
          {HIGHLIGHTS.map((project, index) => (
            <div
              key={index}
              className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12"
            >
              {/* Project Text */}
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <div className="font-mono text-blue-500 text-sm uppercase tracking-widest mb-3">
                  0{index + 1} — {project.subtitle}
                </div>
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {project.title}
                </h3>

                {/* AWARD TAGS */}
                {project.awards && (
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {project.awards.map((award, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-xs font-mono uppercase tracking-wider"
                      >
                        <Award className="w-3 h-3" />
                        {award}
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto mb-8">
                  {project.description}
                </p>

                {/* --- NEW PROJECT LINK BUTTON --- */}
                {project.link && (
                  <div className="flex justify-center">
                    <Link
                      href={project.link}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors text-sm font-mono uppercase tracking-wider"
                    >
                      Launch Experience <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Visuals Row */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full">
                {/* Mobile Frame */}
                <div className="relative shrink-0 w-[240px] md:w-[320px] aspect-[9/19] bg-black rounded-[2.5rem] border-[8px] border-neutral-800 overflow-hidden shadow-2xl z-20">
                  <div className="absolute top-0 w-full h-6 z-20 flex justify-center items-center pointer-events-none">
                    <div className="w-20 h-5 bg-black rounded-b-lg" />
                  </div>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover bg-neutral-900"
                  >
                    <source src={project.mobile} type="video/mp4" />
                  </video>
                </div>

                {/* Desktop Frame */}
                <div className="relative shrink-0 w-full md:w-[600px] lg:w-[800px] aspect-video bg-black rounded-[2rem] border-[8px] border-neutral-800 overflow-hidden shadow-2xl z-10">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover bg-neutral-900"
                  >
                    <source src={project.desktop} type="video/mp4" />
                  </video>
                </div>
              </div>

              {/* Divider (except last) */}
              {index !== HIGHLIGHTS.length - 1 && (
                <div className="w-24 h-px bg-neutral-800 mx-auto mt-32" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- CHAPTER 3: MORE AR PROJECTS (SIDE SCROLL) --- */}
      <section className="py-24 bg-neutral-950 border-t border-neutral-900 overflow-hidden">
        <div className="px-6 md:px-12 mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              More AR Projects
            </h2>
            <p className="text-neutral-500">
              A collection of mobile-first experiments
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-neutral-600 font-mono text-xs uppercase tracking-widest animate-pulse">
            Scroll <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-8 overflow-x-auto pb-12 px-6 md:px-12 snap-x scrollbar-hide">
          {MORE_PROJECTS.map((project, i) => (
            <div
              key={i}
              className="shrink-0 snap-center flex flex-col items-center gap-6"
            >
              {/* Phone Frame */}
              <div className="relative w-[260px] aspect-[9/19] bg-black rounded-[2.5rem] border-[6px] border-neutral-800 overflow-hidden shadow-lg group">
                <div className="absolute top-0 w-full h-5 z-20 flex justify-center items-center pointer-events-none">
                  <div className="w-16 h-4 bg-black rounded-b-lg" />
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 ${
                    project.title === "Mars Insight Lander"
                      ? "scale-[1.04]"
                      : ""
                  }`}
                >
                  <source src={project.video} type="video/mp4" />
                </video>
              </div>

              <span className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                {project.title}
              </span>
            </div>
          ))}

          {/* Padding for scroll end */}
          <div className="w-12 shrink-0" />
        </div>
      </section>

      {/* --- PULL QUOTE --- */}
      <section className="py-24 px-6 md:px-24 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8">
            "The Times displayed innovation in AR reporting under Roberts'
            leadership."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-neutral-700" />
            <cite className="text-neutral-500 font-mono text-sm uppercase tracking-widest not-italic">
              Next Reality
            </cite>
            <div className="h-px w-12 bg-neutral-700" />
          </div>
        </div>
      </section>

      {/* --- CHAPTER 4: SPEAKING / CONCLUSION --- */}
      <section className="py-24 px-6 md:px-24 bg-white text-black">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-6">Advancing the Medium</h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-6">
              I have had the privilege of sharing our learnings and strategies
              for immersive journalism at conferences around the world.
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed">
              From defining the "grammar" of AR news to building
              cross-functional teams that can deliver 3D on deadline, the work
              we did at the Times helped set the stage for the spatial web.
            </p>
          </div>

          <div className="md:w-1/2 order-1 md:order-2">
            <img
              src="/IMG_3108-11441.JPG"
              alt="Graham Roberts speaking"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
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
