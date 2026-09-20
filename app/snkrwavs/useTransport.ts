"use client";

import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

type Clock = { at: number; since: number; running: boolean };

export type Stem = {
  src: string;
  // Seconds added to the master's currentTime when seeking this file. An MP3
  // stem of an AAC mix is not zero: the two encodings report different amounts
  // of priming, and without this they play the same music a few tens of
  // milliseconds apart.
  offset?: number;
};

type Held = { src: string; offset: number };

// How far the stem may sit from the master before it is pulled back. Silent, a
// correction costs nothing, so it is held to a fiftieth of a second; audible, a
// seek can be heard, so it is left alone unless something has properly gone
// wrong, like the file stalling.
const TIGHT = 0.02;

// How long a part may be left silent while it is put in step before it is handed
// the mix regardless. Reached only when the file is still filling its buffer
// after the jump, in which case it could not have played in time anyway; with
// the audio already in hand it takes a couple of seeks and a fraction of this.
const PATIENCE = 900;

// How long to let a seek settle before believing where it says it landed. A
// seeked element reports the time it was asked for, and then, once it is
// actually playing again, drops back to the frame boundary it could really
// start from — some forty milliseconds in an MP3, a frame and a half of it.
// Reading any sooner than that measures the request rather than the result.
const SETTLE = 120;

// A media element reports where it is up to in steps rather than continuously,
// so between those steps the ring is turned by the wall clock and snapped back
// whenever the two disagree by more than this. Small enough that nobody can
// see the correction, loose enough that it almost never has to make one.
const SLIP = 0.05;

const DRAG = 0.1;

const holding = (el: HTMLAudioElement, src: string) => {
  if (!el.src) return false;

  try {
    return new URL(el.src).pathname === src;
  } catch {
    return el.src.endsWith(src);
  }
};

const linedUp = (player: HTMLAudioElement, offset: number) =>
  Math.max(0, player.currentTime + offset);

// Put the stem where the master is. Aimed at where the master will be by the
// time the seek lands rather than where it is now, since otherwise every
// correction leaves the stem exactly one seek behind — which is how a solo ends
// up arriving a frame or two after the part it is meant to be. What a seek costs
// is measured as it goes and kept for the next one.
const nudge = (
  player: HTMLAudioElement,
  stemmed: HTMLAudioElement,
  held: Held,
  lag: { current: number },
  settling: { current: boolean },
) => {
  settling.current = true;

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;

    const off = stemmed.currentTime - linedUp(player, held.offset);
    if (!player.paused && !stemmed.seeking) {
      lag.current = Math.min(0.25, Math.max(0, lag.current - off));
    }

    settling.current = false;
  };

  const landed = () => {
    stemmed.removeEventListener("seeked", landed);
    window.setTimeout(finish, SETTLE);
  };

  stemmed.addEventListener("seeked", landed);
  // Should the seek never report back, the next one would otherwise never be
  // allowed to happen.
  window.setTimeout(finish, SETTLE * 8);

  stemmed.currentTime =
    linedUp(player, held.offset) + (player.paused ? 0 : lag.current);
};

// The clock every part of the visualisation reads, taken from the recording
// itself. It lives in a ref and gets sampled once per frame rather than held
// in state, so a running transport re-renders nothing: the rings, the readout
// and the progress bar all ask it where the music is and draw themselves.
//
// Two elements, not one. The master is the clock and never stops being the
// clock: soloing a part mutes it and brings the stem up alongside it rather
// than swapping what is loaded, so nothing has to be fetched or decoded before
// the next frame can be drawn and the rings carry on turning through the
// switch. What changes is only which of the two you can hear.
export function useTransport(
  audio: RefObject<HTMLAudioElement | null>,
  aside: RefObject<HTMLAudioElement | null>,
) {
  const clock = useRef<Clock>({ at: 0, since: 0, running: false });
  // What the second element is holding, and whether you can hear it, which are
  // two different questions. Once a stem is loaded it keeps playing in step with
  // the master whether or not it is the one being listened to, so coming back to
  // a part is a matter of swapping which of the two is muted and lands exactly
  // where the music is.
  const loaded = useRef<Held | null>(null);
  const soloing = useRef<Held | null>(null);
  // How long a seek on a playing element takes to land, learned from the last
  // one. The master does not wait for it, so a seek that aims at where the
  // master is now arrives this far behind.
  const lag = useRef(0.04);
  // One correction at a time. A seek that has been asked for but has not settled
  // yet reports a time that would only provoke another one.
  const settling = useRef(false);
  // Until when to hold the stem closely rather than loosely. Set whenever the
  // two have just been thrown out of step — a solo starting, the music being
  // moved — where a correction is masked by the jump that caused it.
  const mending = useRef(0);
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

  // Play one part on its own, or hand it back to the mix. Called with a file to
  // solo it and with nothing to stop soloing, which is the whole of the
  // arrangement: one thing or everything, never a blend of the two.
  const solo = useCallback(
    (stem: Stem | null) => {
      const player = audio.current;
      const stemmed = aside.current;
      if (!player || !stemmed) return;

      if (stem === null) {
        soloing.current = null;
        // Left playing, silently. It stays in step with the master, so asking
        // for this part again costs nothing and arrives on the beat.
        stemmed.muted = true;
        player.muted = false;
        return;
      }

      const held: Held = { src: stem.src, offset: stem.offset ?? 0 };
      soloing.current = held;

      // Identity rather than the filename: two clicks on the same part are two
      // different requests, and only the newest of them should be allowed to
      // finish.
      const mine = () => soloing.current === held;

      // It comes up silent and is put in step before anything is handed to it,
      // so a solo cannot be heard arriving late. Corrections made now are
      // corrections nobody hears.
      stemmed.muted = true;

      const handover = () => {
        if (!mine()) return;

        stemmed.muted = false;
        player.muted = true;
      };

      // Wait for the part to be in step before handing it the mix, and hand it
      // over anyway if it cannot get there. The putting-in-step itself belongs
      // to the frame loop; all this does is watch, which is why it can afford
      // to: every try happens silent, so the only cost of waiting is a few more
      // milliseconds of the mix, and what it buys is a solo that starts on the
      // beat rather than a third of a sixteenth behind it.
      const watch = (by: number) => {
        if (!mine()) return;
        if (player.paused || performance.now() >= by) {
          handover();
          return;
        }

        if (!settling.current && stemmed.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          const off = stemmed.currentTime - linedUp(player, held.offset);
          if (Math.abs(off) <= TIGHT) {
            handover();
            return;
          }
        }

        requestAnimationFrame(() => watch(by));
      };

      const start = () => {
        if (!mine()) return;

        // Nothing to line up against while the music is stopped: the mutes are
        // swapped now and the stem is put in step when the master starts.
        if (player.paused) {
          handover();
          return;
        }

        mending.current = performance.now() + PATIENCE;

        void stemmed
          .play()
          .then(() => watch(performance.now() + PATIENCE))
          .catch(() => undefined);
      };

      loaded.current = held;

      // Loading a file it is already holding would throw away the buffer and
      // start the fetch again, which is what makes switching back and forth
      // between the same two things free after the first time.
      if (
        holding(stemmed, held.src) &&
        stemmed.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        start();
        return;
      }

      if (!holding(stemmed, held.src)) stemmed.src = held.src;

      const onReady = () => {
        stemmed.removeEventListener("canplay", onReady);
        start();
      };

      stemmed.addEventListener("canplay", onReady);
    },
    [audio, aside],
  );

  useEffect(() => {
    const player = audio.current;
    if (!player) return;

    // Whatever the master does, the stem does with it, heard or not: it is the
    // same recording heard from a different distance, and it is never asked to
    // lead.
    const follow = () => {
      const stemmed = aside.current;
      const held = loaded.current;
      if (!stemmed || !held) return;

      if (player.paused) {
        stemmed.pause();
        return;
      }

      void stemmed.play().catch(() => undefined);

      // The music has just moved, so the stem is somewhere else entirely: put it
      // roughly right now and closely right over the next few frames, while the
      // jump that caused it is still what you are hearing.
      nudge(player, stemmed, held, lag, settling);
      mending.current = performance.now() + PATIENCE;
    };

    const onPlay = () => {
      clock.current = { at: player.currentTime, since: performance.now(), running: true };
      setRunning(true);
      follow();
    };

    const onStop = () => {
      clock.current = { at: player.currentTime, since: performance.now(), running: false };
      setRunning(false);
      aside.current?.pause();
    };

    const onSeeked = () => {
      rebase(player.currentTime);
      follow();
    };
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

        // And the same argument a second time, between the two recordings: if
        // the stem has fallen behind the master — buffering, most likely — the
        // master is the one that is right.
        //
        // Held closely whenever a correction would go unheard, which is while
        // the stem is silent and for a moment after any jump, and loosely once
        // it is the thing being listened to and settled, where a seek would be
        // the most audible thing on the page.
        const stemmed = aside.current;
        const held = loaded.current;
        if (stemmed && held && !stemmed.paused && !settling.current) {
          const close = !soloing.current || performance.now() < mending.current;
          const off = stemmed.currentTime - linedUp(player, held.offset);

          if (Math.abs(off) > (close ? TIGHT : DRAG)) {
            nudge(player, stemmed, held, lag, settling);
          }
        }
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
  }, [audio, aside, elapsed, rebase]);

  return { running, elapsed, toggle, rewind, seek, solo, duration };
}
