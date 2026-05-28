"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";

// --- THE APPLE GRADIENT DEFINITIONS ---
const ROLES = [
  {
    text: "Director",
    // Siri Intelligence vibe (Purple to Pink)
    gradient: "from-indigo-400 via-purple-400 to-pink-400",
  },
  {
    text: "Innovator",
    // Deep Tech vibe (Cyan to Blue)
    gradient: "from-cyan-400 via-blue-400 to-indigo-400",
  },
  {
    text: "Designer",
    // Creative Sunset vibe (Amber to Rose)
    gradient: "from-amber-400 via-orange-500 to-rose-500",
  },
  {
    text: "Storyteller",
    // Aurora vibe (Emerald to Cyan)
    gradient: "from-emerald-400 via-teal-400 to-cyan-400",
  },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State to track which word is currently flashing during the auto-sequence
  const [flashIndex, setFlashIndex] = useState<number | null>(null);

  useEffect(() => {
    // The "Invisible Nudge" for Desktop Chrome & SPA Routing
    if (containerRef.current) {
      const videoElement = containerRef.current.querySelector("video");
      if (videoElement) {
        videoElement.muted = true;
        videoElement.play().catch((error) => {
          console.warn("Autoplay required a manual nudge:", error);
        });
      }
    }
  }, []);

  useEffect(() => {
    // The Auto-Flash Cascade Sequence
    let timeouts: NodeJS.Timeout[] = [];
    
    // Wait 1.5 seconds after page load to start the sequence
    const startDelay = setTimeout(() => {
      ROLES.forEach((_, i) => {
        // Stagger each word's glow by 600ms
        const t = setTimeout(() => {
          setFlashIndex(i);
        }, i * 600);
        timeouts.push(t);
      });

      // Clear the final word's glow to return everything to white
      const finalClear = setTimeout(() => {
        setFlashIndex(null);
      }, ROLES.length * 600);
      timeouts.push(finalClear);
    }, 1500);

    // Cleanup function to prevent memory leaks if the user navigates away early
    return () => {
      clearTimeout(startDelay);
      timeouts.forEach(clearTimeout);
    };
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
          {/* LEFT COLUMN: THE GLOWING STACK */}
          <div className="flex-shrink-0">
            <h1 className="text-[14vw] sm:text-[11vw] lg:text-[7.5rem] xl:text-[8.5rem] font-black tracking-tighter text-white leading-[0.85] lg:leading-[0.8] whitespace-nowrap">
              {ROLES.map((role, i) => {
                const isFlashing = flashIndex === i;

                return (
                  <React.Fragment key={role.text}>
                    <span className="relative group inline-block cursor-default">
                      {/* Ghost Render: The Blurred Glow Layer */}
                      <span
                        className={`absolute left-0 top-0 text-transparent bg-clip-text bg-gradient-to-r ${role.gradient} blur-[12px] transition-opacity duration-700 ${
                          isFlashing ? "opacity-80" : "opacity-0 group-hover:opacity-80"
                        }`}
                        aria-hidden="true"
                      >
                        {role.text}
                      </span>
                      
                      {/* Foreground: The Crisp Gradient Layer */}
                      <span
                        className={`relative bg-clip-text bg-gradient-to-r ${role.gradient} transition-colors duration-500 ${
                          isFlashing ? "text-transparent" : "text-white group-hover:text-transparent"
                        }`}
                      >
                        {role.text}
                      </span>
                    </span>

                    {/* The Ampersand / Period (Stays static white) */}
                    {i < ROLES.length - 1 ? (
                      <span className="text-white"> &</span>
                    ) : (
                      <span className="text-white">.</span>
                    )}
                    
                    {/* Line Break */}
                    {i < ROLES.length - 1 && <br />}
                  </React.Fragment>
                );
              })}
            </h1>
          </div>

          {/* RIGHT COLUMN: MANIFESTO & CTA */}
          <div className="max-w-xl pb-2 lg:pb-4">
            <p className="text-lg md:text-xl xl:text-2xl text-neutral-300 font-light leading-relaxed mb-8">
              Graham Roberts is a multidisciplinary design leader exploring how AI and emerging technologies can advance human-computer interaction.
            </p>

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