"use client";

import React, { useEffect, useRef } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import LoopRing from "./LoopRing";
import PadRing from "./PadRing";
import Readout from "./Readout";
import Scrubber from "./Scrubber";
import Thump from "./Thump";
import Wash from "./Wash";
import { SNKRWAVS_SONG as SONG, songSeconds } from "./loop";
import { useTransport } from "./useTransport";

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;

export default function SnkrwavsPage() {
  // Nothing turns until the music is playing, and nothing plays until it is
  // asked for: a page cannot start its own sound, and a ring turning silently
  // would only have to jump into line once the sound caught up with it.
  const player = useRef<HTMLAudioElement>(null);
  const { running, elapsed, toggle, rewind, seek, duration } =
    useTransport(player);

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
      <audio ref={player} src={SONG.audio} preload="auto" className="hidden" />

      {/* A part with no ring: it lights the whole page instead, so it sits
          outside the space the rings are given. */}
      {SONG.chords.map((part) => (
        <Wash key={part.id} song={SONG} part={part} elapsed={elapsed} />
      ))}

      <header className="flex w-full items-baseline justify-between gap-6">
        <h1 className="font-mono text-sm uppercase tracking-[0.3em] text-neutral-300">
          snkrwavs
        </h1>

        <Readout song={SONG} elapsed={elapsed} />
      </header>

      {/* The rings turn around the parts that have pitch; the parts that do
          not beat in the middle of them. This takes whatever height the
          header and the controls leave it, and the drawing squares itself off
          inside that, so listing another part costs the rings a little room
          rather than pushing the page off the screen. */}
      <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
        {SONG.loops.map((loop) => (
          <LoopRing key={loop.id} song={SONG} loop={loop} elapsed={elapsed} />
        ))}

        {SONG.pads.map((pad) => (
          <PadRing key={pad.id} song={SONG} pad={pad} elapsed={elapsed} />
        ))}

        {SONG.pulses.map((pulse) => (
          <Thump key={pulse.id} song={SONG} pulse={pulse} elapsed={elapsed} />
        ))}
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

        <Scrubber
          song={SONG}
          elapsed={elapsed}
          duration={duration}
          seek={seek}
        />

        {/* What the piece is, and nothing about the parts: they are what the
            drawing is for, and every line written about them down here comes
            straight out of the height it gets to turn in. Once a part can be
            soloed by clicking its ring, whatever needs saying about it can be
            said where it is being pointed at. */}
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-neutral-500">
          {SONG.bpm} bpm &middot; {SONG.beatsPerBar}/4 &middot; {SONG.bars} bars
          &middot; {clock(songSeconds(SONG))} &middot; fades from bar{" "}
          {SONG.fadeOutFrom}
        </p>
      </footer>
    </main>
  );
}
