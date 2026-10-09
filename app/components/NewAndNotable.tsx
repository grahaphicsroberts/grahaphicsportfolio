"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import AutoVideo from "./AutoVideo";

// How long one lockup holds the banner before the next one takes it.
const HOLD = 5000;

// How far a lockup slides as it arrives and leaves. Small, because this sits
// directly under the hero and a banner that throws itself across the screen
// every five seconds reads as an advertisement.
const TRAVEL = 24;

// Titles of works are set in italics, but the text has to survive as a plain
// string as well: the dot that jumps to a lockup is labelled with its headline.
// So *asterisks* mark what leans over, and the markers are stripped for labels.
const ITALIC = /(\*[^*]+\*)/;

function leaned(text: string) {
  return text.split(ITALIC).map((piece, index) =>
    ITALIC.test(piece) ? (
      <em key={index} className="italic">
        {piece.slice(1, -1)}
      </em>
    ) : (
      piece
    ),
  );
}

function plain(text: string) {
  return text.replace(/\*/g, "");
}

type Lockup = {
  eyebrow: string;
  headline: string;
  copy: string;
  // `veil` is for work that can be mentioned but not shown. The file in
  // public/ is already blurred past legibility — the stamp labels it, it does
  // not protect it — and `tone` says which way a veiled frame needs pushing:
  // dark media gets lifted so the panel is not just a black rectangle.
  media: {
    src: string;
    kind: "image" | "video";
    alt: string;
    veil?: string;
    tone?: "light" | "dark";
  };
  link?: { href: string; label: string };
};

// What the banner is carrying. Edit this list and nothing else: order here is
// the order on screen, and `link` can be dropped from any entry that has
// nowhere to point.
const LOCKUPS: Lockup[] = [
  {
    eyebrow: "On view at MoMA",
    headline: "Work featured in the Museum of Modern Art",
    copy: "*Full Disclosure: The Edge of Information Design* features my forensic reconstruction of the 2019 fire at Notre Dame, through June 2027.",
    media: {
      src: "/NotreDameMoMA.jpg",
      kind: "image",
      alt: "The Notre Dame reconstruction on a screen in a MoMA gallery.",
    },
    link: { href: "/immersive-web#notre-dame", label: "See the project" },
  },
  {
    eyebrow: "In the studio",
    headline: "Visualization at the AI frontier",
    copy: "Recently the studio has explored translating AI policy research with Google DeepMind.",
    media: {
      src: "/deepmindProposal.jpg",
      kind: "image",
      alt: "",
      veil: "Under NDA",
      tone: "dark",
    },
    link: { href: "/studio", label: "Visit the studio" },
  },
  {
    eyebrow: "In the studio",
    headline: "The launch of *snkrwavs*",
    copy: "Grahaphics studio presents *snkrwavs*, an original music + visualization art project. The first interactive song is now live.",
    media: {
      src: "/snkrwavs_carousel.mp4",
      kind: "video",
      alt: "",
    },
    link: { href: "/snkrwavs/sharp-knife", label: "Hear the first song" },
  },
  {
    eyebrow: "In the studio",
    headline: "Digital storytelling sprint for Kimberly-Clark",
    copy: "The studio recently completed a project in partnership with sprint facilitator Mesa to highlight a ground-breaking absorption technology.",
    media: {
      src: "/KC_mesa_caroussel.mp4",
      kind: "video",
      alt: "",
      veil: "Under NDA",
    },
    link: { href: "/studio", label: "Visit the studio" },
  },
];

// Arriving from the side it is travelling toward, and leaving the other way.
const SLIDE = {
  enter: (travel: number) => ({ opacity: 0, x: travel }),
  held: { opacity: 1, x: 0 },
  gone: (travel: number) => ({ opacity: 0, x: -travel }),
};

export default function NewAndNotable() {
  const [at, setAt] = useState(0);
  const [way, setWay] = useState(1);
  const [stopped, setStopped] = useState(false);
  const [still, setStill] = useState(false);
  const [today, setToday] = useState("");

  // Read on the client, because a date baked in at build time is the date of the
  // last deploy rather than today's.
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    );
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setStill(query.matches);

    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  const show = useCallback((next: number, heading: number) => {
    setWay(heading);
    setAt((next + LOCKUPS.length) % LOCKUPS.length);
  }, []);

  // The wait, keyed on which lockup is up: asking for one by hand gives it a
  // full five seconds rather than the tail of the last wait. Nothing rotates
  // under a hand, under a keyboard, or for anyone who has asked for less motion.
  useEffect(() => {
    if (stopped || still || LOCKUPS.length < 2) return;

    const timer = setTimeout(() => show(at + 1, 1), HOLD);
    return () => clearTimeout(timer);
  }, [at, show, still, stopped]);

  const lockup = LOCKUPS[at];
  const { veil, tone } = lockup.media;

  // The blur lives in the asset itself, not here: a CSS filter leaves the
  // original a URL away. What is left to do is a matter of tone — a frame that
  // was already dark collapses into nothing, so it gets lifted.
  const veiled = veil && tone === "dark" ? "brightness-[1.6] saturate-150" : "";
  const scrim = tone === "dark" ? "bg-black/20" : "bg-black/40";
  const travel = still ? 0 : TRAVEL * way;

  return (
    <section
      aria-label="New and notable"
      aria-roledescription="carousel"
      className="bg-neutral-950 px-6 pb-8 pt-6 md:px-12 md:pb-12 md:pt-10"
      onMouseEnter={() => setStopped(true)}
      onMouseLeave={() => setStopped(false)}
      onFocus={() => setStopped(true)}
      onBlur={() => setStopped(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") show(at - 1, -1);
        if (event.key === "ArrowRight") show(at + 1, 1);
      }}
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-3 flex items-baseline justify-between gap-4 md:mb-5">
          <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
            New &amp; Notable
          </h2>
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-neutral-500 md:text-xs">
            {today}
          </span>
        </div>

        {/* The banner holds the same height whichever lockup is up and however
            long its copy runs, so the work below it never moves. The copy is
            clamped to fit rather than allowed to push anything down. On a phone
            the media sits above the copy instead of beside it: a 132px-wide
            column left the words nowhere to go, and a full-width strip costs
            less height than it looks like it does. */}
        <div className="relative h-[280px] overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/40 sm:h-[212px] lg:h-[236px]">
          <AnimatePresence custom={travel} initial={false}>
            <motion.div
              key={at}
              custom={travel}
              variants={SLIDE}
              initial="enter"
              animate="held"
              exit="gone"
              transition={{ duration: still ? 0.2 : 0.5, ease: "easeOut" }}
              role="group"
              aria-label={`${at + 1} of ${LOCKUPS.length}`}
              className="absolute inset-0 flex flex-col sm:flex-row"
            >
              <div className="relative h-[116px] w-full shrink-0 overflow-hidden bg-neutral-900 sm:h-full sm:w-[260px] lg:w-[420px]">
                {/* A veiled frame is scaled up before it is blurred, so the
                    soft edge the filter leaves behind falls outside the panel
                    rather than feathering against its border. */}
                {lockup.media.kind === "video" ? (
                  <AutoVideo
                    src={lockup.media.src}
                    className={`h-full w-full object-cover ${veiled}`}
                    aria-hidden="true"
                  />
                ) : (
                  <img
                    src={lockup.media.src}
                    alt={veil ? "" : lockup.media.alt}
                    className={`h-full w-full object-cover ${veiled}`}
                  />
                )}

                {veil && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center px-2 ${scrim}`}
                  >
                    <span className="rounded-full border border-white/30 bg-black/50 px-2 py-1 text-center font-mono text-[0.55rem] font-bold uppercase leading-none tracking-widest text-white/90 sm:px-3 sm:py-1.5 sm:text-[0.6rem] lg:text-xs">
                      {veil}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3 sm:gap-2 sm:px-6 lg:px-10">
                {/* One line, always: a label that wrapped would eat into the
                    room the headline is counting on. */}
                <p className="line-clamp-1 font-mono text-[0.65rem] uppercase tracking-widest text-neutral-500 sm:text-xs">
                  {lockup.eyebrow}
                </p>
                <h3 className="line-clamp-2 text-base font-bold leading-tight text-white sm:text-xl sm:leading-snug lg:text-3xl">
                  {leaned(lockup.headline)}
                </h3>
                <p className="line-clamp-3 text-xs leading-snug text-neutral-400 sm:text-sm lg:text-base lg:leading-relaxed">
                  {leaned(lockup.copy)}
                </p>
                {lockup.link && (
                  <Link
                    href={lockup.link.href}
                    className="group mt-0.5 inline-flex w-fit items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-widest text-white transition-colors hover:text-neutral-400 sm:text-xs"
                  >
                    <span>{lockup.link.label}</span>
                    <ArrowUpRight
                      className="h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 md:mt-4">
          <button
            type="button"
            onClick={() => show(at - 1, -1)}
            aria-label="Previous"
            className="rounded-full p-2 text-neutral-500 transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          {LOCKUPS.map((item, index) => (
            <button
              key={item.headline}
              type="button"
              onClick={() => show(index, index > at ? 1 : -1)}
              aria-label={plain(item.headline)}
              aria-current={index === at ? "true" : undefined}
              className="group p-3 sm:p-2"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  index === at
                    ? "w-6 bg-white"
                    : "w-2 bg-white/30 group-hover:bg-white/60"
                }`}
              />
            </button>
          ))}

          <button
            type="button"
            onClick={() => show(at + 1, 1)}
            aria-label="Next"
            className="rounded-full p-2 text-neutral-500 transition-colors hover:text-white"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
