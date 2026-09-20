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
import { SNKRWAVS_SONG as SONG, songAt, songSeconds } from "./loop";
import { ringAt } from "./rings";
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
  const { running, elapsed, toggle, rewind, seek, solo, duration } =
    useTransport(player, stem);

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

  // A click on a ring plays that part alone. A second click on the same ring, or
  // a click anywhere that is not a ring, hands it back to the mix. There is no
  // third state and no combining: two parts at once is a mix, and mixing is a
  // job for the desk this came off, not for a page.
  const onClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      // The controls are not the drawing. Reaching for play or the scrubber
      // should not throw away the part you set up to listen to.
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, [role='slider']")) return;

      const hit = ringUnder(event.clientX, event.clientY);
      const next = hit && hit.id !== chosen.current ? hit : null;

      if (next === null && chosen.current === null) return;

      choose(
        next?.id ?? null,
        next?.stem
          ? { src: next.stem, offset: next.stemOffset ?? 0 }
          : null,
      );
    },
    [choose, ringUnder],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      // Out of a solo, for anyone who would rather not have to find a piece of
      // empty page to click on.
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
      toggle();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose, toggle]);

  return (
    <main
      onClick={onClick}
      onMouseMove={(event) => {
        const over = ringUnder(event.clientX, event.clientY) !== null;
        if (over !== pointing) setPointing(over);
      }}
      className={`flex min-h-screen flex-col items-center justify-between gap-8 bg-black px-6 py-6 text-white ${
        pointing ? "cursor-pointer" : ""
      }`}
    >
      {/* The mix, and the one part playing on its own. One of the two plays at a
          time and the other waits in the same place, stopped: soloing hands the
          sound from one to the other once the one coming in is in step. */}
      <audio ref={player} src={SONG.audio} preload="auto" className="hidden" />
      {/* The first stem is already sitting in this element so the first click
          does not have to wait on a fetch. Later stems swap the file; this one
          is just the one that is ready. */}
      <audio
        ref={stem}
        src={SONG.loops.find((part) => part.stem)?.stem}
        preload="auto"
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
      <div
        ref={stage}
        className="relative z-10 flex min-h-0 w-full flex-1 items-center justify-center"
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
            onClick={toggle}
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
