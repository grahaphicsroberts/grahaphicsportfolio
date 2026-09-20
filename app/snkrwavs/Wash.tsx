"use client";

import React, { useEffect, useRef } from "react";
import {
  type Chords,
  type Song,
  chordAt,
  songAt,
  songFade,
  staffStep,
  tremoloAt,
} from "./loop";
import { pitchColour } from "./palette";

// A part drawn as light rather than as a line. The guitar is three chords
// struck and left to ring under a tremolo, and there is no shape in that
// worth a ring of its own; what there is, is the room changing colour. So the
// screen takes the colour of whichever chord is sounding, on the same rainbow
// the staffs read pitch by, and breathes with the tremolo chopping it.
//
// It is laid over everything and blended as light, not as paint, so it lifts
// the black off the page and leaves the white of the drawing where it is. The
// middle is left clearest, since that is where the rings are.

// Most colour a strike can put on screen, before the tremolo takes its share.
const PEAK = 0.62;
// How much of that the tremolo swings, which is what makes it breathe rather
// than sit. All of it would be a strobe; none of it would be a lamp.
const DEPTH = 0.45;
// How much of the way out from the middle the colour stays out of, so the
// rings keep their contrast against it.
const CLEAR = 0.3;

export default function Wash({
  song,
  part,
  elapsed,
  focus,
}: {
  song: Song;
  part: Chords;
  elapsed: () => number;
  focus: (id: string) => number;
}) {
  const washRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wash = washRef.current;
    if (!wash) return;

    // A colour filling the screen and pulsing sixteen times a bar is a lot to
    // put in front of somebody who has asked for less of it. Asked, the
    // tremolo is dropped and the chords simply change colour: the part is
    // still legible, it just stops flashing.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let painted = "";
    let drawn = -1;

    const tick = () => {
      const beats = songAt(song, elapsed());
      const sounding = chordAt(song, part, beats);

      const breath = still.matches
        ? 1 - DEPTH / 2
        : 1 - DEPTH + DEPTH * tremoloAt(song, part, beats);

      const level = sounding
        ? sounding.strength *
          breath *
          songFade(song, beats) *
          focus(part.id) *
          PEAK
        : 0;

      if (sounding) {
        const step = staffStep(sounding.chord.root);
        const colour = `radial-gradient(circle at 50% 45%, ${pitchColour(step, 0)} ${CLEAR * 100}%, ${pitchColour(step, 1)} 100%)`;

        if (colour !== painted) {
          wash.style.backgroundImage = colour;
          painted = colour;
        }
      }

      if (Math.abs(level - drawn) > 0.002) {
        wash.style.opacity = String(level);
        drawn = level;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [song, part, elapsed, focus]);

  return (
    <>
      {/* Every other part says what it is through the label on its drawing.
          This one has no drawing to label, so it says it here. */}
      <p className="sr-only">
        {part.label}: {part.chords.length} strikes on{" "}
        {new Set(part.chords.map((chord) => chord.root)).size} chords, each left
        to ring, from bar {part.from} to bar {part.to} of the song. It has no ring
        of its own: the whole screen takes the colour of whichever chord is
        sounding and pulses {part.tremolo} times a bar with its tremolo.
      </p>

      <div
        ref={washRef}
        aria-hidden="true"
        style={{ opacity: 0, mixBlendMode: "screen" }}
        className="pointer-events-none fixed inset-0 z-20"
      />
    </>
  );
}
