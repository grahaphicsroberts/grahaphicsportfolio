"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The "Invisible Nudge" for Desktop Chrome & SPA Routing
    if (containerRef.current) {
      const videoElement = containerRef.current.querySelector("video");
      if (videoElement) {
        // Redundantly lock the muted state (Chrome sometimes forgets during route changes)
        videoElement.muted = true;
        // Explicitly force play
        videoElement.play().catch((error) => {
          console.warn("Autoplay required a manual nudge:", error);
        });
      }
    }
  }, []);

  const scrollToWork = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const workSection = document.getElementById("work");
    if (workSection) {
      workSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-neutral-950 flex flex-col justify-center pt-24 pb-12">
      {/* --- VIDEO BACKGROUND --- */}
      <div className="absolute inset-0 z-0 bg-neutral-900">
        <div
          ref={containerRef}
          className="w-full h-full"
          dangerouslySetInnerHTML={{
            __html: `
              <video 
                autoplay 
                loop 
                muted 
                playsinline 
                poster="/video-poster.jpg"
                class="w-full h-full object-cover opacity-60"
              >
                <source src="/Kronos_lbrt-8966.mp4" type="video/mp4" />
              </video>
            `,
          }}
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/20 to-transparent pointer-events-none" />
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 px-6 md:px-12 w-full max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-16"
        >
          {/* LEFT COLUMN: THE MASSIVE STACK */}
          <div className="flex-shrink-0">
            <h1 className="text-[14vw] sm:text-[11vw] lg:text-[7.5rem] xl:text-[8.5rem] font-black tracking-tighter text-white leading-[0.85] lg:leading-[0.8] whitespace-nowrap">
              Director &<br />
              Innovator &<br />
              Designer &<br />
              Storyteller.
            </h1>
          </div>

          {/* RIGHT COLUMN: MANIFESTO & CTA */}
          <div className="max-w-xl pb-2 lg:pb-4">
            <p className="text-lg md:text-xl xl:text-2xl text-neutral-300 font-light leading-relaxed mb-8">
              Graham Roberts is a multidisciplinary design leader exploring how AI and emerging technologies can advance human-computer interaction.
            </p>

            {/* MINIMALIST CTA WITH SMOOTH SCROLL */}
            <Link
              href="#work"
              onClick={scrollToWork}
              className="group inline-flex items-center gap-3 border-b border-white pb-1 text-white hover:text-neutral-300 hover:border-neutral-300 transition-colors uppercase tracking-widest text-xs md:text-sm font-mono"
            >
              <span>View Selected Works</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* --- SCROLL INDICATOR --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-20"
      >
        <a href="#work" onClick={scrollToWork} className="cursor-pointer block text-white/40 hover:text-white/70 transition-colors animate-bounce">
          <ArrowDown className="w-5 h-5" />
        </a>
      </motion.div>
    </section>
  );
}