"use client";

import React, { useEffect, useRef } from "react";
import {
  type Loop,
  type Song,
  beatSeconds,
  turnBeats,
  partCursor,
  partPhase,
  partPresence,
  turnSeconds,
  songAt,
  songFade,
} from "./loop";
import { pitchColour } from "./palette";

// The loop drawn as a staff bent into a circle: five lines, bar lines crossing
// them, and one turn of the ring for one pass of the loop. Top centre is now.

const TAU = Math.PI * 2;

// Everything is a fraction of the shorter side of the canvas, so the ring holds
// its proportions from a phone to a wide display.
// A staff is a staff whatever ring it is drawn on: the lines sit the same
// distance apart on all of them, so only the radius changes as loops nest.
// Since the staff no longer shrinks to make room, this is also what decides
// how many rings the drawing can hold: each one costs a band of about nine
// gaps, so a finer staff is what buys room for another part.
const STAFF_GAP = 0.0105;

// Everything else is measured in staff gaps, which keeps the ticks, numbers
// and playhead in proportion to the notation rather than to the canvas.
const BEAT_TICK = 1.05; // length of a beat tick, outside the staff
const SEAM_REACH = 1.7; // beat ticks' worth of length for the loop's seam mark
const SEAM_SPACING = 0.75; // gaps between the seam's two strokes
const BREAK = 2.5; // gaps of staff left open where a part does not come round
const BREAK_MOST = 0.09; // radians, so a small ring is not opened too far
const BAR_LABEL_OFFSET = 2.3; // bar numbers, outside the staff
const BAR_LABEL_SIZE = 1.25;
const PLAYHEAD_REACH = 1.8; // how far past the staff the playhead runs
const PLAYHEAD_TIP = 0.9; // the arrowhead at the top of it
const PLAYHEAD_CLEAR = 0.7; // gaps it carries on past the lowest note
const PLAYHEAD_LEAST = 0.8; // and how far inside the staff it goes regardless

// A note is a dash on the staff, as thick as a fraction of a staff gap so it
// keeps its proportions at any size.
// Neighbouring steps are half a gap apart, so a dash has to stay under that to
// keep a held note from merging with the one a step above it.
const NOTE_THICKNESS = 0.38;
const NOTE_GROWTH = 0.35; // how much thicker a note gets while it sounds
const NOTE_FADE = 0.4; // seconds it takes to go dark after it stops

// The strike itself, which is the thing worth seeing and was the thing hardest
// to see: a note used to light and thicken and then hold that for however long
// it rang, so nothing marked the instant it was played. Now it swells past its
// sounding thickness as it crosses the playhead and settles back, which is the
// swell the kick coin has always had on the beat.
const NOTE_FLARE = 0.75; // thicker again at the instant it is struck
const NOTE_ONSET = 0.13; // seconds that swell takes to settle
const NOTE_GLOW = 2.6; // gaps of glow it carries while it sounds
const NOTE_BLAZE = 4.5; // and at the strike

const STAFF_COLOR = "rgba(255, 255, 255, 0.34)";
const BAR_COLOR = "rgba(255, 255, 255, 0.5)";
const DOWNBEAT_COLOR = "rgba(255, 255, 255, 0.92)";
const BEAT_COLOR = "rgba(255, 255, 255, 0.22)";
const LABEL_COLOR = "rgba(255, 255, 255, 0.4)";
const NOTE_COLOR = "rgba(255, 255, 255, 0.5)";
const PLAYHEAD_COLOR = "#3b82f6";

export default function LoopRing({
  song,
  loop,
  elapsed,
}: {
  song: Song;
  loop: Loop;
  elapsed: () => number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let mono = "monospace";
    let drawnPhase: number | null = -1;
    let drawnPresence = -1;
    let drawnFade = -1;
    let frame = 0;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // next/font hands out a generated family name, and canvas will not read
      // the CSS variable holding it, so it gets resolved here.
      const family = getComputedStyle(document.body)
        .getPropertyValue("--font-geist-mono")
        .trim();
      mono = family ? `${family}, monospace` : "monospace";

      drawnPhase = -1;
    };

    const render = (
      phase: number | null,
      cursor: number,
      presence: number,
      fade: number,
    ) => {
      const cx = width / 2;
      const cy = height / 2;
      const size = Math.min(width, height);
      const gap = size * STAFF_GAP;
      const radius = size * loop.radius;
      const inner = radius - gap * 2;
      const outer = radius + gap * 2;

      ctx.clearRect(0, 0, width, height);

      // Before the loop comes in and after it drops out there is no ring at
      // all: the bars still pass, they just pass somewhere else.
      if (phase === null || presence <= 0 || fade <= 0) return;

      // The pop is the loop's own arrival; the fade is the hand on the mix
      // taking the whole piece down. Only the first of them moves the ring,
      // since a fade-out should dim it rather than shrink it.
      const visible = presence * fade;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(0.97 + presence * 0.03, 0.97 + presence * 0.03);
      ctx.translate(-cx, -cy);
      ctx.globalAlpha = visible;

      // Where a point in the loop sits right now. The ring turns anticlockwise,
      // so time crosses the playhead from right to left: what has just played
      // is to the left of top centre, and what is coming waits to the right.
      const angleAt = (fraction: number) =>
        -Math.PI / 2 + TAU * (fraction - phase);

      // Neither a part heard exactly once nor a part rolling past is a loop,
      // and neither is drawn as one: the staff is left open at the join, so it
      // reads as a strip bent nearly into a circle rather than a ring coming
      // round again. On a loop the join is its seam and turns with it; on a
      // rolling part it is the edge of the window, which stays at the bottom,
      // opposite the playhead, where notes arrive and leave.
      const turn = turnBeats(song, loop);
      const rolls = loop.rolls === true;
      const open = rolls || loop.to - loop.from === loop.bars;
      // Measured along the staff, so the break is the same size in the hand on
      // every ring, but capped as an angle: the same length of staff is a far
      // bigger bite out of a small circle than a large one.
      const split = open ? Math.min((gap * BREAK) / radius, BREAK_MOST) : 0;

      // What the ring is carrying, in beats from the part's downbeat: a whole
      // turn of a loop, or the stretch of the song a rolling part has in its
      // window, which is a turn less what the break takes out of it. Paying
      // for the gap in music rather than drawing over it keeps every note and
      // bar line on a piece of staff.
      const edge = rolls ? cursor / turn - 0.5 : 0;
      const spent = rolls ? (split / TAU) * turn : 0;
      const first = edge * turn + spent;
      const last = (edge + 1) * turn - spent;

      // The five lines. As circles they carry no sense of rotation themselves:
      // the bar lines and, later, the notes are what turn.
      ctx.lineWidth = 1;
      ctx.strokeStyle = STAFF_COLOR;
      for (let line = -2; line <= 2; line++) {
        ctx.beginPath();
        ctx.arc(
          cx,
          cy,
          radius + line * gap,
          angleAt(edge) + split,
          angleAt(edge + 1) - split,
        );
        ctx.stroke();
      }

      const radial = (angle: number, from: number, to: number) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(cx + cos * from, cy + sin * from);
        ctx.lineTo(cx + cos * to, cy + sin * to);
        ctx.stroke();
      };

      // Beats are a reading aid rather than notation, so they sit outside the
      // staff as ticks: the inside has to stay clear for the notes that hang
      // below the staff on their ledger lines. A rolling ring goes without
      // them, and without its numbers: it is the innermost thing on the
      // drawing and has no room outside itself to put them in.
      if (!rolls) {
        ctx.strokeStyle = BEAT_COLOR;
        for (let beat = 0; beat < turn; beat++) {
          if (beat % song.beatsPerBar === 0) continue;
          radial(angleAt(beat / turn), outer, outer + gap * BEAT_TICK);
        }
      }

      ctx.font = `${Math.round(gap * BAR_LABEL_SIZE)}px ${mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const labelRadius = outer + gap * BAR_LABEL_OFFSET;

      // A loop carries its own bars, the same ones every turn; a rolling part
      // carries whichever of the song's bars are inside the window.
      const from = rolls ? Math.ceil(first / song.beatsPerBar) : 0;
      const to = rolls ? Math.floor(last / song.beatsPerBar) : loop.bars - 1;

      for (let bar = from; bar <= to; bar++) {
        const angle = angleAt((bar * song.beatsPerBar) / turn);
        // Nothing on a rolling ring is its bar one: the window is a stretch of
        // the song, and one bar line in it is worth no more than the next.
        const downbeat = !rolls && bar === 0;

        // Bar lines cross the staff, the way they do on paper: one line each,
        // the downbeat's only heavier. A second stroke in here would read as a
        // bar line sitting inside the last bar.
        ctx.lineWidth = downbeat ? 2 : 1;
        ctx.strokeStyle = downbeat ? DOWNBEAT_COLOR : BAR_COLOR;
        radial(angle, inner, outer);

        // The double line that marks the seam of the loop lives outside the
        // staff instead, where it crosses no notes. A part that only passes
        // once has no seam to mark: the break in the staff says it already.
        if (downbeat && !open) {
          const seam = outer + gap * BEAT_TICK * SEAM_REACH;
          radial(angle, outer, seam);
          ctx.lineWidth = 1;
          radial(angle - (gap * SEAM_SPACING) / outer, outer, seam);
        }

        // Numbers are placed rather than rotated into position, so they stay
        // upright as the ring turns.
        if (!rolls && loop.numbers !== false) {
          ctx.fillStyle = LABEL_COLOR;
          ctx.fillText(
            String(bar + 1),
            cx + Math.cos(angle) * labelRadius,
            cy + Math.sin(angle) * labelRadius,
          );
        }
      }

      // Notes: a rounded dash lying along the staff, as long as the note holds.
      const seconds = turnSeconds(song, loop);
      ctx.lineCap = "round";

      for (const note of loop.notes) {
        // On a rolling ring most of the part is somewhere else in the song.
        // What is left of a note at the window's edge is drawn cut off there,
        // rather than allowed to run out through the break.
        if (rolls && (note.at + note.length <= first || note.at >= last))
          continue;

        const head = rolls ? Math.max(note.at, first) : note.at;
        const tail = rolls
          ? Math.min(note.at + note.length, last)
          : note.at + note.length;

        // Step 0 is the innermost line, so pitch rises outward.
        const r = inner + note.step * (gap / 2);
        const start = angleAt(head / turn);
        const end = angleAt(tail / turn);

        // How long ago the front of the note crossed the playhead. Tied to the
        // clock rather than to how close it looks, so it stays true once audio
        // is driving the transport. A loop's notes are always somewhere behind
        // the playhead, since the pass before this one put them there; a note
        // on a rolling ring can be genuinely still to come, and waits dark.
        const since = rolls
          ? (cursor - note.at) * beatSeconds(song)
          : ((((phase - note.at / turn) % 1) + 1) % 1) * seconds;
        const held = note.length * beatSeconds(song);
        const lit =
          since < 0
            ? 0
            : since <= held
              ? 1
              : Math.max(0, 1 - (since - held) / NOTE_FADE);

        // How much of the strike is still in it, which is a much shorter thing
        // than how long it sounds for.
        const struck = since < 0 ? 0 : Math.max(0, 1 - since / NOTE_ONSET);

        // Everything a note does beyond sitting there is scaled by this, so a
        // ring asking for twice the swell gets a note that grows twice as far
        // from its resting thickness and flares twice as hard.
        const swell = loop.swell ?? 1;

        const width = Math.max(
          1.5,
          gap *
            NOTE_THICKNESS *
            (1 + swell * (lit * NOTE_GROWTH + struck * NOTE_FLARE)),
        );
        const colour = pitchColour(note.step);

        // Ledger lines, drawn behind only the notes that need them: one for
        // every line position between the staff and the note, which is what
        // tells a B below the staff from the C above it.
        if (note.step < -1 || note.step > 9) {
          const outward = note.step > 9;
          ctx.strokeStyle = STAFF_COLOR;
          ctx.lineWidth = 1;

          for (
            let step = outward ? 10 : -2;
            outward ? step <= note.step : step >= note.step;
            step += outward ? 2 : -2
          ) {
            const ledger = inner + step * (gap / 2);
            const overhang = (gap * 0.55) / ledger;
            ctx.beginPath();
            ctx.arc(cx, cy, ledger, start - overhang, end + overhang);
            ctx.stroke();
          }
        }

        ctx.strokeStyle = lit > 0 ? colour : NOTE_COLOR;
        ctx.shadowColor = colour;
        ctx.shadowBlur = gap * swell * (lit * NOTE_GLOW + struck * NOTE_BLAZE);

        const solid = lit > 0 ? 0.45 + lit * 0.55 : 1;

        ctx.lineWidth = width;
        ctx.globalAlpha = visible * solid;

        // The round caps hang half a line width off each end, so the arc is
        // pulled in by that much and the dash covers the note's real length.
        const cap = width / 2 / r;
        const from = start + cap;
        const to = end - cap;

        ctx.beginPath();
        if (to > from) ctx.arc(cx, cy, r, from, to);
        // Anything shorter than its own caps is a dot on the staff.
        else ctx.arc(cx, cy, r, (start + end) / 2, (start + end) / 2 + 0.0001);
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = visible;
      }

      // The playhead never moves: it is the moment the loop passes through.
      // Each ring carries its own across its own band, so the nested rings
      // read as one spoke, but only the outermost gets the arrowhead.
      const tip = outer + gap * PLAYHEAD_REACH;
      ctx.strokeStyle = PLAYHEAD_COLOR;
      ctx.lineWidth = 2;
      // Inside, it goes as far as the ring's own lowest note and no further:
      // a loop that sits on the staff has no reason to reach down into the
      // space the next ring in is turning in.
      const lowest = Math.min(0, ...loop.notes.map((note) => note.step));
      const under = Math.max(PLAYHEAD_LEAST, PLAYHEAD_CLEAR - lowest / 2);
      radial(-Math.PI / 2, inner - gap * under, tip);

      if (song.loops.every((other) => other.radius <= loop.radius)) {
        const tipSize = gap * PLAYHEAD_TIP;
        ctx.beginPath();
        ctx.moveTo(cx, cy - tip);
        ctx.lineTo(cx - tipSize * 0.62, cy - tip - tipSize);
        ctx.lineTo(cx + tipSize * 0.62, cy - tip - tipSize);
        ctx.closePath();
        ctx.fillStyle = PLAYHEAD_COLOR;
        ctx.fill();
      }

      ctx.restore();
    };

    const draw = () => {
      const beats = songAt(song, elapsed());
      const phase = partPhase(song, loop, beats);
      const cursor = partCursor(song, loop, beats);
      const presence = partPresence(song, loop, beats);
      const fade = songFade(song, beats);

      // Paused, or between frames on a fast display, there is nothing new to
      // draw and the ring costs nothing.
      if (
        phase !== drawnPhase ||
        presence !== drawnPresence ||
        fade !== drawnFade
      ) {
        render(phase, cursor, presence, fade);
        drawnPhase = phase;
        drawnPresence = presence;
        drawnFade = fade;
      }
      frame = requestAnimationFrame(draw);
    };

    layout();

    const observer = new ResizeObserver(layout);
    observer.observe(canvas);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [song, loop, elapsed]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={
        loop.rolls
          ? `${loop.label}: played straight through from bar ${loop.from} to bar ${loop.to} of the song, drawn on a circular music staff carrying ${loop.bars} bars at a time`
          : `${loop.label}: a ${loop.bars}-bar loop drawn as a circular music staff, turning once for each pass, from bar ${loop.from} to bar ${loop.to} of the song`
      }
      className="absolute inset-0 h-full w-full"
    />
  );
}
