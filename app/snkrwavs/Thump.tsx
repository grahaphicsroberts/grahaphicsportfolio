"use client";

import React, { useEffect, useRef } from "react";
import { type Pulse, type Song, pulseAt, songAt, songFade } from "./loop";
import { strike } from "./palette";
import { COIN } from "./rings";

// A part with no pitch, sitting in the middle of the rings: a coin that swells
// on every thump and settles between them. It writes straight to the element
// rather than through state, so the page around it never re-renders while it
// is beating.

// How much bigger a coin gets on the thump. Its size at rest is COIN, which is
// kept with the rings since clicking the middle has to find it there.
const SWELL = 0.45;

export default function Thump({
  song,
  pulse,
  elapsed,
  focus,
}: {
  song: Song;
  pulse: Pulse;
  elapsed: () => number;
  focus: (id: string) => number;
}) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    const coin = coinRef.current;
    if (!field || !coin) return;

    // Measured off the shorter side of the space, the way the rings measure
    // themselves, so the coin stays in proportion to them whatever shape the
    // space is.
    const layout = () => {
      const rect = field.getBoundingClientRect();
      const across = Math.min(rect.width, rect.height) * COIN;

      coin.style.width = `${across}px`;
      coin.style.height = `${across}px`;
    };

    let frame = 0;
    let drawn = -1;

    const tick = () => {
      const beats = songAt(song, elapsed());
      const hit =
        pulseAt(song, pulse, beats) * songFade(song, beats) * focus(pulse.id);

      // Paused, or between frames, there is nothing new to write.
      if (Math.abs(hit - drawn) > 0.002) {
        coin.style.transform = `scale(${1 + hit * SWELL})`;
        coin.style.opacity = String(hit);
        drawn = hit;
      }

      frame = requestAnimationFrame(tick);
    };

    layout();

    const observer = new ResizeObserver(layout);
    observer.observe(field);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [song, pulse, elapsed, focus]);

  return (
    <div
      ref={fieldRef}
      role="img"
      aria-label={`${pulse.label}, pulsing in the middle of the rings on every beat it lands on`}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {/* The same blue the pattern strikes in: what is hit reads one way,
          what is played reads another. */}
      <div
        ref={coinRef}
        style={{
          opacity: 0,
          backgroundColor: strike(),
          boxShadow: `0 0 2.5rem ${strike(0.5)}`,
        }}
        className="rounded-full"
      />
    </div>
  );
}
