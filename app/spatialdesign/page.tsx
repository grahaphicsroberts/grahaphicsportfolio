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
      "The first full spatial experience we shipped was produced for the Olympics — after many rounds of ideation, we arrived at the idea to scan the top athletes competing that year using photogrammetry, creating an experience where you could project them at real scale into your space, and learn about their sport while they were frozen mid performance.",
    desktop: "/olympics-desktop.mp4",
    mobile: "/olympics-mobile.mp4",
    link: "https://www.nytimes.com/interactive/2018/02/05/sports/olympics/ar-augmented-reality-olympic-athletes-ul.html",
    awards: ["SND Gold Medal", "Lumiere Award Winner"],
  },
  {
    title: "David Bowie in 3 Dimensions",
    subtitle: "Cultural Heritage",
    description: [
      "On top of this product development we were then able to create dozens of projects, and 2 solid years of innovative award winning visual storytelling using spatial principles across a variety of topics, like this culture project on David Bowie, looking at a new exhibit of his iconic fashion pieces. Here we could bring the museum experience to users in high fidelity.",
      "We were obsessive about getting every detail right, recreating the experience of the material down to the way it sparkled or shined, developing custom shaders that would look highly realistic on mobile devices. We also created guidelines and a tech stack for capturing and processing real world objects through photogrammetry, which became a key supporting technology for our approach.",
    ],
    desktop: "/bowie-desktop.mp4",
    mobile: "/bowie-mobile.mp4",
    link: "https://www.nytimes.com/interactive/2018/03/20/arts/design/bowie-costumes-ar-3d-ul.html",
    awards: ["Webby Award Winner", "Deadline Club Winner"],
  },
  {
    title: "One Building, One Bomb",
    subtitle: "Forensic Architecture",
    description:
      "This Emmy award winning visual investigation of an attack in Syria uses a 3D reconstruction of the crime scene in partnership with Forensic Architecture. Here, in what could be perceived as closer to a VR experience, a user can walk around the roof where the bomb landed, and investigate the evidence themselves, navigating to \"flags\" indicating perspectives of interest.",
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
  // Mobile split is rendered from ONE decoded video painted into two canvases,
  // so there's no second decoder to contend on mobile and the halves stay synced.
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const topCanvasRef = useRef<HTMLCanvasElement>(null);
  const botCanvasRef = useRef<HTMLCanvasElement>(null);
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

  // Play/restart the relevant video when the section enters view, pause when it
  // leaves. Desktop uses one on-screen video; mobile decodes a single hidden
  // video and paints its left/right halves into two stacked canvases.
  useEffect(() => {
    const desktop = videoRef.current;
    const src = mobileVideoRef.current;
    const playFrom0 = (v: HTMLVideoElement | null) => {
      if (!v) return;
      v.currentTime = 0;
      const p = v.play();
      if (p) p.catch(() => {});
    };

    if (!inView) {
      desktop?.pause();
      src?.pause();
      return;
    }

    playFrom0(desktop);
    playFrom0(src);

    // Paint the single decoded frame into both halves on every animation frame.
    const topC = topCanvasRef.current;
    const botC = botCanvasRef.current;
    if (!src || !topC || !botC) return;
    const topCtx = topC.getContext("2d");
    const botCtx = botC.getContext("2d");
    if (!topCtx || !botCtx) return;

    let raf = 0;
    const draw = () => {
      const vw = src.videoWidth;
      const vh = src.videoHeight;
      if (vw && vh) {
        const halfW = Math.floor(vw / 2);
        if (topC.width !== halfW) {
          topC.width = halfW;
          topC.height = vh;
          botC.width = halfW;
          botC.height = vh;
        }
        // Top canvas = left half of the frame; bottom canvas = right half.
        topCtx.drawImage(src, 0, 0, halfW, vh, 0, 0, halfW, vh);
        botCtx.drawImage(src, vw - halfW, 0, halfW, vh, 0, 0, halfW, vh);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
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
        {/* Desktop: single 16:9 video */}
        <div className="hidden md:block relative w-full max-w-5xl max-h-[80vh] aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
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

        {/* Mobile: the same clip split into stacked left/right halves so it can
            fill the vertical space at a larger size. */}
        <div
          className="md:hidden flex flex-col items-center"
          aria-label="Screen recording of the first AR article prototype, shown as a stacked split of the left and right halves of the frame"
          role="img"
        >
          <span className="mb-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs font-mono uppercase tracking-widest">
            First AR Prototype
          </span>
          {/* Single decoded source (kept rendered but invisible so it keeps
              decoding on mobile); its frames are drawn into the two canvases.
              data-no-observe keeps the page-level video pauser from touching it. */}
          <video
            ref={mobileVideoRef}
            src="/AR_FirstPrototypeDemo.mp4"
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            data-no-observe="true"
            className="pointer-events-none absolute h-px w-px opacity-0"
          />
          <div className="relative h-[36vh] aspect-[8/9] mx-auto overflow-hidden rounded-t-2xl border border-b-0 border-white/10 shadow-2xl">
            <canvas
              ref={topCanvasRef}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <div className="relative h-[36vh] aspect-[8/9] mx-auto overflow-hidden rounded-b-2xl border border-white/10 shadow-2xl">
            <canvas
              ref={botCanvasRef}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
            />
          </div>
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
      {/* Ambient glow behind the artwork */}
      <div
        className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/15 blur-3xl"
        aria-hidden="true"
      />

      {/* Partner artwork. The black background is pre-keyed to transparency in the
          PNG itself (baked luminance-to-alpha), so no runtime SVG url() filter is
          needed. That filter was triggering a mobile-GPU paint artifact (a stray
          box at the page's top-left). Only the soft glow remains as a CSS filter. */}
      <img
        src="/techPartnersArranged-keyed.png"
        alt=""
        aria-hidden="true"
        className="relative w-full h-auto"
        style={{
          filter: "drop-shadow(0 0 18px rgba(56,189,248,0.4))",
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

// Drive a pair of motion values from the device's orientation sensor so 3D
// objects react to phone tilt on touch devices, mirroring desktop mouse-move
// tilt. No-op on non-touch devices, so desktop behavior is unchanged.
function useDeviceTilt(px: MotionValue<number>, py: MotionValue<number>) {
  useEffect(() => {
    if (typeof window === "undefined" || !window.DeviceOrientationEvent) return;
    const isTouch = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;
    if (!isTouch) return;

    let baseBeta: number | null = null;
    const clamp = (v: number) => Math.max(-0.5, Math.min(0.5, v));

    const handle = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0; // left/right tilt, -90..90
      const beta = e.beta ?? 0; // front/back tilt
      if (baseBeta === null) baseBeta = beta; // calibrate to holding angle
      px.set(clamp(gamma / 45));
      py.set(clamp((beta - baseBeta) / 45));
    };

    const attach = () =>
      window.addEventListener("deviceorientation", handle, true);

    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };

    let cleanupGesture: (() => void) | undefined;
    if (typeof DOE.requestPermission === "function") {
      // iOS 13+ requires permission, granted from a user gesture.
      const onGesture = () => {
        DOE.requestPermission?.()
          .then((res) => {
            if (res === "granted") attach();
          })
          .catch(() => {});
        cleanupGesture?.();
      };
      window.addEventListener("touchend", onGesture, { once: true });
      window.addEventListener("click", onGesture, { once: true });
      cleanupGesture = () => {
        window.removeEventListener("touchend", onGesture);
        window.removeEventListener("click", onGesture);
      };
    } else {
      attach();
    }

    return () => {
      window.removeEventListener("deviceorientation", handle, true);
      cleanupGesture?.();
    };
  }, [px, py]);
}

// --- PHONE 3D MODEL: stacked depth + crossfading screen ---
const PHONE_SCREEN_A = "/Apple_AR_productDesign.png";
const PHONE_SCREEN_B = "/Apple_AR_productDesign_2.png";
const PHONE_SCREEN_C = "/Apple_AR_productDesign_3.png";
const PHONE_CROSSFADE_STEP = 2; // step 3 (0-indexed): switch to screen B
const PHONE_CROSSFADE_STEP_2 = 7; // step 8 (0-indexed): switch to screen C

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
  useDeviceTilt(px, py);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [14, -14]), {
    stiffness: 150,
    damping: 18,
  });
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-18, 18]), {
    stiffness: 150,
    damping: 18,
  });

  const slice = 1 / total;
  const cf1 = PHONE_CROSSFADE_STEP / total;
  const cf2 = PHONE_CROSSFADE_STEP_2 / total;
  const fade = slice * 0.35;
  const screenAOpacity = useTransform(
    progress,
    [0, cf1 - fade / 2, cf1 + fade / 2, 1],
    [1, 1, 0, 0]
  );
  const screenBOpacity = useTransform(
    progress,
    [0, cf1 - fade / 2, cf1 + fade / 2, cf2 - fade / 2, cf2 + fade / 2, 1],
    [0, 0, 1, 1, 0, 0]
  );
  const screenCOpacity = useTransform(
    progress,
    [0, cf2 - fade / 2, cf2 + fade / 2, 1],
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
              <motion.img
                src={PHONE_SCREEN_C}
                alt="AR product design mockup: zoned interaction view with a life-sized hand and 'Lean in close to see' prompt"
                style={{ opacity: screenCOpacity }}
                className={`absolute inset-0 block h-full w-full ${corner} select-none`}
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

// 3D "movie screen on the moon": a tilted lunar floor with the video standing on
// it, reacting subtly to mouse movement and gently floating like the phone model.
function MoonscapeScreen() {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  useDeviceTilt(px, py);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), {
    stiffness: 120,
    damping: 20,
  });
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), {
    stiffness: 120,
    damping: 20,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative mx-auto w-full max-w-5xl [perspective:1600px]"
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* Lunar surface receding behind / below the screen. Hidden on mobile so
            the floor doesn't crop the video — there we just show the full clip. */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute left-1/2 top-[52%] h-[720px] w-[200%] origin-top"
          style={{
            transform: "translateX(-50%) rotateX(74deg)",
            backgroundImage: [
              // Craters: each built from overlapping, irregular ellipses so the
              // rims read as jagged/lumpy rather than perfect circles.
              "radial-gradient(ellipse 38px 26px at 28% 20%, rgba(0,0,0,0.5) 0 58%, rgba(255,255,255,0.13) 82%, transparent 100%)",
              "radial-gradient(ellipse 22px 32px at 31% 21%, rgba(0,0,0,0.34) 0 60%, transparent 88%)",
              "radial-gradient(ellipse 56px 40px at 64% 31%, rgba(0,0,0,0.46) 0 60%, rgba(255,255,255,0.1) 84%, transparent 100%)",
              "radial-gradient(ellipse 34px 50px at 67% 28%, rgba(0,0,0,0.3) 0 58%, transparent 86%)",
              "radial-gradient(ellipse 84px 60px at 44% 48%, rgba(0,0,0,0.42) 0 62%, rgba(255,255,255,0.09) 85%, transparent 100%)",
              "radial-gradient(ellipse 52px 78px at 47% 51%, rgba(0,0,0,0.26) 0 60%, transparent 88%)",
              "radial-gradient(ellipse 48px 34px at 82% 58%, rgba(0,0,0,0.45) 0 60%, rgba(255,255,255,0.1) 84%, transparent 100%)",
              "radial-gradient(ellipse 30px 44px at 80% 60%, rgba(0,0,0,0.3) 0 58%, transparent 86%)",
              "radial-gradient(ellipse 32px 24px at 16% 52%, rgba(0,0,0,0.4) 0 58%, rgba(255,255,255,0.1) 82%, transparent 100%)",
              "radial-gradient(ellipse 62px 44px at 72% 72%, rgba(0,0,0,0.38) 0 62%, rgba(255,255,255,0.08) 85%, transparent 100%)",
              "radial-gradient(ellipse 40px 60px at 74% 74%, rgba(0,0,0,0.24) 0 60%, transparent 88%)",
              "radial-gradient(ellipse 42px 30px at 36% 78%, rgba(0,0,0,0.36) 0 60%, rgba(255,255,255,0.08) 84%, transparent 100%)",
              "radial-gradient(ellipse 24px 20px at 54% 14%, rgba(0,0,0,0.42) 0 58%, rgba(255,255,255,0.1) 82%, transparent 100%)",
              // Fine regolith mottling
              "radial-gradient(ellipse 60% 40% at 50% 35%, rgba(255,255,255,0.05), transparent 60%)",
              // Base regolith, lit from the far horizon
              "radial-gradient(80% 70% at 50% 0%, #8a8a92 0%, #5b5b63 24%, #34343b 50%, #18181d 74%, #08080a 100%)",
            ].join(","),
          }}
        />

        {/* Soft contact shadow grounding the screen on the surface */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute left-1/2 top-[56%] h-24 w-[70%] rounded-[50%] bg-black/70 blur-2xl"
          style={{ transform: "translate(-50%,0) translateZ(-40px)" }}
        />

        {/* The screen, lifted forward off the surface and gently floating */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d", z: 60 }}
          className="relative z-10 mx-auto w-full"
        >
          {/* Ambient glow cast by the bright screen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-8 bg-gradient-to-tr from-indigo-500/25 via-blue-400/15 to-transparent blur-3xl"
          />
          <div className="relative overflow-hidden rounded-2xl border border-neutral-700/80 shadow-[0_50px_140px_rgba(0,0,0,0.85)]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="block aspect-video md:aspect-[3/2] w-full bg-black object-cover object-center md:object-[center_calc(50%_-_150px)]"
            >
              <source src="/Apollo_TheMill.mp4" type="video/mp4" />
            </video>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Magic Leap "put on the headset" reveal: two stereoscopic lenses play the
// video doubled and separated, then converge and fuse into a single merged
// video as you scroll the section into view (like sliding the headset on).
function MagicLeapHeadsetReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "center 0.5"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  // Lenses slide from far apart to a slight overlap at center.
  const leftX = useTransform(p, [0, 0.75], ["-58%", "9%"]);
  const rightX = useTransform(p, [0, 0.75], ["58%", "-9%"]);
  const lensScale = useTransform(p, [0, 0.75], [0.7, 1.06]);
  const lensOpacity = useTransform(p, [0.6, 0.9], [1, 0]);
  const bezelOpacity = useTransform(p, [0, 0.5], [0.9, 0]);
  const finalOpacity = useTransform(p, [0.72, 0.96], [0, 1]);
  const hintOpacity = useTransform(p, [0, 0.12, 0.4], [1, 1, 0]);

  // Visor housing sweeps down over the eyes, peaks during the "put on" motion,
  // then recedes to a faint vignette so the video reads cleanly once you're in.
  const visorOpacity = useTransform(p, [0.22, 0.62, 0.82, 1], [0, 1, 1, 0.14]);
  const visorScale = useTransform(p, [0.22, 0.88], [1.32, 1]);
  const visorY = useTransform(p, [0.22, 0.88], ["-12%", "0%"]);

  const lensVignette = {
    boxShadow: "inset 0 0 70px 22px rgba(0,0,0,0.65)",
  } as const;

  return (
    <div ref={ref} className="relative">
      {/* Hologram ambient glow */}
      <div
        className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <figure className="relative">
        <div className="relative aspect-[3/4] md:aspect-video overflow-hidden rounded-[2rem] border border-indigo-400/30 bg-black shadow-2xl shadow-indigo-950/50">
          {/* Merged single video — the fused result once the headset is on */}
          <motion.video
            style={{ opacity: finalOpacity }}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/MagicLeap_Guatemala.mp4" type="video/mp4" />
          </motion.video>

          {/* Stereoscopic lens pair */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <motion.div
              style={{ x: leftX, scale: lensScale, opacity: lensOpacity }}
              className="relative w-[46%] aspect-square overflow-hidden rounded-full ring-1 ring-indigo-300/20 md:w-auto md:h-[88%]"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              >
                <source src="/MagicLeap_Guatemala.mp4" type="video/mp4" />
              </video>
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={lensVignette}
              />
            </motion.div>
            <motion.div
              style={{ x: rightX, scale: lensScale, opacity: lensOpacity }}
              className="relative w-[46%] aspect-square overflow-hidden rounded-full ring-1 ring-indigo-300/20 md:w-auto md:h-[88%]"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              >
                <source src="/MagicLeap_Guatemala.mp4" type="video/mp4" />
              </video>
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={lensVignette}
              />
            </motion.div>
          </div>

          {/* Nose-bridge bezel between the two lenses */}
          <motion.div
            style={{ opacity: bezelOpacity }}
            className="absolute top-1/2 left-1/2 z-10 h-20 w-12 -translate-x-1/2 -translate-y-1/2 rounded-b-[2rem] bg-neutral-950/80 blur-[2px]"
            aria-hidden="true"
          />

          {/* Visor housing — the goggles interior dropping over the eyes.
              Hidden on mobile, where the tall crop distorts its geometry. */}
          <motion.div
            style={{ opacity: visorOpacity, scale: visorScale, y: visorY }}
            className="absolute inset-0 z-[15] pointer-events-none hidden md:block"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 160 90"
              preserveAspectRatio="xMidYMid slice"
              className="h-full w-full"
            >
              <defs>
                <radialGradient id="ml-eye" cx="50%" cy="50%" r="50%">
                  <stop offset="60%" stopColor="black" />
                  <stop offset="100%" stopColor="white" />
                </radialGradient>
                <mask id="ml-visor-mask">
                  <rect width="160" height="90" fill="white" />
                  <ellipse cx="55" cy="45" rx="33" ry="35" fill="url(#ml-eye)" />
                  <ellipse cx="105" cy="45" rx="33" ry="35" fill="url(#ml-eye)" />
                </mask>
                <linearGradient id="ml-housing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#13131c" />
                  <stop offset="48%" stopColor="#050507" />
                  <stop offset="100%" stopColor="#0d0d16" />
                </linearGradient>
              </defs>
              <rect
                width="160"
                height="90"
                fill="url(#ml-housing)"
                mask="url(#ml-visor-mask)"
              />
            </svg>

            {/* Glowing lens rims around each eye opening */}
            <div
              className="absolute rounded-full ring-1 ring-indigo-400/25 shadow-[0_0_45px_rgba(99,102,241,0.28)]"
              style={{
                left: "34%",
                top: "50%",
                width: "41%",
                height: "78%",
                transform: "translate(-50%,-50%)",
              }}
            />
            <div
              className="absolute rounded-full ring-1 ring-indigo-400/25 shadow-[0_0_45px_rgba(99,102,241,0.28)]"
              style={{
                left: "66%",
                top: "50%",
                width: "41%",
                height: "78%",
                transform: "translate(-50%,-50%)",
              }}
            />
          </motion.div>

          {/* HUD chrome — fades in once the headset is fully on */}
          <motion.div style={{ opacity: finalOpacity }}>
            {/* Top HUD status bar */}
            <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 py-3 bg-gradient-to-b from-black/70 to-transparent text-[11px] md:text-xs font-mono uppercase tracking-wider text-neutral-200 pointer-events-none">
              <div className="flex items-center gap-2">
                <Glasses className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                <span>Magic Leap One · Creator Edition</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-200">
                <span
                  className="w-2 h-2 rounded-full bg-red-500 animate-pulse"
                  aria-hidden="true"
                />
                <span>Live Screen Capture</span>
              </div>
            </div>

            {/* AR HUD corner brackets */}
            <div
              className="absolute inset-4 md:inset-6 z-10 pointer-events-none"
              aria-hidden="true"
            >
              <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-indigo-400/60 rounded-tl-md" />
              <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-indigo-400/60 rounded-tr-md" />
              <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-indigo-400/60 rounded-bl-md" />
              <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-indigo-400/60 rounded-br-md" />
            </div>
          </motion.div>

          {/* Scroll hint while the headset is still "off" */}
          <motion.div
            style={{ opacity: hintOpacity }}
            className="absolute bottom-5 inset-x-0 z-20 text-center text-[11px] font-mono uppercase tracking-widest text-indigo-200/70 pointer-events-none"
          >
            Scroll to put on the headset
          </motion.div>
        </div>
        <figcaption className="mt-4 text-center text-sm font-mono uppercase tracking-wider text-neutral-500">
          The reader&apos;s view through the Magic Leap One Creator Edition
          headset
        </figcaption>
      </figure>
    </div>
  );
}

// Floor-perspective zone map: 4 quadrants that highlight clockwise on a loop.
function QuadrantDiagram() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % 4), 1100);
    return () => clearInterval(id);
  }, []);

  // Order is clockwise from top-left: 1 = TL, 2 = TR, 3 = BR, 4 = BL.
  const wedges = [
    { d: "M50,50 L4,50 A46,46 0 0 1 50,4 Z", lx: 30, ly: 30 },
    { d: "M50,50 L50,4 A46,46 0 0 1 96,50 Z", lx: 70, ly: 30 },
    { d: "M50,50 L96,50 A46,46 0 0 1 50,96 Z", lx: 70, ly: 70 },
    { d: "M50,50 L50,96 A46,46 0 0 1 4,50 Z", lx: 30, ly: 70 },
  ];

  const ZoneSvg = () => (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      {wedges.map((w, i) => (
        <path
          key={i}
          d={w.d}
          fill="#38bdf8"
          fillOpacity={active === i ? 0.55 : 0.08}
          stroke="#38bdf8"
          strokeWidth="0.6"
          strokeOpacity="0.45"
          style={{ transition: "fill-opacity 0.4s ease" }}
        />
      ))}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="1.5"
      />
      {wedges.map((w, i) => (
        <text
          key={i}
          x={w.lx}
          y={w.ly}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="11"
          fontFamily="monospace"
          fontWeight="bold"
          fill={active === i ? "#fff" : "#7dd3fc"}
          style={{ transition: "fill 0.4s ease" }}
        >
          {i + 1}
        </text>
      ))}
    </svg>
  );

  return (
    <>
      {/* Mobile: compact, flat zone map that fits in the top header */}
      <div className="md:hidden relative shrink-0 mt-2 w-28 h-28">
        <ZoneSvg />
      </div>

      {/* Desktop: large floor-perspective zone map */}
      <div className="hidden md:block relative shrink-0 -mt-20 w-[30rem] h-[30rem] [perspective:900px]">
        <div className="absolute inset-0 [transform:rotateX(62deg)] [transform-style:preserve-3d]">
          <ZoneSvg />
        </div>
      </div>
    </>
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
  const cf1 = PHONE_CROSSFADE_STEP / total;
  const cf2 = PHONE_CROSSFADE_STEP_2 / total;
  const fade = slice * 0.35;
  const initialOpacity = useTransform(
    progress,
    [0, cf1 - fade / 2, cf1 + fade / 2, 1],
    [1, 1, 0, 0]
  );
  const shippedOpacity = useTransform(
    progress,
    [0, cf1 - fade / 2, cf1 + fade / 2, cf2 - fade / 2, cf2 + fade / 2, 1],
    [0, 0, 1, 1, 0, 0]
  );
  const movementOpacity = useTransform(
    progress,
    [0, cf2 - fade / 2, cf2 + fade / 2, 1],
    [0, 0, 1, 1]
  );

  return (
    <div className="relative z-10 w-full min-h-[11rem] md:min-h-[7rem] pointer-events-none">
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
      <motion.div
        style={{ opacity: movementOpacity }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-6"
      >
        <p className="text-xl md:text-2xl font-bold text-white tracking-tight text-center">
          Interaction through spatial movement
        </p>
        <QuadrantDiagram />
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
  offsetX = 0,
  offsetY = 0,
}: {
  progress: MotionValue<number>;
  blockIndex: number;
  total: number;
  side: "left" | "right";
  shape: "pill" | "pill-narrow" | "circle";
  offsetX?: number;
  offsetY?: number;
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
      : shape === "pill-narrow"
        ? "w-[19%] aspect-[1.9/1]"
        : "w-[12%] aspect-square";

  // Positive offsetX always moves the ring rightward, regardless of anchor side.
  const horizontalOffset =
    side === "left" ? { marginLeft: offsetX } : { marginRight: -offsetX };

  return (
    <motion.div
      style={{ opacity, ...horizontalOffset, marginTop: offsetY }}
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
          className="h-full w-full rounded-full border-2 border-sky-400 bg-sky-400/40 shadow-[0_0_16px_rgba(56,189,248,0.55)]"
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

function PhonePlacementHighlight({
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
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      {/* Wide pill around the "Tap to place" button */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.03, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[calc(18%+2px)] right-[calc(18%-2px)] top-[calc(68%+8px)] h-[5.4%] rounded-full border-2 border-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.55)]"
      />

      {/* Floor-plane arrows drawn in the cube's perspective */}
      <div className="absolute left-[15%] right-[15%] top-[33%] aspect-square">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <marker
              id="ph-arrowhead"
              markerUnits="userSpaceOnUse"
              markerWidth="9"
              markerHeight="9"
              refX="4.5"
              refY="4.5"
              orient="auto-start-reverse"
            >
              <path d="M1.5,1.5 L7.5,4.5 L1.5,7.5 Z" fill="#7dd3fc" />
            </marker>
          </defs>

          {/* Axis A — down-right ground direction */}
          <motion.g
            animate={{ x: [-3.5, 3.5, -3.5], y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <line
              x1="28.35"
              y1="37.5"
              x2="71.65"
              y2="62.5"
              stroke="#7dd3fc"
              strokeWidth="1.8"
              strokeLinecap="round"
              markerStart="url(#ph-arrowhead)"
              markerEnd="url(#ph-arrowhead)"
            />
          </motion.g>

          {/* Axis B — down-left ground direction */}
          <motion.g
            animate={{ x: [-3.5, 3.5, -3.5], y: [2, -2, 2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <line
              x1="28.35"
              y1="62.5"
              x2="71.65"
              y2="37.5"
              stroke="#7dd3fc"
              strokeWidth="1.8"
              strokeLinecap="round"
              markerStart="url(#ph-arrowhead)"
              markerEnd="url(#ph-arrowhead)"
            />
          </motion.g>
        </svg>
      </div>
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
    header: "FINAL DESIGN",
    body: "The shipped design was about maximizing simplicity and a UI that mostly got out of the way, while still providing the necessary functionality.",
  },
  {
    header: "FROSTED WINDOW AESTHETIC",
    body: "Key elements were getting the frosted window aesthetic dialed in just right, and editing and testing simple prompt language.",
  },
  {
    header: "OBJECT PLACEMENT FLOW",
    body: "Design of the object placement flow, which was done through phone movement only, eliminating all onscreen controls.",
  },
  {
    header: "SCENE REFRESH BUTTON",
    body: "Creating a simple way to refresh the scene if it was placed poorly, or any other issue with how it loaded.",
  },
  {
    header: "SCALE TOGGLE",
    body: "Designing a toggle switch for scale, removing all user scale controls and simplifying it to simply switch between real scale and tabletop mode.",
  },
  {
    header: "ZONED INTERACTION",
    body: "We simplified interactivity in the scene from hot spots you needed to reach or tap, as seen in the prototype, into a zone system, where the scene would detect where the user was in space and load different non-diegetic annotations and models to develop the story from that perspective.",
  },
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
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center gap-4 w-full bg-black px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
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
          <PhonePlacementHighlight
            progress={scrollYProgress}
            blockIndex={4}
            total={PHONE_BLOCKS.length}
          />
          <PhoneHighlightRing
            progress={scrollYProgress}
            blockIndex={5}
            total={PHONE_BLOCKS.length}
            side="left"
            shape="circle"
            offsetX={2}
            offsetY={1}
          />
          <PhoneHighlightRing
            progress={scrollYProgress}
            blockIndex={6}
            total={PHONE_BLOCKS.length}
            side="right"
            shape="pill-narrow"
            offsetX={6}
            offsetY={4}
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

  // Perf: only let videos decode/play while they're near the viewport. The page
  // has many autoplaying loops; running them all at once makes mobile playback
  // stutter. Pausing the off-screen ones keeps the visible video smooth.
  useEffect(() => {
    const root = containerRef.current as HTMLElement | null;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const videos = Array.from(root.querySelectorAll("video"));
    if (videos.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.1 }
    );
    // Skip videos that manage their own playback (e.g. the hidden canvas source).
    videos
      .filter((v) => v.dataset.noObserve !== "true")
      .forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

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
            className="w-full h-full object-cover opacity-60 object-[25%_center] md:object-center"
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
            {/* Video — on mobile this sits right after the intro paragraph */}
            <figure className="order-1 lg:order-1">
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
            <div className="order-2 lg:order-2 prose prose-invert prose-lg text-neutral-400">
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
            <div className="order-2 lg:order-1">
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

            {/* Team image — on mobile this sits right after the intro paragraph */}
            <figure className="order-1 lg:order-2">
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
        {/* Prominent centered section header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <Box className="w-8 h-8 text-blue-600 mb-4" aria-hidden="true" />
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none uppercase">
            The Launch
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* TEXT COLUMN */}
          <div>
            <h3 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter leading-tight">
              Hello, World. <br /> Meet the "Honor Box."
            </h3>

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

        {/* Pull quote */}
        <figure className="max-w-4xl mx-auto text-center mt-24 md:mt-32">
          <blockquote className="text-2xl md:text-4xl font-medium tracking-tight leading-snug text-black">
            &ldquo;… by using your smartphone as a &lsquo;window,&rsquo; we are
            extending stories beyond the inches of a screen, by digitally adding
            objects into your space at real scale.&rdquo;
          </blockquote>
          <figcaption className="mt-6 text-sm font-mono uppercase tracking-widest text-neutral-500">
            Graham Roberts
          </figcaption>
        </figure>
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

                {Array.isArray(project.description) ? (
                  <div className="grid md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto mb-8">
                    {project.description.map((para, i) => (
                      <p
                        key={i}
                        className="text-lg text-neutral-400 leading-relaxed"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto mb-8">
                    {project.description}
                  </p>
                )}

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
                <figure className="shrink-0 flex flex-col items-center">
                  <div className="relative w-[240px] md:w-[320px] aspect-[9/19] bg-black rounded-[2.5rem] border-[8px] border-neutral-800 overflow-hidden shadow-2xl z-20">
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
                  <figcaption className="mt-4 text-xs font-mono uppercase tracking-widest text-neutral-500">
                    Mobile AR experience
                  </figcaption>
                </figure>

                {/* Desktop Frame */}
                <figure className="shrink-0 w-full md:w-[600px] lg:w-[800px] flex flex-col items-center">
                  <div className="relative w-full aspect-video bg-black rounded-[2rem] border-[8px] border-neutral-800 overflow-hidden shadow-2xl z-10">
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
                  <figcaption className="mt-4 text-xs font-mono uppercase tracking-widest text-neutral-500">
                    Desktop realtime 3D experience
                  </figcaption>
                </figure>
              </div>

              {/* Reading copy after the Olympics videos */}
              {index === 0 && (
                <div className="max-w-3xl mx-auto text-center mt-20 md:mt-24">
                  <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
                    For each AR project we created a parallel 3D web experience
                    that would leverage the same assets and storytelling. This
                    put the user first, understanding that the AR experience only
                    made sense when you had the space and time to engage with it.
                    I feel this struck a good balance between our explorations of
                    spatial storytelling, and the realities of the user
                    experience.
                  </p>
                </div>
              )}

              {/* Divider (except last) */}
              {index !== HIGHLIGHTS.length - 1 && (
                <div className="w-24 h-px bg-neutral-800 mx-auto mt-32" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- FULLY IMMERSIVE EXPERIENCES (OCULUS VR / MOON) --- */}
      <section className="relative py-32 overflow-hidden bg-black border-t border-neutral-900">
        {/* Deep-space backdrop */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black"
          aria-hidden="true"
        />
        {/* Starfield */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(1.5px 1.5px at 25% 15%, rgba(255,255,255,0.85), transparent), radial-gradient(1px 1px at 65% 28%, rgba(255,255,255,0.7), transparent), radial-gradient(1.5px 1.5px at 82% 12%, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 40% 42%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 12% 58%, rgba(255,255,255,0.6), transparent), radial-gradient(1.5px 1.5px at 90% 52%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 55% 8%, rgba(255,255,255,0.6), transparent)",
          }}
        />
        {/* Distant Earth glow */}
        <div
          aria-hidden="true"
          className="absolute top-16 right-[8%] w-40 h-40 rounded-full bg-gradient-to-br from-blue-400/40 to-indigo-700/30 blur-2xl pointer-events-none"
        />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="flex justify-center mb-6">
              <Glasses className="w-10 h-10 text-indigo-400" aria-hidden="true" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Fully Immersive Experiences
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
              We explored extending projects from AR mobile onto fully immersive
              headsets, like in this project that revisited the photography from
              the moon landing and re-contextualized it from where each photo was
              shot. You can actually hold the Hasselblad camera they used, and
              take the photos Buzz and Neil took from the exact spot each was
              taken.
            </p>
          </div>

          {/* 3D moonscape movie screen */}
          <MoonscapeScreen />
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
            To explore the future of immersive reading, we brought a specialized
            team down to Magic Leap&apos;s headquarters in Florida. Working
            side-by-side with their engineering and design teams, we investigated
            what a New York Times article might look like as a fully spatial
            experience.
          </p>
        </div>

        {/* Centered Hero Video — screen capture from the headset */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 mt-20">
          <MagicLeapHeadsetReveal />
        </div>

        {/* Narrative copy + speaking image (two-column, vertically centered) */}
        <div className="max-w-6xl mx-auto px-6 lg:px-12 mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
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
        <div className="max-w-3xl mx-auto text-center px-6 md:px-12 mb-16">
          <div className="flex justify-center mb-6">
            <Box className="w-10 h-10 text-indigo-400" aria-hidden="true" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            A creative explosion in spatial storytelling
          </h2>
          <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
            We visualized the invisible pollution around us, how water might have
            existed on Mars, used Microsoft&apos;s volumetric video SDK to bring
            celebrities into your space, and many more from which we developed a
            perspective and tremendous learnings on how to create engaging,
            effective, and inspiring work, leaning in to the future of spatial
            platforms.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-neutral-600 font-mono text-xs uppercase tracking-widest animate-pulse">
            Scroll <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-8 overflow-x-auto pt-8 pb-12 px-6 md:px-12 snap-x scrollbar-hide">
          {MORE_PROJECTS.map((project, i) => (
            <div
              key={i}
              className="group shrink-0 snap-center flex flex-col items-center gap-6"
            >
              {/* Phone Frame */}
              <div className="relative w-[260px] aspect-[9/19] bg-black rounded-[2.5rem] border-[6px] border-neutral-800 overflow-hidden shadow-lg transition-all duration-500 group-hover:scale-[1.04] group-hover:border-neutral-600 group-hover:shadow-xl group-hover:shadow-indigo-500/20">
                <div className="absolute top-0 w-full h-5 z-20 flex justify-center items-center pointer-events-none">
                  <div className="w-16 h-4 bg-black rounded-b-lg" />
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${
                    project.title === "Mars Insight Lander"
                      ? "scale-[1.04]"
                      : ""
                  }`}
                >
                  <source src={project.video} type="video/mp4" />
                </video>
              </div>

              <span className="block w-[260px] text-center text-sm font-mono text-neutral-500 uppercase tracking-wider">
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