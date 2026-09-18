// One note on the staff.
export type Note = {
  // Where it starts, in beats from the downbeat of the loop.
  at: number;
  // How long it sounds, in beats.
  length: number;
  // Its place on the staff, counted in diatonic steps: 0 is the bottom line, 1
  // the space above it, 4 the middle line, 8 the top line. Below 0 and above 8
  // the note sits off the staff and gets ledger lines.
  step: number;
  // The pitch as written. Nothing drawn depends on it, but it is what the
  // stems will be matched against.
  pitch?: string;
};

const LETTER_STEPS: Record<string, number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
};

// The bottom line of a treble staff is E4, so pitches are counted in diatonic
// steps from there. A flat or a sharp changes what a note sounds like, not
// where it sits, so the accidental is read and then ignored.
const BOTTOM_LINE = LETTER_STEPS.E + 4 * 7;

export const staffStep = (pitch: string) => {
  const match = /^([A-G])([b#]?)(-?\d+)$/.exec(pitch);
  if (!match) throw new Error(`Unreadable pitch: ${pitch}`);
  const [, letter, , octave] = match;
  return LETTER_STEPS[letter] + Number(octave) * 7 - BOTTOM_LINE;
};

// A loop in the piece. Everything the visualisation draws is derived from
// these numbers, so a stem that runs at a different length only needs its own
// bar count here.
export type Loop = {
  id: string;
  label: string;
  // How many bars it takes to come back around: one turn of its ring.
  bars: number;
  // The song bars it comes in on and drops out on, counted from one. It plays
  // from `from` up to but not including `to`, so an eight-bar loop running
  // from 5 to 45 is heard five times.
  from: number;
  to: number;
  notes: Note[];
};

// A part with no pitch in it: a thump that lands on the same beats of every
// bar it plays. There is nothing for it to turn, so it is drawn as a pulse in
// the middle of the rings rather than as a ring of its own.
export type Pulse = {
  id: string;
  label: string;
  // Where it lands inside a bar, in beats from the downbeat.
  hits: number[];
  // The song bars it plays through, each one from its bar up to but not
  // including the next. A part can drop out and come back.
  spans: { from: number; to: number }[];
  // Bars it takes to come up to full strength when it first arrives.
  fadeIn: number;
};

// The piece the loops are heard in. The clock belongs to the song rather than
// to any one loop, which is what lets loops of different lengths turn at their
// own rate against the same bar count.
export type Song = {
  bpm: number;
  beatsPerBar: number;
  // How long it is, counting from bar one. It comes back around a bar later.
  bars: number;
  loops: Loop[];
  pulses: Pulse[];
};

export const beatSeconds = (song: Song) => 60 / song.bpm;

export const songBeats = (song: Song) => song.bars * song.beatsPerBar;

export const songSeconds = (song: Song) => beatSeconds(song) * songBeats(song);

// Where the song is at a moment on the transport clock, in beats from its
// first downbeat. Everything else on screen is read off this one number.
export const songAt = (song: Song, elapsed: number) => {
  const seconds = songSeconds(song);
  const position = elapsed % seconds;

  return ((position < 0 ? position + seconds : position) / seconds) * songBeats(song);
};

// A position counted the way a musician would say it, from one.
export const barBeat = (song: Song, beats: number) => {
  const whole = Math.floor(beats);

  return {
    bar: Math.floor(whole / song.beatsPerBar) + 1,
    beat: (whole % song.beatsPerBar) + 1,
    // How far into the current beat we are, for anything that should move
    // continuously rather than step.
    fraction: beats - whole,
  };
};

export const loopBeats = (song: Song, loop: Loop) => loop.bars * song.beatsPerBar;

// How long one full turn of a loop's ring takes.
export const loopSeconds = (song: Song, loop: Loop) =>
  beatSeconds(song) * loopBeats(song, loop);

const entrance = (song: Song, loop: Loop) => (loop.from - 1) * song.beatsPerBar;
const exit = (song: Song, loop: Loop) => (loop.to - 1) * song.beatsPerBar;

// Where a loop is in its own turn, as a fraction: 0 is its downbeat at the
// playhead, 1 is a turn later. Null before it comes in and after it drops out,
// when there is nothing of it to draw.
export const loopPhase = (song: Song, loop: Loop, beats: number) => {
  if (beats < entrance(song, loop) || beats >= exit(song, loop)) return null;

  return ((beats - entrance(song, loop)) / loopBeats(song, loop)) % 1;
};

// A loop pops into existence on the bar it comes in on and pops out on the bar
// it leaves, with only enough of a ramp either side to keep the edges from
// tearing. It arrives, rather than fading up.
const POP = 0.12; // beats

export const loopPresence = (song: Song, loop: Loop, beats: number) => {
  if (beats < entrance(song, loop) || beats >= exit(song, loop)) return 0;

  return Math.min(
    1,
    (beats - entrance(song, loop)) / POP,
    (exit(song, loop) - beats) / POP,
  );
};

// How long a thump takes to fall away to nothing, in beats. Longer than the
// tighter gaps in a pattern like the kick's, so the paired hits run into each
// other and only the wider gaps go fully dark. A hit landing on one still
// falling just starts it over.
const THUMP_FALL = 0.9;

// Whether a pulse is playing at all, and how far up its fade it has come.
const pulseStrength = (song: Song, pulse: Pulse, beats: number) => {
  const playing = pulse.spans.some(
    (span) =>
      beats >= (span.from - 1) * song.beatsPerBar &&
      beats < (span.to - 1) * song.beatsPerBar,
  );
  if (!playing) return 0;

  const arrival = (pulse.spans[0].from - 1) * song.beatsPerBar;
  const fade = pulse.fadeIn * song.beatsPerBar;

  return fade > 0 ? Math.min(1, (beats - arrival) / fade) : 1;
};

// How long ago the last thump landed, in beats, wrapping back into the bar
// before when the bar has only just turned over.
const sinceHit = (song: Song, pulse: Pulse, beats: number) => {
  const inBar = ((beats % song.beatsPerBar) + song.beatsPerBar) % song.beatsPerBar;

  return pulse.hits.reduce((closest, hit) => {
    const gap = inBar - hit;

    return Math.min(closest, gap >= 0 ? gap : gap + song.beatsPerBar);
  }, Infinity);
};

// How hard the pulse is ringing: struck at one, gone by the time the next one
// lands, and nothing at all outside the bars it plays.
export const pulseAt = (song: Song, pulse: Pulse, beats: number) => {
  const strength = pulseStrength(song, pulse, beats);
  if (strength <= 0) return 0;

  const since = sinceHit(song, pulse, beats);
  if (since >= THUMP_FALL) return 0;

  // Squared, so it drops away and then tapers into the dark rather than
  // sliding down at an even rate.
  const left = 1 - since / THUMP_FALL;

  return strength * left * left;
};

// The riff, sixteenths the whole way through. Each bar is an eight-note figure
// played twice, which is where the sixteen notes a bar come from. The octaves
// are the ones the figures imply, since every one of them climbs.
const FIGURE_A = ["Bb3", "D4", "Eb4", "F4", "G4", "Ab4", "Bb4", "C5"];
const FIGURE_B = ["Ab3", "D4", "Eb4", "F4", "G4", "Ab4", "Bb4", "Eb5"];
const FIGURE_C = ["Ab3", "D4", "Eb4", "F4", "G4", "Ab4", "Bb4", "F5"];
const FIGURE_D = ["G3", "Bb3", "D4", "F4", "G4", "Bb4", "Eb5", "F5"];

const FIGURES = [
  FIGURE_A,
  FIGURE_A,
  FIGURE_B,
  FIGURE_C,
  FIGURE_A,
  FIGURE_A,
  FIGURE_B,
  FIGURE_D,
];

const SIXTEENTH = 0.25; // of a beat

// How long each of those notes is actually held, in beats, read off the
// harpsichord performance. The figures are struck as sixteenths but played
// legato: the four notes at the bottom of a run ring on for a beat and a half
// while the run climbs over them, and the four at the top are clipped short.
// Two rows a bar, one for each pass of the figure.
const HOLD = [
  // bar 1
  1.55, 1.74, 1.49, 1.32, 0.27, 0.33, 0.23, 0.39,
  1.56, 1.74, 1.51, 1.34, 0.28, 0.29, 0.21, 0.55,
  // bar 2
  1.63, 1.69, 1.46, 1.28, 0.28, 0.32, 0.26, 0.51,
  1.35, 1.26, 1.07, 0.82, 0.31, 0.33, 0.24, 0.27,
  // bar 3
  1.72, 1.63, 1.44, 1.24, 0.23, 0.28, 0.21, 1.36,
  1.67, 1.63, 1.43, 1.22, 0.28, 0.30, 0.23, 1.42,
  // bar 4
  1.78, 1.66, 1.42, 1.25, 0.32, 0.33, 0.16, 1.32,
  1.49, 1.47, 1.25, 1.07, 0.31, 0.29, 0.24, 0.92,
  // bar 5
  1.68, 1.66, 1.53, 1.31, 0.29, 0.26, 0.23, 0.41,
  1.42, 1.56, 1.45, 1.24, 0.26, 0.28, 0.27, 0.36,
  // bar 6
  1.56, 1.67, 1.46, 1.26, 0.26, 0.30, 0.25, 0.45,
  1.35, 1.31, 1.08, 0.84, 0.27, 0.32, 0.29, 0.29,
  // bar 7
  1.74, 1.00, 0.75, 0.58, 0.28, 0.32, 0.26, 0.98,
  1.19, 0.93, 0.63, 0.54, 0.28, 0.27, 0.28, 0.52,
  // bar 8
  1.55, 1.48, 1.00, 0.50, 0.25, 0.27, 0.31, 0.25,
  1.23, 1.03, 0.82, 0.57, 0.26, 0.28, 0.31, 0.25,
];

const RIFF: Note[] = FIGURES.flatMap((figure, bar) =>
  [...figure, ...figure].map((pitch, index) => {
    const sixteenth = bar * 16 + index;

    return {
      at: sixteenth * SIXTEENTH,
      length: HOLD[sixteenth],
      step: staffStep(pitch),
      pitch,
    };
  }),
);

if (HOLD.length !== RIFF.length) {
  throw new Error(`${RIFF.length} notes but ${HOLD.length} lengths`);
}

// The first loop, and the one the rest of the stems will be measured against.
// Four bars of the song go by before the harpsichord comes in, and it then
// runs to the end: forty bars, which is five passes of the eight.
const HARPSICHORD: Loop = {
  id: "harpsichord",
  label: "Harpsichord",
  bars: 8,
  from: 5,
  to: 45,
  notes: RIFF,
};

// The low kick: a boom-bap thump on the one, the two-and, the three and the
// four-and of every bar. It holds the floor from the top of the song, drops
// out for the twenty-one bars from 60, and comes back at 81 to see it out.
const LOW_KICK: Pulse = {
  id: "low-kick",
  label: "Low kick",
  hits: [0, 1.5, 2, 3.5],
  spans: [
    { from: 1, to: 60 },
    { from: 81, to: 116 },
  ],
  fadeIn: 4,
};

export const SNKRWAVS_SONG: Song = {
  bpm: 94,
  beatsPerBar: 4,
  // The piece ends on bar 115, so it comes back around on 116.
  bars: 115,
  loops: [HARPSICHORD],
  pulses: [LOW_KICK],
};

for (const loop of SNKRWAVS_SONG.loops) {
  const played = loop.to - loop.from;

  if (played % loop.bars !== 0) {
    throw new Error(
      `${loop.id} runs ${played} bars, which is not a whole number of its ${loop.bars}-bar turn`,
    );
  }
}
