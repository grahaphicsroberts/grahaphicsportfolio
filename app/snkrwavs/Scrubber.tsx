"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { type Song, barBeat, beatSeconds, songAt } from "./loop";

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

// Where the music is up to, and the handle for going somewhere else in it.
// Like the rings, it reads the transport once a frame and writes straight to
// the DOM, so dragging it does not put the whole page through React.
export default function Scrubber({
  song,
  elapsed,
  duration,
  seek,
}: {
  song: Song;
  elapsed: () => number;
  duration: number;
  seek: (seconds: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    const head = headRef.current;
    const time = timeRef.current;
    if (!fill || !head || !time) return;

    let frame = 0;
    let drawn = -1;

    const tick = () => {
      const at = elapsed();

      if (Math.abs(at - drawn) > 0.01) {
        const through = duration ? Math.min(at / duration, 1) : 0;
        const percent = `${(through * 100).toFixed(3)}%`;

        fill.style.width = percent;
        head.style.left = percent;
        time.textContent = clock(at);
        drawn = at;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [elapsed, duration]);

  // Where along the track a pointer landed, as a moment in the song.
  const momentAt = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track || !duration) return 0;

      const box = track.getBoundingClientRect();
      const through = Math.min(Math.max((clientX - box.left) / box.width, 0), 1);

      return through * duration;
    },
    [duration],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    seek(momentAt(event.clientX));
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    // Only while the pointer is held down, so hovering across does not move
    // the music out from under whoever is listening to it.
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

    seek(momentAt(event.clientX));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // A bar at a time, since that is the unit the rings are counting in.
    const bar = beatSeconds(song) * song.beatsPerBar;
    const step: Record<string, number> = {
      ArrowLeft: -bar,
      ArrowRight: bar,
      ArrowDown: -bar * 8,
      ArrowUp: bar * 8,
    };

    if (event.key in step) seek(elapsed() + step[event.key]);
    else if (event.key === "Home") seek(0);
    else if (event.key === "End") seek(duration);
    else return;

    event.preventDefault();
  };

  const { bar } = barBeat(song, songAt(song, elapsed()));

  return (
    <div className="flex w-full max-w-2xl flex-col gap-1.5">
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={`Position in ${song.title}`}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(elapsed())}
        aria-valuetext={`bar ${bar} of ${song.bars}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
        className="group relative cursor-pointer touch-none py-3 outline-none"
      >
        <div className="h-[2px] w-full bg-white/15">
          <div ref={fillRef} className="h-full w-0 bg-white/80" />
        </div>

        {/* Out of the way until it is wanted, so what is left is a line under
            the drawing rather than a piece of player furniture. */}
        <div
          ref={headRef}
          className="pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      </div>

      {/* One line, whatever the screen. A title wrapping under the line it
          belongs to reads as the page coming apart, and the second line it takes
          comes out of the height the drawing has to turn in. The two times keep
          their ends; the title gives up size and spacing first, and only then a
          character or two off its end. */}
      <div className="flex items-baseline justify-between gap-2 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-neutral-500 sm:text-[0.7rem] sm:tracking-[0.2em]">
        <span ref={timeRef} className="shrink-0">
          0:00
        </span>
        <span className="min-w-0 truncate text-neutral-700">{song.title}</span>
        <span className="shrink-0">{clock(duration)}</span>
      </div>
    </div>
  );
}
