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

// How far the two recordings may sit apart before the silent one is pulled back
// into step. Not tighter than this: a compressed file can only be seeked to a
// frame boundary, a fortieth of a second in an MP3, so asking for better is
// asking for a correction that can never succeed and will be tried again every
// time it is measured.
const TIGHT = 0.035;

// And not more often than this, however far apart they are. A phone takes long
// enough over a seek that a correction made every frame would spend its time
// starting over, and the recording being corrected is the one nobody can hear,
// so there is nothing to be gained by hurrying it.
const COOL = 250;

// How long a part may be left silent while it is put in step before it is handed
// the mix regardless. Reached only when the file is still filling its buffer
// after the jump, in which case it could not have played in time anyway; with
// the audio already in hand it takes a couple of seeks and a fraction of this.
const PATIENCE = 900;

// How long a part has to start playing at all before the drawing gives up on it
// and goes back to the mix. Long, because on a phone this is a file being
// fetched for the first time, and the mix is still playing while it comes.
const REACH = 8000;

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

const holding = (el: HTMLAudioElement, src: string) => {
  if (!el.src) return false;

  try {
    return new URL(el.src).pathname === src;
  } catch {
    return el.src.endsWith(src);
  }
};

// Where one recording has to stand to be level with another. The shift is what
// separates the two clocks: an MP3 stem of an AAC mix reports its time a few
// tens of milliseconds out, and which way round that goes depends on which of
// the two is doing the following.
const aimedAt = (leader: HTMLAudioElement, shift: number) =>
  Math.max(0, leader.currentTime + shift);

// Put the follower where the leader is. Aimed at where the leader will be by the
// time the seek lands rather than where it is now, since otherwise every
// correction leaves the follower exactly one seek behind — which is how a solo
// ends up arriving a frame or two after the part it is meant to be. What a seek
// costs is measured as it goes and kept for the next one. Answers with where it
// aimed, which is how a housekeeping seek is told apart from someone dragging
// the progress bar.
const nudge = (
  leader: HTMLAudioElement,
  follower: HTMLAudioElement,
  shift: number,
  lag: { current: number },
  settling: { current: boolean },
) => {
  settling.current = true;

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;

    const off = follower.currentTime - aimedAt(leader, shift);
    if (!leader.paused && !follower.seeking) {
      lag.current = Math.min(0.25, Math.max(0, lag.current - off));
    }

    settling.current = false;
  };

  const landed = () => {
    follower.removeEventListener("seeked", landed);
    window.setTimeout(finish, SETTLE);
  };

  follower.addEventListener("seeked", landed);
  // Should the seek never report back, the next one would otherwise never be
  // allowed to happen.
  window.setTimeout(finish, SETTLE * 8);

  const aim = aimedAt(leader, shift) + (leader.paused ? 0 : lag.current);
  follower.currentTime = aim;

  return aim;
};

// The clock every part of the visualisation reads, taken from the recording
// itself. It lives in a ref and gets sampled once per frame rather than held
// in state, so a running transport re-renders nothing: the rings, the readout
// and the progress bar all ask it where the music is and draw themselves.
//
// Two elements, not one. Soloing a part mutes the mix and brings the stem up
// alongside it rather than swapping what is loaded, so nothing has to be fetched
// or decoded before the next frame can be drawn and the rings carry on turning
// through the switch. What changes is only which of the two you can hear.
//
// Whichever that is, is the clock — and is also the one that is never seeked.
// Corrections go to the silent recording, always: it is playing the same music
// at the same rate, so putting it in step there costs nothing, while a seek in
// the audible one is a hole in the music. On a phone, where a seek is slow and
// can only land on a frame boundary, a correction aimed at what you are
// listening to does not settle — it just keeps trying, and you hear every try.
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
  // And which of them you are actually hearing, which trails the one above by
  // however long the stem takes to get in step: soloing is asked for first and
  // granted afterwards, and everything that must not be heard happening has to
  // know the difference.
  const audible = useRef<Held | null>(null);
  // Where the last correction was aimed. A seek the page made for its own
  // housekeeping must not be mistaken for the music being moved by hand.
  const tidy = useRef(-1);
  // When the last one was made, so they cannot come faster than COOL.
  const nudged = useRef(0);
  // How long a seek on a playing element takes to land, learned from the last
  // one. The master does not wait for it, so a seek that aims at where the
  // master is now arrives this far behind.
  const lag = useRef(0.04);
  // One correction at a time. A seek that has been asked for but has not settled
  // yet reports a time that would only provoke another one.
  const settling = useRef(false);
  // Whether the stem element has been played once from inside a gesture, which
  // is what a phone waits for before it will have anything to do with it.
  const woken = useRef(false);
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

  // Where the music has got to, read from whichever recording you can hear. That
  // one is the truth by definition: a part playing on its own that has to stop
  // and fill its buffer should take the drawing with it, rather than leave the
  // rings turning somewhere the sound is not. Answered in the master's terms,
  // since that is what the song is counted in.
  //
  // Except in the moment after a jump, when the audible one is still on its way
  // to where it was sent and the master is the only one that knows where that
  // was.
  const heardAt = useCallback(() => {
    const player = audio.current;
    if (!player) return 0;

    const held = audible.current;
    const stemmed = aside.current;
    if (!held || !stemmed || performance.now() < mending.current) {
      return player.currentTime;
    }

    return Math.max(0, stemmed.currentTime - held.offset);
  }, [audio, aside]);

  // Waking the second element, which can only be done from inside a gesture: a
  // phone will not fetch or touch a media file that nothing asked for in one,
  // and it holds that against an element until something does. Started and
  // stopped again here, in the tap that asks for the music, it is awake and its
  // file is on the way down long before anyone clicks a ring.
  const wake = useCallback(() => {
    const stemmed = aside.current;
    if (!stemmed || woken.current || !stemmed.src) return;

    woken.current = true;

    // Silent, and stopped again once it is awake — unless a part has already
    // been asked for while the music was stopped, in which case this is the
    // gesture that gets it going and it should be left alone.
    stemmed.muted = soloing.current !== null ? stemmed.muted : true;
    void stemmed
      .play()
      .then(() => {
        if (soloing.current === null) stemmed.pause();
      })
      .catch(() => undefined);
  }, [aside]);

  const toggle = useCallback(() => {
    const player = audio.current;
    if (!player) return;

    // Nothing here sets `running`: the element says when it is playing, and
    // both the keyboard and the button end up going through these same events.
    if (player.paused) {
      wake();
      void player.play().catch(() => undefined);
    } else player.pause();
  }, [audio, wake]);

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
  //
  // Answers whether the part can actually be heard, so that a drawing which has
  // already gone dim and warm around one ring can put itself back if the sound
  // never arrives, rather than sitting there claiming something it is not doing.
  const solo = useCallback(
    (stem: Stem | null): Promise<boolean> => {
      const player = audio.current;
      const stemmed = aside.current;
      if (!player || !stemmed) return Promise.resolve(false);

      if (stem === null) {
        soloing.current = null;
        audible.current = null;
        // The master has been kept in step all the while the stem was the one
        // being heard, so handing it back is two mutes and nothing else: no
        // seek, no gap, and the beat carries straight on. The stem is left
        // playing, silently, for the same reason.
        stemmed.muted = true;
        player.muted = false;
        rebase(player.currentTime);
        return Promise.resolve(true);
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
      loaded.current = held;

      // Loading a file it is already holding would throw away the buffer and
      // start the fetch again, which is what makes switching back and forth
      // between the same two things free after the first time.
      if (!holding(stemmed, held.src)) stemmed.src = held.src;

      return new Promise<boolean>((resolve) => {
        let answered = false;
        const answer = (heard: boolean) => {
          if (answered) return;

          answered = true;
          resolve(heard);
        };

        const handover = () => {
          if (!mine()) {
            answer(false);
            return;
          }

          stemmed.muted = false;
          player.muted = true;
          // From here the stem is the clock, and the master is the one that gets
          // moved if the two ever part company.
          audible.current = held;
          answer(true);
        };

        // How long the part has to arrive at all, and then, once it is running,
        // how long it has to get in step before it is handed the mix anyway.
        // Two clocks because they are two different waits: a file coming down a
        // phone's connection can take seconds, while lining up one that is
        // already playing takes two seeks.
        const arriving = performance.now() + REACH;
        let lining = 0;

        // The putting-in-step itself belongs to the frame loop; all this does is
        // watch, which is why it can afford to wait: every try happens silent, so
        // the only cost is a few more milliseconds of the mix, and what it buys
        // is a solo that starts on the beat rather than a third of a sixteenth
        // behind it.
        const watch = () => {
          if (answered) return;

          if (!mine()) {
            answer(false);
            return;
          }

          if (player.paused) {
            handover();
            return;
          }

          // Not playing yet: either the file is still coming or the phone has
          // refused it. The mix carries on meanwhile, so this is worth waiting
          // out — but not forever, since a part that never arrives still owes
          // the drawing an answer.
          const rolling =
            !stemmed.paused &&
            stemmed.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;

          if (!rolling) {
            if (performance.now() >= arriving) answer(false);
            else requestAnimationFrame(watch);
            return;
          }

          if (lining === 0) {
            lining = performance.now() + PATIENCE;
            mending.current = lining;
          }

          if (performance.now() >= lining) {
            handover();
            return;
          }

          if (!settling.current && stemmed.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
            const off = stemmed.currentTime - aimedAt(player, held.offset);
            if (Math.abs(off) <= TIGHT) {
              handover();
              return;
            }
          }

          requestAnimationFrame(watch);
        };

        // Nothing to line up against while the music is stopped, so the mutes are
        // swapped now and the frame loop puts the stem in step when the master
        // starts. It is stood where the master is standing first, so that when
        // the music does start it starts from there rather than from the top.
        if (player.paused) {
          if (stemmed.readyState >= HTMLMediaElement.HAVE_METADATA) {
            stemmed.currentTime = aimedAt(player, held.offset);
          }

          handover();
          return;
        }

        // Asked to play now, in the same turn as the click that wanted it, and
        // before it is known to be ready. Waiting on the file first would spend
        // the gesture a phone has to see to allow this at all — and a phone does
        // not fetch a media file until something asks it to play, so that wait
        // would never end. It is silent either way, so there is nothing to hear
        // in starting it early.
        void stemmed.play().catch(() => answer(false));
        watch();
      });
    },
    [audio, aside, rebase],
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
      // jump that caused it is still what you are hearing. This is the one time
      // the audible recording is seeked, and it is the one time a gap in it is
      // the point rather than a fault.
      nudge(player, stemmed, held.offset, lag, settling);
      nudged.current = performance.now();
      mending.current = performance.now() + PATIENCE;
    };

    const onPlay = () => {
      clock.current = { at: heardAt(), since: performance.now(), running: true };
      setRunning(true);
      follow();
    };

    const onStop = () => {
      clock.current = { at: heardAt(), since: performance.now(), running: false };
      setRunning(false);
      aside.current?.pause();
    };

    const onSeeked = () => {
      // A seek the page made itself, to keep the silent recording in step. It is
      // not the music being moved, so it must not drag the other one after it.
      if (Math.abs(player.currentTime - tidy.current) < 0.02) {
        tidy.current = -1;
        return;
      }

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
        const played = heardAt();
        if (Math.abs(elapsed() - played) > SLIP) rebase(played);

        // And the same argument a second time, between the two recordings, with
        // one rule: the correction is always made to the one you cannot hear.
        // A seek in the audible recording is the most obvious thing on the page —
        // a hole in the music — and having two elements playing at once is what
        // buys the freedom to put things right where nobody is listening.
        const stemmed = aside.current;
        const held = audible.current ?? loaded.current;
        const ready =
          stemmed &&
          held &&
          !stemmed.paused &&
          !settling.current &&
          performance.now() - nudged.current > COOL;

        if (stemmed && held && ready) {
          if (audible.current) {
            // Soloing: the stem is the one being heard, so the master follows it.
            // It is muted the whole time, so this costs nothing but a seek nobody
            // can hear, and it is what makes coming back out of a solo a swap of
            // two mutes rather than a jump in the music.
            const off = player.currentTime - aimedAt(stemmed, -held.offset);

            if (Math.abs(off) > TIGHT) {
              nudged.current = performance.now();
              tidy.current = nudge(stemmed, player, -held.offset, lag, settling);
            }
          } else {
            // Mixing: the master is the one being heard, and the stem waits in
            // step behind it so that asking for it is instant.
            const off = stemmed.currentTime - aimedAt(player, held.offset);

            if (Math.abs(off) > TIGHT) {
              nudged.current = performance.now();
              nudge(player, stemmed, held.offset, lag, settling);
            }
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
  }, [audio, aside, elapsed, heardAt, rebase]);

  return { running, elapsed, toggle, rewind, seek, solo, duration };
}
