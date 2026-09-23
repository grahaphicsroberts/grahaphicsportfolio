"use client";

import React, { useEffect, useRef } from "react";
import { noiseDensity } from "./canvas";
import { type Noise, type Song, noiseAt, songAt, songFade } from "./loop";

// The wind, drawn as the page's own grain: static, pulled sideways so it reads
// as blown rather than as television, drifting past in gusts and boiling in
// place the way static does. It goes behind everything, since it is the only
// part here that is a background in the music too — the thing the first third
// of the piece is played over rather than anything played in it.
//
// Everything it does is a function of where the song is, not of the wall clock,
// so it holds still when the music does and it is in the same place every time
// you play the same bar.

const TILE = 160; // pixels of noise made, then repeated across the page
const TILES = 4; // a few of them, cycled, which is what makes it boil
const BOIL = 7; // tiles a beat, so about eleven a second
// Most of the page the static ever takes, at full level. The gusts thin it
// everywhere except where they are thickest, so this is the top of the range
// rather than the look of it.
const PEAK = 0.19;
const STRETCH = 2.4; // grain pulled this much wider than tall: the wind in it
const DRIFT = 150; // pixels a bar the near grain travels
const GUST = 60; // and how far a gust carries it either side of that
const FAR = 0.5; // the far layer, dimmer and coarser and slower than the near

// Grain drifting at an even density is a film over the page, not weather. What
// makes it weather is that it arrives in gusts: bands of thicker and thinner
// static travelling across, so the wind is something you can watch cross the
// page rather than something the whole page is doing at once.
const BANDS = 9; // bands across the page, which is how wide a gust is
const BITE = 0.62; // how much of the static a thin patch gives up
const ACROSS = 0.62; // bars a gust takes to cross, in gusts a bar

// How often the static is laid down again. It is the one thing here that covers
// the whole page — three fills of it, one of them a gradient masking the other
// two — and the one thing that gains nothing from being redrawn sixty times a
// second: the grain itself only boils eleven times, and what moves between those
// is a drift of two pixels. Half rate, so the rings keep the frames.
const REDRAW = 1000 / 30;

export default function Static({
  song,
  part,
  elapsed,
  focus,
}: {
  song: Song;
  part: Noise;
  elapsed: () => number;
  focus: (id: string) => number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Static that boils and blows is a lot of movement to put behind a drawing
    // this busy. Asked for less of it, the grain is laid down once and left
    // there: the wind still comes up and goes away, it just stops moving.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    // The grain, made once. Sparse rather than a flat film, so it reads as
    // specks caught in a light rather than as fog.
    const grain = Array.from({ length: TILES }, () => {
      const tile = document.createElement("canvas");
      tile.width = TILE;
      tile.height = TILE;

      const tctx = tile.getContext("2d");
      if (!tctx) return tile;

      const image = tctx.createImageData(TILE, TILE);
      for (let i = 0; i < image.data.length; i += 4) {
        const value = Math.random();

        image.data[i] = 255;
        image.data[i + 1] = 255;
        image.data[i + 2] = 255;
        image.data[i + 3] = value > 0.55 ? Math.round(((value - 0.55) / 0.45) * 255) : 0;
      }
      tctx.putImageData(image, 0, 0);

      return tile;
    });

    const patterns = grain
      .map((tile) => ctx.createPattern(tile, "repeat"))
      .filter((pattern): pattern is CanvasPattern => pattern !== null);
    if (patterns.length === 0) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let painted = false;
    let laid = 0;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = noiseDensity();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      painted = false;
    };

    const layer = (
      pattern: CanvasPattern,
      scale: number,
      x: number,
      y: number,
      alpha: number,
    ) => {
      pattern.setTransform(
        new DOMMatrix().translate(x, y).scale(scale * STRETCH, scale),
      );
      ctx.globalAlpha = alpha;
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, width, height);
    };

    const tick = () => {
      const beats = songAt(song, elapsed());
      // Its own fader climbs to the last bar, but the fade on the whole mix
      // from bar 97 takes it down along with everything else, and what is drawn
      // is what is heard.
      const level =
        noiseAt(song, part, beats) * songFade(song, beats) * focus(part.id);

      // Which is nothing for two thirds of the piece: leave the canvas alone
      // rather than filling it with transparent static.
      if (level <= 0.001) {
        if (painted) {
          ctx.clearRect(0, 0, width, height);
          painted = false;
        }

        frame = requestAnimationFrame(tick);
        return;
      }

      const now = performance.now();
      if (painted && now - laid < REDRAW) {
        frame = requestAnimationFrame(tick);
        return;
      }
      laid = now;

      const bars = beats / song.beatsPerBar;
      const moving = !still.matches;

      // Two slow waves against each other, so the gusting never settles into a
      // rhythm of its own — the one thing that would give away that the wind is
      // being drawn rather than heard.
      const gust = moving
        ? 0.6 * Math.sin(bars * 0.8) + 0.4 * Math.sin(bars * 1.43 + 1.1)
        : 0;

      const near = moving ? bars * DRIFT + gust * GUST : 0;
      const far = moving ? bars * DRIFT * 0.45 - gust * GUST * 0.6 : 0;
      const sway = moving ? Math.sin(bars * 0.37) * 12 : 0;
      const boiling = moving ? Math.floor(beats * BOIL) : 0;

      ctx.clearRect(0, 0, width, height);
      painted = true;

      // Gusts carry a little more grain with them, not just the same grain
      // faster.
      const lit = level * PEAK * (moving ? 0.85 + 0.15 * gust : 0.8);

      layer(patterns[boiling % patterns.length], 2.1, far, -sway, lit * FAR);
      layer(patterns[(boiling + 2) % patterns.length], 1, near, sway, lit);

      ctx.globalAlpha = 1;

      // The gusts, taken out of the grain rather than drawn over it: a soft
      // band pattern travelling across, thinning the static where it is
      // thinnest. Two waves again, at different widths, so no two gusts cross
      // the page the same way.
      if (moving) {
        const phase = bars * ACROSS * Math.PI * 2;
        const weather = ctx.createLinearGradient(0, 0, width, height * 0.35);

        for (let stop = 0; stop <= BANDS; stop++) {
          const along = stop / BANDS;
          const wave =
            0.6 * Math.sin(phase + along * Math.PI * 3) +
            0.4 * Math.sin(phase * 1.7 + along * Math.PI * 5);

          weather.addColorStop(
            along,
            `rgba(0, 0, 0, ${1 - BITE * (0.5 - wave / 2)})`,
          );
        }

        ctx.globalCompositeOperation = "destination-in";
        ctx.fillStyle = weather;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";
      }

      frame = requestAnimationFrame(tick);
    };

    layout();

    const observer = new ResizeObserver(layout);
    observer.observe(canvas);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [song, part, elapsed, focus]);

  return (
    <>
      {/* No drawing of its own to label, like the guitar and the block. */}
      <p className="sr-only">
        {part.label}: noise rather than notes. It fades up from silence at the
        top of the song to full by bar {part.envelope[3].bar}, away to nothing by
        bar 45, and then returns at bar 61 and climbs to the end. It has no ring:
        it is drawn as static blown across the page behind everything else.
      </p>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      />
    </>
  );
}
