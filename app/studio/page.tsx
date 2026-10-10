"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";
import DotField from "../components/DotField";
import { NotableFrame, leaned, notable } from "../components/notable";

// ---------------------------------------------------------------------------
// WHAT THE STUDIO IS HIRED FOR
// ---------------------------------------------------------------------------

const SERVICES = [
  {
    title: "Data visualization & information design",
    copy: "Production-grade explanatory graphics, charts, and 3D visualization for dense, technical subject matter that has to stay accurate while becoming legible.",
  },
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

// ---------------------------------------------------------------------------
// WHAT IS HAPPENING NOW — the same entries the homepage banner carries, read
// in this page's own order
// ---------------------------------------------------------------------------

const NEWS = notable("moma");

// Two of these point back at the studio, which is this page. A link that
// leads where the reader already is earns nothing, so it comes off here.
const PROJECTS = (["snkrwavs", "deepmind", "kimberly-clark"] as const).map(
  (id) => {
    const project = notable(id);
    return {
      ...project,
      link: project.link?.href === "/studio" ? undefined : project.link,
    };
  },
);

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
};

// Seconds for the row to travel the width of one group of logos — about 38px a
// second. Slow enough to read a logo as it passes rather than register a moving
// band.
const MARQUEE_DURATION = 50;

// How many copies of the row the track carries. The travel is one copy's width,
// so the copies that are left have to cover the window on their own at the
// moment it wraps: two is a few pixels short of that on a 1920 display and
// leaves a gap sweeping through, three covers anything up to 3800px wide.
const MARQUEE_COPIES = 3;

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

// One row at every width, running the full span of the page rather than
// wrapping into a block: fourteen logos read as a client list you glance along
// instead of a grid you audit. The row fades out at both edges so a logo
// leaves the frame rather than being cut in half by it.
const MarqueeRow = ({ brands }: { brands: typeof BRANDS }) => {
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
    <div className="overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_3rem,black_calc(100%-3rem),transparent)] [mask-image:linear-gradient(to_right,transparent,black_3rem,black_calc(100%-3rem),transparent)] md:[-webkit-mask-image:linear-gradient(to_right,transparent,black_8rem,black_calc(100%-8rem),transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_8rem,black_calc(100%-8rem),transparent)]">
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", `-${(100 / MARQUEE_COPIES).toFixed(4)}%`] }}
        transition={{
          duration: MARQUEE_DURATION,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Identical groups, each carrying its own trailing gap, so travelling
            exactly one group's width lands back on the start. Only the first is
            read out; the rest are the same list again. */}
        {Array.from({ length: MARQUEE_COPIES }, (_, copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center gap-x-10 pr-10"
          >
            {brands.map((brand) => (
              <BrandLogo
                key={brand.src}
                brand={brand}
                decorative={copy > 0}
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
            Grahaphics is the independent practice of Graham Roberts.
            <br />I work with teams across disciplines to transform complex data
            and concepts into clear and compelling stories and experiences.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="mailto:graham@grahaphics.com?subject=Project%20inquiry"
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
      <section className="border-b border-neutral-800 py-12">
        <motion.div
          {...reveal}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <MarqueeRow brands={BRANDS} />
        </motion.div>
      </section>

      {/* --- NEWS --- */}
      <section className="border-b border-neutral-800 px-6 py-32 md:px-24">
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal} transition={{ duration: 0.6 }}>
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
              News
            </h2>
            {/* The headline does the work of the section statement here, rather
                than being repeated under the photograph. */}
            <p className="mt-6 max-w-3xl text-3xl font-bold tracking-tighter text-white md:text-5xl">
              {leaned(NEWS.headline)}.
            </p>
          </motion.div>

          <motion.div
            {...reveal}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-14 grid gap-10 md:grid-cols-5 md:items-center md:gap-14"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900 md:col-span-3">
              <NotableFrame media={NEWS.media} stamp="feature" />
              {/* The photograph goes where the button below it goes. It is
                  held out of the tab order so the one destination is not
                  announced twice. */}
              {NEWS.link && (
                <Link
                  href={NEWS.link.href}
                  aria-hidden="true"
                  tabIndex={-1}
                  className="absolute inset-0"
                />
              )}
            </div>

            <div className="md:col-span-2">
              <p className="text-lg leading-relaxed text-neutral-300 md:text-xl">
                {leaned(NEWS.copy)}
              </p>
              {NEWS.link && (
                <Link
                  href={NEWS.link.href}
                  className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white transition-colors hover:border-white/60"
                >
                  {NEWS.link.label}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- RECENT PROJECTS --- */}
      <section className="border-b border-neutral-800 px-6 py-32 md:px-24">
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal} transition={{ duration: 0.6 }}>
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
              Recent projects
            </h2>
            <p className="mt-6 max-w-3xl text-3xl font-bold tracking-tighter text-white md:text-5xl">
              In the studio right now.
            </p>
          </motion.div>

          {/* Sides alternate so three stacked rows read as a sequence rather
              than as a list of identical cards. */}
          <div className="mt-20 flex flex-col gap-20 md:gap-28">
            {PROJECTS.map((project, i) => (
              <motion.article
                key={project.headline}
                {...reveal}
                transition={{ duration: 0.6 }}
                className={`flex flex-col gap-8 md:items-center md:gap-14 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900 md:w-1/2">
                  <NotableFrame media={project.media} stamp="feature" />
                </div>

                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold tracking-tighter text-white md:text-4xl">
                    {leaned(project.headline)}
                  </h3>
                  <p className="mt-5 leading-relaxed text-neutral-400 md:text-lg">
                    {leaned(project.copy)}
                  </p>
                  {project.link && (
                    <Link
                      href={project.link.href}
                      className="group mt-8 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-white transition-colors hover:text-neutral-400"
                    >
                      {project.link.label}
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
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
              href="mailto:graham@grahaphics.com?subject=Project%20inquiry"
              className="group inline-flex items-center gap-3 rounded-full bg-black px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-700"
            >
              graham@grahaphics.com
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
