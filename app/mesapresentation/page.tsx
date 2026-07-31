"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronUp, Trophy } from "lucide-react";
import Link from "next/link";
import AutoVideo from "../components/AutoVideo";

// ---------------------------------------------------------------------------
// SHARED: AWARD TAGS (carried across project slides)
// ---------------------------------------------------------------------------

type Award = { label: string; highlight?: boolean };

const AwardTags = ({
  awards,
  vertical = false,
}: {
  awards: Award[];
  vertical?: boolean;
}) => (
  <div
    className={`flex gap-2 ${
      vertical ? "flex-col items-end" : "flex-wrap gap-3"
    }`}
  >
    {awards.map((award) => (
      <div
        key={award.label}
        className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono uppercase tracking-wide ${
          award.highlight
            ? "border-yellow-700/50 bg-yellow-900/20 text-yellow-500"
            : "border-neutral-700 bg-neutral-800 text-neutral-400"
        }`}
      >
        {award.highlight && <Trophy className="h-3 w-3" aria-hidden="true" />}
        {award.label}
      </div>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// SLIDE CONTENT COMPONENTS
// ---------------------------------------------------------------------------

const IntroSlide = () => (
  <div className="grid h-full w-full grid-cols-1 md:grid-cols-2">
    {/* Left: Typography & Intro */}
    <div className="order-2 flex flex-col justify-center bg-neutral-950 px-6 py-10 md:order-1 md:px-24">
      <span className="mb-4 block font-mono text-sm uppercase tracking-widest text-blue-500">
        Profile &amp; Biography
      </span>
      <h1 className="mb-6 text-5xl font-bold leading-[0.9] tracking-tighter text-white md:mb-8 md:text-7xl lg:text-8xl">
        GRAHAM <br /> ROBERTS
      </h1>
      <div className="mb-6 h-1 w-24 bg-neutral-800 md:mb-8" />
      <p className="max-w-md text-lg font-light leading-relaxed text-neutral-400 md:text-2xl">
        Senior Design Leader operating at the frontier of AI, information
        design, and digital storytelling.
      </p>
    </div>

    {/* Right: The Portrait */}
    <div className="group relative order-1 h-[40vh] overflow-hidden border-neutral-800 md:order-2 md:h-full md:border-l">
      <img
        src="/graham-headshotbw.jpg"
        alt="Graham Roberts"
        className="h-full w-full object-cover grayscale transition-all duration-1000 ease-out group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent md:hidden" />
    </div>
  </div>
);

const PhilosophySlide = () => (
  <div className="flex h-full w-full items-center justify-center bg-neutral-950 px-6">
    <div className="mx-auto max-w-4xl text-center">
      <span className="mb-8 block font-mono text-sm uppercase tracking-widest text-neutral-500">
        The Philosophy
      </span>
      <blockquote className="mb-10 font-serif text-3xl italic leading-tight text-white md:text-5xl">
        &ldquo;Information design is a very human place, where we strive to
        understand the world around us, and to share that understanding in ever
        more efficient, effective, and engaging ways.&rdquo;
      </blockquote>
      <div className="mx-auto mb-10 h-1 w-24 bg-neutral-800" />
      <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-400">
        I have spent my career operating in this space, leading diverse teams to
        produce award-winning work across journalism, technology, marketing, and
        academia&mdash;guiding organizations through technological shifts, from
        the rise of mobile formats to the integration of generative AI.
      </p>
    </div>
  </div>
);

type SplitSlideProps = {
  eyebrow: string;
  title: string;
  image: string;
  imageAlt: string;
  imageSide: "left" | "right";
  accent: string;
  children: React.ReactNode;
};

const SplitSlide = ({
  eyebrow,
  title,
  image,
  imageAlt,
  imageSide,
  accent,
  children,
}: SplitSlideProps) => {
  const imageBlock = (
    <div className="group relative h-[38vh] overflow-hidden md:h-full">
      <img
        src={image}
        alt={imageAlt}
        className="h-full w-full object-cover opacity-80 transition-all duration-[2s] group-hover:scale-105 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 to-transparent md:bg-gradient-to-r md:from-transparent md:to-neutral-950/30" />
    </div>
  );

  const textBlock = (
    <div className="flex h-full flex-col justify-center overflow-y-auto bg-neutral-950 px-6 py-10 md:px-20">
      <div className="mx-auto w-full max-w-xl">
        <span
          className={`mb-4 block font-mono text-sm uppercase tracking-widest ${accent}`}
        >
          {eyebrow}
        </span>
        <h2 className="mb-8 text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
          {title}
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-neutral-400 md:text-xl">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid h-full w-full grid-cols-1 md:grid-cols-2">
      {imageSide === "left" ? (
        <>
          <div className="order-1">{imageBlock}</div>
          <div className="order-2">{textBlock}</div>
        </>
      ) : (
        <>
          <div className="order-2 md:order-1">{textBlock}</div>
          <div className="order-1 md:order-2">{imageBlock}</div>
        </>
      )}
    </div>
  );
};

const BerkeleySlide = () => (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
    <img
      src="/berkeley-about.jpg"
      alt="Berkeley Hills"
      className="absolute inset-0 z-0 h-full w-full object-cover object-[center_calc(50%_-_150px)] opacity-60"
    />
    <div className="absolute inset-0 z-10 bg-black/50" />
    <div className="relative z-20 max-w-3xl px-6 text-center">
      <span className="mb-8 block font-mono text-sm uppercase tracking-widest text-emerald-400/80">
        Life Outside the Work
      </span>
      <p className="font-serif text-3xl leading-tight text-white drop-shadow-xl md:text-5xl">
        &ldquo;I live amongst the turkey and deer in the Berkeley Hills of
        California with my partner Jessica, our son Roman, and our bulldog
        Ralphie.&rdquo;
      </p>
    </div>
  </div>
);

const TheWorkSlide = () => (
  <div className="flex h-full w-full flex-col items-center justify-center bg-black px-6 text-center">
    <h2 className="text-6xl font-bold tracking-tighter text-white md:text-8xl lg:text-9xl">
      The Work
    </h2>
    <div className="mt-8 flex items-center gap-4 md:gap-6">
      {/* Left decorative element */}
      <span className="hidden h-px w-16 bg-gradient-to-r from-transparent via-blue-500/40 to-blue-500 md:block" />
      <span className="h-1.5 w-1.5 rotate-45 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
      <p className="text-xl font-light tracking-[0.2em] text-neutral-300 md:text-3xl">
        Designing understanding
      </p>
      {/* Right decorative element */}
      <span className="h-1.5 w-1.5 rotate-45 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
      <span className="hidden h-px w-16 bg-gradient-to-l from-transparent via-blue-500/40 to-blue-500 md:block" />
    </div>
  </div>
);

const NytCoverSlide = () => (
  <div className="relative flex h-full w-full items-end overflow-hidden">
    <img
      src="/video-hero.jpg"
      alt="The New York Times — Innovation in Visual Storytelling"
      className="absolute inset-0 z-0 h-full w-full object-cover opacity-60"
    />
    <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-neutral-950/10" />
    <div className="relative z-20 max-w-4xl px-6 pb-20 md:px-24 md:pb-28">
      <span className="mb-4 block font-mono text-sm uppercase tracking-widest text-white/70">
        The New York Times
      </span>
      <h2 className="mb-8 text-5xl font-bold leading-[0.95] tracking-tighter text-white md:text-7xl lg:text-8xl">
        Innovation in <br /> Visual Storytelling
      </h2>
      <p className="max-w-2xl text-lg font-light leading-relaxed text-neutral-300 md:text-2xl">
        My decade at The New York Times focused on innovation in visual
        storytelling, and how the convergence of new technologies and platforms
        would change how we interact with and understand information.
      </p>
    </div>
  </div>
);

const SnowFallSlide = () => (
  <div className="flex h-full w-full flex-col bg-neutral-950 md:grid md:grid-cols-5">
    {/* Text column */}
    <div className="order-2 flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-6 py-8 md:order-1 md:col-span-2 md:h-full md:px-16">
      <div className="mb-4 font-mono text-sm uppercase tracking-widest text-blue-500">
        The Breakthrough
      </div>
      <h2 className="mb-3 text-5xl font-bold tracking-tighter text-white md:text-6xl lg:text-7xl">
        Snow Fall
      </h2>
      <p className="mb-6 text-lg text-neutral-400">
        The Avalanche at Tunnel Creek
      </p>
      <div className="mb-6">
        <AwardTags
          awards={[
            { label: "Pulitzer Prize Winner", highlight: true },
            { label: "Peabody Award" },
          ]}
        />
      </div>
      <p className="leading-relaxed text-neutral-400 md:text-lg">
        Snow Fall was the project that coined the term &ldquo;scrollytelling.&rdquo;
        We wanted to break the rigid CMS templates of the time to create a
        reading experience that felt as fluid as the events being described. The
        result was a seamless blend of text, video, and interactive graphics
        that moved with the reader.
      </p>
    </div>

    {/* Imagery column */}
    <div className="order-1 flex h-[40vh] flex-col gap-4 p-4 md:order-2 md:col-span-3 md:h-full md:p-6">
      {/* Hero desktop experience */}
      <div className="relative min-h-0 flex-[2] overflow-hidden rounded-xl border border-neutral-800 bg-black">
        <AutoVideo
          src="/snowfall-desktop.mp4"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[10px] text-white backdrop-blur">
          Desktop Experience
        </div>
      </div>
      {/* BTS row */}
      <div className="grid min-h-0 flex-[1] grid-cols-2 gap-4">
        <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <img
            src="/snowfall-bts-1.jpg"
            alt="Snow Fall storyboard sketches"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute bottom-2 left-2 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/80 backdrop-blur">
            Storyboards
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <AutoVideo
            src="/snowfall-bts-2.mp4"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-2 left-2 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/80 backdrop-blur">
            3D Flythrough
          </div>
        </div>
      </div>
    </div>
  </div>
);

type MusicProjectProps = {
  subtitle: string;
  title: string;
  video: string;
  images: string[];
  awards: Award[];
  accent: string;
};

const MusicProject = ({
  subtitle,
  title,
  video,
  images,
  awards,
  accent,
}: MusicProjectProps) => (
  <div className="flex min-h-0 flex-col">
    {/* Hero motion video */}
    <div className="relative min-h-0 flex-[3] overflow-hidden rounded-xl border border-neutral-800 bg-black">
      <AutoVideo src={video} className="h-full w-full object-cover" />
    </div>
    {/* Label + awards (awards right-aligned, stacked directly below video) */}
    <div className="mt-4 flex shrink-0 items-start justify-between gap-4">
      <div>
        <div className={`mb-1 font-mono text-xs uppercase tracking-widest ${accent}`}>
          {subtitle}
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          {title}
        </h3>
      </div>
      <AwardTags awards={awards} vertical />
    </div>
    {/* Behind-the-scenes stills */}
    <div className="mt-4 grid min-h-0 flex-[1] grid-cols-2 gap-3">
      {images.map((img) => (
        <div
          key={img}
          className="relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900"
        >
          <img
            src={img}
            alt={`${title} behind the scenes`}
            className="h-full w-full object-cover opacity-80"
          />
        </div>
      ))}
    </div>
  </div>
);

const ExplainingMusicSlide = () => (
  <div className="flex h-full w-full flex-col bg-neutral-950 px-6 py-10 md:px-16 md:py-14">
    {/* Header */}
    <div className="mb-6 max-w-4xl shrink-0 md:mb-10">
      <span className="mb-3 block font-mono text-sm uppercase tracking-widest text-violet-400">
        Demystifying Music
      </span>
      <h2 className="mb-4 text-4xl font-bold tracking-tighter text-white md:text-6xl">
        Explaining Music
      </h2>
      <p className="max-w-3xl text-base leading-relaxed text-neutral-400 md:text-xl">
        We produced a number of projects that used information design and visual
        storytelling to give insights into how music is made, how it&apos;s
        structured, and the subtle interaction and decision-making that goes into
        the best of what we consume.
      </p>
    </div>

    {/* Two featured projects */}
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
      <MusicProject
        subtitle="Bieber, Skrillex & Diplo"
        title="Make a Hit"
        video="/bieber-motion.mp4"
        images={["/bieber-1.jpg", "/bieber-2.jpg"]}
        awards={[
          { label: "Edward R. Murrow Award" },
          { label: "Malofiej: Gold Medal" },
        ]}
        accent="text-yellow-400"
      />
      <MusicProject
        subtitle="Kronos Quartet"
        title="Inside the Quartet"
        video="/quartet-motion.mp4"
        images={["/quartet-1.jpg", "/quartet-2.jpg"]}
        awards={[
          { label: "News & Doc Emmy Nomination" },
          { label: "SND: Best of Digital Design" },
        ]}
        accent="text-violet-400"
      />
    </div>
  </div>
);

const NotreDameSlide = () => (
  <div className="flex h-full w-full flex-col bg-neutral-950 md:grid md:grid-cols-5">
    {/* Text column */}
    <div className="order-2 flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-6 py-8 md:order-1 md:col-span-2 md:h-full md:px-16">
      <div className="mb-4 font-mono text-sm uppercase tracking-widest text-orange-500">
        Breaking News, On Deadline
      </div>
      <h2 className="mb-6 text-4xl font-bold tracking-tighter text-white md:text-6xl">
        Reinventing the <br /> Story, in Real Time
      </h2>
      <p className="mb-6 leading-relaxed text-neutral-400 md:text-lg">
        We set out to reimagine how the biggest stories of the moment could be
        told&mdash;finding new and innovative visual forms for major news
        events, and delivering them under the relentless pressure of deadline.
      </p>
      <div className="mb-6 h-px w-16 bg-neutral-800" />
      <p className="mb-6 leading-relaxed text-neutral-400 md:text-lg">
        When the spire of <strong className="text-white">Notre Dame</strong>{" "}
        fell, we turned laser-scan data into a forensic 3D reconstruction that
        explained how the fire spread&mdash;published while the world was still
        watching. The work was later acquired by the{" "}
        <strong className="text-white">Museum of Modern Art</strong> for its
        permanent collection.
      </p>
      <AwardTags
        awards={[
          { label: "MoMA Permanent Collection", highlight: true },
          { label: "Malofiej Gold" },
          { label: "SND Best in Show" },
        ]}
      />
    </div>

    {/* Imagery column */}
    <div className="order-1 flex h-[40vh] flex-col gap-4 p-4 md:order-2 md:col-span-3 md:h-full md:p-6">
      {/* Hero desktop experience */}
      <div className="relative min-h-0 flex-[2] overflow-hidden rounded-xl border border-neutral-800 bg-black">
        <AutoVideo
          src="/notredame-desktop.mp4"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[10px] text-white backdrop-blur">
          Desktop Experience
        </div>
      </div>
      {/* BTS row */}
      <div className="grid min-h-0 flex-[1] grid-cols-2 gap-4">
        <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <img
            src="/notredame-bts-1.jpg"
            alt="Notre Dame point cloud scan"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute bottom-2 left-2 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/80 backdrop-blur">
            Point Cloud
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <img
            src="/notredame-bts-2.jpg"
            alt="Notre Dame 3D wireframe reconstruction"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute bottom-2 left-2 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/80 backdrop-blur">
            3D Reconstruction
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PolarVortexSlide = () => (
  <div className="flex h-full w-full flex-col bg-neutral-950 md:grid md:grid-cols-5">
    {/* Text column */}
    <div className="order-2 flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-6 py-8 md:order-1 md:col-span-2 md:h-full md:px-16">
      <div className="mb-4 font-mono text-sm uppercase tracking-widest text-cyan-400">
        Innovation in Data Storytelling
      </div>
      <h2 className="mb-3 text-4xl font-bold tracking-tighter text-white md:text-6xl">
        The Polar Vortex
      </h2>
      <p className="mb-6 text-lg text-neutral-400">
        Making a planetary phenomenon legible
      </p>
      <p className="mb-6 leading-relaxed text-neutral-400 md:text-lg">
        The term &ldquo;Polar Vortex&rdquo; was everywhere in the media, but
        rarely understood. We set out to create a definitive visual explanation
        of how a disruption in the stratosphere can trigger extreme cold snaps
        on the ground.
      </p>
      <p className="mb-6 leading-relaxed text-neutral-400 md:text-lg">
        By visualizing wind patterns and temperature data on a planetary scale
        in 3D, we turned a complex meteorological phenomenon into a clear,
        compelling narrative&mdash;pushing the craft of data storytelling
        forward.
      </p>
      <AwardTags
        awards={[
          { label: "Malofiej Silver" },
          { label: "SND Award of Excellence" },
        ]}
      />
    </div>

    {/* Imagery column */}
    <div className="order-1 flex h-[40vh] flex-col gap-4 p-4 md:order-2 md:col-span-3 md:h-full md:p-6">
      {/* Hero desktop experience */}
      <div className="relative min-h-0 flex-[2] overflow-hidden rounded-xl border border-neutral-800 bg-black">
        <AutoVideo
          src="/polar-desktop.mp4"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[10px] text-white backdrop-blur">
          Desktop Experience
        </div>
      </div>
      {/* BTS row */}
      <div className="grid min-h-0 flex-[1] grid-cols-2 gap-4">
        <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <img
            src="/polar-bts-1.jpg"
            alt="Atmospheric data visualization"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute bottom-2 left-2 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/80 backdrop-blur">
            Atmospheric Data
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <img
            src="/polar-bts-2.jpg"
            alt="Global temperature map"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute bottom-2 left-2 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/80 backdrop-blur">
            Global Scale
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ImmersiveTeamSlide = () => (
  <div className="relative flex h-full w-full items-center overflow-hidden">
    <img
      src="/oculus-vr.jpg"
      alt="NYT VR Daydream and Oculus interface"
      className="absolute inset-0 z-0 h-full w-full object-cover"
    />
    {/* Subtle vignette only — keeps the image bright */}
    <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/40 to-transparent" />
    <div className="relative z-20 w-full px-6 md:px-16">
      <div className="max-w-2xl rounded-2xl border border-white/15 bg-neutral-950/40 p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl md:p-12">
        <span className="mb-4 block font-mono text-sm uppercase tracking-widest text-sky-400">
          The New York Times &middot; A New Discipline
        </span>
        <h2 className="mb-6 text-4xl font-bold leading-[1.05] tracking-tighter text-white md:text-5xl lg:text-6xl">
          Founding the Immersive Storytelling Team
        </h2>
        <p className="mb-8 text-lg font-light leading-relaxed text-neutral-300 md:text-xl">
          I founded and led a new team built to push further on emerging
          technologies and platforms&mdash;bringing together multiple
          disciplines under one conceptual umbrella to reimagine how stories
          could be experienced.
        </p>
        <div className="flex flex-wrap gap-3">
          {["Filmmaking", "Product Design", "Spatial Design"].map(
            (discipline) => (
              <span
                key={discipline}
                className="rounded-full border border-white/25 bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-white"
              >
                {discipline}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  </div>
);

const LAUREL_LEAVES = [
  { cx: 40, cy: 14, r: -40 },
  { cx: 31, cy: 27, r: -28 },
  { cx: 26, cy: 42, r: -12 },
  { cx: 25, cy: 57, r: 2 },
  { cx: 27, cy: 72, r: 16 },
  { cx: 33, cy: 87, r: 32 },
  { cx: 41, cy: 99, r: 48 },
];

const LaurelBranch = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 50 110" className={className} fill="none" aria-hidden="true">
    <path
      d="M44 8 C 22 32 22 78 44 102"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {LAUREL_LEAVES.map((leaf, i) => (
      <ellipse
        key={i}
        cx={leaf.cx}
        cy={leaf.cy}
        rx="6"
        ry="2.6"
        fill="currentColor"
        transform={`rotate(${leaf.r} ${leaf.cx} ${leaf.cy})`}
      />
    ))}
  </svg>
);

const TribecaLaurel = () => (
  <div className="inline-flex items-center gap-2 text-yellow-400">
    <LaurelBranch className="h-14 w-auto" />
    <div className="text-center leading-tight">
      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-yellow-400/80">
        Official Selection
      </div>
      <div className="font-serif text-base font-bold text-white md:text-lg">
        Tribeca Film Festival
      </div>
    </div>
    <LaurelBranch className="h-14 w-auto -scale-x-100" />
  </div>
);

const AntarcticaSlide = () => (
  <div className="flex h-full w-full flex-col bg-neutral-950 md:grid md:grid-cols-5">
    {/* Text column */}
    <div className="order-2 flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-6 py-8 md:order-1 md:col-span-2 md:px-16">
      <div className="mb-4 font-mono text-sm uppercase tracking-widest text-indigo-400">
        Filmmaking &middot; 360° Capture
      </div>
      <h2 className="mb-2 text-4xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
        The Antarctica Series
      </h2>
      <p className="mb-5 text-lg text-neutral-400">Four-Part VR Documentary</p>
      <p className="mb-6 leading-relaxed text-neutral-400 md:text-lg">
        We pushed 360° capture technology into uncharted territory&mdash;
        producing first-of-its-kind footage of the melting continent at{" "}
        <strong className="text-white">8K per eye</strong>, in full{" "}
        <strong className="text-white">stereoscopic 3D</strong>. Custom camera
        rigs were engineered to survive the extreme cold and capture the ice
        shelf as it had never been seen.
      </p>
      <div className="mb-6">
        <TribecaLaurel />
      </div>
      <AwardTags
        awards={[
          { label: "News & Doc Emmy: New Approaches", highlight: true },
          { label: "World Press Photo: Immersive" },
        ]}
      />
    </div>

    {/* Imagery column */}
    <div className="order-1 flex h-[40vh] flex-col gap-4 p-4 md:order-2 md:col-span-3 md:h-full md:p-6">
      {/* Hero film — kept as the primary focus */}
      <div className="relative min-h-0 flex-[2] overflow-hidden rounded-xl border border-neutral-800 bg-black">
        <AutoVideo
          src="/antarctica-motion.mp4"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[10px] text-white backdrop-blur">
          Part 1 &middot; 8K Stereoscopic 360°
        </div>
      </div>
      {/* Remaining three parts of the series */}
      <div className="grid min-h-0 flex-[1] grid-cols-3 gap-4">
        {[
          { src: "/antarctica-part2.jpg", label: "Part 2" },
          { src: "/antarctica-part3.jpg", label: "Part 3" },
          { src: "/antarctica-part4.jpg", label: "Part 4" },
        ].map((part) => (
          <div
            key={part.src}
            className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
          >
            <img
              src={part.src}
              alt={`The Antarctica Series ${part.label}`}
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute bottom-2 left-2 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/80 backdrop-blur">
              {part.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SpatialHackathonSlide = () => (
  <div className="flex h-full w-full flex-col items-center justify-center bg-neutral-950 px-6 pt-10 pb-28 md:px-16 md:pt-12 md:pb-28">
    {/* Header */}
    <div className="mb-5 w-full max-w-5xl shrink-0 md:mb-6">
      <div className="mb-3 font-mono text-sm uppercase tracking-widest text-emerald-400">
        Spatial Design &middot; Hackathon Breakthrough
      </div>
      <h2 className="text-4xl font-bold leading-[1.05] tracking-tighter text-white md:text-5xl lg:text-6xl">
        Designing the Article as a Window
      </h2>
    </div>

    {/* AR demo — full frame, never cropped (split-screen video) */}
    <div className="relative flex min-h-0 w-full max-w-5xl flex-1 items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-black">
      <AutoVideo
        src="/AR_FirstPrototypeDemo.mp4"
        className="h-full w-full object-contain"
      />
      <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur-md">
        First AR Prototype &middot; Met Galleries
      </div>
    </div>

    {/* Copy + outcome */}
    <div className="mt-5 grid w-full max-w-5xl shrink-0 gap-4 md:mt-6 md:grid-cols-2 md:items-center md:gap-8">
      <p className="leading-relaxed text-neutral-400 md:text-lg">
        During a hackathon, we reimagined an arts article about the Met&apos;s
        galleries around an emerging idea: the camera as a storytelling surface.
        Rather than a flat page, the phone became a{" "}
        <strong className="text-white">window</strong>&mdash;using augmented
        reality to let readers look <em>through</em> the screen and into the
        story.
      </p>
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
        <span className="text-emerald-400">&rarr;</span>
        <p className="text-sm font-medium text-emerald-200 md:text-base">
          The breakthrough that launched two years of spatial design
          exploration.
        </p>
      </div>
    </div>
  </div>
);

type ARProjectProps = {
  subtitle: string;
  title: string;
  description: React.ReactNode;
  desktop: string;
  mobile: string;
  awards: Award[];
  accent: string;
};

const ARProjectSlide = ({
  subtitle,
  title,
  description,
  desktop,
  mobile,
  awards,
  accent,
}: ARProjectProps) => (
  <div className="flex h-full w-full flex-col bg-neutral-950 md:grid md:grid-cols-5">
    {/* Text column */}
    <div className="order-2 flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-6 py-8 md:order-1 md:col-span-2 md:h-full md:px-16">
      <div className={`mb-4 font-mono text-sm uppercase tracking-widest ${accent}`}>
        Spatial Design &middot; {subtitle}
      </div>
      <h2 className="mb-6 text-4xl font-bold leading-[1.05] tracking-tighter text-white md:text-5xl">
        {title}
      </h2>
      <p className="mb-6 leading-relaxed text-neutral-400 md:text-lg">
        {description}
      </p>
      <AwardTags awards={awards} />
    </div>

    {/* Media column — phone and desktop balanced side by side, each sized to
        its native aspect ratio so object-cover fills with no crop. */}
    <div className="order-1 h-[40vh] p-4 md:order-2 md:col-span-3 md:h-full md:p-6">
      <div className="flex h-full w-full items-center justify-center gap-4 md:gap-6">
        {/* Phone */}
        <div className="relative aspect-[886/1920] h-[82%] max-w-[42%] overflow-hidden rounded-2xl border-2 border-neutral-700 bg-black shadow-2xl">
          <AutoVideo src={mobile} className="h-full w-full object-cover" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-white backdrop-blur">
            On Device
          </div>
        </div>
        {/* Desktop */}
        <div className="relative aspect-[2772/1426] w-[58%] max-h-full overflow-hidden rounded-xl border border-neutral-800 bg-black shadow-2xl">
          <AutoVideo src={desktop} className="h-full w-full object-cover" />
          <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-white backdrop-blur">
            Desktop
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CONTINUED_EXPERIMENTS = [
  {
    video: "/honor-box-mobile.mp4",
    title: "The Honor Box",
    category: "Official Launch",
    accent: "text-orange-400",
  },
  {
    video: "/mars-mobile.mp4",
    title: "Mars InSight Lander",
    category: "Space Science",
    accent: "text-rose-400",
  },
  {
    video: "/torch-mobile.mp4",
    title: "Lady Liberty's Torch",
    category: "History & Monuments",
    accent: "text-amber-400",
  },
  {
    video: "/aqi-mobile.mp4",
    title: "Air Quality Index",
    category: "Climate & Data",
    accent: "text-emerald-400",
  },
  {
    video: "/ashley-mobile.mp4",
    title: "Ashley Graham",
    category: "Culture & Fashion",
    accent: "text-fuchsia-400",
  },
  {
    video: "/lakeith-mobile.mp4",
    title: "Lakeith Stanfield",
    category: "Film & Portraiture",
    accent: "text-sky-400",
  },
];

const ContinuedExperimentsSlide = () => (
  <div className="flex h-full w-full flex-col bg-neutral-950 px-6 pt-12 pb-24 md:px-16">
    {/* Header */}
    <div className="mb-6 max-w-4xl shrink-0 md:mb-8">
      <span className="mb-3 block font-mono text-sm uppercase tracking-widest text-emerald-400">
        Spatial Design &middot; A Living Practice
      </span>
      <h2 className="mb-4 text-4xl font-bold tracking-tighter text-white md:text-6xl">
        Experimenting Across Every Subject
      </h2>
      <p className="max-w-3xl text-base leading-relaxed text-neutral-400 md:text-xl">
        We kept pushing the medium forward&mdash;applying spatial design and
        augmented reality to an ever-widening range of subjects, from science
        and history to climate and culture.
      </p>
    </div>

    {/* Phone examples */}
    <div className="flex min-h-0 flex-1 items-center justify-center gap-3 md:gap-5">
      {CONTINUED_EXPERIMENTS.map((item) => (
        <figure
          key={item.video}
          className="flex h-full flex-col items-center justify-center"
        >
          <div className="relative aspect-[886/1920] h-[76%] max-w-full overflow-hidden rounded-2xl border-2 border-neutral-700 bg-black shadow-xl">
            <AutoVideo src={item.video} className="h-full w-full object-cover" />
          </div>
          <figcaption className="mt-3 text-center">
            <div
              className={`font-mono text-[9px] uppercase tracking-widest ${item.accent}`}
            >
              {item.category}
            </div>
            <div className="text-xs font-bold text-white md:text-sm">
              {item.title}
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// SLIDE REGISTRY
// ---------------------------------------------------------------------------

const SLIDES: { id: string; label: string; node: React.ReactNode }[] = [
  { id: "intro", label: "Intro", node: <IntroSlide /> },
  { id: "philosophy", label: "Philosophy", node: <PhilosophySlide /> },
  {
    id: "havas",
    label: "Havas",
    node: (
      <SplitSlide
        eyebrow="Building a Discipline"
        title="Havas Global Network"
        image="/havas-about.jpg"
        imageAlt="Havas Health Concept"
        imageSide="left"
        accent="text-blue-400"
      >
        <p>
          Most recently, I served as{" "}
          <strong className="text-white">
            EVP of Global Information Design
          </strong>
          , where I built a new design practice from the ground up.
        </p>
        <p>
          Operating in the high-stakes world of health and biotech, I led teams
          exploring how AI and emerging technologies can converge with human
          creativity to clarify critical health data for physicians and patients
          alike.
        </p>
      </SplitSlide>
    ),
  },
  {
    id: "google",
    label: "Google",
    node: (
      <SplitSlide
        eyebrow="Brand & Culture"
        title="Google Brand Studio"
        image="/google-about.jpg"
        imageAlt="Graham at Google"
        imageSide="right"
        accent="text-red-400"
      >
        <p>
          Previously, I led digital design at the{" "}
          <strong className="text-white">Google Brand Studio</strong>. My work
          focused on solving brand challenges through digital innovation.
        </p>
        <p>
          I used Search data to connect the dots between Google&apos;s mission
          and the cultural insights buried within the world&apos;s largest
          information engine.
        </p>
      </SplitSlide>
    ),
  },
  {
    id: "nyt",
    label: "NYT",
    node: (
      <SplitSlide
        eyebrow="A Decade of News"
        title="The New York Times"
        image="/nyt-about.jpg"
        imageAlt="NYT Newsroom"
        imageSide="left"
        accent="text-neutral-300"
      >
        <p>
          As{" "}
          <strong className="text-white">
            Director of Immersive Storytelling
          </strong>
          , my career tracked the rise of digital platforms, exploring how
          integrated media could enhance the report.
        </p>
        <p>
          I led projects from <em>Snow Fall</em>&mdash;a Pulitzer
          Prize-winning exploration of digital storytelling&mdash;to NYT VR and
          bringing Augmented Reality to the core news app.
        </p>
        <p className="border-l-2 border-blue-500 pl-4 text-base text-neutral-400">
          My work <em>Why Notre Dame Was a Tinderbox</em> was acquired by the{" "}
          <strong className="text-white">Museum of Modern Art (MoMA)</strong>{" "}
          for its permanent collection.
        </p>
      </SplitSlide>
    ),
  },
  { id: "berkeley", label: "Berkeley", node: <BerkeleySlide /> },
  { id: "the-work", label: "The Work", node: <TheWorkSlide /> },
  { id: "nyt-cover", label: "NYT", node: <NytCoverSlide /> },
  { id: "snow-fall", label: "Snow Fall", node: <SnowFallSlide /> },
  { id: "explaining-music", label: "Explaining Music", node: <ExplainingMusicSlide /> },
  { id: "notre-dame", label: "Notre Dame", node: <NotreDameSlide /> },
  { id: "polar-vortex", label: "Polar Vortex", node: <PolarVortexSlide /> },
  { id: "immersive-team", label: "The Team", node: <ImmersiveTeamSlide /> },
  { id: "antarctica", label: "Antarctica", node: <AntarcticaSlide /> },
  { id: "spatial-hackathon", label: "Spatial Design", node: <SpatialHackathonSlide /> },
  {
    id: "olympics-ar",
    label: "Olympics AR",
    node: (
      <ARProjectSlide
        subtitle="Spatial Analysis"
        title="Four of the Best Olympians"
        description={
          <>
            The first full spatial experience we shipped. We scanned the top
            athletes of the Games using photogrammetry, letting readers project
            them at real scale into their own space&mdash;frozen
            mid-performance&mdash;to explore the mechanics of their sport.
          </>
        }
        desktop="/olympics-desktop.mp4"
        mobile="/olympics-mobile.mp4"
        awards={[
          { label: "SND Gold Medal", highlight: true },
          { label: "Lumiere Award Winner" },
        ]}
        accent="text-amber-400"
      />
    ),
  },
  {
    id: "bowie-ar",
    label: "Bowie AR",
    node: (
      <ARProjectSlide
        subtitle="Cultural Heritage"
        title="David Bowie in 3 Dimensions"
        description={
          <>
            A culture project built on that same technology&mdash;bringing a
            museum exhibit of Bowie&apos;s iconic costumes into your space in
            high fidelity. We were obsessive about detail, developing custom
            shaders that recreated how each material sparkled and shined on a
            phone screen.
          </>
        }
        desktop="/bowie-desktop.mp4"
        mobile="/bowie-mobile.mp4"
        awards={[
          { label: "Webby Award Winner", highlight: true },
          { label: "Deadline Club Winner" },
        ]}
        accent="text-fuchsia-400"
      />
    ),
  },
  {
    id: "syria-ar",
    label: "Syria AR",
    node: (
      <ARProjectSlide
        subtitle="Forensic Architecture"
        title="One Building, One Bomb"
        description={
          <>
            An Emmy-winning visual investigation. In partnership with Forensic
            Architecture, we reconstructed the scene of a chemical attack in
            Syria in 3D&mdash;letting readers walk the rooftop where the bomb
            landed and examine the evidence for themselves.
          </>
        }
        desktop="/syria-desktop.mp4"
        mobile="/syria-mobile.mp4"
        awards={[{ label: "News & Doc Emmy Winner", highlight: true }]}
        accent="text-rose-400"
      />
    ),
  },
  {
    id: "continued-experiments",
    label: "More Experiments",
    node: <ContinuedExperimentsSlide />,
  },
];

const TOTAL = SLIDES.length;
const TRANSITION_MS = 750;

// Vertical slide transition — each advance frames a new slide.
const variants = {
  enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir: number) => ({ y: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

// ---------------------------------------------------------------------------
// PRESENTATION SHELL
// ---------------------------------------------------------------------------

export default function MesaPresentation() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Locks input during a transition so one gesture advances exactly one slide.
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

  const next = useCallback(
    () => paginate(indexRef.current + 1, 1),
    [paginate]
  );
  const prev = useCallback(
    () => paginate(indexRef.current - 1, -1),
    [paginate]
  );
  const goTo = useCallback(
    (target: number) =>
      paginate(target, target > indexRef.current ? 1 : -1),
    [paginate]
  );

  // Wheel: throttle trackpad inertia via the transition lock.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (lockRef.current) return;
      if (Math.abs(e.deltaY) < 12) return;
      if (e.deltaY > 0) next();
      else prev();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  // Keyboard navigation.
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

  // Touch (swipe) navigation.
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
