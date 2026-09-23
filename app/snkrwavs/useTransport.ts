"use client";

import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

type Clock = { at: number; since: number; running: boolean };

export type Stem = {
  src: string;
  // Seconds added to the master's clock to get this file's own. Nothing, for a
  // stem encoded the way the mix is; see the note on `stemOffset` in loop.ts for
  // why it is worth the trouble of making sure they are.
  offset?: number;
};

type Held = { src: string; offset: number };

// How close the recording coming in has to stand to the one going out before it
// is handed the sound. Not tighter than this: a compressed file can only be
// seeked to a frame boundary, a fortieth of a second or so, and asking for
// better is asking for a seek that cannot land and will be tried again for as
// long as it is measured.
const TIGHT = 0.035;

// How long it may spend getting there, once it is playing, before it is given the
// sound anyway, landing wherever it has got to. Room for four or five goes at it:
// a go costs a seek, the wait to see where that seek landed, and the stretch of
// proper timekeeping below. Worth being generous with, because the whole of it is
// spent listening to the mix — and what is bought is a switch that lands on the
// beat instead of a bar's eighth away from it, which is heard as the music
// stumbling.
const PATIENCE = 1500;

// And how long it has to start playing at all before the drawing gives up on it.
// Long, because on a phone this is a file being fetched for the first time, and
// the music carries on while it comes.
const REACH = 8000;

// How long the part coming in has to be keeping proper time before it is handed
// the sound, and how far from the wall clock it may be over that stretch. Asked
// to play, an element reports the time it is about to start from a good while
// before any sound comes out of it, and it will even let that reported time
// creep forward: the only thing that tells a recording which is playing from one
// which is about to be playing is a clock that keeps up with the room's.
const PROOF = 100;
const DRIFT = 0.04;

// How long to let a seek settle before believing where it says it landed. An
// element reports the time it was asked for, and then, once it is really playing
// again, drops back to the frame it could actually start from.
const SETTLE = 120;

// A media element reports where it is up to in steps rather than continuously, so
// between those steps the rings are turned by the wall clock and snapped back
// whenever the two disagree by more than this. Small enough that nobody can see
// the correction, loose enough that it almost never has to make one.
const SLIP = 0.05;

const same = (url: string, src: string) => {
  if (!url) return false;

  try {
    return new URL(url).pathname === src;
  } catch {
    return url.endsWith(src);
  }
};

// Which file an element has been pointed at, and which one it has actually got
// hold of. The two differ for a moment after the file is changed, and in that
// moment everything the element says about itself — how much of it is loaded,
// where it is up to — is still about the file it is leaving. Believing that is
// how a part gets handed the sound before it has a sample of it: parked in step
// on the last stem, it reads as loaded and exactly in time, because those
// readings belong to the last one. Nine parts in, that is the ordinary case.
const pointedAt = (el: HTMLAudioElement, src: string) => same(el.src, src);
const holding = (el: HTMLAudioElement, src: string) => same(el.currentSrc, src);

// Move an element to where it ought to be. Aimed at where that will be by the
// time the seek lands rather than where it is now, since otherwise every attempt
// leaves it exactly one seek behind — which is how a solo ends up arriving after
// the part it belongs to. What a seek costs is measured as it goes and kept for
// the next one.
const nudge = (
  el: HTMLAudioElement,
  target: () => number,
  lag: { current: number },
  settling: { current: boolean },
) => {
  settling.current = true;

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;

    if (!el.seeking) {
      const off = el.currentTime - target();
      lag.current = Math.min(0.25, Math.max(0, lag.current - off));
    }

    settling.current = false;
  };

  const landed = () => {
    el.removeEventListener("seeked", landed);
    window.setTimeout(finish, SETTLE);
  };

  el.addEventListener("seeked", landed);
  // Should the seek never report back, the next one would otherwise never be
  // allowed to happen.
  window.setTimeout(finish, SETTLE * 8);

  el.currentTime = Math.max(0, target() + lag.current);
};

// The clock every part of the visualisation reads, taken from the recording
// itself. It lives in a ref and gets sampled once per frame rather than held in
// state, so a running transport re-renders nothing: the rings, the readout and
// the progress bar all ask it where the music is and draw themselves.
//
// Two elements, and one of them playing at a time. Whichever you can hear is the
// clock, and the other is parked — muted, stopped, and left standing at the same
// moment so that it can take over. Soloing is a handover: the part coming in is
// started silently, put in step while nobody can hear it, given the sound only
// once it is there, and the one it replaces is stopped.
//
// Two rules come out of that, and a phone is what taught both. Nothing audible is
// ever seeked, because a seek it cannot land exactly is a hole in the music and
// it will keep trying. And nothing is left decoding once it has been handed over,
// because a second file playing quietly in the background is not free — it was
// what made the whole page feel heavier for as long as a solo had been touched.
export function useTransport(
  audio: RefObject<HTMLAudioElement | null>,
  aside: RefObject<HTMLAudioElement | null>,
) {
  const clock = useRef<Clock>({ at: 0, since: 0, running: false });
  // The part being heard on its own, if any. While it is set the second element
  // is the one playing and the master is parked; while it is not, the other way
  // about.
  const audible = useRef<Held | null>(null);
  // What that element is holding, which outlives the solo: the file stays loaded,
  // so asking for the same part twice does not fetch it twice.
  const loaded = useRef<Held | null>(null);
  // Every request to change what is playing takes a number, and only the newest
  // of them is allowed to finish: clicks come faster than files load.
  const asked = useRef(0);
  // How long a seek takes to land, learned from the last one.
  const lag = useRef(0.04);
  // One seek at a time. A seek asked for but not yet settled reports a time that
  // would only provoke another.
  const settling = useRef(false);
  // Whether the second element has been played once from inside a gesture, which
  // is what a phone waits for before it will have anything to do with it.
  const woken = useRef(false);
  const [running, setRunning] = useState(false);
  const [duration, setDuration] = useState(0);

  // The element you can hear, which is the only one that should be playing.
  const live = useCallback(
    () => (audible.current ? aside.current : audio.current),
    [audio, aside],
  );

  // Where the music has got to, read off that element and given in the master's
  // terms, since the song is counted in those. A part playing on its own that has
  // to stop and fill its buffer takes the drawing with it, rather than leaving
  // the rings turning somewhere the sound is not.
  const heardAt = useCallback(() => {
    const held = audible.current;
    const stemmed = aside.current;
    if (held && stemmed) return Math.max(0, stemmed.currentTime - held.offset);

    return audio.current?.currentTime ?? 0;
  }, [audio, aside]);

  const elapsed = useCallback(() => {
    const { at, since, running } = clock.current;

    return running ? at + (performance.now() - since) / 1000 : at;
  }, []);

  const rebase = useCallback((at: number) => {
    clock.current = { at, since: performance.now(), running: clock.current.running };
  }, []);

  // Waking the second element, which can only be done from inside a gesture: a
  // phone will not fetch or touch a media file that nothing has asked for in one,
  // and it holds that against the element until something does. Played and
  // stopped again here, in the tap that asks for the music, it is awake and its
  // file is on the way down long before anyone clicks a ring.
  const wake = useCallback(() => {
    const stemmed = aside.current;
    if (!stemmed || woken.current || !stemmed.src) return;

    woken.current = true;
    if (audible.current) return;

    stemmed.muted = true;
    void stemmed
      .play()
      .then(() => {
        if (!audible.current) stemmed.pause();
      })
      .catch(() => undefined);
  }, [aside]);

  const toggle = useCallback(() => {
    const playing = live();
    if (!playing) return;

    // Nothing here sets `running`: the element says when it is playing, and both
    // the keyboard and the button end up going through these same events.
    if (playing.paused) {
      wake();
      void playing.play().catch(() => undefined);
    } else playing.pause();
  }, [live, wake]);

  const seek = useCallback(
    (seconds: number) => {
      const player = audio.current;
      const stemmed = aside.current;
      if (!player) return;

      const length = player.duration || 0;
      const at = Math.min(Math.max(seconds, 0), length ? length - 0.01 : 0);

      // Both of them: the one you can hear because that is what was asked for,
      // and the parked one so that it is already standing where it will be
      // wanted. Only the first of the two is heard, and a gap there is the point.
      player.currentTime = at;

      const held = audible.current ?? loaded.current;
      if (stemmed && held) stemmed.currentTime = Math.max(0, at + held.offset);

      // Moved here rather than waiting on the element to report the seek, so the
      // rings answer the drag in the same frame as the hand moving it.
      rebase(at);
    },
    [audio, aside, rebase],
  );

  const rewind = useCallback(() => seek(0), [seek]);

  // Play one part on its own, or hand it back to the mix. Called with a file to
  // solo it and with nothing to stop soloing, which is the whole of the
  // arrangement: one thing or everything, never a blend of the two.
  //
  // Answers whether the part can actually be heard, so that a drawing which has
  // already gone dim and warm around one ring can put itself back if the sound
  // never arrives, rather than sitting there claiming something it is not doing.
  const solo = useCallback(
    (stem: Stem | null): Promise<boolean> => {
      const player = audio.current;
      const stemmed = aside.current;
      if (!player || !stemmed) return Promise.resolve(false);

      const held: Held | null = stem
        ? { src: stem.src, offset: stem.offset ?? 0 }
        : null;

      // Already the thing playing.
      if ((held?.src ?? null) === (audible.current?.src ?? null)) {
        return Promise.resolve(true);
      }

      // One part straight into another would mean taking the file out from under
      // the element that is playing it, and there is no way to do that without a
      // hole. Going back through the mix costs a beat longer and stays seamless,
      // since the mix has been parked in step all along waiting to be asked.
      if (held && audible.current) {
        return solo(null).then((back) => (back ? solo(stem) : false));
      }

      const ticket = ++asked.current;
      const mine = () => asked.current === ticket;

      const from = audible.current ? stemmed : player;
      const to = held ? stemmed : player;

      if (held && !pointedAt(stemmed, held.src)) stemmed.src = held.src;

      // Where the incoming recording should stand: the same moment in the music,
      // told in its own file's terms.
      const aim = () => Math.max(0, heardAt() + (held?.offset ?? 0));

      to.muted = true;
      if (held) loaded.current = held;

      return new Promise<boolean>((resolve) => {
        let answered = false;
        const answer = (heard: boolean) => {
          if (answered) return;

          answered = true;
          resolve(heard);
        };

        const swap = () => {
          if (!mine()) {
            answer(false);
            return;
          }

          to.muted = false;
          audible.current = held;
          from.muted = true;
          from.pause();
          rebase(heardAt());
          answer(true);
        };

        // Stopped: there is nothing to be in step with, so the two change places
        // at once and the new one waits where the music was left.
        if (from.paused) {
          to.currentTime = aim();
          swap();
          return;
        }

        const giveUp = performance.now() + REACH;
        let lining = 0;
        // When the incoming recording was last seen to start keeping time, and
        // where it was then.
        let proof: { at: number; time: number } | null = null;

        // Wait for it to be in step before handing it the sound. It can afford to
        // wait: every try happens silent, so the only cost is a few more
        // milliseconds of what was already playing, and what it buys is a switch
        // that lands on the beat rather than a third of a sixteenth off it.
        const watch = () => {
          if (answered) return;

          if (!mine()) {
            answer(false);
            return;
          }

          // Paused while it was getting ready.
          if (from.paused) {
            to.pause();
            to.currentTime = aim();
            swap();
            return;
          }

          // Three things have to be true of the part coming in before it can be
          // given the sound, and each of them was a hole in the music before it
          // was asked for.
          //
          // That it is the file that was asked for, since for a moment after the
          // file changes the element is still describing the last one — and the
          // mix never changes file, so it is always holding its own. That it has
          // enough of it in hand to carry on from where it is, rather than taking
          // the sound and stopping to fetch. And that it has been keeping time
          // for a tenth of a second, which is the only thing that separates a
          // recording that is playing from one that has been told to.
          //
          // A seek sets all of that back: what an element reports in the middle
          // of one is where it is going rather than where it is playing. So does
          // falling behind the wall clock, which is what starting up looks like
          // from the outside.
          //
          // Waiting on all three costs nothing, because what is waited through is
          // the mix, still playing.
          const now = performance.now();
          const got = !held || holding(to, held.src);
          const steady =
            got &&
            !to.paused &&
            !to.seeking &&
            !settling.current &&
            to.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;

          if (!steady) proof = null;
          else if (!proof) proof = { at: now, time: to.currentTime };
          else if (
            Math.abs(to.currentTime - proof.time - (now - proof.at) / 1000) > DRIFT
          ) {
            proof = { at: now, time: to.currentTime };
          }

          const rolling = proof !== null && now - proof.at >= PROOF;

          if (!rolling) {
            if (now < giveUp) {
              requestAnimationFrame(watch);
              return;
            }

            // It never started: the file did not come, or the phone would not
            // have it. Stopped again rather than left half awake, decoding
            // something nobody will hear.
            to.pause();
            answer(false);
            return;
          }

          if (lining === 0) lining = now + PATIENCE;

          if (Math.abs(to.currentTime - aim()) <= TIGHT || now >= lining) {
            swap();
            return;
          }

          if (!settling.current) nudge(to, aim, lag, settling);

          requestAnimationFrame(watch);
        };

        // Stood roughly right and asked to play now, in the same turn as the click
        // that wanted it and before it is known to be ready. Waiting on the file
        // first would spend the gesture a phone has to see to allow this at all —
        // and a phone fetches nothing until something asks it to play, so that
        // wait would never end. It is muted, so there is nothing to hear in it
        // starting early or in the wrong place.
        to.currentTime = aim();
        void to.play().catch(() => answer(false));
        watch();
      });
    },
    [audio, aside, heardAt, rebase],
  );

  useEffect(() => {
    const player = audio.current;
    const stemmed = aside.current;
    if (!player) return;

    // Only the element you can hear has anything to say about the transport. The
    // other one starting and stopping is housekeeping, and the page should not
    // hear about it.
    const its = (event: Event) => event.currentTarget === live();

    const onPlay = (event: Event) => {
      if (!its(event)) return;

      clock.current = { at: heardAt(), since: performance.now(), running: true };
      setRunning(true);
    };

    const onStop = (event: Event) => {
      if (!its(event)) return;

      clock.current = { at: heardAt(), since: performance.now(), running: false };
      setRunning(false);
    };

    const onSeeked = (event: Event) => {
      if (!its(event)) return;

      rebase(heardAt());
    };

    const onMeta = () => setDuration(player.duration || 0);

    const both = [player, stemmed].filter(Boolean) as HTMLAudioElement[];
    for (const el of both) {
      el.addEventListener("play", onPlay);
      el.addEventListener("playing", onPlay);
      el.addEventListener("pause", onStop);
      el.addEventListener("ended", onStop);
      el.addEventListener("seeked", onSeeked);
    }

    player.addEventListener("loadedmetadata", onMeta);
    player.addEventListener("durationchange", onMeta);

    onMeta();

    // Pulling the smooth clock back in line with the audio, once a frame. Two
    // clocks running at once will always part company eventually; this is what
    // decides that the music is the one that is right.
    let frame = 0;
    // The last reading taken, because the same one twice is not always news. An
    // element that is playing perfectly well can go a good while without telling
    // anyone where it is up to — a tenth of a second, and more on the frame where
    // a file is being fetched for another part. Taking that for a stop is how the
    // rings freeze and then jump, when the wall clock was the better guess all
    // along and the element, when it speaks again, has got to where the wall clock
    // said it would.
    //
    // A recording that has run out of buffer stops saying anything too, and that
    // is news: the music really has stopped and the rings have to stop with it.
    // What tells the two apart is whether the element has anything left to play.
    let read = -1;

    const check = () => {
      if (clock.current.running) {
        const playing = live();
        const played = heardAt();
        const starved =
          !playing || playing.readyState < HTMLMediaElement.HAVE_FUTURE_DATA;

        if (
          (played !== read || starved) &&
          Math.abs(elapsed() - played) > SLIP
        ) {
          rebase(played);
        }

        read = played;
      }

      frame = requestAnimationFrame(check);
    };

    frame = requestAnimationFrame(check);

    return () => {
      cancelAnimationFrame(frame);

      for (const el of both) {
        el.removeEventListener("play", onPlay);
        el.removeEventListener("playing", onPlay);
        el.removeEventListener("pause", onStop);
        el.removeEventListener("ended", onStop);
        el.removeEventListener("seeked", onSeeked);
      }

      player.removeEventListener("loadedmetadata", onMeta);
      player.removeEventListener("durationchange", onMeta);
    };
  }, [audio, aside, elapsed, heardAt, live, rebase]);

  return { running, elapsed, toggle, rewind, seek, solo, duration };
}
