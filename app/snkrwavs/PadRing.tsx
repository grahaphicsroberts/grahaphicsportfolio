"use client";

import React, { useEffect, useRef } from "react";
import { fitTo } from "./canvas";
import { STRIKE, strike, warming } from "./palette";
import { LANE, bandOf } from "./rings";
import {
  type Pad,
  type Song,
  partPhase,
  partPresence,
  songAt,
  songFade,
  turnBeats,
  turnSeconds,
} from "./loop";

// A drum machine bent into a circle. Where a played part gets a staff, a
// programmed one gets what it was written on: lanes for its voices, a cell
// for every step of the grid, and the cells that sound filled in. Top centre
// is now, and the ring turns anticlockwise like all the others.

const TAU = Math.PI * 2;

// Everything is a fraction of the shorter side of the canvas, so the pattern
// holds its proportions from a phone to a wide display. The lane width lives
// with the rest of the ring geometry, where the hit testing can read it too.
const CELL_INSET = 0.16; // of a lane, left dark around each filled cell
const STEP_INSET = 0.1; // and of a step, so the grid reads as cells

// What a cell does when it is struck, beyond changing colour. Waiting its turn
// it sits inside its borders; struck, it takes them, filling its lane and its
// step, and for the moment of the strike it swells past them both. Same idea as
// the coin in the middle, which has always jumped on the beat.
const CELL_FLARE = 0.4; // over a full lane, at the instant of the strike
const CELL_ONSET = 0.1; // seconds that swell takes to settle
const CELL_GLOW = 3.2; // lanes of glow a struck cell carries
const CELL_BLAZE = 3; // and at the strike

// The squared paper, which warms when this is the part being heard on its own,
// the way a staff does. Weights rather than colours, since what changes then is
// the hue of the grid and not how heavily it is ruled. Colour only: a blur is
// paid per stroke, and a grid is one stroke per step of every bar in it.
const GRID_INK = 0.1;
const BAR_INK = 0.4;

const PLAYHEAD_COLOR = "#3b82f6";

// Percussion has no pitch, so the rainbow the other rings read by means
// nothing here: a cell waiting its turn is white, dimmed by how hard it will
// be struck, which in a pattern this regular is the only thing still moving.
// What it does get is the strike itself, which fires electric blue and cools
// back to white, so the machine reads as a machine against all that colour.
const CELL_REST = 0.3; // of full white, at full force, before it is struck
const CELL_FADE = 0.45; // seconds a struck cell takes to cool
const CELL_COLD = [255, 255, 255];

// The glow is the dearest thing on the ring — a blur is paid per stroke, and on
// some phones rasterised on the processor — and worth least on a pattern that has
// been dimmed for another part to be heard. Below this, cells are drawn flat.
const GLOW_WORTH = 0.4;

// How far outside its band the pattern draws, in lanes: the glow of a struck cell
// carries further than the playhead does.
const OUTSIDE = Math.max(CELL_GLOW + CELL_BLAZE, 0.4);

// A cell on its way back to white, mixed rather than switched, so a hit cools
// through the blue instead of dropping out of it.
const cooling = (lit: number) => {
  const mix = CELL_COLD.map((cold, i) =>
    Math.round(cold + (STRIKE[i] - cold) * lit),
  );

  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`;
};

export default function PadRing({
  song,
  pad,
  elapsed,
  focus,
  warmth,
}: {
  song: Song;
  pad: Pad;
  elapsed: () => number;
  focus: (id: string) => number;
  warmth: (id: string) => number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // The canvas box, and the stage's shorter side, which is the unit the pattern
    // measures itself in.
    let width = 0;
    let height = 0;
    let size = 0;
    let drawnPhase: number | null = -1;
    let drawnPresence = -1;
    let drawnWarm = -1;
    let drawnGlow: boolean | null = null;
    let drawnFade = -1;
    let frame = 0;

    const reach = bandOf(pad).outer + LANE * OUTSIDE;

    const layout = () => {
      const fitted = fitTo(canvas, reach);
      if (!fitted) return;

      width = fitted.width;
      height = fitted.height;
      size = fitted.stage;

      drawnPhase = -1;
    };

    const render = (
      phase: number | null,
      presence: number,
      warm: number,
      glow: boolean,
    ) => {
      // Its square is centred on the middle the rings turn around, so the middle
      // of the canvas is that middle whatever size the square is.
      const cx = width / 2;
      const cy = height / 2;
      const lane = size * LANE;
      const radius = size * pad.radius;

      // The band the lanes fill, counted out from the middle of the ring.
      const floor = radius - (pad.voices.length * lane) / 2;

      ctx.clearRect(0, 0, width, height);

      if (phase === null || presence <= 0) return;

      // The pattern's own arrival, which moves it. Dimming is done to the canvas
      // whole rather than to every stroke on it.
      const visible = presence;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(0.97 + presence * 0.03, 0.97 + presence * 0.03);
      ctx.translate(-cx, -cy);
      ctx.globalAlpha = visible;

      const angleAt = (fraction: number) =>
        -Math.PI / 2 + TAU * (fraction - phase);

      const beats = turnBeats(song, pad);
      const cells = pad.bars * pad.steps;
      const roof = floor + pad.voices.length * lane;

      // The grid: the lanes the voices run in, and the steps they are written
      // on. Empty, it is a sheet of squared paper with the bars marked, and warm
      // while this is the part being heard by itself. Both inks are mixed once
      // here, since every step of every bar is ruled in one or the other.
      const gridInk = warming(warm, GRID_INK);
      const barInk = warming(warm, BAR_INK);

      ctx.lineWidth = 1;
      ctx.strokeStyle = gridInk;
      for (let line = 0; line <= pad.voices.length; line++) {
        ctx.beginPath();
        ctx.arc(cx, cy, floor + line * lane, angleAt(0), angleAt(1));
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

      for (let cell = 0; cell < cells; cell++) {
        const bar = cell % pad.steps === 0;
        ctx.strokeStyle = bar ? barInk : gridInk;
        radial(angleAt(cell / cells), floor, roof);
      }

      // The hits. A cell holds the step it starts on: anything struck between
      // steps, like a flam, gets what is left of the cell it landed in, which
      // is what makes it look like the late arrival it is.
      const seconds = turnSeconds(song, pad);
      const step = beats / cells;

      for (const hit of pad.hits) {
        const start = hit.at / beats;
        const end = Math.min(
          (Math.floor(hit.at / step) + 1) * step,
          hit.at + step,
        ) / beats;

        // How long ago it crossed the playhead, which is what lights it.
        const since = (((phase - start) % 1) + 1) % 1 * seconds;
        const lit = Math.max(0, 1 - since / CELL_FADE);

        const struck = Math.max(0, 1 - since / CELL_ONSET);

        const bottom = floor + hit.lane * lane;
        const middle = bottom + lane / 2;
        const thick =
          lane * (1 - CELL_INSET * 2 * (1 - lit)) * (1 + struck * CELL_FLARE);
        const margin = ((end - start) * TAU * STEP_INSET * (1 - lit)) / 2;

        ctx.lineCap = "butt";
        ctx.lineWidth = thick;
        ctx.strokeStyle = cooling(lit);
        // The glow is the strike, so it belongs to the blue and goes out with
        // it: a cell sitting in the pattern is flat.
        ctx.shadowColor = strike();
        ctx.shadowBlur = glow
          ? lane * (lit * CELL_GLOW + struck * CELL_BLAZE)
          : 0;
        ctx.globalAlpha =
          visible * hit.force * (CELL_REST + lit * (1 - CELL_REST));

        ctx.beginPath();
        ctx.arc(cx, cy, middle, angleAt(start) + margin, angleAt(end) - margin);
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = visible;
      }

      // The playhead, carried across this band the way every other ring
      // carries it across its own.
      ctx.strokeStyle = PLAYHEAD_COLOR;
      ctx.lineWidth = 2;
      radial(-Math.PI / 2, floor - lane * 0.4, roof + lane * 0.4);

      ctx.restore();
    };

    const draw = () => {
      const beats = songAt(song, elapsed());
      const phase = partPhase(song, pad, beats);
      const presence = partPresence(song, pad, beats);
      const fade = songFade(song, beats) * focus(pad.id);
      const warm = warmth(pad.id);
      const glow = fade >= GLOW_WORTH;

      // Handed to the compositor as one number for the canvas, rather than
      // carried through every stroke: cheaper, and even, which a grid of
      // overlapping strokes at a fifth of their weight is not.
      if (fade !== drawnFade) {
        canvas.style.opacity = fade >= 1 ? "" : String(fade);
        drawnFade = fade;
      }

      if (
        fade > 0.002 &&
        (phase !== drawnPhase ||
          presence !== drawnPresence ||
          warm !== drawnWarm ||
          glow !== drawnGlow)
      ) {
        render(phase, presence, warm, glow);
        drawnPhase = phase;
        drawnPresence = presence;
        drawnWarm = warm;
        drawnGlow = glow;
      }
      frame = requestAnimationFrame(draw);
    };

    layout();

    // The stage is watched rather than the canvas, which is sized from it.
    const observer = new ResizeObserver(layout);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [song, pad, elapsed, focus, warmth]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`${pad.label}: a ${pad.bars}-bar pattern for ${pad.voices.join(", ").toLowerCase()}, drawn as a ring of ${pad.steps} steps to the bar, from bar ${pad.from} to bar ${pad.to} of the song${pad.gaps ? ", less the bars the mix mutes" : ""}`}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
  );
}
