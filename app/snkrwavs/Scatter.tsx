"use client";

import React, { useEffect, useRef } from "react";
import { type Flurry, type Song, flurryAt, songAt, songFade } from "./loop";

// The wood block, drawn as sparks rather than as anything that turns. Every
// strike of a run throws one dot somewhere on the page, and each dot is dimmer
// than the one before it, the way the run falls away. They do not gather: a dot
// is gone almost as soon as it lands, so what you see is two or three of them
// at a time skittering about the screen for three beats, and then nothing for
// sixteen bars.
//
// It is laid over everything, rings included, since the block plays over
// everything too.

// Of the shorter side of the window, so a dot is the same size against the
// drawing whatever the window is.
const DOT = 0.0045;
// Beats a dot lasts. Strikes land a sixth of a beat apart, so this is a little
// under three strikes' worth: enough to see one land while the last is going.
const LIFE = 0.45;
// Of the window left clear at the edges, so a dot never lands half off the
// page or under the header and the controls.
const MARGIN = 0.07;
// A dot fully lit would flatten the fade the run is all about, so the brightest
// strike of a run stops short of white.
const PEAK = 0.9;

type Spark = { x: number; y: number; born: number; level: number };

export default function Scatter({
  song,
  part,
  elapsed,
}: {
  song: Song;
  part: Flurry;
  elapsed: () => number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Dots appearing and vanishing six times a beat is a flicker, and asked
    // for less of it the run is drawn as a spray instead: the same dots in the
    // same places, held long enough to overlap and dimmed, so it reads as a
    // scatter building and clearing rather than as flashing.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let frame = 0;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // What is on screen, oldest first, and which strike threw the last of
    // them: a strike is drawn once, on the frame the run first reaches it.
    let sparks: Spark[] = [];
    let struck: number | null = null;
    let painted = 0;

    const tick = () => {
      const beats = songAt(song, elapsed());
      const strike = flurryAt(song, part, beats);
      const life = still.matches ? LIFE * 3 : LIFE;

      if (strike === null) {
        struck = null;
      } else if (strike.index !== struck) {
        struck = strike.index;
        sparks.push({
          x: (MARGIN + Math.random() * (1 - MARGIN * 2)) * width,
          y: (MARGIN + Math.random() * (1 - MARGIN * 2)) * height,
          born: beats,
          level: strike.level,
        });
      }

      // Anything past its life, and anything from before a seek, which is the
      // same test read the other way round.
      sparks = sparks.filter((spark) => {
        const age = beats - spark.born;

        return age >= 0 && age < life;
      });

      // Nothing on screen and nothing there last frame: leave the canvas
      // alone, which is most of the piece.
      if (sparks.length === 0 && painted === 0) {
        frame = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      painted = sparks.length;

      const radius = Math.min(width, height) * DOT;
      const fade = songFade(song, beats);
      const peak = still.matches ? PEAK * 0.6 : PEAK;

      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(255, 255, 255, 0.85)";
      ctx.shadowBlur = radius * 3;

      for (const spark of sparks) {
        const left = 1 - (beats - spark.born) / life;

        ctx.globalAlpha = spark.level * left * fade * peak;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      frame = requestAnimationFrame(tick);
    };

    layout();

    const observer = new ResizeObserver(layout);
    observer.observe(canvas);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [song, part, elapsed]);

  return (
    <>
      {/* Like the guitar, it has no drawing of its own to carry a label. */}
      <p className="sr-only">
        {part.label}: {part.bars.length} runs of {part.strikes} strikes, {part.rate}{" "}
        to the beat, each run falling away to nothing over{" "}
        {part.strikes / part.rate} beats. They land on bars{" "}
        {part.bars.slice(0, -1).join(", ")} and {part.bars[part.bars.length - 1]}{" "}
        of the song, half a beat step after the bar line. It has no ring: each
        strike throws a dot across the screen, dimmer than the strike before it.
      </p>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 h-full w-full"
      />
    </>
  );
}
