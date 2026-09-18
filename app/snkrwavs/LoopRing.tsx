"use client";

import React, { useEffect, useRef } from "react";
import {
  type Loop,
  type Song,
  beatSeconds,
  loopBeats,
  loopPhase,
  loopPresence,
  loopSeconds,
  songAt,
} from "./loop";

// The loop drawn as a staff bent into a circle: five lines, bar lines crossing
// them, and one turn of the ring for one pass of the loop. Top centre is now.

const TAU = Math.PI * 2;

// Everything is a fraction of the shorter side of the canvas, so the ring holds
// its proportions from a phone to a wide display.
const STAFF_RADIUS = 0.405; // the middle line of the five
const STAFF_GAP = 0.0145; // between one staff line and the next
const BEAT_TICK = 0.015; // length of a beat tick, inside the staff
const SEAM_REACH = 1.7; // beat ticks' worth of length for the loop's seam mark
const SEAM_SPACING = 0.75; // staff gaps between the seam's two strokes
const BAR_LABEL_OFFSET = 0.033; // bar numbers, outside the staff
const BAR_LABEL_SIZE = 0.018;
const PLAYHEAD_REACH = 0.026; // how far past the staff the playhead runs
const PLAYHEAD_TIP = 0.013; // the arrowhead at the top of it
const PLAYHEAD_INNER = 3.2; // staff gaps it reaches inside, past the ledgers

// A note is a dash on the staff, as thick as a fraction of a staff gap so it
// keeps its proportions at any size.
// Neighbouring steps are half a gap apart, so a dash has to stay under that to
// keep a held note from merging with the one a step above it.
const NOTE_THICKNESS = 0.38;
const NOTE_GROWTH = 0.35; // how much thicker a note gets while it sounds
const NOTE_FADE = 0.4; // seconds it takes to go dark after it stops
const ATTACK = 0.25; // beats of a note drawn solid, the rest drawn as its tail
const TAIL_THICKNESS = 0.6; // of the attack's width
const TAIL_FADE = 0.12; // what the tail's end is worth against its start
const TAIL_STEPS = 6; // segments the taper is drawn in

const STAFF_COLOR = "rgba(255, 255, 255, 0.34)";
const BAR_COLOR = "rgba(255, 255, 255, 0.5)";
const DOWNBEAT_COLOR = "rgba(255, 255, 255, 0.92)";
const BEAT_COLOR = "rgba(255, 255, 255, 0.22)";
const LABEL_COLOR = "rgba(255, 255, 255, 0.4)";
const NOTE_COLOR = "rgba(255, 255, 255, 0.5)";
const PLAYHEAD_COLOR = "#3b82f6";

// A note lights in the colour of its pitch. Seven colours across seven
// diatonic steps means the rainbow repeats at the octave, so a note and its
// octave share a colour, and the ring reads low to high as red to violet the
// way light itself does.
const ROYGBIV = [
  "#ff453a",
  "#ff9f0a",
  "#ffd60a",
  "#30d158",
  "#0a84ff",
  "#5e5ce6",
  "#bf5af2",
];

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

    const render = (phase: number | null, presence: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const size = Math.min(width, height);
      const gap = size * STAFF_GAP;
      const radius = size * STAFF_RADIUS;
      const inner = radius - gap * 2;
      const outer = radius + gap * 2;

      ctx.clearRect(0, 0, width, height);

      // Before the loop comes in and after it drops out there is no ring at
      // all: the bars still pass, they just pass somewhere else.
      if (phase === null || presence <= 0) return;

      // It arrives at size rather than fading up, so the ramp is short enough
      // to read as a pop and only exists to keep the edges clean.
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(0.97 + presence * 0.03, 0.97 + presence * 0.03);
      ctx.translate(-cx, -cy);
      ctx.globalAlpha = presence;

      // The five lines. As circles they carry no sense of rotation themselves:
      // the bar lines and, later, the notes are what turn.
      ctx.lineWidth = 1;
      ctx.strokeStyle = STAFF_COLOR;
      for (let line = -2; line <= 2; line++) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius + line * gap, 0, TAU);
        ctx.stroke();
      }

      // Where a point in the loop sits right now. The ring turns anticlockwise,
      // so time crosses the playhead from right to left: what has just played
      // is to the left of top centre, and what is coming waits to the right.
      const angleAt = (fraction: number) =>
        -Math.PI / 2 + TAU * (fraction - phase);

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
      // below the staff on their ledger lines.
      const beats = loopBeats(song, loop);
      ctx.strokeStyle = BEAT_COLOR;
      for (let beat = 0; beat < beats; beat++) {
        if (beat % song.beatsPerBar === 0) continue;
        radial(angleAt(beat / beats), outer, outer + size * BEAT_TICK);
      }

      ctx.font = `${Math.round(size * BAR_LABEL_SIZE)}px ${mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const labelRadius = outer + size * BAR_LABEL_OFFSET;

      for (let bar = 0; bar < loop.bars; bar++) {
        const angle = angleAt(bar / loop.bars);
        const downbeat = bar === 0;

        // Bar lines cross the staff, the way they do on paper: one line each,
        // the downbeat's only heavier. A second stroke in here would read as a
        // bar line sitting inside the last bar.
        ctx.lineWidth = downbeat ? 2 : 1;
        ctx.strokeStyle = downbeat ? DOWNBEAT_COLOR : BAR_COLOR;
        radial(angle, inner, outer);

        // The double line that marks the seam of the loop lives outside the
        // staff instead, where it crosses no notes.
        if (downbeat) {
          const seam = outer + size * BEAT_TICK * SEAM_REACH;
          radial(angle, outer, seam);
          ctx.lineWidth = 1;
          radial(angle - (gap * SEAM_SPACING) / outer, outer, seam);
        }

        // Numbers are placed rather than rotated into position, so they stay
        // upright as the ring turns.
        ctx.fillStyle = LABEL_COLOR;
        ctx.fillText(
          String(bar + 1),
          cx + Math.cos(angle) * labelRadius,
          cy + Math.sin(angle) * labelRadius,
        );
      }

      // Notes: a rounded dash lying along the staff, as long as the note holds.
      const seconds = loopSeconds(song, loop);
      ctx.lineCap = "round";

      for (const note of loop.notes) {
        // Step 0 is the innermost line, so pitch rises outward.
        const r = inner + note.step * (gap / 2);
        const start = angleAt(note.at / beats);
        const end = angleAt((note.at + note.length) / beats);

        // How long ago the front of the note crossed the playhead. Tied to the
        // clock rather than to how close it looks, so it stays true once audio
        // is driving the transport.
        const since = (((phase - note.at / beats) % 1) + 1) % 1 * seconds;
        const held = note.length * beatSeconds(song);
        const lit =
          since <= held ? 1 : Math.max(0, 1 - (since - held) / NOTE_FADE);

        const width = Math.max(1.5, gap * NOTE_THICKNESS * (1 + lit * NOTE_GROWTH));
        // Steps below the staff run negative, and a remainder has to stay
        // positive for the octave to come back around to the same colour.
        const colour =
          ROYGBIV[((note.step % ROYGBIV.length) + ROYGBIV.length) % ROYGBIV.length];

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
        ctx.shadowBlur = lit * gap * 2.6;

        const solid = lit > 0 ? 0.45 + lit * 0.55 : 1;

        // A plucked note is struck once and then rings, so it is drawn as a
        // dash for the attack and a tail that thins away for as long as the
        // string is still sounding. Without it the held notes at the bottom of
        // a run would be slabs thick enough to swallow the run climbing over
        // them.
        const head = Math.min(ATTACK, note.length);
        const headEnd = angleAt((note.at + head) / beats);

        if (note.length > head) {
          ctx.lineCap = "butt";

          const span = end - headEnd;
          for (let i = 0; i < TAIL_STEPS; i++) {
            const along = i / TAIL_STEPS;
            ctx.lineWidth = width * TAIL_THICKNESS * (1 - along / 2);
            ctx.globalAlpha = presence * solid * (1 - along * (1 - TAIL_FADE));
            ctx.beginPath();
            ctx.arc(
              cx,
              cy,
              r,
              headEnd + span * along,
              headEnd + span * ((i + 1) / TAIL_STEPS),
            );
            ctx.stroke();
          }

          ctx.lineCap = "round";
        }

        ctx.lineWidth = width;
        ctx.globalAlpha = presence * solid;

        // The round caps hang half a line width off each end, so the arc is
        // pulled in by that much and the dash covers the attack's real length.
        const cap = width / 2 / r;
        const from = start + cap;
        const to = headEnd - cap;

        ctx.beginPath();
        if (to > from) ctx.arc(cx, cy, r, from, to);
        // Anything shorter than its own caps is a dot on the staff.
        else ctx.arc(cx, cy, r, (start + headEnd) / 2, (start + headEnd) / 2 + 0.0001);
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = presence;
      }

      // The playhead never moves: it is the moment the loop passes through.
      const tip = outer + size * PLAYHEAD_REACH;
      ctx.strokeStyle = PLAYHEAD_COLOR;
      ctx.lineWidth = 2;
      // Reaching well inside the staff, so it still crosses the notes that
      // hang below it.
      radial(-Math.PI / 2, inner - gap * PLAYHEAD_INNER, tip);

      const tipSize = size * PLAYHEAD_TIP;
      ctx.beginPath();
      ctx.moveTo(cx, cy - tip);
      ctx.lineTo(cx - tipSize * 0.62, cy - tip - tipSize);
      ctx.lineTo(cx + tipSize * 0.62, cy - tip - tipSize);
      ctx.closePath();
      ctx.fillStyle = PLAYHEAD_COLOR;
      ctx.fill();

      ctx.restore();
    };

    const draw = () => {
      const beats = songAt(song, elapsed());
      const phase = loopPhase(song, loop, beats);
      const presence = loopPresence(song, loop, beats);

      // Paused, or between frames on a fast display, there is nothing new to
      // draw and the ring costs nothing.
      if (phase !== drawnPhase || presence !== drawnPresence) {
        render(phase, presence);
        drawnPhase = phase;
        drawnPresence = presence;
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
      aria-label={`${loop.label}: a ${loop.bars}-bar loop drawn as a circular music staff, turning once for each pass, from bar ${loop.from} to bar ${loop.to} of the song`}
      className="absolute inset-0 h-full w-full"
    />
  );
}
