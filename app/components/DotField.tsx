"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// A quiet grid of dots that keeps wiring itself together: information design as
// a shape rather than a statement. Canvas rather than DOM, since this is close
// to a thousand dots redrawn every frame.

const SPACING = 38; // ~1cm on a typical display
const DOT_RADIUS = 1.5;
const BASE_ALPHA = 0.5;

// The glass that follows the pointer. Dots inside it are pushed off the grid,
// so the field itself bends rather than the dots merely lighting up.
const LENS_RADIUS = 150;
const LENS_LIFT = 17; // px of outward push at the strongest ring
const LENS_FOLLOW = 14; // how fast the glass catches the pointer, per second
const LENS_FADE = 5; // how fast it arrives and leaves
// r * (1 - r²)² peaks at this value, and dividing by it keeps LENS_LIFT honest
// as the actual maximum displacement in pixels.
const LENS_PEAK = 0.2865;

// The wake the glass leaves behind it.
const RIPPLE_SPEED = 190; // px per second
const RIPPLE_LIFE = 1.2; // seconds before the wave has spent itself
const RIPPLE_BAND = 52; // width of the moving front
const RIPPLE_LIFT = 6; // px the crest carries dots
const RIPPLE_SPACING = 42; // px of pointer travel between waves
const CLICK_POWER = 2.2; // a click hits harder than a passing wave
const MAX_RIPPLES = 10;

// The chains of light.
const SEGMENT_DRAW = 0.24; // seconds to draw one link
const CHAIN_HOLD = 1.2;
const CHAIN_FADE = 1;
const CHAIN_MIN_LINKS = 3;
const CHAIN_MAX_LINKS = 6;
const STEP_MIN = 2; // grid units between two linked dots
const STEP_MAX = 5;
const CHAIN_GAP_MIN = 1.4; // seconds between chains that start on their own
const CHAIN_GAP_MAX = 3;
const MAX_CHAINS = 4;

const COLORS = [
  "#5b9cff",
  "#37d6c0",
  "#ffd166",
  "#f782c2",
  "#a78bfa",
  "#7ee787",
];

// x and y are where a dot belongs on the grid, px and py where the field has
// pushed it this frame.
type Dot = { x: number; y: number; px: number; py: number; col: number; row: number };
type Chain = { points: Dot[]; color: string; start: number };
type Ripple = { x: number; y: number; start: number; power: number };

const easeOut = (p: number) => 1 - (1 - p) ** 3;
const between = (min: number, max: number) => min + Math.random() * (max - min);

export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let dots: Dot[] = [];
    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;

    let chains: Chain[] = [];
    let ripples: Ripple[] = [];
    let nextChainAt = 0;
    let lastRipple = { x: -9999, y: -9999 };
    let lastFrame = 0;
    let frame = 0;

    const pointer = { x: 0, y: 0 };
    const lens = { x: 0, y: 0, strength: 0 };
    let lensTarget = 0;

    const dotAt = (col: number, row: number) =>
      col >= 0 && col < cols && row >= 0 && row < rows
        ? dots[row * cols + col]
        : undefined;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(2, Math.floor(width / SPACING));
      rows = Math.max(2, Math.floor(height / SPACING));

      // Centred, so the margins match on both sides at any window size.
      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;

      dots = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = offsetX + col * SPACING;
          const y = offsetY + row * SPACING;
          dots.push({ x, y, px: x, py: y, col, row });
        }
      }
    };

    const buildChain = (from: Dot, now: number): Chain => {
      const points = [from];
      const links = Math.round(between(CHAIN_MIN_LINKS, CHAIN_MAX_LINKS));
      let current = from;

      for (let i = 0; i < links; i++) {
        let next: Dot | undefined;

        // Several attempts, so a step that lands off-grid or on a dot already
        // in the chain does not cut the whole chain short.
        for (let tries = 0; tries < 12 && !next; tries++) {
          const angle = Math.random() * Math.PI * 2;
          const reach = between(STEP_MIN, STEP_MAX);
          const candidate = dotAt(
            current.col + Math.round(Math.cos(angle) * reach),
            current.row + Math.round(Math.sin(angle) * reach),
          );
          if (candidate && !points.includes(candidate)) next = candidate;
        }

        if (!next) break;
        points.push(next);
        current = next;
      }

      return {
        points,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        start: now,
      };
    };

    const chainLife = (chain: Chain) =>
      (chain.points.length - 1) * SEGMENT_DRAW + CHAIN_HOLD + CHAIN_FADE;

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      for (const dot of dots) {
        ctx.moveTo(dot.x + DOT_RADIUS, dot.y);
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
      }
      ctx.fillStyle = `rgba(255, 255, 255, ${BASE_ALPHA})`;
      ctx.fill();
    };

    const draw = (time: number) => {
      const now = time / 1000;
      const delta = lastFrame ? Math.min(0.05, now - lastFrame) : 1 / 60;
      lastFrame = now;

      ctx.clearRect(0, 0, width, height);

      // Frame-rate independent easing, so the glass glides the same way on a
      // 120Hz display as on a 60Hz one.
      lens.strength += (lensTarget - lens.strength) * (1 - Math.exp(-delta * LENS_FADE));
      lens.x += (pointer.x - lens.x) * (1 - Math.exp(-delta * LENS_FOLLOW));
      lens.y += (pointer.y - lens.y) * (1 - Math.exp(-delta * LENS_FOLLOW));

      ripples = ripples.filter((r) => now - r.start < RIPPLE_LIFE);
      chains = chains.filter((c) => now - c.start < chainLife(c));

      if (now >= nextChainAt && chains.length < MAX_CHAINS && dots.length) {
        chains.push(
          buildChain(dots[Math.floor(Math.random() * dots.length)], now),
        );
        nextChainAt = now + between(CHAIN_GAP_MIN, CHAIN_GAP_MAX);
      }

      // Every dot at rest is the same colour and radius, so they go into one
      // path and get filled in a single call. Only the lit ones cost more.
      const lit: { dot: Dot; boost: number }[] = [];
      const lensLive = lens.strength > 0.002;
      ctx.beginPath();

      for (const dot of dots) {
        let offsetX = 0;
        let offsetY = 0;
        let boost = 0;

        if (lensLive) {
          const vx = dot.x - lens.x;
          const vy = dot.y - lens.y;
          const distance = Math.hypot(vx, vy) || 0.001;

          if (distance < LENS_RADIUS) {
            const r = distance / LENS_RADIUS;
            // Zero at the centre and again at the rim, strongest between the
            // two: dots spread away from the middle and bunch under the edge,
            // which is what makes it read as glass rather than a spotlight.
            const push = ((r * (1 - r * r) ** 2) / LENS_PEAK) * LENS_LIFT * lens.strength;
            offsetX += (vx / distance) * push;
            offsetY += (vy / distance) * push;
            boost += (1 - r * r) ** 2 * lens.strength;
          }
        }

        for (const ripple of ripples) {
          const age = now - ripple.start;
          const vx = dot.x - ripple.x;
          const vy = dot.y - ripple.y;
          const distance = Math.hypot(vx, vy) || 0.001;

          // Where the dot sits relative to the front: ahead of it, on it, or
          // behind. The sine makes dots pile up into the crest as it passes.
          const phase = (distance - age * RIPPLE_SPEED) / RIPPLE_BAND;
          if (phase <= -1 || phase >= 1) continue;

          const decay = 1 - age / RIPPLE_LIFE;
          const lift = Math.sin(Math.PI * phase) * RIPPLE_LIFT * ripple.power * decay;
          offsetX += (vx / distance) * lift;
          offsetY += (vy / distance) * lift;
          boost += (1 - Math.abs(phase)) * decay * 0.8;
        }

        dot.px = dot.x + offsetX;
        dot.py = dot.y + offsetY;

        if (boost > 0.02) {
          lit.push({ dot, boost: Math.min(1, boost) });
          continue;
        }

        ctx.moveTo(dot.px + DOT_RADIUS, dot.py);
        ctx.arc(dot.px, dot.py, DOT_RADIUS, 0, Math.PI * 2);
      }

      ctx.fillStyle = `rgba(255, 255, 255, ${BASE_ALPHA})`;
      ctx.fill();

      for (const { dot, boost } of lit) {
        ctx.beginPath();
        ctx.arc(dot.px, dot.py, DOT_RADIUS * (1 + boost * 1.1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${
          BASE_ALPHA + (1 - BASE_ALPHA) * boost
        })`;
        ctx.fill();
      }

      for (const chain of chains) {
        const age = now - chain.start;
        const drawn = (chain.points.length - 1) * SEGMENT_DRAW;
        const fading = age - drawn - CHAIN_HOLD;
        const alpha = fading > 0 ? Math.max(0, 1 - fading / CHAIN_FADE) : 1;

        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.strokeStyle = chain.color;
        ctx.shadowColor = chain.color;
        ctx.shadowBlur = 6;
        ctx.globalAlpha = alpha * 0.85;

        // Chains are drawn to the pushed positions, so a line running under the
        // glass bends with the dots it connects.
        for (let i = 1; i < chain.points.length; i++) {
          const progress = (age - (i - 1) * SEGMENT_DRAW) / SEGMENT_DRAW;
          if (progress <= 0) break;

          const from = chain.points[i - 1];
          const to = chain.points[i];
          const reached = easeOut(Math.min(1, progress));

          ctx.beginPath();
          ctx.moveTo(from.px, from.py);
          ctx.lineTo(
            from.px + (to.px - from.px) * reached,
            from.py + (to.py - from.py) * reached,
          );
          ctx.stroke();
        }

        ctx.shadowBlur = 0;

        // Each dot the line arrives at goes to full white, with a wash of the
        // chain's colour around it.
        for (let i = 0; i < chain.points.length; i++) {
          if (i > 0 && age < i * SEGMENT_DRAW) break;
          const point = chain.points[i];

          ctx.globalAlpha = alpha * 0.22;
          ctx.beginPath();
          ctx.arc(point.px, point.py, DOT_RADIUS * 4.5, 0, Math.PI * 2);
          ctx.fillStyle = chain.color;
          ctx.fill();

          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(point.px, point.py, DOT_RADIUS * 1.9, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      }

      frame = requestAnimationFrame(draw);
    };

    const pointAt = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      return inside ? { x, y } : null;
    };

    const onMove = (event: PointerEvent) => {
      const point = pointAt(event);

      if (!point) {
        lensTarget = 0;
        return;
      }

      // Coming back after being away, the glass appears where the pointer is
      // rather than sliding in from wherever it was last.
      if (lensTarget === 0) {
        lens.x = point.x;
        lens.y = point.y;
      }

      lensTarget = 1;
      pointer.x = point.x;
      pointer.y = point.y;

      // One wave per stretch of travel, otherwise every frame spawns one.
      if (Math.hypot(point.x - lastRipple.x, point.y - lastRipple.y) < RIPPLE_SPACING) {
        return;
      }

      lastRipple = point;
      ripples.push({ ...point, start: performance.now() / 1000, power: 1 });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
    };

    const onLeave = () => {
      lensTarget = 0;
    };

    // A finger that lifts, or a drag the browser takes over for scrolling,
    // leaves no trace of itself. Without this the glass stays where the touch
    // ended, frozen in the field.
    const onRelease = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") lensTarget = 0;
    };

    const onDown = (event: PointerEvent) => {
      const point = pointAt(event);
      if (!point || !dots.length) return;

      // A tap arrives with no hover before it, so touch presses the glass into
      // the field at the contact point and lets go with the finger.
      if (event.pointerType !== "mouse") {
        lens.x = point.x;
        lens.y = point.y;
        pointer.x = point.x;
        pointer.y = point.y;
        lensTarget = 1;
      }

      const now = performance.now() / 1000;
      ripples.push({ ...point, start: now, power: CLICK_POWER });

      let nearest = dots[0];
      let shortest = Infinity;
      for (const dot of dots) {
        const distance = (dot.x - point.x) ** 2 + (dot.y - point.y) ** 2;
        if (distance < shortest) {
          shortest = distance;
          nearest = dot;
        }
      }

      chains.push(buildChain(nearest, now));
    };

    layout();

    const observer = new ResizeObserver(() => {
      layout();
      if (reduceMotion) drawStatic();
    });
    observer.observe(canvas);

    // Someone who asked for stillness gets the grid and nothing else.
    if (reduceMotion) {
      drawStatic();
      return () => observer.disconnect();
    }

    // Listening on the document rather than the canvas, so the glass follows
    // the pointer across the headline too instead of stopping at its edges.
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerup", onRelease);
    document.addEventListener("pointercancel", onRelease);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerup", onRelease);
      document.removeEventListener("pointercancel", onRelease);
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
