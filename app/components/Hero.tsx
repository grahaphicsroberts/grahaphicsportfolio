"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-neutral-950 flex items-center">
      {/* --- VIDEO BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/Kronos_lbrt-8966.mp4" type="video/mp4" />
        </video>
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/20 to-transparent" />
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 px-6 md:px-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* BEATLES STYLE HEADLINE */}
          {/* Added 'whitespace-nowrap' to ensure & always stays with the word */}
          <h1 className="text-5xl sm:text-6xl md:text-9xl font-black tracking-tighter text-white mb-8 leading-[0.9] md:leading-[0.8] whitespace-nowrap">
            Journalist &<br />
            CreativeDirector &<br />
            InfoDesigner &<br />
            ProductDesigner.
          </h1>

          <p className="text-xl md:text-2xl text-neutral-300 font-light max-w-2xl leading-relaxed">
            Graham Roberts is a multidisciplinary designer exploring how technology can shape and advance form and narrative.
          </p>
        </motion.div>
      </div>

      {/* --- SCROLL INDICATOR --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-6 md:left-12 z-20"
      >
        <ArrowDown className="w-6 h-6 text-white/50 animate-bounce" />
      </motion.div>
    </section>
  );
}