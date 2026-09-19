"use client";

import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

type Clock = { at: number; since: number; running: boolean };

// A media element reports where it is up to in steps rather than continuously,
// so between those steps the ring is turned by the wall clock and snapped back
// whenever the two disagree by more than this. Small enough that nobody can
// see the correction, loose enough that it almost never has to make one.
const SLIP = 0.05;

// The clock every part of the visualisation reads, taken from the recording
// itself. It lives in a ref and gets sampled once per frame rather than held
// in state, so a running transport re-renders nothing: the rings, the readout
// and the progress bar all ask it where the music is and draw themselves.
export function useTransport(audio: RefObject<HTMLAudioElement | null>) {
  const clock = useRef<Clock>({ at: 0, since: 0, running: false });
  const [running, setRunning] = useState(false);
  const [duration, setDuration] = useState(0);

  const elapsed = useCallback(() => {
    const { at, since, running } = clock.current;

    return running ? at + (performance.now() - since) / 1000 : at;
  }, []);

  const rebase = useCallback((at: number) => {
    clock.current = { at, since: performance.now(), running: clock.current.running };
  }, []);

  const toggle = useCallback(() => {
    const player = audio.current;
    if (!player) return;

    // Nothing here sets `running`: the element says when it is playing, and
    // both the keyboard and the button end up going through these same events.
    if (player.paused) void player.play().catch(() => undefined);
    else player.pause();
  }, [audio]);

  const seek = useCallback(
    (seconds: number) => {
      const player = audio.current;
      if (!player) return;

      const length = player.duration || 0;
      const at = Math.min(Math.max(seconds, 0), length ? length - 0.01 : 0);

      player.currentTime = at;
      // Moved here rather than waiting on the element to report the seek, so
      // the rings answer the drag in the same frame as the hand moving it.
      rebase(at);
    },
    [audio, rebase],
  );

  const rewind = useCallback(() => seek(0), [seek]);

  useEffect(() => {
    const player = audio.current;
    if (!player) return;

    const onPlay = () => {
      clock.current = { at: player.currentTime, since: performance.now(), running: true };
      setRunning(true);
    };

    const onStop = () => {
      clock.current = { at: player.currentTime, since: performance.now(), running: false };
      setRunning(false);
    };

    const onSeeked = () => rebase(player.currentTime);
    const onMeta = () => setDuration(player.duration || 0);

    player.addEventListener("play", onPlay);
    player.addEventListener("playing", onPlay);
    player.addEventListener("pause", onStop);
    player.addEventListener("ended", onStop);
    player.addEventListener("seeked", onSeeked);
    player.addEventListener("loadedmetadata", onMeta);
    player.addEventListener("durationchange", onMeta);

    onMeta();

    // Pulling the smooth clock back in line with the audio, once a frame. Two
    // clocks running at once will always part company eventually; this is what
    // decides that the music is the one that is right.
    let frame = 0;

    const check = () => {
      if (clock.current.running) {
        const played = player.currentTime;
        if (Math.abs(elapsed() - played) > SLIP) rebase(played);
      }

      frame = requestAnimationFrame(check);
    };

    frame = requestAnimationFrame(check);

    return () => {
      cancelAnimationFrame(frame);
      player.removeEventListener("play", onPlay);
      player.removeEventListener("playing", onPlay);
      player.removeEventListener("pause", onStop);
      player.removeEventListener("ended", onStop);
      player.removeEventListener("seeked", onSeeked);
      player.removeEventListener("loadedmetadata", onMeta);
      player.removeEventListener("durationchange", onMeta);
    };
  }, [audio, elapsed, rebase]);

  return { running, elapsed, toggle, rewind, seek, duration };
}
