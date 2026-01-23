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
  Glasses,
  ArrowRight,
  Image as ImageIcon,
  Layers,
  Box,
  Trophy,
  Award,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

// --- DATA: FEATURED VR PROJECTS ---
const HIGHLIGHTS = [
  {
    title: "The Antarctica Series",
    subtitle: "Four-Part Documentary",
    tribeca: true,
    link: "https://www.nytimes.com/interactive/2017/climate/antarctica-virtual-reality.html",
    linkText: "View the Films",
    description:
      "A physically grueling production capturing the melting continent. We deployed custom 360 camera rigs to capture the ice shelf in a way never before seen.",
    video: "/antarctica-motion.mp4",
    awards: [
      "News & Doc Emmy: Outstanding New Approaches",
      "World Press Photo: Immersive Storytelling",
    ],
    seriesThumbnails: [
      "/antarctica-part2.jpg",
      "/antarctica-part3.jpg",
      "/antarctica-part4.jpg",
    ],
    btsStory:
      "Filming in Antarctica presented unique challenges for VR. The extreme cold drained batteries in minutes, requiring us to build custom heated rigs. We also had to invent new stabilization techniques to mount 360 cameras on helicopters, and custom waterproof inclosures to bring 360 cameras into the freezing waters below the ice shelf.",
    images: ["/antarctica-1.jpg", "/antarctica-2.jpg"],
  },
  {
    title: "Seeking Pluto's Frigid Heart",
    subtitle: "Data Visualization in VR",
    tribeca: true,
    link: "https://www.youtube.com/watch?v=jIxQXGTl_mo",
    linkText: "View the Film",
    description:
      "Working with NASA data to fly users over the surface of Pluto. This project pushed the boundaries of stereoscopic rendering and scientific visualization.",
    video: "/pluto-motion.mp4",
    awards: [
      "Cannes Lions: Silver Lion (Digital Craft)",
      "Webby Award: Best Use of VR/AR",
    ],
    btsStory:
      "We collaborated directly with the New Horizons team at NASA to obtain the raw altimetry data from the flyby, and used this to create accurate renderings of what it would be like to stand on the planets' surface. I also composed a custom operatic soundtrack for the project called The Pluto Chorale. Four opera singers performed the piece at Dubway Studios in NYC around ambisonic microphones, allowing the sound to move with the viewer as they observed the alien environments.",
    images: ["/pluto-1.jpg", "/pluto-2.jpg"],
  },
  {
    title: "Apollo 11: As They Shot It",
    subtitle: "Interactive VR",
    tribeca: false,
    link: "https://www.nytimes.com/interactive/2019/07/18/science/apollo-11-moon-landing-photos-ul.html",
    linkText: "Launch Experience",
    description:
      "Reconstructing the moon landing using only the original photography taken by the astronauts. An interactive experience exploring the lunar surface.",
    video: "/moon-motion.mp4",
    awards: [
      "Peabody Award: Digital Storytelling",
      "SND Best of Digital Design: Gold Medal",
    ],
    btsStory:
      "For the 50th anniversary of the Apollo 11 moon landing, we created a new, spatial way to understand the iconic photography taken by Buzz Aldrin and Neil Armstrong on that day in 1969. Referencing maps that identified where every photograph was taken, we were able give readers the ability to see the photographs from the moon in a new light, reconstructing their relationships to one another spatially and offering a new understanding of the images.",
    images: ["/moon-1.jpg", "/moon-2.jpg"],
  },
];

// --- DATA: MORE VR FILMS (CAROUSEL) ---
const ARCHIVE = [
  {
    title: "The Modern Games",
    image: "/vr-games.jpg",
    link: "https://www.youtube.com/watch?v=rcsev4e9DoI",
  },
  {
    title: "Paris Vigils",
    image: "/vr-paris.jpg",
    link: "https://www.youtube.com/watch?v=o3yvjEMFbnM",
  },
  {
    title: "Sensations of Sound",
    image: "/vr-sound.jpg",
    link: "https://www.youtube.com/watch?v=WOHFpm4w0Hc",
  },
  {
    title: "Pilgrimage",
    image: "/vr-pilgrimage.jpg",
    link: "https://www.youtube.com/watch?v=ecavbpCuvkI", // Linked to The Displaced as representative journey
  },
  {
    title: "The National: Something out of Nothing",
    image: "/vr-national.jpg",
    link: "https://www.youtube.com/watch?v=ZcwiEzY-WjU",
  },
];

export default function NYTVRPage() {
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
            src="/NYTVR_studioimage.png"
            alt="NYT VR Production Studio"
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
              2015 — 2018
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 leading-[0.9]">
            The Birth of <br /> Virtual Reality News
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl leading-relaxed">
            Defining the grammar of immersion and distributing the largest VR
            platform in history.
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
              <p className="text-lg text-white">Creative Lead / Director</p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Distribution
              </h3>
              <p className="text-lg text-white">1 Million+ Headsets</p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Platforms
              </h3>
              <p className="text-lg text-white">Cardboard, Daydream, Oculus</p>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="prose prose-invert prose-lg text-neutral-300 leading-relaxed">
              <p className="text-2xl text-white font-medium mb-8 leading-tight">
                We didn't just make films; we invented a new narrative grammar.
              </p>
              <p className="mb-6">
                Launching with "The Displaced," we undertook a massive
                logistical feat: shipping over one million Google Cardboard
                viewers to Sunday subscribers. This overnight distribution
                created the largest VR audience in the world and established The
                New York Times as a leader in immersive journalism.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE LAUNCH: CARDBOARD & APPS --- */}
      <section className="py-32 px-6 md:px-24 bg-white text-black border-b border-neutral-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6 text-orange-600">
              <Glasses className="w-6 h-6" />
              <span className="font-bold tracking-tight uppercase">
                The Platform
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter leading-tight">
              A Mass Moment <br /> for VR.
            </h2>

            <div className="prose prose-lg text-neutral-600 mb-12">
              <p className="mb-6">
                The NYT VR program was built on the premise that we could reach
                readers in an entirely way — through creating presense. If the
                best journalism could transport readers to give them a new
                perspective and new understanding, this technology held a
                promise to do that more directly than ever before.
              </p>
              <p>
                By pairing the app launch with the physical distribution of
                Cardboard, we solved the "hardware problem" of VR, ensuring our
                journalism was accessible to millions immediately.
              </p>
            </div>
          </div>

          <div className="relative aspect-square md:aspect-[4/3] bg-neutral-100 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/cardboard.jpg"
              alt="Google Cardboard Distribution"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* --- NEW SECTION: BUILDING FOR HEADSETS --- */}
      <section className="py-32 px-6 md:px-24 bg-neutral-950 border-b border-neutral-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Text Left */}
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-3 mb-6 text-blue-500">
              <Box className="w-6 h-6" />
              <span className="font-bold tracking-tight uppercase">
                UX Design
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tighter leading-tight">
              Building for <br /> Headsets.
            </h2>

            <div className="prose prose-lg text-neutral-400 mb-8">
              <p className="mb-6">
                As VR hardware evolved, so did our ambitions. For the launch of
                Google Daydream and Oculus Go, we moved beyond simple video
                playback to create a fully immersive, real-time 3D environment.
              </p>
              <p>
                I led the design of a James Turrell inspired interface where
                users could navigate an archive of journalism floating in a
                void, using gaze-based interaction and 6DOF controllers to
                explore the news in a spatial context.
              </p>
            </div>
          </div>

          {/* Image Right */}
          <div className="order-1 md:order-2 relative aspect-video bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
            <img
              src="/oculus-vr.jpg"
              alt="NYT VR Daydream and Oculus Interface"
              className="w-full h-full object-cover opacity-90"
            />

            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-mono text-white border border-white/10">
              Daydream / Oculus Interface
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED PROJECTS (HERO + SUBSTANTIAL BTS) --- */}
      <section className="py-32 bg-neutral-900">
        <div className="px-6 md:px-24 mb-24 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Original Productions
          </h2>
          <p className="text-xl text-neutral-400 leading-relaxed">
            From the frozen tundra of Antarctica to the surface of Pluto, we
            pushed the limits of 360° filmmaking, ambisonic sound production and
            stereoscopic imagery.
          </p>
        </div>

        <div className="space-y-48">
          {HIGHLIGHTS.map((project, index) => (
            <div
              key={index}
              className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12"
            >
              {/* 1. Header & Intro */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12 items-end">
                <div className="md:col-span-8">
                  {/* TRIBECA BADGE */}
                  {project.tribeca && (
                    <div className="flex items-center gap-3 mb-4 text-yellow-500">
                      <Award className="w-5 h-5" />
                      <span className="font-mono text-xs uppercase tracking-widest">
                        Official Selection: Tribeca Film Festival
                      </span>
                    </div>
                  )}

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
                      {project.linkText || "View Project"}{" "}
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* 1.5 SERIES THUMBNAILS (Conditional) */}
              {project.seriesThumbnails && (
                <div className="grid grid-cols-3 gap-4 mb-4">
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
                    </div>
                  ))}
                </div>
              )}

              {/* 2. Hero Motion Video */}
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
                  <ImageIcon className="w-3 h-3" /> Motion Experience
                </div>
              </div>

              {/* 2.5 AWARDS STRIP */}
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

              {/* 3. Substantial Behind the Scenes Panel */}
              <div className="bg-neutral-800/30 rounded-b-xl border border-t-0 border-neutral-800 p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                  {/* Left: The Story */}
                  <div>
                    <div className="flex items-center gap-3 mb-6 text-orange-500">
                      <Layers className="w-5 h-5" />
                      <h4 className="font-mono text-sm uppercase tracking-widest">
                        Behind the Scenes
                      </h4>
                    </div>
                    <p className="text-lg text-neutral-300 leading-relaxed">
                      {project.btsStory}
                    </p>
                  </div>

                  {/* Right: The Evidence (Static Images) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square bg-neutral-800 rounded-lg overflow-hidden relative group">
                      <img
                        src={project.images[0]}
                        alt="BTS Detail 1"
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    </div>
                    <div className="aspect-square bg-neutral-800 rounded-lg overflow-hidden relative group">
                      <img
                        src={project.images[1]}
                        alt="BTS Detail 2"
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

      {/* --- CAROUSEL: FILM ARCHIVE --- */}
      <section className="py-24 bg-neutral-950 border-t border-neutral-900 overflow-hidden">
        <div className="px-6 md:px-12 mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Film Archive</h2>
            <p className="text-neutral-500">
              Selected works from over 20+ films
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-neutral-600 font-mono text-xs uppercase tracking-widest">
            Scroll <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-12 px-6 md:px-12 scrollbar-hide">
          {ARCHIVE.map((film, i) => (
            <Link
              key={i}
              href={film.link}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 group relative w-[300px] aspect-[2/3] bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 block cursor-pointer"
            >
              {/* Fixed Image Layer - Absolute Positioned */}
              <img
                src={film.image}
                alt={film.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 z-0"
              />

              {/* Text Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 z-10" />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                <h4 className="text-white font-bold text-lg leading-tight group-hover:underline decoration-orange-500 underline-offset-4">
                  {film.title}
                </h4>
                <div className="flex items-center gap-2 mt-2 text-xs font-mono text-neutral-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Watch <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- PULL QUOTE --- */}
      <section className="py-24 px-6 md:px-24 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8">
            "We're always thinking about what makes something valuable in
            virtual reality. There has to be a reason that we're making it in VR
            and not a standard 2D medium."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-neutral-700" />
            <cite className="text-neutral-500 font-mono text-sm uppercase tracking-widest not-italic">
              Interview with UploadVR
            </cite>
            <div className="h-px w-12 bg-neutral-700" />
          </div>
        </div>
      </section>

      {/* --- FOOTER: SPEAKING --- */}
      <section className="py-24 px-6 md:px-24 bg-white text-black">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Evangelizing the Medium</h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-6">
              Bringing VR to the newsroom required cultural change as much as
              technical innovation. I worked to train journalists, establish
              safety protocols for filming, and define the ethics of immersive
              capture.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="/tribeca-vr.jpg"
              alt="Graham Speaking"
              className="w-full rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </section>

      {/* --- BACK LINK --- */}
      <section className="py-12 px-6 text-center border-t border-neutral-900 bg-neutral-950">
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
