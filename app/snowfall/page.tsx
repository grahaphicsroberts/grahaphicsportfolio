"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Layers,
  Smartphone,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function SnowfallCaseStudy() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.3], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="bg-neutral-950 text-neutral-200 min-h-screen font-sans selection:bg-white selection:text-black"
    >
      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference text-white">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold tracking-tight">BACK TO INDEX</span>
        </Link>
        <span className="hidden md:block font-mono text-sm opacity-50">
          CASE STUDY 01
        </span>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden flex items-end pb-24 px-6 md:px-24 border-b border-neutral-800">
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          {/* PLACEHOLDER: Replace src with a high-res image of the Snowfall cover */}
          <img
            src="https://images.unsplash.com/photo-1518182170546-0766cacd42a5?q=80&w=2600&auto=format&fit=crop"
            alt="Snow Mountain Background"
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
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
              2012
            </span>
          </div>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white mb-4">
            SNOW FALL
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl leading-relaxed">
            The avalanche at Tunnel Creek. A multimedia narrative that changed
            digital journalism forever.
          </p>
        </motion.div>
      </section>

      {/* Project Metadata & Brief */}
      <section className="py-24 px-6 md:px-24 border-b border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 space-y-8">
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                My Role
              </h3>
              <p className="text-lg text-white">Graphics & Multimedia Editor</p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Discipline
              </h3>
              <p className="text-lg text-white">Immersive Storytelling</p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Awards
              </h3>
              <p className="text-lg text-white">Pulitzer Prize (2013)</p>
              <p className="text-lg text-white">Peabody Award</p>
            </div>
          </div>

          <div className="md:col-span-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
              The Challenge: How do you make the internet feel as cinematic as a
              documentary?
            </h2>
            <div className="prose prose-invert prose-lg text-neutral-400 leading-relaxed">
              <p className="mb-6">
                In 2012, long-form journalism on the web was static. Text was
                separated from visuals, and video was an interruption rather
                than a companion.
              </p>
              <p>
                Our team at the NYT Graphics Desk set out to integrate video,
                photography, and interactive graphics directly into the flow of
                reading. The result was a seamless narrative experience that
                allowed readers to understand the geography, the physics of the
                avalanche, and the human stories simultaneously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase (Grid) */}
      <section className="py-24 px-6 md:px-24 bg-neutral-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Placeholder for feature content */}
          <div className="aspect-video bg-neutral-800 rounded-sm overflow-hidden border border-neutral-700 relative group">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-neutral-500">
                Interactive Map Component
              </span>
            </div>
          </div>
          <div className="aspect-video bg-neutral-800 rounded-sm overflow-hidden border border-neutral-700 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-neutral-500">
                Video Integration Loop
              </span>
            </div>
          </div>
        </div>
        <p className="font-mono text-xs text-center text-neutral-500 uppercase tracking-widest">
          Original assets courtesy of The New York Times
        </p>
      </section>

      {/* The "Information Design" Deep Dive */}
      <section className="py-32 px-6 md:px-24 bg-white text-black">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6 text-blue-600">
            <Layers className="w-6 h-6" />
            <span className="font-bold tracking-tight uppercase">
              The Logic
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-12 tracking-tighter">
            Visualizing the Invisible
          </h2>
          <p className="text-xl md:text-2xl text-neutral-600 mb-12 leading-relaxed">
            A key challenge was visualizing the snowpack layers. We couldn't
            just tell readers the snow was unstable; we had to show them the
            physics.
          </p>

          {/* Process Diagram Placeholder */}
          <div className="w-full h-96 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center bg-neutral-50 mb-12">
            <p className="text-neutral-400 font-mono">
              Insert: Wireframes / Data Sketches / Prototypes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm border-t border-neutral-200 pt-8">
            <div>
              <strong className="block mb-2">01. Data Collection</strong>
              <p className="text-neutral-500">
                Aggregating wind speed and snowfall data from local weather
                stations.
              </p>
            </div>
            <div>
              <strong className="block mb-2">02. 3D Modeling</strong>
              <p className="text-neutral-500">
                Creating a topographic mesh of Tunnel Creek to map the avalanche
                path.
              </p>
            </div>
            <div>
              <strong className="block mb-2">03. Integration</strong>
              <p className="text-neutral-500">
                Building a custom scroll-listener to trigger video playback at
                precise reading moments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Project Link */}
      <section className="h-[50vh] flex items-center justify-center bg-neutral-950 border-t border-neutral-800 hover:bg-neutral-900 transition-colors cursor-pointer">
        <Link href="/" className="text-center group">
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-4 block group-hover:text-white transition-colors">
            Next Case Study
          </span>
          <h2 className="text-5xl md:text-7xl font-bold text-neutral-700 group-hover:text-white transition-colors flex items-center gap-6">
            Google Brand Studio{" "}
            <ArrowUpRight className="w-12 h-12 md:w-20 md:h-20" />
          </h2>
        </Link>
      </section>
    </div>
  );
}
