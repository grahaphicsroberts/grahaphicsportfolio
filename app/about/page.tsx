"use client";

import React, { useRef, useState } from "react";
import {
  useScroll,
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Linkedin,
  Twitter,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export default function AboutMagazine() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  // Mobile Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      ref={targetRef}
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

      {/* --- HERO HEADER --- */}
      <header className="relative min-h-screen grid grid-cols-1 md:grid-cols-2 border-b border-neutral-800">
        {/* Left: Typography & Intro */}
        <div className="flex flex-col justify-end p-6 md:p-24 pt-32 order-2 md:order-1 bg-neutral-950">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-blue-500 text-sm uppercase tracking-widest mb-4 block">
              Profile & Biography
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8 leading-[0.9]">
              GRAHAM <br /> ROBERTS
            </h1>
            <div className="h-1 w-24 bg-neutral-800 mb-8" />
            <p className="text-xl md:text-2xl text-neutral-400 font-light leading-relaxed max-w-md">
              EVP of Global Information Design. Operating at the intersection of
              journalism, technology, and storytelling.
            </p>
          </motion.div>
        </div>

        {/* Right: The Portrait */}
        <div className="relative h-[50vh] md:h-auto order-1 md:order-2 overflow-hidden border-l border-neutral-800 group">
          <img
            src="/graham-headshotbw.jpg"
            alt="Graham Roberts"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent md:hidden" />
        </div>
      </header>

      {/* --- PHILOSOPHY SECTION --- */}
      <section className="py-32 px-6 border-b border-neutral-900">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-widest sticky top-32">
              The Philosophy
            </h3>
          </div>
          <div className="md:col-span-8 prose prose-invert prose-lg leading-relaxed">
            <blockquote className="text-3xl font-serif text-white leading-tight border-l-0 pl-0 italic mb-8">
              "Information design is a very human place, where we strive to
              understand the world around us, and to share that understanding in
              ever more efficient, effective, and engaging ways."
            </blockquote>
            <p className="text-neutral-400">
              I have spent my career operating in this space, leading diverse
              teams to produce award-winning work across journalism, technology,
              marketing, and academia.
            </p>
            <p className="text-neutral-400">
              My expertise spans{" "}
              <strong>
                visual journalism, motion graphics, 3D visualization, spatial
                computing, and product design
              </strong>
              . In every role, my goal has been to challenge new creators in the
              field and elevate the standard for how complex information is
              communicated to global audiences.
            </p>
          </div>
        </div>
      </section>

      {/* --- VISUAL BREAK: HAVAS --- */}
      <section className="relative w-full h-[60vh] overflow-hidden group">
        <div className="absolute inset-0 bg-blue-900/10 z-10 transition-opacity group-hover:opacity-0" />
        <img
          src="/havas-about.jpg"
          alt="Havas Health Concept"
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2s]"
        />
        <div className="absolute bottom-12 left-6 md:left-24 z-20 max-w-xl">
          <span className="font-mono text-xs text-blue-400 uppercase tracking-widest mb-2 block">
            Current Chapter
          </span>
          <h2 className="text-4xl font-bold text-white">
            Redefining Health Data
          </h2>
        </div>
      </section>

      {/* --- EXPERIENCE: HAVAS & GOOGLE --- */}
      <section className="py-32 px-6 bg-neutral-950">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left Rail */}
          <div className="md:col-span-4 space-y-2">
            <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-widest sticky top-32">
              Strategy & Innovation
            </h3>
          </div>

          {/* Right Content */}
          <div className="md:col-span-8 space-y-16">
            {/* Havas Block */}
            <div className="prose prose-invert prose-lg">
              <h3 className="text-2xl font-bold text-white mb-4">
                Havas Global Network
              </h3>
              <p className="text-neutral-400">
                Currently, I serve as{" "}
                <strong>EVP of Global Information Design</strong> at Havas. We
                are building a new discipline focused on the complex,
                high-stakes world of health. Working with the world's most
                influential pharmaceutical and biotech companies, we explore how
                AI and emerging technologies can converge with human creativity
                to clarify critical health data for physicians and patients
                alike.
              </p>
            </div>

            {/* Google Block (UPDATED: Side-by-side Layout) */}
            <div className="prose prose-invert prose-lg">
              <h3 className="text-2xl font-bold text-white mb-4">
                Google Brand Studio
              </h3>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <p className="text-neutral-400 flex-1 m-0">
                  Previously, I led digital design at the{" "}
                  <strong>Google Brand Studio</strong>. My work focused on
                  solving brand challenges through digital innovation,
                  specifically using Search data to connect the dots between
                  Google's mission and the cultural insights buried within the
                  world's largest information engine.
                </p>

                {/* Google Image Insert - Inset Style */}
                <figure className="w-full md:w-64 shrink-0 m-0">
                  <div className="relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 hover:grayscale-0 transition-all duration-700">
                    <img
                      src="/google-about.jpg"
                      alt="Graham at Google"
                      className="w-full h-auto"
                    />
                  </div>
                  <figcaption className="mt-2 text-center text-[10px] font-mono text-neutral-600 uppercase tracking-wide">
                    Brand Studio Team
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- VISUAL BREAK: NYT --- */}
      <section className="relative w-full h-[60vh] overflow-hidden group">
        <div className="absolute inset-0 bg-neutral-900/50 z-10" />
        <img
          src="/nyt-about.jpg"
          alt="NYT Newsroom"
          className="w-full h-full object-cover opacity-50 group-hover:grayscale-0 transition-all duration-[2s]"
        />
        <div className="absolute bottom-12 right-6 md:right-24 z-20 max-w-xl text-right">
          <span className="font-mono text-xs text-white/60 uppercase tracking-widest mb-2 block">
            The New York Times
          </span>
          <h2 className="text-4xl font-bold text-white">Visual Journalism</h2>
        </div>
      </section>

      {/* --- EXPERIENCE: NYT (WITH MOMA UPDATE) --- */}
      <section className="py-32 px-6 bg-neutral-950 border-b border-neutral-900">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-widest sticky top-32">
              A Decade of News
            </h3>
          </div>
          <div className="md:col-span-8 prose prose-invert prose-lg">
            <h3 className="text-2xl font-bold text-white mb-4">
              The New York Times
            </h3>
            <p className="text-neutral-400">
              As <strong>Director of Immersive Storytelling</strong>, my career
              tracked the rise of digital platforms, exploring how integrated
              media could enhance the report.
            </p>
            <p className="text-neutral-400">
              I led projects ranging from <em>Snow Fall</em> (a Pulitzer
              Prize-winning exploration of digital storytelling) to
              motion-capture applications in sports. I also co-directed
              editorial for <strong>NYT VR</strong>, introducing millions to
              virtual reality, and led product efforts to bring Augmented
              Reality (AR) to the core news app.
            </p>
            {/* NEW MOMA PARAGRAPH */}
            <p className="text-neutral-400 border-l-2 border-blue-500 pl-4">
              Most recently, my work <em>Why Notre Dame Was a Tinderbox</em> was
              acquired by the <strong>Museum of Modern Art (MoMA)</strong> for
              its permanent collection, cementing the role of forensic visual
              journalism in design history.
            </p>
          </div>
        </div>
      </section>

      {/* --- VISUAL BREAK: BERKELEY (WITH BIO TEXT) --- */}
      <section className="relative w-full h-[80vh] overflow-hidden group flex items-center justify-center">
        {/* Background Image */}
        <img
          src="/berkeley-about.jpg"
          alt="Berkeley Hills"
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:grayscale-0 transition-all duration-[2s] z-0"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Overlay Text (Replaces California) */}
        <div className="relative z-20 max-w-2xl px-6 text-center">
          <p className="text-3xl md:text-5xl font-serif text-white leading-tight drop-shadow-xl">
            "I live amongst the turkey and deer in the Berkeley Hills of
            California with my partner Jessica, our son Roman, and our bulldog
            Ralphie."
          </p>
        </div>
      </section>

      {/* --- FOOTER / CONTACT --- */}
      <section className="py-32 px-6 bg-neutral-950">
        <div className="max-w-2xl mx-auto text-center space-y-12">
          <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-8">
            Get in Touch
          </h2>

          {/* Links Grid */}
          <div className="grid grid-cols-3 gap-4">
            <a
              href="mailto:grahaphics@gmail.com"
              className="group flex flex-col items-center gap-4 p-8 rounded-lg hover:bg-neutral-900 transition-colors"
            >
              <div className="p-4 bg-neutral-900 rounded-full group-hover:bg-white group-hover:text-black transition-colors border border-neutral-800">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                Email
              </span>
            </a>

            <a
              href="https://www.linkedin.com/in/grahaphics/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 p-8 rounded-lg hover:bg-neutral-900 transition-colors"
            >
              <div className="p-4 bg-neutral-900 rounded-full group-hover:bg-white group-hover:text-black transition-colors border border-neutral-800">
                <Linkedin className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                LinkedIn
              </span>
            </a>

            <a
              href="https://twitter.com/grahaphics"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 p-8 rounded-lg hover:bg-neutral-900 transition-colors"
            >
              <div className="p-4 bg-neutral-900 rounded-full group-hover:bg-white group-hover:text-black transition-colors border border-neutral-800">
                <Twitter className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                Twitter
              </span>
            </a>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-full text-xs font-mono text-neutral-500">
            <MapPin className="w-3 h-3" />
            <span>Berkeley, CA</span>
          </div>
        </div>
      </section>
    </div>
  );
}