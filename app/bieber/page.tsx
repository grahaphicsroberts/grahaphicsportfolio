"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Play,
  Smartphone,
  Quote,
  AudioWaveform,
} from "lucide-react";
import Link from "next/link";

export default function BieberCaseStudy() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.3], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="bg-neutral-950 text-neutral-200 min-h-screen font-sans selection:bg-yellow-400 selection:text-black"
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
          CASE STUDY 03
        </span>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen overflow-hidden flex items-end pb-24 px-6 md:px-24 border-b border-neutral-800">
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2600&auto=format&fit=crop"
            alt="Studio Session"
            className="w-full h-full object-cover opacity-40 grayscale"
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
              2015
            </span>
          </div>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white mb-4">
            MAKING A HIT
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl leading-relaxed">
            NYT's first major foray into vertical video storytelling. A visual
            deconstruction of "Where Are Ü Now".
          </p>
        </motion.div>
      </section>

      {/* --- METADATA & AWARDS SECTION (Restored) --- */}
      <section className="py-24 px-6 md:px-24 border-b border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 space-y-8">
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                My Role
              </h3>
              <p className="text-lg text-white">Graphics Director</p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Discipline
              </h3>
              <p className="text-lg text-white">
                Interactive Video / Audio Viz
              </p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Awards
              </h3>
              <p className="text-lg text-white">
                World Press Photo (1st Prize)
              </p>
              <p className="text-lg text-white">SND Best of Digital Design</p>
              <p className="text-lg text-white">Webby Award</p>
            </div>
          </div>

          <div className="md:col-span-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
              The Challenge: Visualizing music for a generation that holds their
              phones vertically.
            </h2>
            <div className="prose prose-invert prose-lg text-neutral-400 leading-relaxed">
              <p className="mb-6">
                In 2015, high-quality video was still synonymous with
                "landscape" mode. But we knew the audience for this track lived
                on their phones. We decided to bet on verticality.
              </p>
              <p>
                The goal was to break down the complex layers of electronic
                music—the isolated "stems"—into visual graphics that anyone
                could understand. We had to explain how a "dolphin sound" became
                the hook of a global hit, using motion graphics that synced
                perfectly with the beat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MODULE A: THE VIDEO EMBED --- */}
      <section className="py-24 px-6 md:px-24 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="aspect-video w-full bg-black rounded-sm overflow-hidden border border-neutral-700 relative group">
            {/* REPLACE WITH YOUR ACTUAL VIMEO/YOUTUBE EMBED */}
            <iframe
              src="https://www.youtube.com/embed/In84V4v3eMk?si=scC_qU3s_IqTqB2-"
              title="YouTube video player"
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* --- MODULE B: THE "DOLPHIN" BREAKDOWN --- */}
      <section className="py-32 px-6 md:px-24 bg-white text-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6 text-yellow-600">
              <AudioWaveform className="w-6 h-6" />
              <span className="font-bold tracking-tight uppercase">
                The "Dolphin" Sound
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter leading-tight">
              Visualizing the Invisible Hook
            </h2>
            <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
              The core of the song is a distorted vocal sample that sounds like
              a dolphin. In a traditional article, you would just read about it.
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed">
              We decided to *show* it. By isolating the frequency of that
              specific sample and mapping it to a custom geometric animation,
              viewers could "see" the hook jump out of the mix, connecting the
              audio engineering to the emotional impact.
            </p>
          </div>
          <div className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 p-8 flex items-center justify-center">
            <div className="w-full h-64 bg-neutral-900 flex items-center justify-center relative">
              <div className="w-32 h-32 bg-yellow-400 rounded-full blur-xl animate-pulse" />
              <span className="relative text-white font-mono z-10">
                [ Insert Dolphin GIF ]
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- MODULE C: VERTICAL SHOWCASE --- */}
      <section className="py-32 px-6 md:px-24 bg-neutral-950 border-t border-neutral-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Mobile-First Composition
          </h2>
          <p className="text-neutral-500 max-w-xl mx-auto">
            We shot in 6K to allow for dynamic cropping, ensuring the experience
            felt native to the phone screen.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="aspect-[9/16] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden relative group">
            <img
              src="https://grahaphics.com/Phone-Mock-1.jpg"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-neutral-700" />
            </div>
          </div>
          <div className="aspect-[9/16] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden relative group mt-0 md:-mt-12 shadow-2xl shadow-yellow-900/20">
            <img
              src="https://grahaphics.com/Phone-Mock-2.jpg"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-xs text-yellow-500 border border-yellow-500 px-2 py-1 rounded">
                Focus
              </span>
            </div>
          </div>
          <div className="aspect-[9/16] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden relative group">
            <img
              src="https://grahaphics.com/Phone-Mock-3.jpg"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-neutral-700" />
            </div>
          </div>
        </div>
      </section>

      {/* --- MODULE D: QUOTE --- */}
      <section className="py-24 px-6 md:px-24 bg-yellow-400 text-black">
        <div className="max-w-4xl mx-auto text-center">
          <Quote className="w-12 h-12 mx-auto mb-6 opacity-50" />
          <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
            "The New York Times just revolutionized music journalism."
          </h3>
          <p className="font-mono uppercase tracking-widest text-sm opacity-60">
            — The Verge
          </p>
        </div>
      </section>

      {/* --- NEXT PROJECT LINK --- */}
      <Link
        href="/ground-zero"
        className="block py-32 bg-neutral-950 hover:bg-neutral-900 transition-colors border-t border-neutral-800 text-center group"
      >
        <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-4 block">
          Next Case Study
        </span>
        <h2 className="text-5xl md:text-7xl font-bold text-white inline-flex items-center gap-4">
          Ground Zero{" "}
          <ArrowUpRight className="w-12 h-12 text-neutral-600 group-hover:text-white transition-colors" />
        </h2>
      </Link>
    </div>
  );
}
