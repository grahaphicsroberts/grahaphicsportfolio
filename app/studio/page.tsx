"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";
import DotField from "../components/DotField";

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
    copy: "Where generative and spatial technology earns its place in a product, and where it doesn't. I pioneered spatial design approaches early and have spent the years since putting them into production rather than into demos.",
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
// BRANDS THE WORK HAS BEEN BUILT FOR
// The heights are optical, not uniform: a wide wordmark set to the same height
// as a compact one reads as much larger, so each is tuned to sit evenly in the
// row rather than measure the same.
// ---------------------------------------------------------------------------

const BRANDS = [
  { name: "The New York Times", src: "/logos/nyt.svg", height: "h-[17px]" },
  { name: "Google", src: "/logos/google.svg", height: "h-[21px]" },
  {
    name: "Kimberly-Clark",
    src: "/logos/kimberly-clark.svg",
    height: "h-[16px]",
  },
  { name: "Novartis", src: "/logos/novartis.svg", height: "h-[18px]" },
  { name: "Merck", src: "/logos/merck.svg", height: "h-[21px]" },
  { name: "Genentech", src: "/logos/genentech.svg", height: "h-[16px]" },
  { name: "Sanofi", src: "/logos/sanofi.svg", height: "h-[21px]" },
  { name: "Pfizer", src: "/logos/pfizer.svg", height: "h-[26px]" },
  { name: "Amgen", src: "/logos/amgen.svg", height: "h-[20px]" },
  { name: "Guardant Health", src: "/logos/guardant.svg", height: "h-[19px]" },
  {
    name: "Johnson & Johnson",
    src: "/logos/johnson-and-johnson.svg",
    height: "h-[14px]",
  },
  { name: "AbbVie", src: "/logos/abbvie.svg", height: "h-[19px]" },
  // The Bayer cross is square where the rest are wordmarks, so it needs extra
  // height to carry the same visual weight in the row.
  { name: "Bayer", src: "/logos/bayer.svg", height: "h-[30px]" },
  { name: "Regeneron", src: "/logos/regeneron.svg", height: "h-[15px]" },
];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
};

// Seconds for a row to travel its own width. Slow enough to read a logo as it
// passes rather than register a moving band.
const MARQUEE_DURATION = 26;

const BrandLogo = ({
  brand,
  decorative = false,
}: {
  brand: (typeof BRANDS)[number];
  decorative?: boolean;
}) => (
  <img
    src={brand.src}
    alt={decorative ? "" : brand.name}
    aria-hidden={decorative || undefined}
    // brightness-0 flattens each logo to a silhouette and invert turns it
    // white, so fourteen different palettes read as one.
    className={`w-auto shrink-0 opacity-55 brightness-0 invert transition-opacity duration-300 hover:opacity-100 ${brand.height}`}
  />
);

// Phone layout: two short rows that drift past each other, so fourteen logos
// cost about 90px of height instead of seven stacked rows.
const MarqueeRow = ({
  brands,
  reverse = false,
}: {
  brands: typeof BRANDS;
  reverse?: boolean;
}) => {
  const reduceMotion = useReducedMotion();

  // Nothing should move for someone who asked for stillness, so the row
  // becomes a swipeable strip instead of losing the logos off-screen.
  if (reduceMotion) {
    return (
      <div className="flex items-center gap-x-10 overflow-x-auto px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {brands.map((brand) => (
          <BrandLogo key={brand.src} brand={brand} />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          duration: MARQUEE_DURATION,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Two identical groups, each carrying its own trailing gap, so the
            halfway point of the track lines up exactly with the start. */}
        {[false, true].map((duplicate) => (
          <div
            key={String(duplicate)}
            className="flex shrink-0 items-center gap-x-10 pr-10"
          >
            {brands.map((brand) => (
              <BrandLogo
                key={brand.src}
                brand={brand}
                decorative={duplicate}
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 selection:bg-white selection:text-black">
      <Navbar backToHome />

      {/* --- HERO --- */}
      <header className="relative flex min-h-[92vh] items-center overflow-hidden border-b border-neutral-800 px-6 pt-32 pb-20 md:px-24">
        <DotField />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl"
        >
          <span className="mb-6 block font-mono text-sm uppercase tracking-[0.25em] text-blue-500">
            Grahaphics &middot; The Studio
          </span>

          <h1 className="mb-8 text-5xl font-bold leading-[0.92] tracking-tighter text-white md:text-7xl lg:text-8xl">
            Designing <br /> understanding.
          </h1>

          <p className="mb-12 max-w-2xl text-xl font-light leading-relaxed text-neutral-300 md:text-2xl">
            Grahaphics is the independent practice of Graham Roberts. I work
            with teams across disciplines to build solutions that transform
            complex data and concepts into clear and engaging products and
            experiences.
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

      {/* --- BRANDS --- */}
      <section className="border-b border-neutral-800 py-12 md:px-24">
        <motion.div
          {...reveal}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl"
        >
          <div className="flex flex-col gap-y-6 md:hidden">
            <MarqueeRow brands={BRANDS.slice(0, 7)} />
            <MarqueeRow brands={BRANDS.slice(7)} reverse />
          </div>

          <div className="hidden flex-wrap items-center gap-x-12 gap-y-7 md:flex">
            {BRANDS.map((brand) => (
              <BrandLogo key={brand.src} brand={brand} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* --- WHAT I'M HIRED FOR --- */}
      <section className="border-b border-neutral-800 px-6 py-32 md:px-24">
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal} transition={{ duration: 0.6 }}>
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
              Services
            </h2>
            <p className="mt-6 max-w-3xl text-3xl font-bold tracking-tighter text-white md:text-5xl">
              Ways we can work together.
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

      {/* --- CTA --- */}
      <section className="bg-white px-6 py-32 text-black md:px-24">
        <motion.div {...reveal} transition={{ duration: 0.6 }} className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold tracking-tighter md:text-6xl">
            Get in touch.
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-600">
            Reach out and we can discuss your project to see if it&apos;s a good
            fit.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href="mailto:grahaphics@gmail.com?subject=Project%20inquiry"
              className="group inline-flex items-center gap-3 rounded-full bg-black px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-700"
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
              className="inline-flex items-center gap-3 rounded-full border border-black/20 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-black transition-colors hover:border-black/60"
            >
              LinkedIn
            </a>
            <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 font-mono text-xs text-neutral-500">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              Berkeley, CA
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
