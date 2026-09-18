"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Clock = { running: boolean; startedAt: number; offset: number };

// The clock every part of the visualisation reads. It lives in a ref and gets
// sampled once per frame rather than held in state, so a running transport
// re-renders nothing. When the stems land, this is the one place that changes:
// `elapsed` becomes an AudioContext time instead of a wall clock, and the
// rotation stays locked to the audio rather than to the browser's timers.
export function useTransport(autoStart: boolean) {
  const clock = useRef<Clock>({ running: false, startedAt: 0, offset: 0 });
  const [running, setRunning] = useState(false);

  const elapsed = useCallback(() => {
    const { running, startedAt, offset } = clock.current;
    return running ? offset + (performance.now() - startedAt) / 1000 : offset;
  }, []);

  const start = useCallback(() => {
    if (clock.current.running) return;
    clock.current = {
      running: true,
      startedAt: performance.now(),
      offset: clock.current.offset,
    };
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    if (!clock.current.running) return;
    // Bank the time played so far, so picking it back up carries on from here.
    clock.current = { running: false, startedAt: 0, offset: elapsed() };
    setRunning(false);
  }, [elapsed]);

  const toggle = useCallback(() => {
    if (clock.current.running) stop();
    else start();
  }, [start, stop]);

  const rewind = useCallback(() => {
    clock.current = {
      running: clock.current.running,
      startedAt: performance.now(),
      offset: 0,
    };
  }, []);

  useEffect(() => {
    if (autoStart) start();
  }, [autoStart, start]);

  return { running, elapsed, toggle, rewind };
}
