"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import LoopRing from "./LoopRing";
import PadRing from "./PadRing";
import Readout from "./Readout";
import Scatter from "./Scatter";
import Scrubber from "./Scrubber";
import Static from "./Static";
import Thump from "./Thump";
import Wash from "./Wash";
import {
  type Loop,
  type Pad,
  SNKRWAVS_SONG as SONG,
  backIn,
  songAt,
  songSeconds,
  turnSeconds,
} from "./loop";
import { ringAt } from "./rings";
import * as tape from "./tape";
import { type Stem, useTransport } from "./useTransport";

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;

// Everything with a drawing of its own, which is everything that dims when one
// part is soloed, and what each of them is called.
const DRAWN = [
  ...SONG.loops,
  ...SONG.pads,
  ...SONG.pulses,
  ...SONG.chords,
  ...SONG.flurries,
  ...SONG.noises,
];

const NAMES = new Map(DRAWN.map((part) => [part.id, part.label]));

// The parts that can be heard on their own, by id, so that the one being
// listened to can be asked whether it is still playing.
const SOLOABLE = new Map(
  [...SONG.loops, ...SONG.pads, ...SONG.pulses].map(
    (part) => [part.id, part] as const,
  ),
);

// How long a hole in the part you are listening to is worth sitting through, in
// bars. The mix mutes the hats for a bar around 36 and drops the kit for two at
// 71: those are the arrangement, and hearing what a part does and does not do is
// the reason for listening to it alone. Longer than this is not a hole but the
// part gone — the hats are out for 29 bars from 44 — and sitting through that is
// a dimmed page around a ring that is not there, with nothing coming out of it.
const HOLD = 4; // bars

const TAU = Math.PI * 2;

// How far a pointer has to travel before it is turning a ring rather than
// clicking one. Far enough that a click is never mistaken for a wind — which
// would stop the music to start it again, and be heard — and near enough that
// turning starts under the same finger that meant to.
const WIND = 8; // pixels

// And how long after a wind a click still belongs to it. Long enough to cover the
// click that comes out of the end of the same gesture, short enough that it is
// over before a hand could have meant a second thing.
const WOUND = 400; // milliseconds

// How brightly the rest of the piece is drawn while one part is soloed. Low, but
// not dark: the reason for leaving them turning is to see where the part you are
// hearing sits in the whole, and that only works while they are still legible.
const SHADE = 0.15;

// How long that change takes, which is long enough to read as the page
// answering the click rather than as a cut.
const RAMP = 260; // milliseconds

// Both the dimming of everything else and the warming of the one part run on
// that same ramp, from wherever they had reached when it last changed.
const eased = (started: number | undefined, target: number, at: number) => {
  if (started === undefined) return target;

  return started + (target - started) * Math.min(1, (performance.now() - at) / RAMP);
};

export default function SnkrwavsPage() {
  // Nothing turns until the music is playing, and nothing plays until it is
  // asked for: a page cannot start its own sound, and a ring turning silently
  // would only have to jump into line once the sound caught up with it.
  const player = useRef<HTMLAudioElement>(null);
  const stem = useRef<HTMLAudioElement>(null);
  const {
    running,
    elapsed,
    toggle,
    rewind,
    seek,
    solo,
    grab,
    wind,
    release,
    duration,
  } = useTransport(player, stem);

  // The space the rings turn in, which is also the thing clicks are measured
  // against: where a click landed only means something as a distance from the
  // middle of the drawing.
  const stage = useRef<HTMLDivElement>(null);

  // Which part is playing on its own. In state for the label, and in a ref as
  // well for the frame loops, which ask about it sixty times a second and would
  // otherwise have to be rebuilt every time it changed.
  const [soloed, setSoloed] = useState<string | null>(null);
  const chosen = useRef<string | null>(null);
  const [pointing, setPointing] = useState(false);

  // Where both ramps had got to when they last changed, so that clicking part
  // way through one carries on from where the page actually is rather than
  // starting over from full.
  const shift = useRef({
    at: 0,
    shade: new Map<string, number>(),
    warmth: new Map<string, number>(),
  });

  // How brightly a part should be drawn this frame: all of it unless something
  // else is soloed, and easing rather than jumping between the two.
  const focus = useCallback(
    (id: string) =>
      eased(
        shift.current.shade.get(id),
        chosen.current === null || chosen.current === id ? 1 : SHADE,
        shift.current.at,
      ),
    [],
  );

  // And how warm: the one part being heard on its own has the lines it is
  // written on lit, which is the other half of the same answer. Dimming alone
  // would say only that the rest has gone quiet.
  const warmth = useCallback(
    (id: string) =>
      eased(
        shift.current.warmth.get(id),
        chosen.current === id ? 1 : 0,
        shift.current.at,
      ),
    [],
  );

  const choose = useCallback(
    (id: string | null, source: Stem | null) => {
      const shade = new Map<string, number>();
      const warm = new Map<string, number>();
      for (const part of DRAWN) {
        shade.set(part.id, focus(part.id));
        warm.set(part.id, warmth(part.id));
      }

      shift.current = { at: performance.now(), shade, warmth: warm };
      chosen.current = id;
      setSoloed(id);

      void solo(source).then((heard) => {
        // The part could not be played: the file never came, or the phone would
        // not have it. The drawing has already dimmed and warmed around the ring
        // by this point, so it has to put itself back rather than sit there
        // saying it is playing something you cannot hear.
        if (!heard && chosen.current === id) revert.current();
      });
    },
    [focus, solo, warmth],
  );

  // The tap that starts the music is where the tape machine is woken, for the
  // same reason the second recording is woken there: a phone will not let a page
  // make a sound nothing asked it for, and a hand arriving on a ring later is not
  // an asking. Nothing is fetched or decoded here — only the machine is switched
  // on, standing there silent in case it is wanted.
  const start = useCallback(() => {
    tape.wake();
    toggle();
  }, [toggle]);

  // Kept in a ref so the undo above can reach `choose` without the two of them
  // having to be declared in terms of each other.
  const revert = useRef(() => {});
  revert.current = () => choose(null, null);

  // Which ring, if any, is under a point on the screen. Distances are measured
  // as fractions of the shorter side of the drawing, the way the rings place
  // themselves, so this needs to know nothing about the size of the window.
  const ringUnder = useCallback(
    (x: number, y: number) => {
      const box = stage.current?.getBoundingClientRect();
      if (!box) return null;

      const size = Math.min(box.width, box.height);
      if (size <= 0) return null;

      const across = x - (box.left + box.width / 2);
      const down = y - (box.top + box.height / 2);

      return ringAt(SONG, songAt(SONG, elapsed()), Math.hypot(across, down) / size);
    },
    [elapsed],
  );

  // Which file is making the sound, so that a hand on a ring winds what is being
  // heard rather than what is written: the mix, or the one part soloed out of it.
  const sounding = useCallback((): Stem => {
    const part = chosen.current === null ? null : SOLOABLE.get(chosen.current);

    return part?.stem
      ? { src: part.stem, offset: part.stemOffset ?? 0 }
      : { src: SONG.audio, offset: 0 };
  }, []);

  // A ring in a hand. Where the pointer last was around the middle, how much of a
  // turn it has been taken through since, and the moment in the song it was taken
  // hold at: a ring is a wheel geared to its own length, so what a turn of it is
  // worth is the part's own business.
  const turning = useRef<{
    part: Loop | Pad;
    from: number;
    angle: number;
    turned: number;
    down: { x: number; y: number };
    wound: boolean;
  } | null>(null);

  // When a wind last ended, because the click that comes out of the same gesture
  // is not a click on a ring and must not solo one. A moment rather than a flag:
  // a gesture that ends outside the page never sends the click at all, and a flag
  // left set would swallow the next real one.
  const letGo = useRef(0);

  const middleOf = useCallback(() => {
    const box = stage.current?.getBoundingClientRect();
    if (!box) return null;

    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, [role='slider']")) return;

      const hit = ringUnder(event.clientX, event.clientY);
      // The coin in the middle is a disc rather than a wheel: there is no turning
      // something you have hold of the centre of.
      if (!hit || "spans" in hit) return;

      const middle = middleOf();
      if (!middle) return;

      turning.current = {
        part: hit,
        from: elapsed(),
        angle: Math.atan2(event.clientY - middle.y, event.clientX - middle.x),
        turned: 0,
        down: { x: event.clientX, y: event.clientY },
        wound: false,
      };

      // So that the ring stays in the hand once it is in it, wherever the hand
      // goes: a wheel is turned from the outside, and the outside of a small ring
      // is off it almost at once.
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [elapsed, middleOf, ringUnder],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const held = turning.current;
      const middle = held && middleOf();
      if (!held || !middle) return;

      const angle = Math.atan2(event.clientY - middle.y, event.clientX - middle.x);

      // The short way round, so that a hand crossing the top of a ring is a step
      // across it rather than a turn back the other way.
      let step = angle - held.angle;
      while (step > Math.PI) step -= TAU;
      while (step < -Math.PI) step += TAU;
      held.angle = angle;

      // The rings turn the way the music runs, which here is anticlockwise: the
      // notes come up the right of the screen to meet the playhead at the top. So
      // pulling a ring on the way it was already going runs the song on, pulling
      // it back rewinds it, and whatever was under the finger stays under it —
      // this is the same turn the drawing is made of, read the other way.
      held.turned -= step / TAU;

      // Until it has gone far enough to mean it, this is still a click. The
      // transport is not touched and the music is not stopped, since stopping it
      // to start it again is a hole in the sound and every click would have one.
      if (!held.wound) {
        const far = Math.hypot(
          event.clientX - held.down.x,
          event.clientY - held.down.y,
        );
        if (far < WIND) return;

        const file = sounding();
        held.wound = true;
        grab();
        tape.grab(file.src, file.offset ?? 0, held.from);
        event.currentTarget.style.cursor = "grabbing";
      }

      let at = held.from + held.turned * turnSeconds(SONG, held.part);

      // The ends of the reel. Held at them rather than counted past, so that
      // coming back off an end answers the hand at once instead of spending the
      // first half of the way back winding nothing.
      const last = duration ? duration - 0.01 : 0;
      if (at < 0) {
        held.from -= at;
        at = 0;
      } else if (last && at > last) {
        held.from -= at - last;
        at = last;
      }

      wind(at);
      tape.wind(at);
    },
    [duration, grab, middleOf, sounding, wind],
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const held = turning.current;
      if (!held) return;

      turning.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      // It never became a wind: it was a click, and the click is on its way.
      if (!held.wound) return;

      event.currentTarget.style.cursor = "";
      letGo.current = performance.now();
      release();
      tape.release();
    },
    [release],
  );

  // A click on a ring plays that part alone. Then any click at all hands it back
  // to the mix. There is no third state and no combining: two parts at once is a
  // mix, and mixing is a job for the desk this came off, not for a page.
  const onClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      // The end of a wind, which arrives here as a click on whatever the hand
      // happened to be over when it stopped. Winding is not choosing.
      if (performance.now() - letGo.current < WOUND) return;

      // The controls are not the drawing. Reaching for play or the scrubber
      // should not throw away the part you set up to listen to.
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, [role='slider']")) return;

      // One part never goes straight into another: while something is soloed the
      // whole page is the way back, and the next part is chosen from the mix. A
      // click that means one thing wherever it lands is easier to be sure of
      // than one that means two, and hearing the whole again in between is what
      // makes it clear what the next part is standing out of.
      if (chosen.current !== null) {
        choose(null, null);
        return;
      }

      const hit = ringUnder(event.clientX, event.clientY);
      if (!hit) return;

      choose(
        hit.id,
        hit.stem ? { src: hit.stem, offset: hit.stemOffset ?? 0 } : null,
      );
    },
    [choose, ringUnder],
  );

  // A part cannot go on being the only thing you are listening to once it has
  // stopped playing: past its last bar, or into a hole longer than the ones the
  // arrangement makes, the mix comes back by itself. Watched rather than worked
  // out in advance because the song can be scrubbed, and it only runs while
  // something is soloed.
  useEffect(() => {
    const part = soloed === null ? null : SOLOABLE.get(soloed);
    if (!part) return;

    let frame = 0;
    const watch = () => {
      // A hand winding the part can go through a stretch it is not in and out the
      // other side, looking for something. What it is asking to hear is wherever
      // it stops, so nothing is handed back until it does.
      if (
        !turning.current?.wound &&
        backIn(SONG, part, songAt(SONG, elapsed())) > HOLD * SONG.beatsPerBar
      ) {
        choose(null, null);
        return;
      }

      frame = requestAnimationFrame(watch);
    };

    frame = requestAnimationFrame(watch);

    return () => cancelAnimationFrame(frame);
  }, [choose, elapsed, soloed]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      // Out of a solo, for anyone working from the keyboard, where the whole
      // page being the way back is no use.
      if (event.code === "Escape") {
        if (chosen.current !== null) choose(null, null);
        return;
      }

      if (event.code !== "Space") return;

      // A focused button already answers to the space bar, so leave it alone
      // and let the click handler do the work once.
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea")) return;

      event.preventDefault();
      start();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose, start]);

  return (
    <main
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseMove={(event) => {
        const over = ringUnder(event.clientX, event.clientY) !== null;
        if (over !== pointing) setPointing(over);
      }}
      className={`flex min-h-screen flex-col items-center justify-between gap-8 bg-black px-6 py-6 text-white ${
        pointing ? "cursor-grab" : ""
      }`}
    >
      {/* The mix, and the one part playing on its own. One of the two plays at a
          time and the other waits in the same place, stopped: soloing hands the
          sound from one to the other once the one coming in is in step. */}
      <audio ref={player} src={SONG.audio} preload="auto" className="hidden" />
      {/* It holds a stem from the start, though not for its sound: a phone will
          not touch a media element nothing has played inside a gesture, and the
          tap that starts the music is where that is got out of the way, so there
          has to be a file in here to do it with. Nothing is fetched before that
          tap, and which of the eight it is holding is not worth choosing over:
          the ring clicked first is seven times out of eight a different one, and
          a wrong guess fetched early is megabytes for nothing. */}
      <audio
        ref={stem}
        src={SONG.loops.find((part) => part.stem)?.stem}
        preload="none"
        className="hidden"
      />

      {/* The part that is a background in the music as well as on the page, so
          it goes behind the drawing rather than over it. */}
      {SONG.noises.map((part) => (
        <Static
          key={part.id}
          song={SONG}
          part={part}
          elapsed={elapsed}
          focus={focus}
        />
      ))}

      {/* The parts with no ring, which use the whole page instead of a band of
          it: one lights it, the other throws sparks across it. Both sit
          outside the space the rings are given. */}
      {SONG.chords.map((part) => (
        <Wash
          key={part.id}
          song={SONG}
          part={part}
          elapsed={elapsed}
          focus={focus}
        />
      ))}

      {SONG.flurries.map((part) => (
        <Scatter
          key={part.id}
          song={SONG}
          part={part}
          elapsed={elapsed}
          focus={focus}
        />
      ))}

      {/* The static is laid over the page's black rather than under it, since
          there is nothing under it, so everything that is read rather than
          watched is lifted clear of it. */}
      {/* One line, always, whatever it has to say. The drawing takes the height
          this leaves it, so a header that wraps to a second line moves the rings
          down the page and, on a short screen, shrinks them — which is what
          soloing used to do on a phone. */}
      <header className="relative z-10 flex h-5 w-full items-baseline justify-between gap-6">
        {/* The title gives up its place to the part on a narrow screen, where
            there is only room for two of these three things. It is the least
            useful of them: the page is called this at the top of the browser
            too. */}
        <h1
          className={`font-mono text-sm uppercase tracking-[0.3em] text-neutral-300 ${
            soloed ? "hidden sm:block" : ""
          }`}
        >
          snkrwavs
        </h1>

        {/* What you are hearing, when it is not everything. */}
        {soloed && (
          <p className="min-w-0 truncate font-mono text-sm uppercase tracking-[0.3em] text-white">
            {NAMES.get(soloed)}
            <span className="hidden text-neutral-500 sm:inline"> on its own</span>
          </p>
        )}

        <Readout song={SONG} elapsed={elapsed} />
      </header>

      {/* The rings turn around the parts that have pitch; the parts that do
          not beat in the middle of them. This takes whatever height the
          header and the controls leave it, and the drawing squares itself off
          inside that, so listing another part costs the rings a little room
          rather than pushing the page off the screen. */}
      {/* Nothing here scrolls out of the way of a finger: inside the drawing a
          drag is a ring being turned, and the page has to let go of it to be. */}
      <div
        ref={stage}
        className="relative z-10 flex min-h-0 w-full flex-1 touch-none items-center justify-center"
      >
        {SONG.loops.map((loop) => (
          <LoopRing
            key={loop.id}
            song={SONG}
            loop={loop}
            elapsed={elapsed}
            focus={focus}
            warmth={warmth}
          />
        ))}

        {SONG.pads.map((pad) => (
          <PadRing
            key={pad.id}
            song={SONG}
            pad={pad}
            elapsed={elapsed}
            focus={focus}
            warmth={warmth}
          />
        ))}

        {SONG.pulses.map((pulse) => (
          <Thump
            key={pulse.id}
            song={SONG}
            pulse={pulse}
            elapsed={elapsed}
            focus={focus}
          />
        ))}
      </div>

      <footer className="relative z-10 flex w-full flex-col items-center gap-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-300"
          >
            {running ? (
              <Pause className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" aria-hidden="true" />
            )}
            {running ? "Pause" : "Play"}
          </button>

          <button
            type="button"
            onClick={rewind}
            className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white transition-colors hover:border-white/60"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Restart
          </button>
        </div>

        <Scrubber
          song={SONG}
          elapsed={elapsed}
          duration={duration}
          seek={seek}
        />

        {/* What the piece is, and nothing about the parts: they are what the
            drawing is for, and every line written about them down here comes
            straight out of the height it gets to turn in. Once a part can be
            soloed by clicking its ring, whatever needs saying about it can be
            said where it is being pointed at. */}
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-neutral-500">
          {SONG.bpm} bpm &middot; {SONG.beatsPerBar}/4 &middot; {SONG.bars} bars
          &middot; {clock(songSeconds(SONG))} &middot; fades from bar{" "}
          {SONG.fadeOutFrom}
        </p>
      </footer>
    </main>
  );
}
