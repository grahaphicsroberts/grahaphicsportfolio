"use client";

import React, { useEffect, useRef } from "react";
import { type Pulse, type Song, pulseAt, songAt } from "./loop";

// A part with no pitch, sitting in the middle of the rings: a coin that swells
// on every thump and settles between them. It writes straight to the element
// rather than through state, so the page around it never re-renders while it
// is beating.

const SWELL = 0.45; // how much bigger a coin gets on the thump

export default function Thump({
  song,
  pulse,
  elapsed,
}: {
  song: Song;
  pulse: Pulse;
  elapsed: () => number;
}) {
  const coinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coin = coinRef.current;
    if (!coin) return;

    let frame = 0;
    let drawn = -1;

    const tick = () => {
      const hit = pulseAt(song, pulse, songAt(song, elapsed()));

      // Paused, or between frames, there is nothing new to write.
      if (Math.abs(hit - drawn) > 0.002) {
        coin.style.transform = `scale(${1 + hit * SWELL})`;
        coin.style.opacity = String(hit);
        drawn = hit;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [song, pulse, elapsed]);

  return (
    <div
      role="img"
      aria-label={`${pulse.label}, pulsing in the middle of the rings on every beat it lands on`}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div
        ref={coinRef}
        style={{ opacity: 0 }}
        className="h-[7%] w-[7%] rounded-full bg-white shadow-[0_0_2.5rem_rgba(255,255,255,0.45)]"
      />
    </div>
  );
}
