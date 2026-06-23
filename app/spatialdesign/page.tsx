"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValueEvent,
  useMotionValue,
  useSpring,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import {
  ArrowLeft,
  Box,
  ArrowRight,
  ArrowUpRight,
  Award,
  Menu,
  X,
  Hexagon,
  Quote,
  Glasses,
  Newspaper,
  Cpu,
  Layout,
} from "lucide-react";
import Link from "next/link";

// --- DATA: MAIN HIGHLIGHTS (STACKED) ---
const HIGHLIGHTS = [
  {
    title: "Four of the Best Olympians",
    subtitle: "Spatial Analysis",
    description:
      "Analyzing the athletic prowess of Olympic champions using spatial analysis and volumetric video.",
    desktop: "/olympics-desktop.mp4",
    mobile: "/olympics-mobile.mp4",
    link: "https://www.nytimes.com/interactive/2018/02/05/sports/olympics/ar-augmented-reality-olympic-athletes-ul.html",
    awards: ["SND Gold Medal", "Lumiere Award Winner"],
  },
  {
    title: "David Bowie in 3 Dimensions",
    subtitle: "Cultural Heritage",
    description:
      "Exploring the costumes and artifacts of the legendary artist in your own space, in collaboration with the Bowie Archive.",
    desktop: "/bowie-desktop.mp4",
    mobile: "/bowie-mobile.mp4",
    link: "https://www.nytimes.com/interactive/2018/03/20/arts/design/bowie-costumes-ar-3d-ul.html",
    awards: ["Webby Award Winner", "Deadline Club Winner"],
  },
  {
    title: "One Building, One Bomb",
    subtitle: "Forensic Architecture",
    description:
      "Reconstructing a chemical weapons attack in Syria to prove culpability, winning a News & Documentary Emmy.",
    desktop: "/syria-desktop.mp4",
    mobile: "/syria-mobile.mp4",
    link: "https://www.nytimes.com/interactive/2018/06/24/world/middleeast/douma-syria-chemical-attack-augmented-reality-ar-ul.html",
    awards: ["News & Doc Emmy Winner"],
  },
];

// --- DATA: MORE AR PROJECTS (SIDE SCROLL) ---
const MORE_PROJECTS = [
  { title: "Mars Insight Lander", video: "/mars-mobile.mp4" },
  { title: "Ashley Graham Unfiltered", video: "/ashley-mobile.mp4" },
  { title: "Lady Liberty's Torch", video: "/torch-mobile.mp4" },
  { title: "Air Quality Index", video: "/aqi-mobile.mp4" },
  {
    title: "Great Performers: Lakeith Stanfield",
    video: "/lakeith-mobile.mp4",
  },
];

// --- PROTOTYPE SCROLLYTELLING: sticky video with text scrolling over it ---
const PROTOTYPE_BLOCKS = [
  "Our perspective was to maintain the feeling of a reading experience. It would feel and act like a regular article, but there would immediately be clues that it was new and different.",
  "A frosted-glass look would define the article design, with the camera turning on from the start. This would give an experience of scrolling the words over a window rather than a page.",
  "When an AR moment was scrolled into view, the “window” would suddenly clarify, and prompt a user to project the AR object into their space, and interact with it as if it were there.",
  "Interactive moments would then give the user more interesting ways to learn more about the objects in their space.",
];

function ScrollBlock({
  text,
  index,
  total,
  progress,
}: {
  text: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const slice = 1 / total;
  const start = index * slice;
  const end = start + slice;
  const fade = slice * 0.3;
  const opacity = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0]
  );
  // Move continuously with scroll so the block tracks the page scroll 1:1.
  const y = useTransform(progress, [start, end], ["45vh", "-45vh"]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-end px-6 lg:pr-[6%] pointer-events-none"
    >
      <p className="w-full max-w-sm text-lg md:text-xl font-medium leading-relaxed text-white rounded-2xl bg-black/50 backdrop-blur-md px-7 py-6 border border-white/10">
        {text}
      </p>
    </motion.div>
  );
}

type AnnotatedScrollBlock = {
  header?: string;
  body: string;
};

function AnnotatedScrollBlock({
  header,
  body,
  index,
  total,
  progress,
}: AnnotatedScrollBlock & {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const slice = 1 / total;
  const start = index * slice;
  const end = start + slice;
  const fade = slice * 0.3;
  const opacity = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [start, end], ["45vh", "-45vh"]);

  if (!header && !body) return null;

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-end px-6 lg:pr-[6%] pointer-events-none"
    >
      <div className="w-full max-w-sm rounded-2xl bg-black/50 backdrop-blur-md px-7 py-6 border border-white/10">
        {header ? (
          <p className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-3">
            {header}
          </p>
        ) : null}
        {body ? (
          <p className="text-lg md:text-xl font-medium leading-relaxed text-white">
            {body}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}

function PrototypeScrollytelling() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Track which text block is active for the dot navigation.
  const [activeBlock, setActiveBlock] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(
      PROTOTYPE_BLOCKS.length - 1,
      Math.max(0, Math.floor(v * PROTOTYPE_BLOCKS.length))
    );
    setActiveBlock(idx);
  });

  // Restart the video from the beginning whenever it re-enters the viewport.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView) {
      video.currentTime = 0;
      const playback = video.play();
      if (playback) playback.catch(() => {});
    } else {
      video.pause();
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      className="relative bg-black"
      style={{ height: `${(PROTOTYPE_BLOCKS.length + 1) * 100}vh` }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-black px-6"
      >
        <div className="relative w-full max-w-5xl max-h-[80vh] aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
          <video
            ref={videoRef}
            src="/AR_FirstPrototypeDemo.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="Screen recording of the first AR article prototype, showing a frosted-glass reading experience that clarifies into an interactive augmented reality scene"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none"
            aria-hidden="true"
          />
          <span className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs font-mono uppercase tracking-widest">
            First AR Prototype
          </span>
        </div>
        {PROTOTYPE_BLOCKS.map((text, i) => (
          <ScrollBlock
            key={i}
            text={text}
            index={i}
            total={PROTOTYPE_BLOCKS.length}
            progress={scrollYProgress}
          />
        ))}

        {/* Progress dot nav */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10"
          aria-hidden="true"
        >
          {PROTOTYPE_BLOCKS.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeBlock ? "w-6 bg-white" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- ENGINEERING DIAGRAM: tech partners flowing into a central NYT "T" ---
// Approximate centers of each partner circle in techPartnersArranged.png (in %).
const ENGINEERING_NODES = [
  { name: "Google", x: 21, y: 24 },
  { name: "Apple", x: 79, y: 24 },
  { name: "Microsoft", x: 21, y: 75 },
  { name: "Unity", x: 79, y: 75 },
];

function EngineeringDiagram() {
  const CX = 50;
  const CY = 51;
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-lg"
      role="img"
      aria-label="Google, Apple, Microsoft, and Unity logos arranged around a central New York Times T, with connections flowing inward."
    >
      {/* Luminance-to-alpha key: turns the black background transparent */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id="logo-key" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0.33 0.59 0.11 0 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Ambient glow behind the artwork */}
      <div
        className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/15 blur-3xl"
        aria-hidden="true"
      />

      {/* Partner artwork: black keyed to transparent, with a soft glow */}
      <img
        src="/techPartnersArranged.png"
        alt=""
        aria-hidden="true"
        className="relative w-full h-auto"
        style={{
          filter:
            "url(#logo-key) drop-shadow(0 0 18px rgba(56,189,248,0.4))",
        }}
      />

      {/* Animated connections flowing from each partner toward the T */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <filter id="eng-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="0.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#eng-glow)">
          {ENGINEERING_NODES.map((p, i) => {
            // Inset endpoints so the line clears the partner circle and the T.
            const sx0 = p.x + (CX - p.x) * 0.34;
            const sy0 = p.y + (CY - p.y) * 0.34;
            const ex = p.x + (CX - p.x) * 0.8;
            const ey = p.y + (CY - p.y) * 0.8;
            const mx = (sx0 + ex) / 2;
            const my = (sy0 + ey) / 2;
            const dx = ex - sx0;
            const dy = ey - sy0;
            const len = Math.hypot(dx, dy) || 1;
            const bow = 7;
            const cxp = mx + (-dy / len) * bow;
            const cyp = my + (dx / len) * bow;
            const d = `M ${sx0} ${sy0} Q ${cxp} ${cyp} ${ex} ${ey}`;
            return (
              <g key={p.name}>
                <linearGradient
                  id={`eng-grad-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={sx0}
                  y1={sy0}
                  x2={ex}
                  y2={ey}
                >
                  <stop offset="0" stopColor="#38bdf8" stopOpacity="0" />
                  <stop offset="0.35" stopColor="#38bdf8" stopOpacity="0.6" />
                  <stop offset="0.85" stopColor="#7dd3fc" stopOpacity="0.6" />
                  <stop offset="1" stopColor="#7dd3fc" stopOpacity="0" />
                </linearGradient>
                <path
                  id={`eng-flow-${i}`}
                  d={d}
                  fill="none"
                  stroke={`url(#eng-grad-${i})`}
                  strokeWidth="0.6"
                  strokeLinecap="round"
                />
                <circle r="0.85" fill="#bae6fd" fillOpacity="0.9">
                  <animateMotion
                    dur={`${2.4 + i * 0.4}s`}
                    repeatCount="indefinite"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                  >
                    <mpath href={`#eng-flow-${i}`} />
                  </animateMotion>
                </circle>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

// --- PHONE 3D MODEL: stacked depth + crossfading screen ---
const PHONE_SCREEN_A = "/Apple_AR_productDesign.png";
const PHONE_SCREEN_B = "/Apple_AR_productDesign_2.png";
const PHONE_CROSSFADE_STEP = 2; // step 3 (0-indexed): switch to screen B

function PhoneModel({
  progress,
  total,
  onMouseMove,
  onMouseLeave,
  children,
}: {
  progress: MotionValue<number>;
  total: number;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: () => void;
  children?: React.ReactNode;
}) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [14, -14]), {
    stiffness: 150,
    damping: 18,
  });
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-18, 18]), {
    stiffness: 150,
    damping: 18,
  });

  const slice = 1 / total;
  const crossfadeAt = (PHONE_CROSSFADE_STEP / total);
  const fade = slice * 0.35;
  const screenAOpacity = useTransform(
    progress,
    [0, crossfadeAt - fade / 2, crossfadeAt + fade / 2, 1],
    [1, 1, 0, 0]
  );
  const screenBOpacity = useTransform(
    progress,
    [0, crossfadeAt - fade / 2, crossfadeAt + fade / 2, 1],
    [0, 0, 1, 1]
  );

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
    onMouseMove?.(e);
  };
  const handleLeave = () => {
    px.set(0);
    py.set(0);
    onMouseLeave?.();
  };

  const corner = "rounded-[17px] md:rounded-[21px]";

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative [perspective:1200px]"
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      >
        <motion.div
          animate={{ y: [0, -14, 0], rotateZ: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="relative w-[240px] md:w-[300px] drop-shadow-2xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            {Array.from({ length: 42 }).map((_, k) => (
              <div
                key={k}
                aria-hidden="true"
                className={`absolute inset-0 ${corner}`}
                style={{
                  transform: `translateZ(-${(k + 1) * 1.1}px)`,
                  background:
                    "linear-gradient(180deg,#3a3a3f,#161618 55%,#2c2c30)",
                }}
              />
            ))}
            <div className="relative">
              <motion.img
                src={PHONE_SCREEN_A}
                alt="AR product design mockup: early UI with AR mode toggle and scale controls"
                style={{ opacity: screenAOpacity }}
                className={`absolute inset-0 block h-full w-full ${corner} select-none`}
                draggable={false}
              />
              <motion.img
                src={PHONE_SCREEN_B}
                alt="AR product design mockup: shipped minimal interface with essential controls"
                style={{ opacity: screenBOpacity }}
                className={`relative block w-full h-auto ${corner} select-none`}
                draggable={false}
              />
              {children}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function PhoneLeftPanel({
  progress,
  total,
}: {
  progress: MotionValue<number>;
  total: number;
}) {
  const slice = 1 / total;
  const crossfadeAt = PHONE_CROSSFADE_STEP / total;
  const fade = slice * 0.35;
  const initialOpacity = useTransform(
    progress,
    [0, crossfadeAt - fade / 2, crossfadeAt + fade / 2, 1],
    [1, 1, 0, 0]
  );
  const shippedOpacity = useTransform(
    progress,
    [0, crossfadeAt - fade / 2, crossfadeAt + fade / 2, 1],
    [0, 0, 1, 1]
  );

  return (
    <div className="relative z-10 w-full min-h-[5rem] md:min-h-[7rem] pointer-events-none">
      <motion.div
        style={{ opacity: initialOpacity }}
        className="absolute inset-0 flex items-center justify-center px-6"
      >
        <p className="text-xl md:text-3xl font-bold text-white tracking-tight">
          Initial UI
        </p>
      </motion.div>
      <motion.div
        style={{ opacity: shippedOpacity }}
        className="absolute inset-0 flex items-center justify-center px-6"
      >
        <div className="w-full max-w-sm text-left">
          <p className="text-xl md:text-2xl font-bold text-white tracking-tight mb-3">
            The inevitable interface
          </p>
          <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
            Reduced to the absolute essential. An interface that vanishes,
            allowing the spatial content to hold the user&apos;s complete focus.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function PhoneHighlightRing({
  progress,
  blockIndex,
  total,
  side,
  shape,
}: {
  progress: MotionValue<number>;
  blockIndex: number;
  total: number;
  side: "left" | "right";
  shape: "pill" | "circle";
}) {
  const slice = 1 / total;
  const start = blockIndex * slice;
  const end = start + slice;
  const fade = slice * 0.3;
  const opacity = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    [0.92, 1, 1, 0.92]
  );

  const position =
    side === "left" ? "left-[7%]" : "right-[calc(7%+2px)]";
  const dimensions =
    shape === "pill"
      ? "w-[30%] aspect-[2.35/1]"
      : "w-[12%] aspect-square";

  return (
    <motion.div
      style={{ opacity }}
      className={`absolute top-[calc(15%-5px)] ${position} ${dimensions} pointer-events-none`}
      aria-hidden="true"
    >
      <motion.div style={{ scale }} className="h-full w-full">
        <motion.div
          animate={{
            scale: [1, 1.045, 1],
            opacity: [0.72, 1, 0.72],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: blockIndex * 0.35,
          }}
          className="h-full w-full rounded-full border-2 border-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.55)]"
        />
      </motion.div>
    </motion.div>
  );
}

function PhoneFrostedGlow({
  progress,
  blockIndex,
  total,
}: {
  progress: MotionValue<number>;
  blockIndex: number;
  total: number;
}) {
  const slice = 1 / total;
  const start = blockIndex * slice;
  const end = start + slice;
  const fade = slice * 0.3;
  const opacity = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 overflow-hidden rounded-[17px] md:rounded-[21px] pointer-events-none"
      aria-hidden="true"
    >
      {/* Semi-transparent sky-blue wash */}
      <div className="absolute inset-0 bg-sky-400/20" />

      {/* Soft pulsing blue luminance — no stroke */}
      <motion.div
        animate={{ opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-sky-500/18 shadow-[0_0_32px_rgba(56,189,248,0.55),inset_0_0_44px_rgba(56,189,248,0.22)]"
      />
    </motion.div>
  );
}

// --- PHONE SCROLLYTELLING: sticky phone with annotated text blocks ---
const PHONE_BLOCKS: AnnotatedScrollBlock[] = [
  {
    header: "AR MODE TOGGLE",
    body: "Our first designs focused on a self-contained AR module that would include a switch for moving between AR and 3D modes for the object, essentially pulling it out of the environment and letting you manipulate it on screen.",
  },
  {
    header: "SCALE AND MOVE CONTROLS",
    body: "We also experimented with controls that allowed a user to move and scale the object in space.",
  },
  {
    body: "The shipped design was about maximizing simplicity and a UI that mostly got out of the way, while still providing the necessary functionality.",
  },
  {
    header: "FROSTED WINDOW AESTHETIC",
    body: "Key elements were getting the frosted window aesthetic dialed in just right, and editing and testing simple prompt language.",
  },
  { body: "" },
  { body: "" },
  { body: "" },
  { body: "" },
];

function PhoneScrollytelling() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [activeBlock, setActiveBlock] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(
      PHONE_BLOCKS.length - 1,
      Math.max(0, Math.floor(v * PHONE_BLOCKS.length))
    );
    setActiveBlock(idx);
  });

  return (
    <section
      ref={ref}
      className="relative bg-black"
      style={{ height: `${(PHONE_BLOCKS.length + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden grid w-full grid-cols-[1fr_auto_1fr] items-center bg-black px-6">
        {/* Ambient glow */}
        <div
          className="absolute left-1/2 top-1/2 h-[70%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/15 blur-3xl"
          aria-hidden="true"
        />

        {/* Left panel — crossfades at step 3 */}
        <PhoneLeftPanel
          progress={scrollYProgress}
          total={PHONE_BLOCKS.length}
        />

        <PhoneModel progress={scrollYProgress} total={PHONE_BLOCKS.length}>
          <PhoneHighlightRing
            progress={scrollYProgress}
            blockIndex={0}
            total={PHONE_BLOCKS.length}
            side="left"
            shape="pill"
          />
          <PhoneHighlightRing
            progress={scrollYProgress}
            blockIndex={1}
            total={PHONE_BLOCKS.length}
            side="right"
            shape="circle"
          />
          <PhoneFrostedGlow
            progress={scrollYProgress}
            blockIndex={3}
            total={PHONE_BLOCKS.length}
          />
        </PhoneModel>

        {/* Balance column (scroll blocks overlay on the right) */}
        <div aria-hidden="true" />

        {PHONE_BLOCKS.map((block, i) => (
          <AnnotatedScrollBlock
            key={i}
            header={block.header}
            body={block.body}
            index={i}
            total={PHONE_BLOCKS.length}
            progress={scrollYProgress}
          />
        ))}

        {/* Progress dot nav */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10"
          aria-hidden="true"
        >
          {PHONE_BLOCKS.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeBlock ? "w-6 bg-white" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function NYTARPage() {
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
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          <span className="font-bold tracking-tight">HOME</span>
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
            <X className="w-6 h-6" aria-hidden="true" />
          ) : (
            <Menu className="w-6 h-6" aria-hidden="true" />
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
            src="/AR-hero.jpg"
            alt="AR Technology Abstract"
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
        </motion.div>

        <motion.div
          style={{ opacity: textOpacity }}
          className="relative z-10 max-w-5xl"
        >
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono uppercase tracking-widest bg-black/50 backdrop-blur-md">
              Apple HI Design Team
            </span>
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono uppercase tracking-widest bg-black/50 backdrop-blur-md">
              Spatial Portfolio Review
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 leading-[0.9]">
            Pioneering Spatial Design UI/UX and Storytelling
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl leading-relaxed">
            Shipping the first AR enabled NYT apps, and leading groundbreaking new
            approaches to visual storytelling through augmented reality and 3D
            web features.
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
              <p className="text-lg text-white">
                Director of Immersive Storytelling
              </p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Team Size
              </h3>
              <p className="text-lg text-white">50+ (Cross-functional)</p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                Timeline
              </h3>
              <p className="text-lg text-white">Concept to Launch: 6 Months</p>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="prose prose-invert prose-lg text-neutral-300 leading-relaxed">
              <p className="text-2xl text-white font-medium mb-8 leading-tight">
                As director of immersive storytelling at The New York Times, I
                led a multi-year effort to bring AR to the NYT apps, and produce
                dozens of AR and 3D web features.
              </p>
              <p className="mb-6">
                The immersive storytelling team was founded and led by me, and
                this project went from concept to launch in just 6 months. It
                involved leading a massive project team of over 50 product
                designers, engineers, visual designers, journalists, and
                marketers to define a new grammar for news.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- AR INITIATIVE: THE CHALLENGE --- */}
      <section className="py-32 px-6 md:px-24 bg-neutral-950 border-b border-neutral-800">
        <div className="max-w-[1400px] mx-auto">
          {/* Centered intro */}
          <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-4">
              The AR Initiative
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Inventing a Spatial Grammar
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
              This initiative was the next chapter in a long tradition of visual
              storytelling at The Times — carrying decades of innovation in
              graphics, motion, and interactive design into product, and leaning
              fully into the future of spatial design and immersive experiences.
            </p>
          </div>

          {/* Visual paired with copy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Video */}
            <figure className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-800">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto bg-black"
                >
                  <source src="/ARcollision.mp4" type="video/mp4" />
                </video>
              </div>
              <figcaption className="mt-3 text-xs font-mono uppercase tracking-wider text-neutral-500">
                Screen recording of CERN particle detection AR experience
              </figcaption>
            </figure>

            {/* Copy */}
            <div className="order-1 lg:order-2 prose prose-invert prose-lg text-neutral-400">
              <p>
                The work needed to feel uniquely Timesian, and feel like an
                evolution from our past work. It needed to respect the user — our
                readers — and be simultaneously familiar, innovative, and useful.
                And it needed to live up to the high bar for journalism set by the
                organization.
              </p>
              <p>
                On the engineering side, that meant rendering real-time 3D and
                augmented reality reliably across a huge range of iOS and Android
                devices, keeping every experience performant and lightweight
                enough to ship inside a daily news app, and building authoring
                tools that let journalists and designers create spatial scenes at
                the pace of the newsroom.
              </p>
              <p>
                And because these features lived inside the much larger New York
                Times apps, every interaction had to work within existing
                constraints — the established design system, navigation patterns,
                and reading experience — introducing new spatial UI and UX
                without disrupting the core act of reading the news.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROTOTYPING --- */}
      <section className="relative py-32 px-6 md:px-24 border-b border-neutral-800 overflow-hidden">
        {/* Background: whiteboarding image, dimmed/faded */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img
            src="/ARwhiteboarding.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-950/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/20 to-neutral-950" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto">
          {/* Centered intro */}
          <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-4">
              Prototyping
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Developing the Prototype
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
              To start, we built a prototype. To pull this off at a legacy
              institution, we couldn&apos;t just use existing structures.
              Pioneering spatial computing required fundamentally rewiring how
              we built products&mdash;aligning engineering execution with an
              uncompromising design and editorial vision.
            </p>
          </div>

          {/* Paired: copy + insets on the left, team image on the right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left column: copy + process insets */}
            <div className="order-1">
              <div className="prose prose-invert prose-lg text-neutral-400">
                <p>
                  I led the architecture of a specialized, cross-functional
                  unit of engineers, product designers, and journalists.
                </p>
                <p>
                  My mandate for this team was twofold: drive an uncompromising
                  design vision that made complex 3D interactions feel entirely
                  invisible, and establish a new editorial grammar where
                  volumetric data wasn&apos;t a gimmick, but a rigorous,
                  foundational tool for reporting the news.
                </p>
              </div>

              {/* Process inset */}
              <figure className="mt-8">
                <img
                  src="/UIflowpinup.png"
                  alt="Printed end-to-end UI flow of the AR article experience pinned across a wall"
                  className="w-full h-auto rounded-lg border border-neutral-800"
                />
                <figcaption className="mt-3 text-xs font-mono uppercase tracking-wider text-neutral-500">
                  End-to-end UI flow
                </figcaption>
              </figure>
            </div>

            {/* Team image */}
            <figure className="order-2">
              <img
                src="/ARteam.jpg"
                alt="The New York Times AR team gathered around a phone, reviewing an early prototype"
                className="w-full h-auto rounded-2xl border border-neutral-800"
              />
              <figcaption className="mt-4 text-sm font-mono uppercase tracking-wider text-neutral-500">
                The cross-functional team — engineers, designers, and journalists
              </figcaption>
            </figure>
          </div>

          {/* Closing reading copy */}
          <div className="max-w-3xl mx-auto text-center mt-16 md:mt-24">
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
              We developed a prototype in Unity that would simulate the NYT app,
              and let us iterate on how the product would look and feel. I
              considered the project across three key dimensions:
            </p>
          </div>

          {/* Three key dimensions */}
          <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center px-4">
              <Newspaper
                className="w-8 h-8 text-neutral-300 mx-auto mb-4"
                aria-hidden="true"
              />
              <h3 className="text-lg font-bold text-white mb-2">
                Narrative Content
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Shaping the story itself — what readers experience, and how
                spatial elements deepen the reporting.
              </p>
            </div>
            <div className="text-center px-4">
              <Cpu
                className="w-8 h-8 text-neutral-300 mx-auto mb-4"
                aria-hidden="true"
              />
              <h3 className="text-lg font-bold text-white mb-2">Engineering</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Rendering real-time 3D and AR reliably and performantly across a
                huge range of devices.
              </p>
            </div>
            <div className="text-center px-4">
              <Layout
                className="w-8 h-8 text-neutral-300 mx-auto mb-4"
                aria-hidden="true"
              />
              <h3 className="text-lg font-bold text-white mb-2">
                Interface Design
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Introducing new spatial UI and UX within the constraints of the
                larger New York Times apps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROTOTYPE SCROLLYTELLING --- */}
      <PrototypeScrollytelling />

      {/* --- PILLAR 01: NARRATIVE CONTENT --- */}
      <section className="py-32 px-6 md:px-24 bg-black border-b border-neutral-800">
        <div className="max-w-3xl mx-auto text-center">
          <Newspaper
            className="w-10 h-10 text-neutral-600 mx-auto mb-6"
            aria-hidden="true"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-4">
            Pillar 01 — Narrative Content
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Breaking past the flat image
          </h2>
          <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
            To align the newsroom on the ‘why’ of this project, we had to prove
            that AR wasn’t a technological novelty&mdash;it had to be a rigorous
            journalistic tool.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <figure className="order-1 w-full overflow-hidden">
            <img
              src="/ARprototypePhones.png"
              alt="Two phones showing the AR prototype: a classical marble sculpture rendered at 1:1 scale in a reader's physical space, with article text overlaid"
              className="w-[124%] max-w-none h-auto -ml-[12%]"
            />
          </figure>

          {/* Copy */}
          <div className="order-2">
            <p className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-8">
              A traditional photograph flattens reality.
            </p>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
              We realized that by breaking past the physical limitations of a
              5-inch screen, we could use true 1:1 scale as a literal tool for
              understanding. By placing a volumetric object in the reader’s
              physical space, we transformed a passive graphic into an
              intuitive, humanistic interaction. We weren’t just working around
              the constraints of mobile;
            </p>
            <p className="mt-10 pl-6 border-l-2 border-neutral-700 text-2xl md:text-3xl font-medium text-white leading-snug">
              We were actively establishing how visual journalism will operate
              in the era of spatial computing.
            </p>
          </div>
        </div>
      </section>

      {/* --- PILLAR 02: ENGINEERING --- */}
      <section className="py-24 px-6 md:px-24 border-b border-neutral-800 bg-gradient-to-b from-neutral-950 via-sky-950/25 to-neutral-950">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div className="order-2 lg:order-1">
            <Cpu className="w-10 h-10 text-neutral-500 mb-6" aria-hidden="true" />
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-4">
              Pillar 02 — Engineering
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Multi-platform Alignment
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
              We orchestrated a multi-platform consensus&mdash;aligning
              engineering teams across Apple, Google, Unity, and Microsoft to
              architect a lightweight, performance-optimized 3D pipeline directly
              into our core native applications.
            </p>
            <p className="mt-6 text-lg md:text-xl text-neutral-400 leading-relaxed">
              Lightweight solutions were the priority. We used SceneKit to
              develop 3D scenes on iOS, and worked with Google to create a
              custom version of RenderCore on Android. Later, we worked with
              Microsoft&apos;s engineers to layer in their volumetric video SDK.
            </p>
          </div>

          {/* Diagram */}
          <div className="order-1 lg:order-2">
            <EngineeringDiagram />
          </div>
        </div>
      </section>

      {/* --- PILLAR 03: INTERFACE DESIGN --- */}
      <section className="py-24 px-6 md:px-24 bg-black border-b border-neutral-800">
        <div className="max-w-3xl mx-auto text-center">
          <Layout
            className="w-10 h-10 text-neutral-600 mx-auto mb-6"
            aria-hidden="true"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-4">
            Pillar 03 — Interface Design
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Exploring new territories in interface design
          </h2>
          <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
            To build an experience where the technology completely vanishes, we
            first had to navigate the friction. I led our interdisciplinary
            teams through these rapid prototyping cycles with one relentless
            objective: reduction. We had to take complex surface-scanning
            mechanics, permissions, and brutal mobile constraints, and
            rigorously edit them down until the interaction felt entirely human
            and intuitive.
          </p>
        </div>

        <figure className="mt-12 md:mt-16">
          <figcaption className="mb-4 text-center text-xs font-mono uppercase tracking-widest text-neutral-500">
            Early UI/UX designs
          </figcaption>
          <div className="relative w-full aspect-[2026/560] overflow-hidden">
            <img
              src="/interfaceExplorations.jpg"
              alt="A sequence of phone screens showing the AR green turtle experience, from camera permissions and surface scanning to placing and exploring a life-sized sea turtle"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center 34%" }}
            />
          </div>
        </figure>

        <div className="max-w-3xl mx-auto mt-12 md:mt-16 text-center">
          <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
            In designing the AR window, we needed to balance AR and 3D web
            versions of the experience.
          </p>
        </div>
      </section>

      {/* --- PHONE SCROLLYTELLING --- */}
      <PhoneScrollytelling />

      {/* --- CHAPTER 1: THE LAUNCH (UPDATED ORDER) --- */}
      <section className="py-32 px-6 md:px-24 bg-white text-black border-b border-neutral-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* TEXT COLUMN */}
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 text-blue-600">
              <Box className="w-6 h-6" aria-hidden="true" />
              <span className="font-bold tracking-tight uppercase">
                The Launch
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter leading-tight">
              Hello, World. <br /> Meet the "Honor Box."
            </h2>

            <div className="prose prose-lg text-neutral-600 mb-12">
              <p className="mb-6">
                We launched the feature with an article that explains to users
                why we were building an AR capability. This was also our first
                AR-enabled article.
              </p>
              <p className="mb-6">
                It had a very simple "example" where users could project what is
                called an "honor box" or vintage NYT vending machine into their
                space: a bit of a wink showcasing our newest technology by
                presenting our oldest technology: print.
              </p>
            </div>

            {/* --- MOBILE VIDEO (VISIBLE ONLY ON MOBILE) --- */}
            {/* Placed here to scroll naturally between paragraphs and the footer image */}
            <div className="md:hidden relative flex justify-center py-12">
              <div className="relative w-[300px] aspect-[9/19] bg-black rounded-[3rem] border-8 border-neutral-900 overflow-hidden shadow-2xl shadow-neutral-400/50 ring-1 ring-neutral-950/50">
                <div className="absolute top-0 w-full h-8 z-20 flex justify-center items-center pointer-events-none">
                  <div className="w-20 h-6 bg-black rounded-b-xl" />
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover bg-neutral-900"
                >
                  <source src="/honor-box-mobile.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="absolute -z-10 top-12 -right-12 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50" />
              <div className="absolute -z-10 bottom-12 -left-12 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50" />
            </div>

            {/* Footer Content */}
            <div className="flex flex-row items-start gap-6 border-t border-neutral-200 pt-8">
              <div className="w-1/3 shrink-0">
                <img
                  src="/honorbox-social.JPG"
                  alt="Social media reaction"
                  className="w-full aspect-[3/5] object-cover rounded-lg shadow-lg"
                />
              </div>
              <p className="text-base md:text-lg text-black font-medium leading-relaxed">
                This initial launch was very successful, and we saw the honor
                box appear in living rooms and kitchens across the world,
                driving many new positive camera permissions in the new app, and
                generating a lot of organic sharing on social and in the media.
              </p>
            </div>
          </div>

          {/* --- DESKTOP VIDEO (VISIBLE ONLY ON DESKTOP) --- */}
          {/* Kept sticky for the side-by-side layout */}
          <div className="hidden md:flex relative justify-center pt-12 md:pt-0 sticky top-32">
            <div className="relative w-[350px] aspect-[9/19] bg-black rounded-[3rem] border-8 border-neutral-900 overflow-hidden shadow-2xl shadow-neutral-400/50 ring-1 ring-neutral-950/50">
              <div className="absolute top-0 w-full h-8 z-20 flex justify-center items-center pointer-events-none">
                <div className="w-20 h-6 bg-black rounded-b-xl" />
              </div>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover bg-neutral-900"
              >
                <source src="/honor-box-mobile.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Background Orbs */}
            <div className="absolute -z-10 top-12 -right-12 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50" />
            <div className="absolute -z-10 bottom-12 -left-12 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50" />
          </div>
        </div>
      </section>

      {/* --- CHAPTER 2: STACKED HIGHLIGHTS --- */}
      <section id="major-features" className="py-32 bg-neutral-900 scroll-mt-24">
        {/* Section Header */}
        <div className="px-6 md:px-24 mb-24 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Major Features
          </h2>
          <p className="text-xl text-neutral-400 leading-relaxed">
            Following the launch, we produced a series of high-fidelity
            immersive journalism pieces. These projects set the standard for
            mobile AR, combining volumetric capture, photogrammetry, and spatial
            data analysis.
          </p>
        </div>

        <div className="space-y-32">
          {HIGHLIGHTS.map((project, index) => (
            <div
              key={index}
              className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12"
            >
              {/* Project Text */}
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <div className="font-mono text-blue-500 text-sm uppercase tracking-widest mb-3">
                  0{index + 1} — {project.subtitle}
                </div>
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {project.title}
                </h3>

                {/* AWARD TAGS */}
                {project.awards && (
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {project.awards.map((award, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-xs font-mono uppercase tracking-wider"
                      >
                        <Award className="w-3 h-3" aria-hidden="true" />
                        {award}
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto mb-8">
                  {project.description}
                </p>

                {/* --- NEW PROJECT LINK BUTTON --- */}
                {project.link && (
                  <div className="flex justify-center">
                    <Link
                      href={project.link}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors text-sm font-mono uppercase tracking-wider"
                    >
                      Launch Experience <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Visuals Row */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full">
                {/* Mobile Frame */}
                <div className="relative shrink-0 w-[240px] md:w-[320px] aspect-[9/19] bg-black rounded-[2.5rem] border-[8px] border-neutral-800 overflow-hidden shadow-2xl z-20">
                  <div className="absolute top-0 w-full h-6 z-20 flex justify-center items-center pointer-events-none">
                    <div className="w-20 h-5 bg-black rounded-b-lg" />
                  </div>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover bg-neutral-900"
                  >
                    <source src={project.mobile} type="video/mp4" />
                  </video>
                </div>

                {/* Desktop Frame */}
                <div className="relative shrink-0 w-full md:w-[600px] lg:w-[800px] aspect-video bg-black rounded-[2rem] border-[8px] border-neutral-800 overflow-hidden shadow-2xl z-10">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover bg-neutral-900"
                  >
                    <source src={project.desktop} type="video/mp4" />
                  </video>
                </div>
              </div>

              {/* Divider (except last) */}
              {index !== HIGHLIGHTS.length - 1 && (
                <div className="w-24 h-px bg-neutral-800 mx-auto mt-32" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- SPATIAL COMPUTING / MAGIC LEAP --- */}
      <section className="relative py-32 overflow-hidden border-y border-indigo-500/20 bg-gradient-to-b from-neutral-950 via-indigo-900/50 to-neutral-950">
        {/* Color-block ambient accent */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Centered Header */}
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <Hexagon className="w-10 h-10 text-indigo-400 mx-auto mb-6" aria-hidden="true" />
          <p className="font-mono text-xs uppercase tracking-widest text-indigo-300/80 mb-4">
            Spatial Computing / Magic Leap
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Designing the Spatial Article
          </h2>

          {/* Metadata Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              "Hardware: Magic Leap One",
              "Distribution: Helio Browser",
              "Capture: 700-pt Photogrammetry",
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-indigo-500/10 border border-indigo-400/20 rounded-full font-mono text-xs uppercase tracking-wider text-indigo-200/80"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Short lead-in before the visual */}
          <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto">
            Reimagining a New York Times article as a fully spatial experience —
            built side-by-side with Magic Leap and launched as the very first
            news story on the headset.
          </p>
        </div>

        {/* Centered Hero Video — screen capture from the headset */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 mt-20">
          {/* Hologram ambient glow */}
          <div
            className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <figure className="relative">
            {/* Headset viewport chrome */}
            <div className="relative overflow-hidden rounded-[2rem] border border-indigo-400/30 bg-black shadow-2xl shadow-indigo-950/50">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-video object-cover bg-black"
              >
                <source src="/MagicLeap_Guatemala.mp4" type="video/mp4" />
              </video>

              {/* Top HUD status bar */}
              <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 py-3 bg-gradient-to-b from-black/70 to-transparent text-[11px] md:text-xs font-mono uppercase tracking-wider text-neutral-200 pointer-events-none">
                <div className="flex items-center gap-2">
                  <Glasses className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                  <span>Magic Leap One · Creator Edition</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-200">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
                  <span>Live Screen Capture</span>
                </div>
              </div>

              {/* AR HUD corner brackets */}
              <div className="absolute inset-4 md:inset-6 z-10 pointer-events-none" aria-hidden="true">
                <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-indigo-400/60 rounded-tl-md" />
                <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-indigo-400/60 rounded-tr-md" />
                <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-indigo-400/60 rounded-bl-md" />
                <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-indigo-400/60 rounded-br-md" />
              </div>
            </div>
            <figcaption className="mt-4 text-center text-sm font-mono uppercase tracking-wider text-neutral-500">
              The reader&apos;s view through the Magic Leap One Creator Edition
              headset
            </figcaption>
          </figure>
        </div>

        {/* Narrative copy + speaking image (two-column for a more dynamic feel) */}
        <div className="max-w-6xl mx-auto px-6 lg:px-12 mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Speaking image */}
            <figure className="order-2 lg:order-1">
              <img
                src="/GuatemalaTalk.jpeg"
                alt="Graham Roberts presenting the Guatemala spatial article on stage at the XR For Change Summit in 2018"
                className="w-full rounded-[2rem] border border-neutral-800 object-cover"
              />
              <figcaption className="mt-4 text-sm font-mono uppercase tracking-wider text-neutral-500">
                Presenting the project at the XR For Change Summit, 2018
              </figcaption>
            </figure>

            {/* Narrative copy */}
            <div className="order-1 lg:order-2 prose prose-invert prose-lg text-neutral-400">
              <p>
                To explore the future of immersive reading, we brought a
                specialized team down to Magic Leap&apos;s headquarters in
                Florida. Working side-by-side with their engineering and design
                teams, we investigated what a New York Times article might look
                like as a fully spatial experience.
              </p>
              <p>
                We chose to prototype a breaking news event: the devastating 2018
                volcanic eruption in Guatemala. We trained a stringer
                photographer on the ground to capture 700 precise photos of a
                truck buried in ash, which we then processed into a 1:1 scale 3D
                model using photogrammetry.
              </p>
              <p>
                Launching as the very first news story available on the Magic
                Leap One headset, the design successfully mixed the traditional
                reading experience with 3D exploration, utilizing the physical
                space around the reader to convey the immense scale of the
                disaster.
              </p>
            </div>
          </div>
        </div>

        {/* Press Quotes Grid */}
        <div className="max-w-6xl mx-auto px-6 lg:px-12 mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "A glimpse into the future of journalism, using the physical space around you as a canvas.",
                publication: "The Verge",
              },
              {
                quote:
                  "The New York Times is defining what spatial storytelling looks like on Magic Leap.",
                publication: "Fast Company",
              },
              {
                quote:
                  "Mixing breaking news with spatial computing to convey the immense scale of a disaster.",
                publication: "TechCrunch",
              },
            ].map(({ quote, publication }) => (
              <div
                key={publication}
                className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8"
              >
                <Quote className="w-5 h-5 text-neutral-600 mb-4" aria-hidden="true" />
                <p className="text-lg text-neutral-300 italic">{quote}</p>
                <p className="text-sm font-mono uppercase text-neutral-500 mt-4">
                  {publication}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CHAPTER 3: MORE AR PROJECTS (SIDE SCROLL) --- */}
      <section className="py-24 bg-neutral-950 border-t border-neutral-900 overflow-hidden">
        <div className="px-6 md:px-12 mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              More AR Projects
            </h2>
            <p className="text-neutral-500">
              A collection of mobile-first experiments
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-neutral-600 font-mono text-xs uppercase tracking-widest animate-pulse">
            Scroll <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-8 overflow-x-auto pb-12 px-6 md:px-12 snap-x scrollbar-hide">
          {MORE_PROJECTS.map((project, i) => (
            <div
              key={i}
              className="shrink-0 snap-center flex flex-col items-center gap-6"
            >
              {/* Phone Frame */}
              <div className="relative w-[260px] aspect-[9/19] bg-black rounded-[2.5rem] border-[6px] border-neutral-800 overflow-hidden shadow-lg group">
                <div className="absolute top-0 w-full h-5 z-20 flex justify-center items-center pointer-events-none">
                  <div className="w-16 h-4 bg-black rounded-b-lg" />
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 ${
                    project.title === "Mars Insight Lander"
                      ? "scale-[1.04]"
                      : ""
                  }`}
                >
                  <source src={project.video} type="video/mp4" />
                </video>
              </div>

              <span className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                {project.title}
              </span>
            </div>
          ))}

          {/* Padding for scroll end */}
          <div className="w-12 shrink-0" />
        </div>
      </section>

      {/* --- PULL QUOTE --- */}
      <section className="py-24 px-6 md:px-24 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8">
            "The Times displayed innovation in AR reporting under Roberts'
            leadership."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-neutral-700" />
            <cite className="text-neutral-500 font-mono text-sm uppercase tracking-widest not-italic">
              Next Reality
            </cite>
            <div className="h-px w-12 bg-neutral-700" />
          </div>
        </div>
      </section>

      {/* --- CHAPTER 4: SPEAKING / CONCLUSION --- */}
      <section className="py-24 px-6 md:px-24 bg-white text-black">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-6">Advancing the Medium</h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-6">
              I have had the privilege of sharing our learnings and strategies
              for immersive journalism at conferences around the world.
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed">
              From defining the "grammar" of AR news to building
              cross-functional teams that can deliver 3D on deadline, the work
              we did at the Times helped set the stage for the spatial web.
            </p>
          </div>

          <div className="md:w-1/2 order-1 md:order-2">
            <img
              src="/IMG_3108-11441.JPG"
              alt="Graham Roberts speaking"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <section className="py-24 px-6 text-center border-t border-neutral-900 bg-neutral-950">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors font-mono text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Selected Works
        </Link>
      </section>
    </div>
  );
}