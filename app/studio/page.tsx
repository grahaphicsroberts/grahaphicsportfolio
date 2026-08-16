"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, MapPin, Trophy } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// The single source of truth for availability. It appears here and in the
// footer, so keep the wording consistent when it changes.
const AVAILABILITY = "Taking on select engagements for 2026";

// ---------------------------------------------------------------------------
// WHAT THE STUDIO IS HIRED FOR
// ---------------------------------------------------------------------------

const SERVICES = [
  {
    title: "Advisory & design leadership counsel",
    copy: "Ongoing counsel for leaders building or scaling a design practice: how to shape the org, who to hire, what standards to hold, and the calls that are hard to make from inside.",
  },
  {
    title: "AI-forward product & experience strategy",
    copy: "Where generative and spatial technology genuinely improves a product, and where it is theater. I have spent the last several years operationalizing this rather than demoing it.",
  },
  {
    title: "Strategy sprints",
    copy: "A short, scoped engagement that moves a team from ambiguity to a defensible direction: audit what exists, frame the options, recommend a path, and show what it looks like.",
  },
  {
    title: "Prototype builds",
    copy: "Working code, not comps. Interactive prototypes that pressure-test a visual system, an interaction, or a dataset before engineering commits to building it.",
  },
  {
    title: "Data visualization & information design",
    copy: "Production-grade explanatory graphics, charts, and 3D visualization for dense, technical subject matter that has to stay accurate while becoming legible.",
  },
  {
    title: "Fractional design leadership",
    copy: "Interim leadership for a team between hires, or for an initiative that needs a senior hand for a defined stretch without a permanent headcount.",
  },
  {
    title: "Workshops, talks & teaching",
    copy: "Sessions for teams, conferences, and classrooms on information design, immersive storytelling, and working credibly with emerging technology.",
  },
];

// ---------------------------------------------------------------------------
// HOW AN ENGAGEMENT IS SHAPED — the practical "how do I buy this" answer
// ---------------------------------------------------------------------------

const SHAPES = [
  {
    name: "Retainer",
    duration: "Ongoing",
    copy: "A standing block of time each month for advisory work, reviews, and the questions that come up between them.",
  },
  {
    name: "Sprint",
    duration: "2–6 weeks",
    copy: "A defined question, answered. Ends in a recommendation and enough designed evidence to act on it.",
  },
  {
    name: "Project",
    duration: "Scoped",
    copy: "A deliverable built end to end: a prototype, a visualization system, or a launch-ready experience.",
  },
];

const SECTORS = [
  "Health & biotech",
  "Technology & AI",
  "News & publishing",
  "Museums & cultural institutions",
  "Education & research",
];

// ---------------------------------------------------------------------------
// CURRENT WORK
// Client names are withheld. Replace the copy below as engagements close and
// permission to name them comes through.
// ---------------------------------------------------------------------------

const CURRENT = [
  {
    year: "2026",
    scope: "Delivered",
    copy: "An independent engagement translating a technical dataset into an interactive experience for a private client.",
  },
  {
    year: "2026",
    scope: "Scoped",
    copy: "A second engagement specified and costed, currently awaiting a green light.",
  },
];

// ---------------------------------------------------------------------------
// THE FOUNDATION — twenty years doing the credibility work
// ---------------------------------------------------------------------------

const FOUNDATION = [
  { honor: "Museum of Modern Art", detail: "Permanent collection" },
  { honor: "Pulitzer Prize", detail: "Snow Fall" },
  { honor: "News & Doc Emmy", detail: "One Building, One Bomb" },
  { honor: "World Press Photo", detail: "First prize, immersive" },
  { honor: "Peabody Award", detail: "Digital storytelling" },
];

const PRACTICE_LINKS = [
  { label: "Health & biotech visualization", href: "/havas" },
  { label: "Data storytelling & product design", href: "/google-trends" },
  { label: "Spatial computing, AR & product", href: "/nyt-ar" },
  { label: "Immersive storytelling", href: "/immersive-web" },
];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
};

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 selection:bg-white selection:text-black">
      <Navbar />

      {/* --- HERO --- */}
      <header className="relative flex min-h-[92vh] items-center overflow-hidden border-b border-neutral-800 px-6 pt-32 pb-20 md:px-24">
        <img
          src="/Deepmind_radial_wireframe.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.13]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl"
        >
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300">
              {AVAILABILITY}
            </span>
          </div>

          <span className="mb-6 block font-mono text-sm uppercase tracking-[0.25em] text-blue-500">
            Grahaphics &middot; The Studio
          </span>

          <h1 className="mb-8 text-5xl font-bold leading-[0.92] tracking-tighter text-white md:text-7xl lg:text-8xl">
            Complex information, <br /> made clear.
          </h1>

          <p className="mb-6 max-w-2xl text-xl font-light leading-relaxed text-neutral-300 md:text-2xl">
            Grahaphics is the independent practice of Graham Roberts. I work
            with teams whose subject matter is genuinely hard&mdash;clinical
            data, scientific research, technical products&mdash;and make it
            legible, credible, and usable.
          </p>

          <p className="mb-12 max-w-2xl leading-relaxed text-neutral-500">
            Two decades of that work inside The New York Times, Google, and
            Havas. Now available directly.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="mailto:grahaphics@gmail.com?subject=Project%20inquiry"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-300"
            >
              Start a conversation
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <Link
              href="/#work"
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white transition-colors hover:border-white/60"
            >
              See the work
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </motion.div>
      </header>

      {/* --- WHAT I'M HIRED FOR --- */}
      <section className="border-b border-neutral-800 px-6 py-32 md:px-24">
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal} transition={{ duration: 0.6 }}>
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
              What I am hired for
            </h2>
            <p className="mt-6 max-w-3xl text-3xl font-bold tracking-tighter text-white md:text-5xl">
              Seven ways in, depending on what you need.
            </p>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 gap-x-16 md:grid-cols-2">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                {...reveal}
                transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
                className="group border-t border-neutral-800 py-10 transition-colors hover:border-neutral-500"
              >
                <span className="font-mono text-xs text-neutral-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-neutral-100">
                  {service.title}
                </h3>
                <p className="mt-4 max-w-md leading-relaxed text-neutral-400">
                  {service.copy}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW ENGAGEMENTS ARE SHAPED --- */}
      <section className="border-b border-neutral-800 bg-neutral-900/30 px-6 py-32 md:px-24">
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal} transition={{ duration: 0.6 }}>
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
              How it works
            </h2>
            <p className="mt-6 max-w-3xl text-3xl font-bold tracking-tighter text-white md:text-5xl">
              Three shapes an engagement takes.
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {SHAPES.map((shape, i) => (
              <motion.div
                key={shape.name}
                {...reveal}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-sm border border-neutral-800 bg-neutral-950 p-8 transition-colors hover:border-neutral-600"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-2xl font-bold text-white">
                    {shape.name}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-400">
                    {shape.duration}
                  </span>
                </div>
                <p className="mt-5 leading-relaxed text-neutral-400">
                  {shape.copy}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...reveal}
            transition={{ duration: 0.6 }}
            className="mt-16 border-t border-neutral-800 pt-10"
          >
            <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
              Fields I know well
            </h3>
            <div className="mt-6 flex flex-wrap gap-3">
              {SECTORS.map((sector) => (
                <span
                  key={sector}
                  className="rounded-full border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm text-neutral-300"
                >
                  {sector}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- CURRENT WORK --- */}
      <section className="border-b border-neutral-800 px-6 py-32 md:px-24">
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal} transition={{ duration: 0.6 }}>
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
              Current work
            </h2>
            <p className="mt-6 max-w-3xl text-3xl font-bold tracking-tighter text-white md:text-5xl">
              The practice, so far.
            </p>
          </motion.div>

          <div className="mt-16 max-w-4xl">
            {CURRENT.map((item, i) => (
              <motion.div
                key={item.copy}
                {...reveal}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="flex flex-col gap-4 border-t border-neutral-800 py-8 md:flex-row md:items-baseline md:gap-12"
              >
                <div className="flex shrink-0 items-center gap-4 md:w-48">
                  <span className="font-mono text-sm text-neutral-500">
                    {item.year}
                  </span>
                  <span className="rounded-full border border-neutral-700 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    {item.scope}
                  </span>
                </div>
                <p className="text-lg leading-relaxed text-neutral-300">
                  {item.copy}
                </p>
              </motion.div>
            ))}

            <motion.p
              {...reveal}
              transition={{ duration: 0.6 }}
              className="mt-10 border-t border-neutral-800 pt-10 font-mono text-sm text-neutral-500"
            >
              Client names and detailed case studies available on request.
            </motion.p>
          </div>
        </div>
      </section>

      {/* --- THE FOUNDATION --- */}
      <section className="border-b border-neutral-800 bg-neutral-900/30 px-6 py-32 md:px-24">
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal} transition={{ duration: 0.6 }}>
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
              The foundation
            </h2>
            <p className="mt-6 max-w-3xl text-3xl font-bold tracking-tighter text-white md:text-5xl">
              The practice is new. The work behind it is not.
            </p>
            <p className="mt-8 max-w-2xl leading-relaxed text-neutral-400 md:text-lg">
              Director of Immersive Storytelling at The New York Times, digital
              design lead at the Google Brand Studio, and EVP of Global
              Information Design at Havas&mdash;where I built a global practice
              from the ground up before starting this one.
            </p>
          </motion.div>

          <motion.div
            {...reveal}
            transition={{ duration: 0.6 }}
            className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-neutral-800 sm:grid-cols-2 lg:grid-cols-5"
          >
            {FOUNDATION.map((item) => (
              <div
                key={item.honor}
                className="bg-neutral-950 p-6 outline outline-1 outline-neutral-800"
              >
                <Trophy
                  className="mb-4 h-4 w-4 text-yellow-500"
                  aria-hidden="true"
                />
                <h3 className="font-bold leading-tight text-white">
                  {item.honor}
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-500">
                  {item.detail}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div
            {...reveal}
            transition={{ duration: 0.6 }}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            {PRACTICE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
              >
                {link.label}
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            ))}
            <Link
              href="/recognition"
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-neutral-300 transition-colors hover:text-white"
            >
              Full recognition archive
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="px-6 py-32 md:px-24">
        <motion.div {...reveal} transition={{ duration: 0.6 }} className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold tracking-tighter text-white md:text-6xl">
            Have something complicated <br /> to explain?
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-400">
            Tell me what you are working on and what is in the way. If it is not
            a fit, I will say so and point you somewhere better.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href="mailto:grahaphics@gmail.com?subject=Project%20inquiry"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-300"
            >
              grahaphics@gmail.com
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/grahaphics/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white transition-colors hover:border-white/60"
            >
              LinkedIn
            </a>
            <span className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 font-mono text-xs text-neutral-500">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              Berkeley, CA
            </span>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
