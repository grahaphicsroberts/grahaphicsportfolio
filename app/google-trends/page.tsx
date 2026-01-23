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
  Monitor,
  Smartphone,
  Store,
  Layers,
  Search,
  Hammer,
  Volume2,
  Award,
  Wifi,
  BatteryMedium,
  LayoutTemplate,
  Share2,
  Edit3,
  FileBox,
  Sparkles,
  Type,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export default function GoogleTrendsPage() {
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
            src="/google-hero.jpg"
            alt="Google Trends Data Viz"
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
              Google
            </span>
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono uppercase tracking-widest bg-black/50 backdrop-blur-md">
              2019 — 2023
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 leading-[0.9]">
            Visualizing the <br /> World&apos;s Curiosity
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl leading-relaxed">
            Leading digital and experiential design for Google Trends. Turning
            billions of search queries into human stories.
          </p>
        </motion.div>
      </section>

      {/* --- INTRO --- */}
      <section className="py-24 px-6 md:px-24 border-b border-neutral-800 bg-neutral-900/30">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 space-y-8">
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Role
              </h3>
              <p className="text-lg text-white">Digital Design Lead</p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Focus Areas
              </h3>
              <p className="text-lg text-white">
                Data Visualization, Web Apps, Experiential Retail
              </p>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="prose prose-invert prose-lg text-neutral-300 leading-relaxed">
              <p className="text-2xl text-white font-medium mb-8 leading-tight">
                Search data is a mirror of society. My role was to design the
                reflection.
              </p>
              <p className="mb-6">
                As Digital Design Lead for the Google Brand Studio, I worked to
                transform the raw utility of Google Trends into emotional,
                narrative-driven experiences. This involved spanning the digital
                and physical worlds—from responsive web applications to
                immersive installations at the Google Store.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROJECT 1: SPACE TO BELONG (Digital Design) --- */}
      <section className="py-32 bg-neutral-900 border-b border-neutral-800">
        <div className="px-6 md:px-24 mb-16 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="font-mono text-blue-500 text-sm uppercase tracking-widest mb-3">
                01 — Digital Product
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Space to Belong
              </h2>

              {/* Award Element */}
              <div className="flex items-center gap-2 text-yellow-500 mb-6">
                <Award className="w-5 h-5" />
                <span className="font-mono text-xs uppercase tracking-widest">
                  Anthem Award Gold Winner
                </span>
              </div>

              <p className="text-xl text-neutral-400 max-w-xl leading-relaxed">
                For many, finding a safe space is a challenge. &quot;Space to
                Belong&quot; utilizes Google Trends data to visualize the global
                search for community. We mapped queries related to inclusive
                spaces—from &quot;LGBT friendly cities&quot; to
                &quot;transgender safe spaces&quot;—creating a responsive web
                experience that highlights the universal human need for
                connection and safety.
              </p>
            </div>
            <div className="flex items-center gap-4 text-neutral-500 text-sm font-mono uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Monitor className="w-4 h-4" /> Web App
              </span>
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> Responsive
              </span>
            </div>
          </div>

          {/* Desktop Video - AR Style Frame */}
          <div className="relative aspect-[16/8.5] bg-black rounded-[2rem] border-[8px] border-neutral-800 overflow-hidden shadow-2xl mb-24 z-10">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover bg-neutral-900"
            >
              <source src="/space-desktop.mp4" type="video/mp4" />
            </video>
            <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-xs font-mono text-white border border-white/10 z-20">
              Desktop Experience
            </div>
          </div>

          {/* Mobile Section: Split Layout (Text Left / Images Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start mb-32">
            {/* Copy Column */}
            <div className="lg:col-span-5 pt-4">
              <div className="flex items-center gap-3 mb-6 text-blue-500">
                <Volume2 className="w-6 h-6" />
                <h3 className="font-bold tracking-tight uppercase">
                  Immersive Audio
                </h3>
              </div>
              <div className="prose prose-lg text-neutral-400">
                <p className="mb-6 leading-relaxed text-white text-xl">
                  The concept was an immersive experience with photography and
                  short audio-clip interviews with owners and patrons.
                </p>
                <p className="leading-relaxed">
                  We paid extra attention to accessibility, and wanted the
                  experience to still feel like an audio experience, even when
                  users chose to have sound off. Rather than create an
                  accessibility button, we worked captions into the design from
                  the start as a highly considered element of the overall
                  experience.
                </p>
              </div>
            </div>

            {/* Images Column (Left Aligned relative to this column) */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className="relative aspect-[9/16] bg-black rounded-[1.5rem] md:rounded-[2.5rem] border-[4px] md:border-[8px] border-neutral-800 overflow-hidden shadow-2xl z-20"
                  >
                    {/* White Status Bar Area */}
                    <div className="absolute top-0 w-full h-8 bg-neutral-100 z-10 border-b border-neutral-200 flex items-end pb-1 px-3 justify-between pointer-events-none">
                      <span className="text-[10px] text-black font-medium font-mono leading-none">
                        9:41
                      </span>
                      <div className="flex gap-1 items-center text-black opacity-50">
                        <Wifi className="w-3 h-3" />
                        <BatteryMedium className="w-3 h-3" />
                      </div>
                    </div>

                    {/* AR-style Notch (layered on top) */}
                    <div className="absolute top-0 w-full h-4 md:h-6 z-20 flex justify-center items-start pointer-events-none">
                      <div className="w-12 md:w-20 h-3 md:h-4 bg-black rounded-b-lg" />
                    </div>

                    {/* JPG Image with top padding */}
                    <img
                      src={`/space-mobile-${num}.jpg`}
                      alt={`Space to Belong Mobile UI ${num}`}
                      className="w-full h-full object-cover bg-white pt-8"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- NEW SUBSECTION: EXPRESSIVE CAPTIONS (SQUARE 1:1) --- */}
          <div className="mt-24 p-8 md:p-12 bg-neutral-800/30 rounded-[2rem] border border-neutral-700/50 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="font-mono text-xs text-yellow-400 uppercase tracking-widest">
                    Innovation Spotlight
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Expressive Captions
                </h3>
                <p className="text-white text-lg leading-relaxed mb-6">
                  Born from the accessibility work in &quot;Space to
                  Belong,&quot; this project asked a simple question:{" "}
                  <span className="text-yellow-400 italic">
                    What if captions could emote?
                  </span>
                </p>
                <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                  After conducting over 100 hours of interviews with type
                  experts and machine learning engineers, we developed a system
                  where captions visualize the volume, pitch, and intonation of
                  speech. This feature was championed by Google&apos;s Head of
                  Accessibility and launched on Android in 2025.
                </p>

                {/* LINK BUTTON */}
                <a
                  href="https://www.android.com/accessibility/expressive-captions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors mb-8"
                >
                  <span>Read the Story</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 border border-white/10 rounded-full text-xs font-mono text-neutral-300">
                    <Smartphone className="w-3 h-3" /> Android 2025
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 border border-white/10 rounded-full text-xs font-mono text-neutral-300">
                    <Type className="w-3 h-3" /> Variable Type
                  </div>
                </div>
              </div>

              {/* Media Container - aspect-square - NO LABEL */}
              <div className="relative aspect-square bg-black rounded-xl overflow-hidden border border-neutral-700 shadow-2xl max-w-md mx-auto w-full">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/expressive-captions.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROJECT 2: YEAR IN SEARCH (Experiential) --- */}
      <section className="py-32 bg-neutral-950">
        <div className="px-6 md:px-24 mb-16 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="font-mono text-orange-500 text-sm uppercase tracking-widest mb-3">
                02 — Experiential Design
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Year in Search
              </h2>
              {/* UPDATED COPY */}
              <div className="max-w-2xl text-neutral-400 space-y-6 text-xl leading-relaxed">
                <p>
                  In 2021, Google opened its first brick and mortar retail store
                  in the Chelsea neighborhood of New York City. The store
                  features a new experience space called &quot;The Imagination
                  Space.&quot;
                </p>
                <p>
                  As an extension of the popular annual &quot;Year in
                  Search&quot; series, I led our first out-of-home installation
                  version of the project, creating an interactive experience
                  that allowed visitors to use voice control to explore the
                  trending searches throughout the year that defined culture.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-neutral-500 text-sm font-mono uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Store className="w-4 h-4" /> Retail
              </span>
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" /> Interactive
              </span>
            </div>
          </div>

          {/* Main Experience Video */}
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-neutral-800 shadow-2xl mb-12">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/yis-experience.mp4" type="video/mp4" />
            </video>
            <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-xs font-mono text-white border border-white/10 flex items-center gap-2">
              <Store className="w-3 h-3" /> NYC Google Store
            </div>
          </div>

          {/* BTS Grid - Constrained Height */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Item 1: Vertical Video (Takes up 4 cols, aligned height) */}
            <div className="md:col-span-4 space-y-6">
              <div className="relative h-[500px] md:h-[600px] bg-black rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/yis-bts.mp4" type="video/mp4" />
                </video>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-neutral-500" /> Fabrication
                </h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  We worked with a unique custom "imagination space" that
                  included floor-to-ceiling glass tubes containing LEDs which we
                  designed to reflect the data visualizations in the main
                  displays.
                </p>
              </div>
            </div>

            {/* Item 2: Existing Image (Takes up 8 cols, aligned height) */}
            <div className="md:col-span-8 space-y-6">
              <div className="relative h-[500px] md:h-[600px] bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
                <img
                  src="/yis-bts-2.jpg"
                  alt="Year in Search Interface Design"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-neutral-500" /> Interface
                  Design
                </h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  The interface needed to be legible and engaging from a
                  distance to attract passersby, while offering deep
                  interactivity for users standing directly in front of the
                  screens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROJECT 3: REIMAGINING GOOGLE TRENDS (Product Design) --- */}
      <section className="py-32 bg-neutral-900 border-t border-neutral-800">
        <div className="px-6 md:px-24 mb-16 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="font-mono text-purple-500 text-sm uppercase tracking-widest mb-3">
                03 — Product Innovation
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Reimagining <br /> Google Trends
              </h2>
              {/* Concept Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/20 border border-purple-500/30 rounded-full text-purple-400 text-xs font-mono uppercase tracking-wide mb-6">
                <LayoutTemplate className="w-3 h-3" /> Strategic Concept /
                Ideation
              </div>
              <p className="text-xl text-neutral-400 max-w-xl leading-relaxed">
                Google Trends was built for researchers, but our data showed
                that a significant portion of users were coming for &quot;fun
                and curiosity.&quot; This strategic redesign aimed to pivot the
                platform from a &quot;pull&quot; utility into a &quot;push&quot;
                media destination, surfacing culture as it happens.
              </p>
            </div>
            <div className="flex items-center gap-4 text-neutral-500 text-sm font-mono uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" /> Data Product
              </span>
              <span className="flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Social
              </span>
            </div>
          </div>

          {/* Hero Video - Dashboard */}
          <div className="relative aspect-[16/10] bg-black rounded-[2rem] border-[8px] border-neutral-800 overflow-hidden shadow-2xl mb-24 z-10">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/trends-redesign-hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-xs font-mono text-white border border-white/10 z-20">
              New Homepage Dashboard
            </div>
          </div>

          {/* Core Concept: Snippets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
            <div>
              <div className="flex items-center gap-3 mb-6 text-purple-400">
                <FileBox className="w-6 h-6" />
                <h3 className="font-bold tracking-tight uppercase">
                  The Atomic Unit
                </h3>
              </div>
              <div className="prose prose-lg text-neutral-400">
                <p className="mb-6 leading-relaxed text-white text-xl">
                  We atomized trends data into &quot;Snippets&quot;—portable,
                  shareable cards that tell a single data story.
                </p>
                <p className="leading-relaxed">
                  Instead of forcing users to query a database, Snippets allowed
                  Google to meet users where they were—on social media and third
                  party sites. These self-contained units could host live
                  charts, images, and lists, transforming raw data into social
                  objects.
                </p>
              </div>
            </div>
            <div className="relative bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
              <img
                src="/trends-snippets.jpg"
                alt="Google Trends Snippets UI"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Core Concept: Studio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* UPDATED: Video instead of Image */}
            <div className="order-2 md:order-1 relative bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/trends-studio.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-6 text-purple-400">
                <Edit3 className="w-6 h-6" />
                <h3 className="font-bold tracking-tight uppercase">
                  Trends Studio
                </h3>
              </div>
              <div className="prose prose-lg text-neutral-400">
                <p className="mb-6 leading-relaxed text-white text-xl">
                  To scale this new ecosystem, we designed the &quot;Google
                  Trends Studio&quot;—a creator tool for democratization.
                </p>
                <p className="leading-relaxed">
                  This platform would allow partners, journalists, and creators
                  to build their own verified data visualizations using
                  Google&apos;s live data, without needing a data science
                  degree. It included customizable templates and automated data
                  validation to ensure accuracy.
                </p>
              </div>
            </div>
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
