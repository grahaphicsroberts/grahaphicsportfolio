"use client";

import React, { useEffect, useState } from "react";
import { type Song, barBeat, songAt } from "./loop";

// Where the song is, in the terms a musician would use. It counts the song
// rather than any one loop, since the loops come and go against it. It runs
// its own frame loop and only re-renders when the beat changes, so the page
// around it never re-renders while the transport runs.
export default function Readout({
  song,
  elapsed,
}: {
  song: Song;
  elapsed: () => number;
}) {
  const [at, setAt] = useState({ bar: 1, beat: 1 });

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      const { bar, beat } = barBeat(song, songAt(song, elapsed()));
      setAt((prev) =>
        prev.bar === bar && prev.beat === beat ? prev : { bar, beat },
      );
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [song, elapsed]);

  return (
    <p className="font-mono text-sm uppercase tracking-[0.3em] text-neutral-300">
      <span className="text-neutral-600">bar </span>
      <span className="tabular-nums">
        {at.bar}
        <span className="text-neutral-600">.</span>
        {at.beat}
      </span>
    </p>
  );
}
