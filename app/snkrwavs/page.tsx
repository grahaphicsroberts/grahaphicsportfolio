"use client";

import React, { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import LoopRing from "./LoopRing";
import Readout from "./Readout";
import { SNKRWAVS_SONG as SONG, loopSeconds, songSeconds } from "./loop";
import { useTransport } from "./useTransport";

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;

export default function SnkrwavsPage() {
  const reduceMotion = useReducedMotion();
  // Starts turning on its own, unless the visitor has asked for stillness, in
  // which case it waits to be played.
  const { running, elapsed, toggle, rewind } = useTransport(
    reduceMotion === false,
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;

      // A focused button already answers to the space bar, so leave it alone
      // and let the click handler do the work once.
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea")) return;

      event.preventDefault();
      toggle();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between gap-8 bg-black px-6 py-6 text-white">
      <header className="w-full">
        <h1 className="font-mono text-sm uppercase tracking-[0.3em] text-neutral-300">
          snkrwavs
        </h1>
      </header>

      <div className="relative aspect-square w-full max-w-[min(92vw,calc(100vh-15rem))]">
        {SONG.loops.map((loop) => (
          <LoopRing key={loop.id} song={SONG} loop={loop} elapsed={elapsed} />
        ))}
        <Readout song={SONG} elapsed={elapsed} />
      </div>

      <footer className="flex w-full flex-col items-center gap-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-300"
          >
            {running ? (
              <Pause className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" aria-hidden="true" />
            )}
            {running ? "Pause" : "Play"}
          </button>

          <button
            type="button"
            onClick={rewind}
            className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white transition-colors hover:border-white/60"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Restart
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-neutral-500">
            {SONG.bpm} bpm &middot; {SONG.beatsPerBar}/4 &middot; {SONG.bars}{" "}
            bars &middot; {clock(songSeconds(SONG))}
          </p>

          {SONG.loops.map((loop) => (
            <p
              key={loop.id}
              className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-neutral-700"
            >
              {loop.label} &middot; bars {loop.from}&ndash;{loop.to} &middot; one
              turn every {loopSeconds(SONG, loop).toFixed(1)}s
            </p>
          ))}
        </div>
      </footer>
    </main>
  );
}
