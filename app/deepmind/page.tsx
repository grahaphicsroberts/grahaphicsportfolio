"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  LineChart,
  Lock,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

const PASSWORD = "agieconomics";
const STORAGE_KEY = "deepmind-unlocked";

// ---------------------------------------------------------------------------
// SPIRAL MARK
// A decorative logarithmic-spiral motif as a nod to DeepMind's brand.
// (Original artwork; swap in official DeepMind assets if/when licensed.)
// ---------------------------------------------------------------------------

const SPIRAL_D = (() => {
  const cx = 50;
  const cy = 50;
  const turns = 2.75;
  const steps = 260;
  const a = 1.5;
  const b = 0.2;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * 2 * Math.PI;
    const r = a * Math.exp(b * t);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    d += `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d.trim();
})();

const SpiralMark = ({ className = "" }: { className?: string }) => (
  <motion.svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    aria-hidden="true"
    animate={{ rotate: 360 }}
    transition={{ duration: 48, ease: "linear", repeat: Infinity }}
  >
    <defs>
      <linearGradient id="spiralGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4285f4" />
        <stop offset="55%" stopColor="#34a0ff" />
        <stop offset="100%" stopColor="#63e6e2" />
      </linearGradient>
    </defs>
    <path
      d={SPIRAL_D}
      stroke="url(#spiralGrad)"
      strokeWidth="3.25"
      strokeLinecap="round"
    />
  </motion.svg>
);

// Copy that shows a short preview on mobile with a "Read more" that opens a
// frosted overlay across the slide (so full copy reads over the visual without
// blowing out the fixed-height layout). Desktop always shows the full copy.
// NOTE: the parent slide must be `relative` for the overlay to anchor.
const ExpandableCopy = ({
  children,
  pClassName = "",
}: {
  children: React.ReactNode;
  pClassName?: string;
}) => {
  const [open, setOpen] = useState(false);
  const stop = (e: React.TouchEvent) => e.stopPropagation();
  return (
    <>
      <div>
        <p className={`${pClassName} line-clamp-3 md:line-clamp-none`}>
          {children}
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 inline-block font-mono text-xs uppercase tracking-widest text-sky-400 transition-colors hover:text-sky-300 md:hidden"
        >
          Read more
        </button>
      </div>
      {open && (
        <div
          className="absolute inset-0 z-40 flex flex-col gap-4 overflow-y-auto bg-neutral-950 px-6 pt-16 pb-28 backdrop-blur-md md:hidden"
          onTouchStart={stop}
          onTouchMove={stop}
          onTouchEnd={stop}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="self-start font-mono text-xs uppercase tracking-widest text-sky-400"
          >
            ✕ Show less
          </button>
          <p className={pClassName}>{children}</p>
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------
// SLIDES
// ---------------------------------------------------------------------------

const TitleSlide = () => (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-neutral-950">
    {/* Ambient spiral glow */}
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.12]">
      <SpiralMark className="h-[130vh] w-[130vh] blur-[1px]" />
    </div>
    <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

    <div className="relative z-10 flex flex-col items-center px-6 text-center">
      <SpiralMark className="mb-10 h-24 w-24" />
      <h1 className="text-5xl font-bold tracking-tighter text-white md:text-6xl lg:text-7xl">
        Grahaphics <span className="mx-1 font-light text-neutral-500">×</span>
        <br className="md:hidden" /> DeepMind
      </h1>
      <div className="mx-auto my-8 h-px w-24 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
      <p className="max-w-2xl text-lg font-light leading-relaxed text-neutral-400 md:text-2xl">
        Considerations for the Economics of AGI microsite.
      </p>
    </div>
  </div>
);

const STRUCTURE_STEPS = [
  {
    icon: FileText,
    step: "01",
    title: "The Argument",
    desc: "Framing the paper: the economic threat AGI poses to labor income, and the case for proactive policy intervention.",
  },
  {
    icon: Users,
    step: "02",
    title: "Expert Scoring",
    desc: "How each intervention was scored, using a multi-agent panel of 51 simulated expert economists, run via EDSL.",
  },
  {
    icon: LineChart,
    step: "03",
    title: "Guided Visualization",
    desc: "A guided walkthrough surfacing the key takeaways from the visualizer tool we're building.",
  },
  {
    icon: SlidersHorizontal,
    step: "04",
    title: "Open Exploration",
    desc: "A fully interactive explorer, inviting the visitor to investigate the data on their own terms.",
  },
];

// Horizontally scrollable card strip for mobile. Supports click-and-drag
// (mouse), trackpad/wheel (via the deck's wheel redirect), and native touch.
// Uses proximity snapping so small nudges don't get yanked back to the start.
const CardStrip = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return; // touch/pen use native scrolling
    const el = ref.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft };
    el.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active || !ref.current) return;
    ref.current.scrollLeft =
      drag.current.startLeft - (e.clientX - drag.current.startX);
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    ref.current?.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      ref={ref}
      data-hscroll
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      style={{ touchAction: "pan-x" }}
      className="hide-scrollbar -mx-6 flex shrink-0 cursor-grab snap-x snap-proximity gap-4 overflow-x-auto px-6 pb-3 active:cursor-grabbing md:mx-0 md:cursor-default md:snap-none md:items-stretch md:overflow-visible md:px-0 md:pb-0"
    >
      {children}
    </div>
  );
};

const MicrositeStructureSlide = () => (
  <div className="flex h-full w-full flex-col justify-center bg-neutral-950 px-6 pt-12 pb-24 md:px-16">
    {/* Header / verbal explanation */}
    <div className="mb-8 max-w-4xl shrink-0 md:mb-12">
      <span className="mb-3 block font-mono text-sm uppercase tracking-widest text-sky-400">
        The Microsite &middot; Structure
      </span>
      <h2 className="mb-4 text-3xl font-bold tracking-tighter text-white md:text-5xl">
        How the Experience Unfolds
      </h2>
      <p className="max-w-3xl text-base leading-relaxed text-neutral-400 md:text-lg">
        The microsite guides the visitor along a single arc, from argument, to
        evidence, to exploration. It opens by framing the paper&apos;s
        thesis, explains how the intervention scores were generated by a
        simulated expert panel, walks through the headline findings, and then
        hands over a fully interactive visualizer.
      </p>
    </div>

    {/* Graphic representation of the sequence.
        Mobile: horizontal snap-scroll. Desktop: even row with arrows. */}
    <CardStrip>
      {STRUCTURE_STEPS.map((s, i) => {
        const Icon = s.icon;
        return (
          <React.Fragment key={s.step}>
            <div className="w-[74vw] shrink-0 snap-start rounded-2xl border border-white/10 bg-neutral-900/40 p-5 backdrop-blur-sm md:w-auto md:flex-1 md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 font-mono text-sm font-bold text-black">
                  {s.step}
                </span>
                <Icon className="h-6 w-6 text-sky-400" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white md:text-xl">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-400">
                {s.desc}
              </p>
            </div>
            {i < STRUCTURE_STEPS.length - 1 && (
              <div className="hidden shrink-0 items-center justify-center text-neutral-600 md:flex">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </CardStrip>
  </div>
);

// --- Guided insight interaction (scroll-driven radial highlight) ---

const INSIGHTS = [
  {
    label: "Reskilling & Training",
    value: 0.82,
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    label: "Wage Insurance",
    value: 0.58,
    body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.",
  },
  {
    label: "AGI Dividend",
    value: 0.94,
    body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis.",
  },
  {
    label: "Sectoral Transition",
    value: 0.5,
    body: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione.",
  },
  {
    label: "Progressive Taxation",
    value: 0.72,
    body: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora.",
  },
];

const RADIAL_N = INSIGHTS.length;
const RADIAL_CENTER = 100;
const RADIAL_R0 = 30;
const RADIAL_RMAX = 92;

function radialPoint(r: number, i: number): [number, number] {
  const angle = ((i * (360 / RADIAL_N) - 90) * Math.PI) / 180;
  return [
    RADIAL_CENTER + r * Math.cos(angle),
    RADIAL_CENTER + r * Math.sin(angle),
  ];
}

// Vertices of the radar polygon (one per insight, radius scaled by value).
const RADIAL_VERTICES = INSIGHTS.map((d, i) =>
  radialPoint(RADIAL_R0 + d.value * (RADIAL_RMAX - RADIAL_R0), i)
);
const RADIAL_PATH =
  RADIAL_VERTICES.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(
    " "
  ) + " Z";

const RadialChart = ({ active }: { active: number }) => {
  const [ax, ay] = RADIAL_VERTICES[active];
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4285f4" />
          <stop offset="100%" stopColor="#63e6e2" />
        </linearGradient>
      </defs>
      {/* Grid rings */}
      {[45, 63, 80, 92].map((r) => (
        <circle
          key={r}
          cx={RADIAL_CENTER}
          cy={RADIAL_CENTER}
          r={r}
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.06"
        />
      ))}
      {/* Faint spokes */}
      {INSIGHTS.map((_, i) => {
        const [gx, gy] = radialPoint(RADIAL_RMAX, i);
        return (
          <line
            key={i}
            x1={RADIAL_CENTER}
            y1={RADIAL_CENTER}
            x2={gx}
            y2={gy}
            stroke="#ffffff"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
        );
      })}
      {/* Connected radar shape */}
      <path
        d={RADIAL_PATH}
        fill="url(#barGrad)"
        fillOpacity="0.12"
        stroke="url(#barGrad)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Accent spoke to the active vertex */}
      <line
        x1={RADIAL_CENTER}
        y1={RADIAL_CENTER}
        x2={ax}
        y2={ay}
        stroke="#63e6e2"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeDasharray="2 3"
        style={{ transition: "all 0.5s ease" }}
      />
      {/* Vertex dots */}
      {RADIAL_VERTICES.map(([x, y], i) => {
        const isActive = i === active;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={isActive ? 5 : 2.5}
            fill={isActive ? "#63e6e2" : "#52525b"}
            style={{ transition: "all 0.4s ease" }}
          />
        );
      })}
      {/* Glow ring on the active vertex */}
      <circle
        cx={ax}
        cy={ay}
        r="9"
        fill="none"
        stroke="#63e6e2"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        style={{ transition: "all 0.5s ease" }}
      />
      {/* Hub */}
      <circle
        cx={RADIAL_CENTER}
        cy={RADIAL_CENTER}
        r="22"
        fill="#0a0a0a"
        stroke="#ffffff"
        strokeOpacity="0.12"
      />
      <text
        x={RADIAL_CENTER}
        y={RADIAL_CENTER + 5}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        className="fill-white font-mono"
      >
        {String(active + 1).padStart(2, "0")}
      </text>
    </svg>
  );
};

const GuidedInsightSlide = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Auto-play: cycle through the insights on a loop, no user input needed.
  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % RADIAL_N);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  // Keep the text panel auto-scrolled to the active block.
  useEffect(() => {
    const root = scrollRef.current;
    const target = blockRefs.current[active];
    if (!root || !target) return;
    root.scrollTo({
      top: target.offsetTop - (root.clientHeight - target.clientHeight) / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <div className="flex h-full w-full flex-col bg-neutral-950 pb-16 md:grid md:grid-cols-5 md:pb-0">
      {/* Left: sticky chart */}
      <div className="order-1 flex flex-1 flex-col justify-center gap-5 px-6 pt-16 md:col-span-2 md:h-full md:px-12 md:pt-0">
        <div>
          <span className="mb-2 block font-mono text-sm uppercase tracking-widest text-sky-400">
            Guided Insight Interaction
          </span>
          <h2 className="mb-4 text-2xl font-bold tracking-tighter text-white md:text-4xl">
            Guiding the Eye Through the Data
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-neutral-400 md:text-base">
            As a user scrolls past the initial setup of the paper, we introduce
            the mechanism of the visualization, first drawing out the key
            takeaways that can be curated, then handing over full control to
            explore the data freely.
          </p>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[300px] md:max-w-sm">
          <RadialChart active={active} />
        </div>
        {/* Progress indicator, tracks the active insight */}
        <div className="flex items-center justify-center gap-2">
          {INSIGHTS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-6 bg-sky-400" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right: auto-scrolling text blocks. Hidden on mobile — below the
          breakpoint the chart's animated highlights carry the idea alone. */}
      <div className="relative order-2 hidden min-h-0 md:col-span-3 md:block md:h-full">
        <div
          ref={scrollRef}
          className="hide-scrollbar pointer-events-none h-full overflow-hidden px-6 md:px-16"
        >
          {INSIGHTS.map((d, i) => {
            const isActive = i === active;
            return (
              <div
                key={i}
                data-index={i}
                ref={(el) => {
                  blockRefs.current[i] = el;
                }}
                className="flex min-h-[80%] flex-col justify-center border-b border-white/5 py-10"
              >
                <h3
                  className={`mb-4 text-2xl font-bold tracking-tight transition-colors md:text-3xl ${
                    isActive ? "text-white" : "text-neutral-500"
                  }`}
                >
                  Insight {i + 1}
                </h3>
                <p className="max-w-xl leading-relaxed text-neutral-400">
                  {d.body} Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit, sed do eiusmod tempor incididunt ut labore et dolore
                  magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation.
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Proposed visualization: radar / "fingerprint" chart ---

const CAT_COLORS: Record<string, string> = {
  welfare: "#34d399", // green
  agency: "#60a5fa", // blue
  feasibility: "#fb923c", // orange
  durability: "#c084fc", // purple
};

const CAT_LEGEND = [
  { key: "welfare", label: "Welfare" },
  { key: "agency", label: "Agency" },
  { key: "feasibility", label: "Feasibility" },
  { key: "durability", label: "Durability" },
];

const RADAR_AXES: { label: string; cat: keyof typeof CAT_COLORS }[] = [
  { label: "Standards of Living", cat: "welfare" },
  { label: "Meaning & Human-Value", cat: "welfare" },
  { label: "Macro Stabilization", cat: "welfare" },
  { label: "Economic Participation", cat: "agency" },
  { label: "Ownership of Gains", cat: "agency" },
  { label: "Democratic Voice", cat: "agency" },
  { label: "Political Support", cat: "feasibility" },
  { label: "Popular Support", cat: "feasibility" },
  { label: "Econ Feasibility", cat: "feasibility" },
  { label: "Admin Capacity", cat: "feasibility" },
  { label: "Speed", cat: "feasibility" },
  { label: "Impl. Readiness", cat: "feasibility" },
  { label: "Mild Disruption", cat: "durability" },
  { label: "Broad Displacement", cat: "durability" },
  { label: "Transformation", cat: "durability" },
];

const RADAR_SERIES = [
  {
    name: "Wage Insurance",
    color: "#f0a350",
    values: [62, 70, 48, 40, 68, 45, 40, 70, 55, 48, 72, 68, 42, 40, 52],
  },
  {
    name: "Universal Basic Capital (UBC)",
    color: "#4bb8d6",
    values: [55, 52, 40, 62, 82, 55, 48, 45, 35, 30, 30, 45, 55, 58, 60],
  },
];

const RADAR_LEVELS = [20, 40, 60, 80, 100];
const R_CX = 380;
const R_CY = 300;
const R_MAX = 190;
const R_MAXVAL = 100;
const R_N = RADAR_AXES.length;

function radarPoint(value: number, i: number): [number, number] {
  const angle = ((i * (360 / R_N) - 90) * Math.PI) / 180;
  const r = (value / R_MAXVAL) * R_MAX;
  return [R_CX + r * Math.cos(angle), R_CY + r * Math.sin(angle)];
}

function radarPath(values: number[]): string {
  return (
    values
      .map((v, i) => {
        const [x, y] = radarPoint(v, i);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
}

const RadarChart = () => (
  <svg
    viewBox="0 0 760 620"
    className="h-auto w-full overflow-visible"
    aria-hidden="true"
  >
    {/* Grid rings (polygonal web) */}
    {RADAR_LEVELS.map((level) => (
      <path
        key={level}
        d={radarPath(RADAR_AXES.map(() => level))}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={level === R_MAXVAL ? 0.16 : 0.08}
        strokeWidth="1"
      />
    ))}
    {/* Spokes */}
    {RADAR_AXES.map((_, i) => {
      const [x, y] = radarPoint(R_MAXVAL, i);
      return (
        <line
          key={i}
          x1={R_CX}
          y1={R_CY}
          x2={x}
          y2={y}
          stroke="#ffffff"
          strokeOpacity="0.06"
          strokeWidth="1"
        />
      );
    })}
    {/* Scale numbers up the top axis */}
    {RADAR_LEVELS.map((level) => {
      const [, y] = radarPoint(level, 0);
      return (
        <text
          key={level}
          x={R_CX - 6}
          y={y + 3}
          textAnchor="end"
          fontSize="11"
          className="fill-neutral-500 font-mono"
        >
          {level}
        </text>
      );
    })}
    {/* Data series (drawn back-to-front) */}
    {RADAR_SERIES.map((s) => (
      <g key={s.name}>
        <path
          d={radarPath(s.values)}
          fill={s.color}
          fillOpacity="0.22"
          stroke={s.color}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {s.values.map((v, i) => {
          const [x, y] = radarPoint(v, i);
          return <circle key={i} cx={x} cy={y} r="3" fill={s.color} />;
        })}
      </g>
    ))}
    {/* Axis labels, colored by category */}
    {RADAR_AXES.map((axis, i) => {
      const [lx, ly] = radarPoint(R_MAXVAL + 12, i);
      const anchor =
        lx > R_CX + 4 ? "start" : lx < R_CX - 4 ? "end" : "middle";
      return (
        <text
          key={axis.label}
          x={lx}
          y={ly + 3}
          textAnchor={anchor}
          fontSize="12.5"
          fontWeight="700"
          fill={CAT_COLORS[axis.cat]}
        >
          {axis.label}
        </text>
      );
    })}
  </svg>
);

const VisualizationMechanismSlide = () => (
  <div className="relative flex h-full w-full flex-col justify-start bg-neutral-950 px-6 pt-16 pb-24 md:grid md:grid-cols-5 md:items-center md:justify-center md:gap-8 md:px-14 md:pt-0 md:pb-0">
    {/* Left: framing copy */}
    <div className="mb-6 flex flex-col justify-center md:mb-0 md:col-span-2">
      <span className="mb-2 block font-mono text-sm uppercase tracking-widest text-sky-400">
        Visualization Mechanism
      </span>
      <h2 className="mb-4 text-2xl font-bold tracking-tighter text-white md:mb-5 md:text-5xl">
        Proposed Visualization #1: Radar Charts
      </h2>
      <ExpandableCopy pClassName="max-w-md text-base leading-relaxed text-neutral-400 md:text-lg">
        Radar charts are one way to show each policy&apos;s profile across the
        full set of dimensions and sub-criteria, with overlays the reader can
        build interactively to compare policies directly. They carry real
        trade-offs. The axis order shapes the read, and more than two or three
        overlaid profiles get hard to parse, so they work best for focused,
        side-by-side comparison rather than showing everything at once.
        Both are manageable: ordering can follow the paper&apos;s own grouping,
        and comparison can be capped to a few policies at a time.
      </ExpandableCopy>
    </div>

    {/* Right: recreated fingerprint chart */}
    <div className="flex min-h-0 flex-col items-center justify-center md:col-span-3">
      <h3 className="mb-4 text-center text-lg font-bold text-neutral-200 md:text-xl">
        AGI Redistributive Policy Fingerprints
      </h3>
      {/* Series legend */}
      <div className="mb-2 flex flex-wrap items-center justify-center gap-6">
        {RADAR_SERIES.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <span
              className="h-3 w-6 rounded-sm border-2"
              style={{ borderColor: s.color, backgroundColor: `${s.color}33` }}
            />
            <span className="text-sm text-neutral-300">{s.name}</span>
          </div>
        ))}
      </div>
      <div className="mx-auto w-full max-w-[400px] md:max-w-[560px]">
        <RadarChart />
      </div>
      {/* Category legend */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {CAT_LEGEND.map((c) => (
          <div key={c.key} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: CAT_COLORS[c.key] }}
            />
            <span className="text-sm font-medium text-neutral-300">
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Small multiples: a grid of individual policy fingerprints ---

const SMALL_MULTIPLE_COUNT = 96;

const GRAD_STOPS = [
  [52, 211, 153], // green
  [75, 184, 214], // teal
  [96, 165, 250], // blue
  [168, 139, 250], // indigo
  [192, 132, 252], // purple
];

function gradColor(t: number): string {
  const seg = t * (GRAD_STOPS.length - 1);
  const i = Math.min(Math.floor(seg), GRAD_STOPS.length - 2);
  const f = seg - i;
  const a = GRAD_STOPS[i];
  const b = GRAD_STOPS[i + 1];
  const c = a.map((v, k) => Math.round(v + (b[k] - v) * f));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

// Deterministic pseudo-random so the layout is stable across renders.
function fpValue(f: number, a: number): number {
  const x = Math.sin((f * R_N + a) * 127.1 + 311.7) * 43758.5453;
  return 25 + (x - Math.floor(x)) * 75;
}

const SMALL_MULTIPLES = Array.from(
  { length: SMALL_MULTIPLE_COUNT },
  (_, f) => ({
    color: gradColor(f / (SMALL_MULTIPLE_COUNT - 1)),
    values: Array.from({ length: R_N }, (_, a) => fpValue(f, a)),
  })
);

function miniPoint(value: number, i: number): [number, number] {
  const angle = ((i * (360 / R_N) - 90) * Math.PI) / 180;
  const r = (value / 100) * 40;
  return [50 + r * Math.cos(angle), 50 + r * Math.sin(angle)];
}

function miniPath(values: number[]): string {
  return (
    values
      .map((v, i) => {
        const [x, y] = miniPoint(v, i);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
}

const MiniRadar = ({
  values,
  color,
}: {
  values: number[];
  color: string;
}) => (
  <svg viewBox="0 0 100 100" className="h-full w-full">
    {/* Disc backdrop */}
    <circle cx="50" cy="50" r="44" fill="#ffffff" fillOpacity="0.03" />
    {/* Rings */}
    {[20, 40].map((r) => (
      <circle
        key={r}
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.07"
        strokeWidth="0.7"
      />
    ))}
    {/* Spokes */}
    {values.map((_, i) => {
      const [x, y] = miniPoint(100, i);
      return (
        <line
          key={i}
          x1="50"
          y1="50"
          x2={x}
          y2={y}
          stroke="#ffffff"
          strokeOpacity="0.05"
          strokeWidth="0.6"
        />
      );
    })}
    {/* Fingerprint */}
    <path
      d={miniPath(values)}
      fill={color}
      fillOpacity="0.4"
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    {/* Vertex dots */}
    {values.map((v, i) => {
      const [x, y] = miniPoint(v, i);
      return <circle key={i} cx={x} cy={y} r="1.6" fill="#f8615a" />;
    })}
  </svg>
);

const SmallMultiplesSlide = () => (
  <div className="flex h-full w-full flex-col bg-neutral-950 px-6 pt-16 pb-24 md:px-14 md:pt-12 md:pb-16">
    <div className="mb-6 shrink-0 max-w-3xl md:mb-8">
      <span className="mb-2 block font-mono text-sm uppercase tracking-widest text-sky-400">
        Dynamic Viewing Options
      </span>
      <h2 className="mb-4 text-3xl font-bold tracking-tighter text-white md:text-5xl">
        Breaking Out the Charts
      </h2>
      <p className="max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
        We can also offer dynamic viewing options that would allow each
        individual policy fingerprint to be viewed as small multiples, a gallery
        view for scanning the full landscape at a glance.
      </p>
    </div>
    <div className="min-h-0 flex-1 md:overflow-hidden">
      {/* Mobile shows a representative subset (every 5th, spanning the full
          gradient) at a comfortable size; desktop shows the full grid. */}
      <div className="grid grid-cols-5 content-start gap-2 md:h-full md:grid-cols-12 md:gap-1.5 lg:[grid-template-columns:repeat(16,minmax(0,1fr))]">
        {SMALL_MULTIPLES.map((fp, i) => (
          <div
            key={i}
            className={`aspect-square ${i % 5 === 0 ? "" : "hidden md:block"}`}
          >
            <MiniRadar values={fp.values} color={fp.color} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Additional data views: heatmap ---

const HEATMAP: { name: string; v: number[] }[] = [
  {
    name: "Earned Income Tax Credit (EITC)",
    v: [72, 75.8, 41.3, 75.7, 19.6, 40.9, 75.2, 77.3, 83.2, 77.9, 69.8, 86, 52, 52.3, 20.1],
  },
  {
    name: "Unemployment Insurance (UI)",
    v: [75.3, 79.9, 81.6, 70, 49.8, 56.4, 35.5, 59.2, 63.2, 34.3, 23, 75, 67.2, 66.4, 53.8],
  },
  {
    name: "Active Labour-Market Policies",
    v: [24.6, 47.5, 29.7, 49.5, 10.2, 49.4, 40.7, 62.3, 46.1, 41.2, 28.4, 65, 33.7, 37.6, 10.9],
  },
  {
    name: "Wage Insurance",
    v: [55.5, 75.8, 27.8, 70.8, 51.3, 49.9, 38.3, 48.4, 60.4, 50.2, 32, 50, 35.7, 40.5, 23.9],
  },
  {
    name: "Directed Industrial Policy",
    v: [51.9, 60.8, 17.6, 59.1, 47, 37.7, 35.6, 41.7, 49.5, 39.3, 21.3, 55, 40, 43.3, 38.8],
  },
  {
    name: "Federal Jobs Guarantee (FJG)",
    v: [41.4, 66.4, 47.5, 64.5, 36.8, 57.4, 24.2, 43.9, 30.4, 21.7, 15.7, 27, 28.8, 33.2, 31.3],
  },
  {
    name: "Universal Basic Income (UBI)",
    v: [56.6, 39.6, 35.2, 55.4, 32.8, 39.7, 15.9, 36.7, 32.1, 63.4, 18.4, 54, 35.8, 38.4, 33],
  },
  {
    name: "Negative Income Tax (NIT)",
    v: [73.1, 68.7, 71.7, 52.7, 16.2, 40.5, 22.9, 36.7, 70.3, 66.5, 38.4, 57, 54.7, 54.3, 34.5],
  },
  {
    name: "Universal Basic Services (UBS)",
    v: [63, 56.1, 35.1, 44.6, 25.6, 42.4, 18.3, 40.3, 32.7, 25, 14.1, 39, 41.5, 46.4, 52.4],
  },
  {
    name: "Universal Basic Capital (UBC)",
    v: [49.9, 61.5, 39.6, 69.2, 78.8, 53.5, 19, 39.6, 38.9, 38.2, 17.1, 28, 45.8, 45.2, 52.7],
  },
  {
    name: "Sovereign AI Fund",
    v: [34, 46.2, 40.7, 33.5, 54.9, 15.5, 23.1, 45.5, 40.1, 44.4, 17.8, 37, 40.2, 41.4, 39.7],
  },
];

// Warm sequential scale, tuned for a dark canvas (low = near-bg, high = bright).
const HEAT_STOPS: [number, [number, number, number]][] = [
  [0, [30, 25, 22]],
  [0.25, [91, 33, 18]],
  [0.5, [154, 52, 18]],
  [0.75, [220, 80, 40]],
  [1, [251, 146, 60]],
];

function heatColor(v: number): string {
  const t = Math.max(0, Math.min(1, v / 100));
  let i = 0;
  while (i < HEAT_STOPS.length - 2 && t > HEAT_STOPS[i + 1][0]) i++;
  const [p0, c0] = HEAT_STOPS[i];
  const [p1, c1] = HEAT_STOPS[i + 1];
  const f = (t - p0) / (p1 - p0);
  const c = c0.map((val, k) => Math.round(val + (c1[k] - val) * f));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

const HM_ML = 210;
const HM_MT = 16;
const HM_CW = 42;
const HM_CH = 40;
const HM_G = 12;
const HM_GAPS = [3, 6, 12];
const HM_ROWS = HEATMAP.length;
const HM_COLS = RADAR_AXES.length;

const hmX = (c: number) =>
  HM_ML + c * HM_CW + HM_G * HM_GAPS.filter((t) => c >= t).length;
const hmY = (r: number) => HM_MT + r * HM_CH;
const HM_PLOT_BOTTOM = hmY(HM_ROWS);
const HM_LEGEND_X = 902;
const HM_LEGEND_H = HM_ROWS * HM_CH;

const HM_CALLOUTS = [
  { r: 0, c: 11, n: 1, note: "EITC peaks on Implementation Readiness (86.0)" },
  { r: 9, c: 4, n: 2, note: "UBC leads on Ownership of Gains (78.8)" },
];

const HeatmapChart = () => (
  <svg
    viewBox="0 0 1000 600"
    className="mx-auto h-full max-h-full w-auto max-w-full overflow-visible"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="heatLegend" x1="0" y1="1" x2="0" y2="0">
        {HEAT_STOPS.map(([p, c]) => (
          <stop
            key={p}
            offset={`${p * 100}%`}
            stopColor={`rgb(${c[0]}, ${c[1]}, ${c[2]})`}
          />
        ))}
      </linearGradient>
    </defs>

    {/* Cells */}
    {HEATMAP.map((row, r) =>
      row.v.map((val, c) => {
        const dark = val >= 72;
        return (
          <g key={`${r}-${c}`}>
            <rect
              x={hmX(c) + 1}
              y={hmY(r) + 1}
              width={HM_CW - 2}
              height={HM_CH - 2}
              rx="3"
              fill={heatColor(val)}
            />
            <text
              x={hmX(c) + HM_CW / 2}
              y={hmY(r) + HM_CH / 2 + 3.5}
              textAnchor="middle"
              fontSize="10.5"
              fill={dark ? "#1c1917" : "#fde7d9"}
            >
              {val.toFixed(1)}
            </text>
          </g>
        );
      })
    )}

    {/* Row labels */}
    {HEATMAP.map((row, r) => (
      <text
        key={row.name}
        x={HM_ML - 8}
        y={hmY(r) + HM_CH / 2 + 4}
        textAnchor="end"
        fontSize="11"
        className="fill-neutral-300"
      >
        {row.name}
      </text>
    ))}

    {/* Column labels (rotated), colored by category */}
    {RADAR_AXES.map((axis, c) => {
      const px = hmX(c) + HM_CW / 2;
      const py = HM_PLOT_BOTTOM + 12;
      return (
        <text
          key={axis.label}
          x={px}
          y={py}
          textAnchor="end"
          fontSize="10"
          fontWeight="600"
          fill={CAT_COLORS[axis.cat]}
          transform={`rotate(-40, ${px}, ${py})`}
        >
          {axis.label}
        </text>
      );
    })}

    {/* Callout highlights */}
    {HM_CALLOUTS.map((co) => (
      <g key={co.n}>
        <rect
          x={hmX(co.c)}
          y={hmY(co.r)}
          width={HM_CW}
          height={HM_CH}
          rx="4"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
        />
        <circle
          cx={hmX(co.c) + HM_CW}
          cy={hmY(co.r)}
          r="7.5"
          fill="#38bdf8"
        />
        <text
          x={hmX(co.c) + HM_CW}
          y={hmY(co.r) + 3}
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="#04263a"
        >
          {co.n}
        </text>
      </g>
    ))}

    {/* Legend */}
    <text
      x={HM_LEGEND_X + 9}
      y={HM_MT - 4}
      textAnchor="middle"
      fontSize="11"
      className="fill-neutral-300"
    >
      Score
    </text>
    <rect
      x={HM_LEGEND_X}
      y={HM_MT}
      width="18"
      height={HM_LEGEND_H}
      rx="3"
      fill="url(#heatLegend)"
    />
    {[0, 20, 40, 60, 80, 100].map((tick) => {
      const ty = HM_MT + (1 - tick / 100) * HM_LEGEND_H;
      return (
        <text
          key={tick}
          x={HM_LEGEND_X + 24}
          y={ty + 3}
          textAnchor="start"
          fontSize="10"
          className="fill-neutral-500 font-mono"
        >
          {tick}
        </text>
      );
    })}
  </svg>
);

// Compact heatmap for mobile: a representative 6x6 subset of policies x
// dimensions, with larger cells so it stays legible on a narrow screen.
const HM_M_ROWS = [0, 1, 3, 6, 9, 10]; // EITC, UI, Wage Ins., UBI, UBC, Sov. AI
const HM_M_ROW_LABELS = ["EITC", "UI", "Wage Ins.", "UBI", "UBC", "Sov. AI"];
const HM_M_COLS = [0, 3, 4, 8, 11, 14];
const HM_M_COL_LABELS = [
  "Std. of Living",
  "Econ. Part.",
  "Ownership",
  "Econ. Feas.",
  "Impl. Ready",
  "Transform",
];
const HM_M_ML = 84;
const HM_M_MT = 8;
const HM_M_CW = 52;
const HM_M_CH = 44;
const hmMX = (c: number) => HM_M_ML + c * HM_M_CW;
const hmMY = (r: number) => HM_M_MT + r * HM_M_CH;
const HM_M_BOTTOM = hmMY(HM_M_ROWS.length);

const HeatmapChartMobile = () => (
  <svg
    viewBox="0 0 420 380"
    className="mx-auto h-auto w-full overflow-visible"
    aria-hidden="true"
  >
    {HM_M_ROWS.map((rowIdx, r) =>
      HM_M_COLS.map((colIdx, c) => {
        const val = HEATMAP[rowIdx].v[colIdx];
        const dark = val >= 72;
        return (
          <g key={`${r}-${c}`}>
            <rect
              x={hmMX(c) + 1}
              y={hmMY(r) + 1}
              width={HM_M_CW - 2}
              height={HM_M_CH - 2}
              rx="3"
              fill={heatColor(val)}
            />
            <text
              x={hmMX(c) + HM_M_CW / 2}
              y={hmMY(r) + HM_M_CH / 2 + 4}
              textAnchor="middle"
              fontSize="12"
              fill={dark ? "#1c1917" : "#fde7d9"}
            >
              {val.toFixed(0)}
            </text>
          </g>
        );
      })
    )}

    {/* Row labels */}
    {HM_M_ROW_LABELS.map((label, r) => (
      <text
        key={label}
        x={HM_M_ML - 6}
        y={hmMY(r) + HM_M_CH / 2 + 4}
        textAnchor="end"
        fontSize="11"
        className="fill-neutral-300"
      >
        {label}
      </text>
    ))}

    {/* Column labels (rotated), colored by category */}
    {HM_M_COLS.map((colIdx, c) => {
      const px = hmMX(c) + HM_M_CW / 2;
      const py = HM_M_BOTTOM + 10;
      return (
        <text
          key={HM_M_COL_LABELS[c]}
          x={px}
          y={py}
          textAnchor="end"
          fontSize="10"
          fontWeight="600"
          fill={CAT_COLORS[RADAR_AXES[colIdx].cat]}
          transform={`rotate(-38, ${px}, ${py})`}
        >
          {HM_M_COL_LABELS[c]}
        </text>
      );
    })}
  </svg>
);

const AdditionalDataViewsSlide = () => (
  <div className="relative flex h-full w-full flex-col bg-neutral-950 px-6 pt-16 pb-24 md:grid md:grid-cols-3 md:items-center md:gap-10 md:px-14 md:py-0">
    {/* Left third: headline + subcopy together */}
    <div className="mb-4 flex flex-col justify-center md:mb-0 md:col-span-1">
      <span className="mb-2 block font-mono text-sm uppercase tracking-widest text-sky-400">
        Visualization Mechanism
      </span>
      <h2 className="mb-4 text-2xl font-bold tracking-tighter text-white md:text-3xl lg:text-4xl">
        Proposed Visualization #2: Heat Maps
      </h2>
      <ExpandableCopy pClassName="text-sm leading-relaxed text-neutral-400 md:text-base">
        A sorted heatmap lays every policy against every dimension at once. Rows
        for the interventions, columns for the criteria, color for the score, so
        the whole landscape is legible in a single view. Its
        strength is comparison at scale: click any dimension to re-sort, and the
        policies that lead or lag on that criterion surface immediately. Weight
        scenario durability and watch the order rearrange; the finding that no
        single policy holds up everywhere emerges directly from the matrix rather
        than being asserted. It trades the visual drama of a profile shape for
        density and precision, which is its own kind of appeal for a reader who
        wants to interrogate the evidence rather than be walked through it.
      </ExpandableCopy>
    </div>

    {/* Right two-thirds: visualization, centered */}
    <div className="flex min-h-0 flex-col items-center justify-center gap-3 md:col-span-2 md:h-full">
      {/* Mobile: compact 6x6 subset */}
      <div className="w-full md:hidden">
        <HeatmapChartMobile />
      </div>
      {/* Desktop: full heatmap */}
      <div className="hidden min-h-0 w-full flex-1 items-center justify-center md:flex">
        <HeatmapChart />
      </div>
      <div className="hidden shrink-0 flex-wrap justify-center gap-x-6 gap-y-2 md:flex">
        {HM_CALLOUTS.map((co) => (
          <div key={co.n} className="flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-400 font-mono text-[10px] font-bold text-sky-950">
              {co.n}
            </span>
            <span className="text-xs text-neutral-400">{co.note}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Scatter view: Implementation Readiness vs Transformation Durability ---
// Coordinates reuse the heatmap's "Impl. Readiness" (col 11) and
// "Transformation" (col 14) columns so the views stay consistent.

const SCATTER = HEATMAP.map((p) => ({
  name: p.name,
  x: p.v[11],
  y: p.v[14],
  hi: p.name.includes("(UBC)") || p.name.includes("(UI)"),
}));

const SC_L = 92;
const SC_R = 958;
const SC_T = 40;
const SC_B = 556;
const SC_XMIN = 18;
const SC_XMAX = 95;
const SC_YMIN = 0;
const SC_YMAX = 63;
const SC_XTICKS = [20, 30, 40, 50, 60, 70, 80, 90];
const SC_YTICKS = [0, 10, 20, 30, 40, 50, 60];

const scX = (v: number) =>
  SC_L + ((v - SC_XMIN) / (SC_XMAX - SC_XMIN)) * (SC_R - SC_L);
const scY = (v: number) =>
  SC_B - ((v - SC_YMIN) / (SC_YMAX - SC_YMIN)) * (SC_B - SC_T);

const ScatterChart = () => (
  <svg
    viewBox="0 0 1000 640"
    className="mx-auto h-auto w-full overflow-visible md:h-full md:max-h-full md:w-auto md:max-w-full"
    aria-hidden="true"
  >
    {/* Plot backdrop */}
    <rect
      x={SC_L}
      y={SC_T}
      width={SC_R - SC_L}
      height={SC_B - SC_T}
      fill="#ffffff"
      fillOpacity="0.02"
      stroke="#ffffff"
      strokeOpacity="0.1"
    />
    {/* Grid + ticks */}
    {SC_XTICKS.map((t) => (
      <g key={`x${t}`}>
        <line
          x1={scX(t)}
          y1={SC_T}
          x2={scX(t)}
          y2={SC_B}
          stroke="#ffffff"
          strokeOpacity="0.05"
          strokeWidth="1"
        />
        <text
          x={scX(t)}
          y={SC_B + 20}
          textAnchor="middle"
          fontSize="12"
          className="fill-neutral-500 font-mono"
        >
          {t}
        </text>
      </g>
    ))}
    {SC_YTICKS.map((t) => (
      <g key={`y${t}`}>
        <line
          x1={SC_L}
          y1={scY(t)}
          x2={SC_R}
          y2={scY(t)}
          stroke="#ffffff"
          strokeOpacity="0.05"
          strokeWidth="1"
        />
        <text
          x={SC_L - 12}
          y={scY(t) + 4}
          textAnchor="end"
          fontSize="12"
          className="fill-neutral-500 font-mono"
        >
          {t}
        </text>
      </g>
    ))}
    {/* Axis titles */}
    <text
      x={(SC_L + SC_R) / 2}
      y={SC_B + 52}
      textAnchor="middle"
      fontSize="14"
      className="fill-neutral-300"
    >
      Implementation Readiness (Easier to deploy →)
    </text>
    <text
      x={30}
      y={(SC_T + SC_B) / 2}
      textAnchor="middle"
      fontSize="14"
      className="fill-neutral-300"
      transform={`rotate(-90, 30, ${(SC_T + SC_B) / 2})`}
    >
      Transformation Durability (Survives AGI better →)
    </text>
    {/* Points + labels */}
    {SCATTER.map((p) => {
      const cx = scX(p.x);
      const cy = scY(p.y);
      const dy = p.name.includes("(UBI)") ? 24 : -14;
      return (
        <g key={p.name}>
          <circle
            cx={cx}
            cy={cy}
            r="8"
            fill={p.hi ? "#3b82f6" : "#94a3b8"}
            stroke="#0a0a0a"
            strokeWidth="1.5"
          />
          <text
            x={cx}
            y={cy + dy}
            textAnchor="middle"
            fontSize="12"
            fontWeight={p.hi ? 700 : 400}
            fill={p.hi ? "#93c5fd" : "#cbd5e1"}
            className="hidden md:block"
          >
            {p.name}
          </text>
        </g>
      );
    })}
  </svg>
);

const ScatterConsiderationsSlide = () => (
  <div className="relative flex h-full w-full flex-col bg-neutral-950 px-6 pt-16 pb-24 md:grid md:grid-cols-3 md:items-center md:gap-10 md:px-14 md:py-0">
    {/* Left third: headline + subcopy */}
    <div className="mb-4 flex flex-col justify-center md:col-span-1 md:mb-0">
      <span className="mb-2 block font-mono text-sm uppercase tracking-widest text-sky-400">
        Visualization Mechanism
      </span>
      <h2 className="mb-4 text-2xl font-bold tracking-tighter text-white md:text-3xl lg:text-4xl">
        Proposed Visualization #3: Scatter Plots
      </h2>
      <ExpandableCopy pClassName="text-sm leading-relaxed text-neutral-400 md:text-base">
        A scatter plot trades breadth for focus: it drops to two dimensions at a
        time and, in return, makes the trade-off between them visible as space.
        With transformation durability on one axis and implementation readiness
        on the other, each policy finds a quadrant: durable and ready, durable
        but hard to deploy, quick to implement but short-lived, or neither. The
        tensions in the paper&apos;s framework become something you can see
        rather than infer. Letting the reader set each axis
        turns it into a trade-off explorer: choose any two dimensions and watch
        how the policies redistribute. It shows less at once than the matrix,
        deliberately. The point isn&apos;t to compare everything, but to
        interrogate one relationship at a time.
      </ExpandableCopy>
    </div>

    {/* Right two-thirds: scatter, centered */}
    <div className="flex min-h-0 flex-col items-center justify-center md:col-span-2 md:h-full">
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <ScatterChart />
      </div>
    </div>
  </div>
);

// Self-playing, muted, looping video (for silent in-deck playback).
// Sets `muted` imperatively and calls play() so mobile Safari/Chrome reliably
// autoplay (React can miss the muted attribute, which blocks autoplay).
const AutoVideo = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    />
  );
};

// --- Visual reference: prior work (Havas patient profiles radial) ---

const VisualReference1Slide = () => (
  <div className="relative flex h-full w-full flex-col bg-neutral-950 px-6 pt-16 pb-24 md:grid md:grid-cols-3 md:items-center md:gap-10 md:px-14 md:py-0">
    {/* Left third: framing copy */}
    <div className="mb-4 flex flex-col justify-center md:col-span-1 md:mb-0">
      <span className="mb-2 block font-mono text-sm uppercase tracking-widest text-sky-400">
        Prior Work
      </span>
      <h2 className="mb-4 text-3xl font-bold tracking-tighter text-white md:text-4xl lg:text-5xl">
        Visual Reference #2
      </h2>
      <ExpandableCopy pClassName="max-w-md text-base leading-relaxed text-neutral-400 md:text-lg">
        This is a former project of mine also featuring a radar chart approach.
        This one is different in that the radar chart represents data over time,
        in this case showing patient data before and after treatment,
        clearly visualizing a quick and lasting response. This can be a grounding
        for our aesthetic approach to the project.
      </ExpandableCopy>
    </div>

    {/* Right two-thirds: reference image */}
    <div className="flex min-h-0 items-center justify-center md:col-span-2 md:h-full">
      <img
        src="/havas-work-5.jpg"
        alt="Patient profiles radial chart showing patient data before and after treatment, visualized over time."
        className="h-auto max-h-[55vh] w-full max-w-full rounded-2xl border border-white/10 object-contain md:max-h-full md:w-auto"
      />
    </div>
  </div>
);

const VisualReference2Slide = () => (
  <div className="relative flex h-full w-full flex-col bg-neutral-950 px-6 pt-16 pb-24 md:grid md:grid-cols-3 md:items-center md:gap-10 md:px-14 md:py-0">
    {/* Left third: framing copy */}
    <div className="mb-4 flex flex-col justify-center md:col-span-1 md:mb-0">
      <span className="mb-2 block font-mono text-sm uppercase tracking-widest text-sky-400">
        Prior Work
      </span>
      <h2 className="mb-4 text-3xl font-bold tracking-tighter text-white md:text-4xl lg:text-5xl">
        Visual Reference #1
      </h2>
      <ExpandableCopy pClassName="max-w-md text-base leading-relaxed text-neutral-400 md:text-lg">
        This example concerns a recent white paper I produced, and showcases how
        guided scroll can drive visualization, and highlight key takeaways. This
        can be applied in the lead-in to the visualization tool, where we would
        create a tiered experience that allows the casual user to get the key
        messages out of the visualization regardless of their interest in
        interactively digging into the data themselves.
      </ExpandableCopy>
    </div>

    {/* Right two-thirds: two phones side by side. On mobile they size by
        width (capped by height via min()) and keep aspect + shrink-0 so the
        pair scales down together instead of squeezing horizontally. */}
    <div className="flex min-h-0 items-center justify-center gap-3 md:col-span-2 md:h-full md:gap-8">
      {[
        "/Havas_Novartis_WhitePaper_Charts.mp4",
        "/Havas_Novartis_WhitePaper_Squares.mp4",
      ].map((src) => (
        <div
          key={src}
          className="relative aspect-[1290/2796] w-[min(38vw,18vh)] max-h-full shrink-0 overflow-hidden rounded-[2rem] border-[3px] border-neutral-700 bg-black shadow-2xl md:h-[88%] md:w-auto"
        >
          <AutoVideo src={src} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  </div>
);

// --- Closing ---

const ClosingSlide = () => (
  <div className="relative flex h-full w-full flex-col justify-start gap-6 overflow-hidden bg-neutral-950 px-6 pt-16 pb-24 md:justify-between md:gap-0 md:px-16 md:py-20">
    {/* Ambient spiral */}
    <div className="pointer-events-none absolute -right-24 -top-24 opacity-[0.06]">
      <SpiralMark className="h-[560px] w-[560px] blur-[1px]" />
    </div>
    <div className="pointer-events-none absolute right-0 top-0 -z-0 h-[50vh] w-[50vh] translate-x-1/4 -translate-y-1/4 rounded-full bg-blue-500/10 blur-[120px]" />

    {/* Top: headline + supporting sentence */}
    <div className="relative z-10 max-w-4xl">
      <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-6xl lg:text-7xl">
        A starting point for a conversation.
      </h2>
      <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-neutral-300 md:mt-6 md:text-2xl">
        What you&apos;ve seen is an early interpretation of the paper draft, one
        reading of how the ideas might take shape. The real form of the microsite
        is something best defined in collaboration once we get started.
      </p>
    </div>

    {/* Secondary block: two brief notes */}
    <div className="relative z-10 grid max-w-4xl gap-5 border-t border-white/10 pt-8 md:grid-cols-2 md:gap-10">
      <div>
        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-sky-400">
          On the aesthetic
        </span>
        <p className="text-sm leading-relaxed text-neutral-400 md:text-base">
          The dark treatment here is for the deck. The site&apos;s own visual
          register is a separate decision, and I&apos;d lean editorial and
          high-legibility for this audience.
        </p>
      </div>
      <div>
        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-sky-400">
          A first working session
        </span>
        <p className="text-sm leading-relaxed text-neutral-400 md:text-base">
          Where we&apos;d settle which visualization approach (or combination)
          fits best, the site&apos;s visual register, and the priorities within
          scope.
        </p>
      </div>
    </div>

    {/* Bottom: CTA + sign-off */}
    <div className="relative z-10 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-end md:justify-between">
      <p className="max-w-xl text-lg font-light leading-relaxed text-white md:text-xl">
        Thank you, and I look forward to building something useful, engaging,
        and impactful together.
      </p>
      <span className="shrink-0 font-mono text-xs tracking-wide text-neutral-500">
        Graham Roberts &middot; grahaphics.com
      </span>
    </div>
  </div>
);

const SLIDES: { id: string; label: string; node: React.ReactNode }[] = [
  { id: "title", label: "Title", node: <TitleSlide /> },
  {
    id: "structure",
    label: "Structure",
    node: <MicrositeStructureSlide />,
  },
  {
    id: "guided-insight",
    label: "Guided Insight",
    node: <GuidedInsightSlide />,
  },
  {
    id: "visualization",
    label: "Visualization",
    node: <VisualizationMechanismSlide />,
  },
  {
    id: "small-multiples",
    label: "Small Multiples",
    node: <SmallMultiplesSlide />,
  },
  {
    id: "additional-views",
    label: "Heat Maps",
    node: <AdditionalDataViewsSlide />,
  },
  {
    id: "scatter-view",
    label: "Scatter View",
    node: <ScatterConsiderationsSlide />,
  },
  {
    id: "visual-reference-2",
    label: "Visual Reference",
    node: <VisualReference2Slide />,
  },
  {
    id: "visual-reference-1",
    label: "Visual Reference",
    node: <VisualReference1Slide />,
  },
  {
    id: "closing",
    label: "Closing",
    node: <ClosingSlide />,
  },
];

const TOTAL = SLIDES.length;
const TRANSITION_MS = 750;

const variants = {
  enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir: number) => ({ y: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

// ---------------------------------------------------------------------------
// PRESENTATION DECK (identical UX to the main presentation)
// ---------------------------------------------------------------------------

function DeepmindDeck() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const lockRef = useRef(false);
  const indexRef = useRef(0);
  const touchStartY = useRef<number | null>(null);

  const paginate = useCallback((target: number, dir: number) => {
    if (lockRef.current) return;
    if (target < 0 || target >= TOTAL) return;
    lockRef.current = true;
    indexRef.current = target;
    setDirection(dir);
    setIndex(target);
    window.setTimeout(() => {
      lockRef.current = false;
    }, TRANSITION_MS + 150);
  }, []);

  const next = useCallback(() => paginate(indexRef.current + 1, 1), [paginate]);
  const prev = useCallback(() => paginate(indexRef.current - 1, -1), [paginate]);
  const goTo = useCallback(
    (target: number) => paginate(target, target > indexRef.current ? 1 : -1),
    [paginate]
  );

  // Wheel
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Let a horizontally-scrollable region (e.g. the mobile card strip on
      // slide 2) consume the gesture instead of paginating the deck.
      const hs = (e.target as HTMLElement | null)?.closest?.(
        "[data-hscroll]"
      ) as HTMLElement | null;
      if (hs && hs.scrollWidth > hs.clientWidth + 1) {
        const delta =
          Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        hs.scrollLeft += delta;
        e.preventDefault();
        return;
      }
      e.preventDefault();
      if (lockRef.current) return;
      if (Math.abs(e.deltaY) < 12) return;
      if (e.deltaY > 0) next();
      else prev();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(TOTAL - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo]);

  // Touch
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) {
        if (delta > 0) next();
        else prev();
      }
      touchStartY.current = null;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [next, prev]);

  const current = SLIDES[index];

  return (
    <div className="fixed inset-0 overflow-hidden bg-neutral-950 font-sans text-neutral-200 selection:bg-white selection:text-black">
      {/* Exit to site */}
      <Link
        href="/"
        className="fixed left-6 top-6 z-50 flex items-center gap-2 text-white mix-blend-difference transition-opacity hover:opacity-70"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        <span className="font-bold tracking-tight">EXIT</span>
      </Link>

      {/* Slide counter */}
      <div className="fixed right-6 top-6 z-50 font-mono text-sm tracking-widest text-white mix-blend-difference">
        {String(index + 1).padStart(2, "0")}
        <span className="text-neutral-500"> / {String(TOTAL).padStart(2, "0")}</span>
      </div>

      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "tween", ease: [0.65, 0, 0.35, 1], duration: TRANSITION_MS / 1000 },
            opacity: { duration: 0.25 },
          }}
          className="absolute inset-0"
        >
          {current.node}
        </motion.div>
      </AnimatePresence>

      {/* Up/Down affordances (desktop) */}
      <div className="pointer-events-none fixed inset-y-0 right-6 z-40 hidden flex-col items-center justify-center gap-4 md:flex">
        <button
          onClick={prev}
          disabled={index === 0}
          className="pointer-events-auto rounded-full border border-white/15 bg-black/40 p-2 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-20"
          aria-label="Previous slide"
        >
          <ChevronUp className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          onClick={next}
          disabled={index === TOTAL - 1}
          className="pointer-events-auto rounded-full border border-white/15 bg-black/40 p-2 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-20"
          aria-label="Next slide"
        >
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* --- DOT NAV --- */}
      <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3 backdrop-blur-md">
          {SLIDES.map((slide, i) => {
            const active = i === index;
            return (
              <button
                key={slide.id}
                onClick={() => goTo(i)}
                aria-label={`Go to ${slide.label}`}
                aria-current={active ? "true" : undefined}
                title={slide.label}
                className="group relative flex items-center"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-500 ${
                    active
                      ? "w-8 bg-white"
                      : "w-2 bg-neutral-600 group-hover:bg-neutral-400"
                  }`}
                />
              </button>
            );
          })}
          <span className="ml-2 hidden font-mono text-xs uppercase tracking-widest text-neutral-400 sm:block">
            {current.label}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PASSWORD GATE
// ---------------------------------------------------------------------------

export default function DeepmindPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  // Restore unlock state for the session.
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(STORAGE_KEY) === "1"
    ) {
      setUnlocked(true);
    }
    setChecked(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSWORD) {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  // Avoid a flash of the gate before we check sessionStorage.
  if (!checked) {
    return <div className="fixed inset-0 bg-neutral-950" />;
  }

  if (unlocked) {
    return <DeepmindDeck />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-neutral-950 font-sans text-neutral-200">
      {/* Ambient spiral */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.08]">
        <SpiralMark className="h-[120vh] w-[120vh]" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[50vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-950/60 p-8 text-center backdrop-blur-xl"
      >
        <SpiralMark className="mx-auto mb-6 h-14 w-14" />
        <h1 className="mb-1 text-xl font-bold tracking-tight text-white">
          Grahaphics <span className="font-light text-neutral-500">×</span>{" "}
          DeepMind
        </h1>
        <p className="mb-6 text-sm text-neutral-500">
          This proposal is private. Enter the password to continue.
        </p>

        <div
          className={`flex items-center gap-2 rounded-full border bg-black/40 px-4 py-2.5 transition-colors ${
            error ? "border-red-500/60" : "border-white/15 focus-within:border-white/40"
          }`}
        >
          <Lock className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
          <input
            type="password"
            value={value}
            autoFocus
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            aria-label="Password"
            className="w-full bg-transparent text-sm text-white placeholder:text-neutral-600 focus:outline-none"
          />
        </div>

        {error && (
          <p className="mt-3 text-xs font-mono uppercase tracking-widest text-red-400">
            Incorrect password
          </p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-neutral-200"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
