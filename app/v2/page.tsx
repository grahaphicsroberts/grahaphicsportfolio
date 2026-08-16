"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Trophy } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AutoVideo from "../components/AutoVideo";

// ---------------------------------------------------------------------------
// CHAPTERS
// The scroll is written as a sequence of chapters. This list drives the fixed
// rail on the right edge, and each id is the anchor on its section.
// ---------------------------------------------------------------------------
const CHAPTERS = [
  { id: "open", label: "Open" },
  { id: "thesis", label: "The Idea" },
  { id: "arc", label: "The Arc" },
  { id: "collage", label: "In Volume" },
  { id: "hits", label: "The Work" },
  { id: "breadth", label: "The Range" },
  { id: "honors", label: "Recognition" },
  { id: "stage", label: "On Stage" },
  { id: "work", label: "Full Archive" },
];

// ---------------------------------------------------------------------------
// SHARED PIECES
// ---------------------------------------------------------------------------

/**
 * A muted background clip whose playback follows an `active` flag instead of
 * its own visibility. Inside a pinned stage every clip is technically on
 * screen, so an IntersectionObserver would leave them all decoding at once.
 */
function StageVideo({
  src,
  active,
  className,
}: {
  src: string;
  active: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);

  return (
    <video
      ref={ref}
      loop
      muted
      playsInline
      preload="metadata"
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

/**
 * Turns scroll position through a tall section into a step index, so a pinned
 * stage can advance through a set of items as the reader scrolls.
 */
function useStageIndex(
  ref: React.RefObject<HTMLElement | null>,
  count: number
) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [index, setIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(p * count)));
    setIndex((prev) => (prev === next ? prev : next));
  });

  return { index, progress: scrollYProgress };
}

/**
 * A band of oversized type sliding past. The set is duplicated and travels
 * exactly half the track width, so the loop has no seam.
 */
function TickerBand({
  items,
  duration = 34,
  reverse = false,
}: {
  items: string[];
  duration?: number;
  reverse?: boolean;
}) {
  return (
    <div className="relative overflow-hidden border-y border-neutral-900 bg-neutral-950 py-7">
      <motion.div
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="flex w-max items-center whitespace-nowrap"
      >
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center">
            <span className="text-3xl font-bold tracking-tighter text-neutral-300 md:text-5xl">
              {item}
            </span>
            <span className="mx-8 text-lg text-neutral-700 md:mx-12">
              &#9670;
            </span>
          </span>
        ))}
      </motion.div>
      {/* Feathered edges so the type slides out of view rather than cutting */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-neutral-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-neutral-950 to-transparent" />
    </div>
  );
}

const Eyebrow = ({
  children,
  className = "text-neutral-500",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`block font-mono text-xs uppercase tracking-[0.25em] ${className}`}
  >
    {children}
  </span>
);

// ---------------------------------------------------------------------------
// CHAPTER RAIL + PROGRESS
// ---------------------------------------------------------------------------

function ChapterRail({ active }: { active: string }) {
  return (
    <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex">
      {CHAPTERS.map((chapter) => {
        const isActive = active === chapter.id;
        return (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            className="group flex items-center gap-3"
          >
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-opacity duration-300 ${
                isActive
                  ? "text-white opacity-100"
                  : "text-neutral-400 opacity-0 group-hover:opacity-100"
              }`}
            >
              {chapter.label}
            </span>
            <span
              className={`h-px transition-all duration-300 ${
                isActive
                  ? "w-10 bg-white"
                  : "w-4 bg-neutral-600 group-hover:w-7 group-hover:bg-neutral-300"
              }`}
            />
          </a>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CHAPTER 1 — THE OPEN
// ---------------------------------------------------------------------------

const ROLES = [
  { text: "Director", gradient: "from-indigo-400 via-purple-400 to-pink-400" },
  { text: "Innovator", gradient: "from-cyan-400 via-blue-400 to-indigo-400" },
  { text: "Designer", gradient: "from-amber-400 via-orange-500 to-rose-500" },
  { text: "Storyteller", gradient: "from-emerald-400 via-teal-400 to-cyan-400" },
];

function OpenChapter() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The opening frame recedes as the reader leaves it, so the first scroll
  // reads as a deliberate move rather than a jump.
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const mediaOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // One role word lights up at a time, on a loop.
  const [lit, setLit] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setLit((prev) => (prev + 1) % ROLES.length),
      1800
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="open"
      ref={ref}
      className="relative flex h-screen w-full flex-col justify-center overflow-hidden bg-neutral-950"
    >
      <motion.div
        style={{ scale: mediaScale, opacity: mediaOpacity }}
        className="absolute inset-0 z-0"
      >
        <StageVideo
          src="/Kronos_lbrt-8966.mp4"
          active
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-neutral-950 via-neutral-950/50 to-neutral-950/10" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-48 bg-gradient-to-t from-neutral-950 to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-[1600px] px-6 md:px-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-[13vw] font-black leading-[0.82] tracking-tighter text-white sm:text-[10vw] lg:text-[8rem]">
            GRAHAM <br /> ROBERTS
          </h1>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-sm uppercase tracking-[0.2em] md:text-base">
            {ROLES.map((role, i) => (
              <span key={role.text} className="flex items-baseline gap-3">
                <span
                  className={`bg-gradient-to-r bg-clip-text transition-colors duration-700 ${
                    role.gradient
                  } ${lit === i ? "text-transparent" : "text-neutral-500"}`}
                >
                  {role.text}
                </span>
                {i < ROLES.length - 1 && (
                  <span className="text-neutral-700">/</span>
                )}
              </span>
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-lg font-light leading-relaxed text-neutral-300 md:text-2xl">
            A multidisciplinary design leader exploring how AI and emerging
            technologies can advance human&#8209;computer interaction.
          </p>
        </motion.div>
      </motion.div>

      <motion.a
        href="#thesis"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-10 left-6 z-10 flex items-center gap-3 text-white/50 transition-colors hover:text-white md:left-12"
      >
        <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
          Scroll &mdash; the whole story is one scroll long
        </span>
      </motion.a>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CHAPTER 2 — THE IDEA (scrubbed text reveal)
// ---------------------------------------------------------------------------

const THESIS =
  "Information design is a very human place, where we strive to understand the world around us, and to share that understanding in ever more efficient, effective, and engaging ways.";

function ThesisWord({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

function ThesisChapter() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const words = THESIS.split(" ");
  // The sentence finishes lighting up at 70% so the closing lines have room.
  const span = 0.7 / words.length;
  const tailOpacity = useTransform(scrollYProgress, [0.72, 0.85], [0, 1]);
  const tailY = useTransform(scrollYProgress, [0.72, 0.85], [24, 0]);

  return (
    <section
      id="thesis"
      ref={ref}
      className="relative h-[300vh] bg-neutral-950"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-1 font-serif text-3xl italic leading-[1.15] text-white md:text-5xl lg:text-6xl">
            {words.map((word, i) => (
              <ThesisWord
                key={`${word}-${i}`}
                progress={scrollYProgress}
                range={[i * span, i * span + span * 4]}
              >
                {word}
              </ThesisWord>
            ))}
          </p>

          <motion.div style={{ opacity: tailOpacity, y: tailY }}>
            <div className="mx-auto mt-12 h-px w-16 bg-neutral-700" />
            <p className="mx-auto mt-12 max-w-2xl text-lg leading-relaxed text-neutral-400 md:text-xl">
              I have spent my career in that space, leading teams to
              award-winning work across journalism, technology, marketing, and
              academia&mdash;guiding organizations through technological shifts,
              from the rise of mobile formats to the integration of generative
              AI.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CHAPTER 3 — THE ARC (sticky media, scrolling acts)
// ---------------------------------------------------------------------------

type ActMedia = { src: string; type: "video" | "image" };

const ACTS: {
  org: string;
  period: string;
  role: string;
  media: ActMedia[];
  alt: string;
  accent: string;
  copy: string;
  link: string;
  linkLabel: string;
}[] = [
  {
    org: "The New York Times",
    period: "A decade",
    role: "Director of Immersive Storytelling",
    media: [
      { src: "/snowfall-desktop.mp4", type: "video" },
      { src: "/antarctica-motion.mp4", type: "video" },
      { src: "/olympics-desktop.mp4", type: "video" },
      { src: "/ARteam.jpg", type: "image" },
    ],
    alt: "The New York Times newsroom",
    accent: "text-blue-400",
    copy: "My career tracked the rise of digital platforms, from Snow Fall through NYT VR. I then founded the immersive storytelling team and built the paper's augmented reality program from the ground up, directing a matrixed team of more than 50 designers, engineers, journalists, and marketers to launch it in six months.",
    link: "/nyt-ar",
    linkLabel: "The AR program",
  },
  {
    org: "Google",
    period: "Brand Studio",
    role: "Senior Creative Lead / Digital Design Lead",
    media: [
      { src: "/space-desktop.mp4", type: "video" },
      { src: "/yis-experience.mp4", type: "video" },
      { src: "/trends-redesign-hero.mp4", type: "video" },
      { src: "/google-about.jpg", type: "image" },
    ],
    alt: "Graham Roberts at Google",
    accent: "text-red-400",
    copy: "Search data is a mirror of society, and my role was to design the reflection. I defined the experience strategy that turned billions of Google Trends queries into narrative products, spanning global web platforms through to a voice-controlled installation inside Google's first retail store.",
    link: "/google-trends",
    linkLabel: "Google Trends work",
  },
  {
    org: "Havas",
    period: "Most recently",
    role: "EVP, Global Information Design",
    media: [
      { src: "/Havas_DSEclip.mp4", type: "video" },
      { src: "/Havas_LUPsyringe_dark.mp4", type: "video" },
      { src: "/Havas_microsphere.mp4", type: "video" },
      { src: "/havas-about.jpg", type: "image" },
    ],
    alt: "Havas health data concept",
    accent: "text-cyan-400",
    copy: "I built a global practice from the ground up, helping the world's leading healthcare organizations make dense clinical data legible. We operationalized emerging technology, from LLMs to spatial UI, and proved the art of the possible through high-fidelity interactive prototypes.",
    link: "/havas",
    linkLabel: "The health practice",
  },
];

function ArcChapter() {
  const ref = useRef<HTMLDivElement>(null);
  const { index } = useStageIndex(ref, ACTS.length);

  return (
    <section
      id="arc"
      ref={ref}
      className="relative border-t border-neutral-900 bg-neutral-950"
    >
      <div className="mx-auto grid max-w-[1700px] grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
        {/* Sticky collage: each act brings in its own set of work */}
        <div className="sticky top-0 hidden h-screen self-start overflow-hidden lg:block">
          {ACTS.map((act, i) => (
            <motion.div
              key={act.org}
              animate={{ opacity: index === i ? 1 : 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-3 p-8"
            >
              {act.media.map((item, j) => (
                <motion.div
                  key={item.src}
                  animate={{
                    opacity: index === i ? 1 : 0,
                    y: index === i ? 0 : 26,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: index === i ? j * 0.09 : 0,
                    ease: "easeOut",
                  }}
                  className="relative overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900"
                >
                  {item.type === "video" ? (
                    <StageVideo
                      src={item.src}
                      active={index === i}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={act.alt}
                      className="h-full w-full object-cover"
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          ))}

          {/* Act counter, pinned over the collage */}
          <div className="absolute bottom-10 left-10 z-10 rounded-full bg-black/60 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-white/80 backdrop-blur">
            Act {index + 1} of {ACTS.length}
          </div>
        </div>

        {/* The acts themselves */}
        <div>
          {ACTS.map((act, i) => (
            <div
              key={act.org}
              className="flex min-h-screen flex-col justify-center px-6 py-24 md:px-16 lg:px-20"
            >
              {i === 0 && (
                <Eyebrow className="mb-12 text-neutral-500">
                  Three chapters, one throughline
                </Eyebrow>
              )}

              {/* Inline collage on narrow screens, where the sticky panel is off */}
              <div className="mb-8 grid grid-cols-2 gap-2 lg:hidden">
                {act.media.map((item) => (
                  <div
                    key={item.src}
                    className="aspect-[4/3] overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900"
                  >
                    {item.type === "video" ? (
                      <AutoVideo
                        src={item.src}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.src}
                        alt={act.alt}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>

              <Eyebrow className={act.accent}>{act.period}</Eyebrow>
              <h2 className="mt-4 text-4xl font-bold tracking-tighter text-white md:text-6xl">
                {act.org}
              </h2>
              <p className="mt-4 text-lg text-neutral-500">{act.role}</p>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-300 md:text-xl">
                {act.copy}
              </p>
              <Link
                href={act.link}
                className="group mt-10 inline-flex w-fit items-center gap-3 border-b border-neutral-700 pb-1 font-mono text-xs uppercase tracking-[0.2em] text-neutral-300 transition-colors hover:border-white hover:text-white"
              >
                {act.linkLabel}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CHAPTER 4 — IN VOLUME (a drifting collage of the wider body of work)
// Deliberately small, light files: this is texture, not a gallery.
// ---------------------------------------------------------------------------

const MOSAIC: { src: string; type: "video" | "image"; aspect: string }[] = [
  { src: "/trends-redesign-hero.mp4", type: "video", aspect: "aspect-video" },
  { src: "/havas-work-2.mp4", type: "video", aspect: "aspect-[3/4]" },
  { src: "/FlareViz.mp4", type: "video", aspect: "aspect-square" },
  { src: "/pluto-motion.mp4", type: "video", aspect: "aspect-video" },
  { src: "/havas-work-3.mp4", type: "video", aspect: "aspect-square" },
  { src: "/trends-studio.mp4", type: "video", aspect: "aspect-video" },
  { src: "/interfaceExplorations.jpg", type: "image", aspect: "aspect-[4/3]" },
  { src: "/havas-work-9.mp4", type: "video", aspect: "aspect-[5/3]" },
  { src: "/PatientProfileViz.mp4", type: "video", aspect: "aspect-[4/3]" },
  { src: "/vr-sound.jpg", type: "image", aspect: "aspect-[3/2]" },
  { src: "/havas-work-10.mp4", type: "video", aspect: "aspect-[9/8]" },
  { src: "/Havas_microsphere.mp4", type: "video", aspect: "aspect-[2/1]" },
  { src: "/ARprototypePhones.png", type: "image", aspect: "aspect-[4/3]" },
  { src: "/havas-work-8.mp4", type: "video", aspect: "aspect-[9/16]" },
  { src: "/UIflowpinup.png", type: "image", aspect: "aspect-[3/2]" },
  { src: "/trends-snippets.jpg", type: "image", aspect: "aspect-[4/3]" },
];

const MOSAIC_SPEED = 26; // pixels per second

const MosaicGrid = () => (
  <div className="columns-2 gap-3 md:columns-4 lg:columns-5">
    {MOSAIC.map((item) => (
      <div
        key={item.src}
        className={`mb-3 w-full break-inside-avoid overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900 ${item.aspect}`}
      >
        {item.type === "video" ? (
          <AutoVideo src={item.src} className="h-full w-full object-cover" />
        ) : (
          <img
            src={item.src}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        )}
      </div>
    ))}
  </div>
);

function CollageChapter() {
  const blockRef = useRef<HTMLDivElement>(null);
  // The grid is rendered twice and travels the height of exactly one copy, so
  // the second copy lands where the first began and the drift never seams.
  const [blockHeight, setBlockHeight] = useState(0);

  useEffect(() => {
    const measure = () => setBlockHeight(blockRef.current?.offsetHeight ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section
      id="collage"
      className="relative h-screen overflow-hidden border-t border-neutral-900 bg-black"
    >
      <motion.div
        animate={{ y: blockHeight ? [0, -blockHeight] : 0 }}
        transition={{
          duration: Math.max(1, blockHeight / MOSAIC_SPEED),
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-x-0 top-0 px-3"
      >
        <div ref={blockRef}>
          <MosaicGrid />
        </div>
        <div aria-hidden="true">
          <MosaicGrid />
        </div>
      </motion.div>

      {/* Scrim, heaviest on the left where the copy sits */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />

      <div className="relative flex h-full items-center px-6 md:px-16 lg:px-24">
        <div className="max-w-xl">
          <Eyebrow className="text-neutral-400">In Volume</Eyebrow>
          <h2 className="mt-6 text-4xl font-bold leading-[1.02] tracking-tighter text-white md:text-6xl">
            Hundreds of pieces, <br /> one obsession.
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-neutral-300 md:text-xl">
            Prototypes, motion studies, interfaces, and reconstructions&mdash;
            produced across newsrooms, brand studios, and global health
            practices. The highlights are next.
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CHAPTER 5 — GREATEST HITS (pinned stage, scrubbed, full bleed)
// ---------------------------------------------------------------------------

const HITS = [
  {
    title: "Snow Fall",
    org: "The New York Times",
    honor: "Pulitzer Prize · Peabody Award",
    copy: "The project that coined the term scrollytelling. We broke the rigid CMS templates of the time to build a reading experience as fluid as the events it described.",
    video: "/snowfall-desktop.mp4",
    link: "/immersive-web#snow-fall",
  },
  {
    title: "Why Notre Dame Was a Tinderbox",
    org: "The New York Times",
    honor: "MoMA Permanent Collection",
    copy: "A 3D explanatory graphic of the cathedral's timber lattice, and how the fire moved through it. Now held in the permanent collection of the Museum of Modern Art.",
    video: "/notredame-desktop.mp4",
    link: "/immersive-web",
  },
  {
    title: "One Building, One Bomb",
    org: "The New York Times · AR",
    honor: "News & Doc Emmy",
    copy: "A forensic reconstruction built with Forensic Architecture, letting readers walk the roof where the bomb landed and examine the evidence themselves.",
    video: "/syria-desktop.mp4",
    link: "/nyt-ar#major-features",
  },
  {
    title: "Under a Cracked Sky",
    org: "The New York Times · VR",
    honor: "World Press Photo, First Prize",
    copy: "Diving beneath the Antarctic ice with the scientists measuring a warming ocean, in virtual reality.",
    video: "/antarctica-motion.mp4",
    link: "/nyt-vr#antarctica",
  },
  {
    title: "Four of the Best Olympians",
    org: "The New York Times · AR",
    honor: "SND Gold Medal",
    copy: "The first full spatial experience we shipped: athletes captured with photogrammetry, projected at real scale into the reader's own room.",
    video: "/olympics-desktop.mp4",
    link: "/nyt-ar#major-features",
  },
  {
    title: "Space to Belong",
    org: "Google",
    honor: "Anthem Award, Gold",
    copy: "A digital product built around belonging, and one of the clearest examples of search data shaped into something personal.",
    video: "/space-desktop.mp4",
    link: "/google-trends",
  },
  {
    title: "Year in Search: The Imagination Space",
    org: "Google · NYC Store",
    honor: "First out-of-home Year in Search",
    copy: "An interactive installation at the center of Google's first retail store, where visitors used voice to explore the searches that defined the year.",
    video: "/yis-experience.mp4",
    link: "/google-trends",
  },
  {
    title: "Disease State Education",
    org: "Havas",
    honor: "Health & biotech",
    copy: "Physicians are inundated with percentages. Shaping the data into the concepts it describes turns an abstract figure into something closer to an experience.",
    video: "/Havas_DSEclip.mp4",
    link: "/havas",
  },
];

function HitsChapter() {
  const ref = useRef<HTMLDivElement>(null);
  const { index } = useStageIndex(ref, HITS.length);
  const hit = HITS[index];

  return (
    <section
      id="hits"
      ref={ref}
      className="relative border-t border-neutral-900 bg-black"
      style={{ height: `${HITS.length * 90 + 30}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Full bleed media. Each clip is cropped to fill the screen, which is
            the tradeoff for the cinematic scale. */}
        {HITS.map((item, i) => (
          <motion.div
            key={item.video}
            animate={{
              opacity: index === i ? 1 : 0,
              scale: index === i ? 1 : 1.06,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <StageVideo
              src={item.video}
              active={index === i}
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}

        {/* Scrims: enough to hold type, not enough to kill the footage */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

        {/* Running count, top right of the frame */}
        <div className="absolute right-6 top-28 flex items-baseline gap-2 font-mono md:right-12">
          <span className="text-4xl font-bold text-white/90">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-xs uppercase tracking-[0.25em] text-white/50">
            / {String(HITS.length).padStart(2, "0")}
          </span>
        </div>

        {/* Copy, laid over the footage */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-20 md:px-12 md:pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={hit.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <Eyebrow className="text-white/60">{hit.org}</Eyebrow>
              <h2 className="mt-4 text-4xl font-bold leading-[0.95] tracking-tighter text-white drop-shadow-2xl md:text-6xl lg:text-7xl">
                {hit.title}
              </h2>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-black/50 px-3 py-1.5 backdrop-blur">
                  <Trophy
                    className="h-3.5 w-3.5 text-yellow-500"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-yellow-200">
                    {hit.honor}
                  </span>
                </div>
                <Link
                  href={hit.link}
                  className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white"
                >
                  <span className="border-b border-white/40 pb-1 transition-colors group-hover:border-white">
                    See the project
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>

              <p className="mt-6 max-w-xl leading-relaxed text-neutral-300 md:text-lg">
                {hit.copy}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step ticks */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {HITS.map((item, i) => (
            <span
              key={item.title}
              className={`h-[2px] transition-all duration-500 ${
                index === i ? "w-10 bg-white" : "w-4 bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CHAPTER 5 — THE RANGE
// ---------------------------------------------------------------------------

const CAPABILITIES = [
  {
    title: "AI-forward product strategy",
    copy: "Operationalizing emerging technology, from LLMs to spatial UI, as a practical part of the design process rather than a demo.",
  },
  {
    title: "Information design & data visualization",
    copy: "Making dense, technical datasets legible for audiences ranging from specialists to the general public.",
  },
  {
    title: "Spatial computing",
    copy: "AR and VR products shipped to a mass audience, including a new interaction grammar for news.",
  },
  {
    title: "Immersive storytelling",
    copy: "Editorial formats that blend text, video, 3D, and interaction into a single reading experience.",
  },
  {
    title: "Scalable UX systems",
    copy: "Frameworks and high-fidelity prototypes that let large organizations align before engineering begins.",
  },
  {
    title: "Design leadership",
    copy: "Building and directing multidisciplinary teams across newsrooms, brand studios, and global agencies.",
  },
];

function RangeChapter() {
  return (
    <section
      id="breadth"
      className="border-t border-neutral-900 bg-neutral-950 px-6 py-32 md:px-16 lg:px-24"
    >
      <div className="mx-auto max-w-[1400px]">
        <Eyebrow>The Range</Eyebrow>
        <h2 className="mt-6 max-w-3xl text-4xl font-bold tracking-tighter text-white md:text-6xl">
          Six things I am brought in to do.
        </h2>

        <div className="mt-20 grid grid-cols-1 gap-x-16 gap-y-px md:grid-cols-2">
          {CAPABILITIES.map((capability, i) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
              className="group border-t border-neutral-800 py-10 transition-colors hover:border-neutral-500"
            >
              <span className="font-mono text-xs text-neutral-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-neutral-200 transition-colors group-hover:text-white md:text-3xl">
                {capability.title}
              </h3>
              <p className="mt-4 max-w-md leading-relaxed text-neutral-500 transition-colors group-hover:text-neutral-400">
                {capability.copy}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CHAPTER 6 — RECOGNITION (marquee)
// ---------------------------------------------------------------------------

const HONORS = [
  { award: "Museum of Modern Art", project: "Why Notre Dame Was a Tinderbox" },
  { award: "Pulitzer Prize", project: "Snow Fall" },
  { award: "News & Doc Emmy", project: "One Building, One Bomb" },
  { award: "World Press Photo", project: "Under a Cracked Sky" },
  { award: "Edward R. Murrow", project: "Making a Hit" },
  { award: "Peabody Award", project: "Snow Fall" },
  { award: "Anthem Award, Gold", project: "Space to Belong" },
  { award: "SND Gold Medal", project: "Olympians in AR" },
];

const HonorItem = ({
  award,
  project,
}: {
  award: string;
  project: string;
}) => (
  <span className="flex shrink-0 items-baseline gap-5">
    <span className="text-3xl font-bold tracking-tighter text-white md:text-5xl">
      {award}
    </span>
    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 md:text-xs">
      {project}
    </span>
    <span className="text-lg text-neutral-700">&#9670;</span>
  </span>
);

function HonorsChapter() {
  // Two identical rows offset in opposite directions: the duplicated set makes
  // each row loop without a visible seam.
  const rows = [
    { items: HONORS, from: "0%", to: "-50%", duration: 40 },
    { items: [...HONORS].reverse(), from: "-50%", to: "0%", duration: 48 },
  ];

  return (
    <section
      id="honors"
      className="overflow-hidden border-t border-neutral-900 bg-neutral-900/20 py-32"
    >
      <div className="mb-16 px-6 md:px-16 lg:px-24">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Recognition</Eyebrow>
            <h2 className="mt-6 flex items-center gap-4 text-4xl font-bold tracking-tighter text-white md:text-6xl">
              <Trophy
                className="h-8 w-8 shrink-0 text-yellow-500"
                aria-hidden="true"
              />
              The short list.
            </h2>
          </div>
          <Link
            href="/recognition"
            className="group flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-white"
          >
            View the full archive
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        {rows.map((row, i) => (
          <motion.div
            key={i}
            animate={{ x: [row.from, row.to] }}
            transition={{
              duration: row.duration,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex w-max items-baseline gap-10 whitespace-nowrap"
          >
            {[...row.items, ...row.items].map((honor, j) => (
              <HonorItem
                key={`${honor.award}-${j}`}
                award={honor.award}
                project={honor.project}
              />
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CHAPTER 7 — ON STAGE
// ---------------------------------------------------------------------------

const ENGAGEMENTS = [
  {
    year: "2026",
    event: "INMA Global Media Awards",
    role: "Grand Jury",
    location: "Global",
  },
  {
    year: "2025",
    event: "Bridge Summit",
    role: "Keynote",
    location: "Abu Dhabi, UAE",
  },
  {
    year: "2025",
    event: "XPerts Series: Data Visualization",
    role: "Speaker",
    location: "Virtual",
  },
  {
    year: "2024",
    event: "Novartis Panel",
    role: "Panelist",
    location: "New York, NY",
  },
];

function StageChapter() {
  return (
    <section
      id="stage"
      className="relative overflow-hidden border-t border-neutral-900 bg-neutral-950"
    >
      <img
        src="/speaking-2.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-950/60" />

      <div className="relative mx-auto max-w-[1400px] px-6 py-32 md:px-16 lg:px-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>On Stage</Eyebrow>
            <h2 className="mt-6 text-4xl font-bold tracking-tighter text-white md:text-6xl">
              Talking about the craft.
            </h2>
          </div>
          <Link
            href="/speaking"
            className="group flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-white"
          >
            Full speaking archive
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ul className="mt-16 max-w-4xl">
          {ENGAGEMENTS.map((item) => (
            <motion.li
              key={item.event}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5 }}
              className="group flex flex-col justify-between gap-2 border-b border-neutral-800 py-6 transition-all hover:border-neutral-500 hover:pl-3 md:flex-row md:items-center"
            >
              <span className="text-xl font-medium text-neutral-300 transition-colors group-hover:text-white">
                {item.event}
              </span>
              <div className="flex items-center gap-4 font-mono text-sm text-neutral-500 md:gap-8">
                <span className="text-neutral-400">{item.role}</span>
                <span className="hidden h-1 w-1 rounded-full bg-neutral-700 md:inline-block" />
                <span>{item.location}</span>
                <span className="hidden h-1 w-1 rounded-full bg-neutral-700 md:inline-block" />
                <span>{item.year}</span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CHAPTER 8 — THE FULL ARCHIVE (categories, so nothing is buried)
// The id stays "work" so the existing nav link to /#work still lands here.
// ---------------------------------------------------------------------------

const CATEGORIES = [
  {
    title: "Health & BioTech Visualization",
    company: "Havas",
    image: "/havas-hero.jpg",
    link: "/havas",
  },
  {
    title: "Data Storytelling & Product Design",
    company: "Google / Brand Studio",
    image: "/google-hero.jpg",
    link: "/google-trends",
  },
  {
    title: "Spatial Computing, AR & Product Design",
    company: "The New York Times",
    image: "/AR-hero.jpg",
    link: "/nyt-ar",
  },
  {
    title: "VR Filmmaking & 3D Interface Design",
    company: "The New York Times",
    image: "/NYTVR_studioimage.png",
    link: "/nyt-vr",
  },
  {
    title: "Immersive Storytelling & Information Design",
    company: "The New York Times",
    image: "/immersive-hero.jpg",
    link: "/immersive-web",
  },
  {
    title: "Motion Design & Data Cinema",
    company: "The New York Times",
    image: "/video-hero.jpg",
    link: "/video-innovation",
  },
];

function ArchiveChapter() {
  return (
    <section
      id="work"
      className="scroll-mt-24 border-t border-neutral-900 bg-neutral-950 px-6 py-32 md:px-16 lg:px-24"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Full Archive</Eyebrow>
            <h2 className="mt-6 max-w-2xl text-4xl font-bold tracking-tighter text-white md:text-6xl">
              Go deeper, by category.
            </h2>
          </div>
          <p className="max-w-sm text-neutral-500">
            Six bodies of work, each with the projects, the process, and the
            behind-the-scenes.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, i) => (
            <motion.div
              key={category.link + category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
            >
              <Link href={category.link} className="group block">
                <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover opacity-75 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute right-4 top-4 rounded-full bg-black/50 p-2 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                    <ArrowUpRight
                      className="h-4 w-4 text-white"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  {category.company}
                </p>
                <h3 className="mt-2 text-xl font-bold leading-tight text-neutral-200 transition-colors group-hover:text-white">
                  {category.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------

const DISCIPLINES = [
  "Information Design",
  "Spatial Computing",
  "Data Visualization",
  "AI-Forward Product Strategy",
  "Immersive Storytelling",
  "Design Leadership",
];

const PLACES = [
  "The New York Times",
  "Google",
  "Havas",
  "MoMA",
  "Tribeca",
  "World Press Photo",
];

export default function ScrollHome() {
  const { scrollYProgress } = useScroll();
  const [activeChapter, setActiveChapter] = useState(CHAPTERS[0].id);

  // The active chapter is whichever section owns the middle band of the
  // viewport, which matches what the reader is actually looking at.
  useEffect(() => {
    const sections = CHAPTERS.map(({ id }) =>
      document.getElementById(id)
    ).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveChapter(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-neutral-950 font-sans text-neutral-100 selection:bg-white selection:text-black">
      <Navbar />

      {/* Scroll progress, hairline across the top */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-white/80"
      />

      <ChapterRail active={activeChapter} />

      <OpenChapter />
      <TickerBand items={DISCIPLINES} />
      <ThesisChapter />
      <ArcChapter />
      <CollageChapter />
      <HitsChapter />
      <RangeChapter />
      <HonorsChapter />
      <TickerBand items={PLACES} duration={44} reverse />
      <StageChapter />
      <ArchiveChapter />
      <Footer />
    </div>
  );
}
