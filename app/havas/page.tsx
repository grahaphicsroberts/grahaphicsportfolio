"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { ArrowLeft, Menu, X, Lock, Eye, Play, Maximize2 } from "lucide-react";
import Link from "next/link";

// --- MOOD BOARD DATA ---
const WORK_ITEMS = [
  {
    id: 1,
    type: "video",
    src: "/havas-work-1.mp4",
    title: "Disease State Education (DSE)",
    category: "3D particle animation",
    aspect: "aspect-[16/9]",
  },
  {
    id: 2,
    type: "video",
    src: "/havas-work-2.mp4",
    title: "Interactive Charts",
    category: "AI-driven visualization",
    aspect: "aspect-[3/4]",
  },
  {
    id: 3,
    type: "video",
    src: "/havas-work-3.mp4",
    title: "Interactive Dashboard",
    category: "AI-driven development",
    aspect: "aspect-square",
  },
  {
    id: 4,
    type: "video",
    src: "/havas-work-4.mp4",
    title: "Clinical Analysis",
    category: "Data Visualization",
    aspect: "aspect-[16/9]",
  },
  {
    id: 5,
    type: "image",
    src: "/havas-work-5.jpg",
    title: "Patient Profiles",
    category: "Data Visualization",
    aspect: "aspect-square",
  },
  {
    id: 6,
    type: "video",
    src: "/havas-work-6.mp4",
    title: "Narrative charts",
    category: "Data Storytelling",
    aspect: "aspect-[4/3]",
  },
  {
    id: 7,
    type: "video",
    src: "/havas-work-7.mp4",
    title: "Clinical Trial Timeline",
    category: "Information Design",
    aspect: "aspect-[16/9]",
  },
  {
    id: 8,
    type: "video",
    src: "/havas-work-8.mp4",
    title: "Datavis Whitepaper",
    category: "Data visualization",
    aspect: "aspect-[9/16]",
  },
  {
    id: 9,
    type: "video",
    src: "/havas-work-9.mp4",
    title: "Dosing Visualization",
    category: "Narrative Charts",
    aspect: "aspect-[5/3]",
  },
  {
    id: 10,
    type: "video",
    src: "/havas-work-10.mp4",
    title: "Interactive Visual Aid",
    category: "Product Design",
    aspect: "aspect-[9/8]",
  },
];

// --- INDIVIDUAL WORK ITEM COMPONENT (Handles Scroll Focus) ---
const WorkItem = ({ item }) => {
  const ref = useRef(null);
  // Detect when element is in the center 10% of the viewport
  const isInView = useInView(ref, {
    margin: "-45% 0px -45% 0px",
    amount: "some",
  });

  return (
    <div
      ref={ref}
      className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 mb-8 md:mb-0"
    >
      <div className={`relative w-full ${item.aspect}`}>
        {item.type === "video" ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition-all duration-700
              ${isInView ? "opacity-100 grayscale-0" : "opacity-30 grayscale"} 
              md:opacity-80 md:grayscale-0 md:group-hover:opacity-100
            `}
          >
            <source src={item.src} type="video/mp4" />
          </video>
        ) : (
          <img
            src={item.src}
            alt={item.title}
            className={`w-full h-full object-cover transition-all duration-700
              ${isInView ? "opacity-100 grayscale-0" : "opacity-30 grayscale"} 
              md:opacity-80 md:grayscale-0 md:group-hover:opacity-100
            `}
          />
        )}

        {/* Overlay Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500
            ${isInView ? "opacity-60" : "opacity-0"}
            md:opacity-60 md:group-hover:opacity-40
          `}
        />

        {/* Content Overlay */}
        <div
          className={`absolute bottom-0 left-0 w-full p-6 transition-all duration-500
            ${
              isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }
            md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100
          `}
        >
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 block">
            {item.category}
          </span>
          <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
        </div>

        {/* Icon Badge */}
        <div
          className={`absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 transition-opacity duration-300
            ${isInView ? "opacity-100" : "opacity-0"}
            md:opacity-0 md:group-hover:opacity-100
          `}
        >
          {item.type === "video" ? (
            <Play className="w-4 h-4 text-white fill-current" />
          ) : (
            <Maximize2 className="w-4 h-4 text-white" />
          )}
        </div>
      </div>
    </div>
  );
};

export default function HavasPage() {
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
            src="/havas-hero.jpg"
            alt="Havas Health Data Art"
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
              Havas
            </span>
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono uppercase tracking-widest bg-black/50 backdrop-blur-md">
              2023 — Present
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 leading-[0.9]">
            The Art of <br /> Health Data
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl leading-relaxed">
            Building a global information design practice. Exploring the
            intersection of biology, technology, and human understanding.
          </p>
        </motion.div>
      </section>

      {/* --- INTRO: THE MISSION --- */}
      <section className="py-24 px-6 md:px-24 border-b border-neutral-800 bg-neutral-900/30">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 space-y-8">
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Role
              </h3>
              <p className="text-lg text-white">
                EVP, Global Information Design
              </p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Focus Areas
              </h3>
              <p className="text-lg text-white">
                Pharma, Biotech, AI, Patient Experience
              </p>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="prose prose-invert prose-lg text-neutral-300 leading-relaxed">
              <p className="text-2xl text-white font-medium mb-8 leading-tight">
                Health data is often complex, opaque, and clinical. Our mission
                is to make it human, accessible, and actionable.
              </p>
              <p className="mb-6">
                I lead a specialized design practice within Havas that helps the
                world&apos;s leading healthcare companies visualize the
                invisible. From pitch decks to patient tools, we use high-end
                visual effects, 3D animation, and interactive design to show
                clients the &quot;art of the possible.&quot;
              </p>
              <div className="flex items-center gap-2 text-sm font-mono text-neutral-500 mt-8">
                <Lock className="w-4 h-4" />
                <span>
                  Note: Much of this work is confidential. Data in these
                  examples has been blinded or abstracted.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MOOD BOARD SECTION (MASONRY GRID) --- */}
      <section className="py-32 px-4 md:px-12 bg-neutral-950">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-24 px-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Explorations
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl">
              A curated collection of prototypes, motion studies, and design
              concepts exploring the future of health interfaces.
            </p>
          </div>

          {/* Masonry Layout using CSS Columns */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {WORK_ITEMS.map((item) => (
              <WorkItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* --- CLOSING THOUGHT (Split Layout) --- */}
      <section className="py-24 px-6 md:px-24 border-t border-neutral-900 bg-neutral-950">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Column (Left) */}
          <div className="order-2 lg:order-1">
            <Eye className="w-12 h-12 text-neutral-500 mb-8" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              &quot;We are not just designing charts. We are designing
              understanding for critical, life-saving innovations.&quot;
            </h2>
            <div className="h-px w-24 bg-neutral-800 mb-12" />

            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors font-mono text-sm uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Selected Works
            </Link>
          </div>

          {/* Image Column (Right - Always Visible) */}
          <div className="order-1 lg:order-2 h-[500px] lg:h-[600px] rounded-2xl overflow-hidden border border-neutral-800 relative">
            <img
              src="/novartis-panel.jpg"
              alt="Graham Roberts Speaking at Novartis"
              // object-right anchors the image to the right so Graham is never cropped out
              className="w-full h-full object-cover object-right opacity-80"
            />
            {/* Gradient Overlay for style */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-neutral-950/20" />

            {/* Caption Overlay */}
            <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
              <p className="text-xs font-mono text-white/80 uppercase tracking-widest">
                Health innovation panel at Novartis NYC hub
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
