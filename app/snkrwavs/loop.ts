import { BASS_NOTES } from "./bass";
import { DROP_HITS } from "./dropBeat";
import { END_SOLO_NOTES } from "./endSolo";

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

// What a part needs to be heard on its own. Not every part that can be heard
// alone turns on a ring, so this is kept apart from the timing.
export type Sounded = {
  // The part on its own, if there is a recording of it: clicking its drawing
  // plays this instead of the mix. The stems are exports of the same session, so
  // they run the length of the whole piece and line up with the master sample
  // for sample — which is what lets the drawing carry on turning untouched while
  // what you hear changes underneath it. Every one is encoded to the same 12,538
  // AAC packets the master is, so a browser's idea of where it is in a stem is
  // its idea of where it is in the mix, and none of them needs an offset.
  stem?: string;
  // Seconds to add to the master's clock when seeking this stem, for a stem that
  // is not the same kind of file as the mix: a browser counts a file's encoder
  // priming in the time it reports, and two encodings prime by different
  // amounts. Encode the stems as AAC, as the master is, and this is nothing —
  // which is the better answer, since the right number for an MP3 turns out to
  // depend on the browser.
  stemOffset?: number;
};

// What every part that turns has in common, whatever is drawn on its ring.
// The timing is all worked out from these four numbers, so anything that can
// answer them can be placed in the piece and turned by the same clock.
export type Part = Sounded & {
  // How many bars it takes to come back around: one turn of its ring.
  bars: number;
  // The song bars it comes in on and drops out on, counted from one. It plays
  // from `from` up to but not including `to`, so an eight-bar loop running
  // from 5 to 45 is heard five times.
  from: number;
  to: number;
  // Beats of pickup: a part that leans over the bar line is already sounding
  // before the downbeat it leads into, so its ring has to be there that much
  // early, turning through the tail of a turn before bar one reaches the
  // playhead. The notes themselves are written at the end of the turn, which
  // on a ring is the same place as before the start of it.
  lead?: number;
  // Stretches the part is written through but not heard in. A MIDI file knows
  // what was programmed and nothing about what the mix does with it, so these
  // are read off the master itself: where a part is muted, its ring goes, and
  // comes back when the part does. Bars, and they can run to a fraction of
  // one, since a mute that ends on a pickup ends between bar lines.
  gaps?: { from: number; to: number }[];
};

// A loop in the piece. Everything the visualisation draws is derived from
// these numbers, so a stem that runs at a different length only needs its own
// bar count here.
export type Loop = Part & {
  id: string;
  label: string;
  // Where its staff sits, as a fraction of the shorter side of the canvas.
  // Loops nest, and every staff is drawn the same size, so the room between
  // one radius and the next is what keeps them from running into each other.
  radius: number;
  // A part that never repeats is drawn as a window on the song instead of as
  // a loop: the ring carries `bars` of music at a time and what is on it is
  // always the playing itself, flowing past rather than coming round. The
  // notes are still written from the part's own downbeat; they just carry on
  // past the end of a turn instead of starting again.
  rolls?: boolean;
  // Whether its bars are numbered outside the staff. They are worth the room
  // they take on a loop, where the same numbers come round every pass and are
  // how you read where in the loop you are. On a part that passes once they
  // are just a count, and the band they reserve is better spent on a part
  // that has nowhere else to go.
  numbers?: boolean;
  // How much to multiply the swell a note takes as it is struck. One for a
  // ring whose notes are drawn at a readable length; more for one where they
  // are not. A turn is a turn however much music is on it, so a part carrying
  // thirty-odd bars in a single pass draws each note into a fraction of the
  // arc the same note gets on an eight-bar loop, and at that size the only
  // thing left to see it by is how far it jumps.
  swell?: number;
  notes: Note[];
};

// One strike on a drum machine.
export type Hit = {
  // Where it lands, in beats from the downbeat of the pattern.
  at: number;
  // Which voice struck it, counted outward from the innermost lane.
  lane: number;
  // How hard, from nothing to full. A programmed part is even in a way a
  // played one never is, and this is the one thing in it that still moves.
  force: number;
};

// A percussion part, and the reason it is not a Loop: there is no pitch in it
// to put on a staff. What it has instead is a handful of voices and a grid of
// steps, so it is drawn the way it was written, as a machine's pattern: lanes
// running round the ring, a cell for every step, and the cells that sound
// filled in.
export type Pad = Part & {
  id: string;
  label: string;
  radius: number;
  // Cells to the bar. Sixteen is a sixteenth each, which is the grid these
  // boxes have had since they were boxes.
  steps: number;
  // The voices, innermost first, named for the caption and the screen reader.
  voices: string[];
  hits: Hit[];
};

// One chord, struck and left alone.
export type Chord = {
  // Where it is struck, in beats from the downbeat of the cycle.
  at: number;
  // How long it has before the next one takes over, in beats. A string is
  // still sounding when that happens; this is how long it has the room.
  length: number;
  // The root, which is all the drawing asks of it: the chord is lit in the
  // colour that root would be given on a staff.
  root: string;
};

// A part played into a microphone rather than programmed, and the first here
// with nothing worth notating: three chords struck and left to ring, under a
// tremolo chopping them at a fixed rate. Drawing that as notes would be three
// dashes an age long and a ring that barely moves, which is not what it
// sounds like at all. What it sounds like is the room changing colour, so
// that is what it is given: no ring, just the colour of whatever chord is
// sounding, breathing at the rate the tremolo opens and closes it.
export type Chords = Part & {
  id: string;
  label: string;
  // Pulses to the bar. A tremolo is a volume being opened and closed over and
  // over, and this is how often.
  tremolo: number;
  chords: Chord[];
};

// A part with no events in it at all: no notes, no strikes, nothing to be on
// time for. It is noise with a hand on the fader, so the only thing there is to
// write down is where the fader was. Levels at bars, straight lines between
// them, and nothing outside the bars given.
export type Noise = {
  id: string;
  label: string;
  envelope: { bar: number; level: number }[];
};

// A part that is neither a phrase nor a pattern: a wood block struck fast, a
// run at a time, at a handful of moments in the piece. There is nothing here
// to put on a staff and nothing to put in a box either, since it plays on
// eleven bars out of a hundred and fourteen and a ring of it would be empty
// almost all the way round. What it is, is a flourish, so it is drawn as one:
// sparks thrown across the page, one for each strike.
export type Flurry = {
  id: string;
  label: string;
  // Strikes to the beat.
  rate: number;
  // Where a run sits against the bar line it lands on, in beats. Half a step,
  // every time: the block plays off the beat rather than with it.
  offset: number;
  // How many strikes in a run. They fall away evenly from the first to
  // nothing at the last, which is what the run sounds like and what makes it
  // read as one gesture rather than a stretch of timekeeping.
  strikes: number;
  // The bars the runs land on.
  bars: number[];
};

// A part with no pitch in it: a thump that lands on the same beats of every
// bar it plays. There is nothing for it to turn, so it is drawn as a pulse in
// the middle of the rings rather than as a ring of its own.
export type Pulse = Sounded & {
  id: string;
  label: string;
  // Where it lands inside a bar, in beats from the downbeat.
  hits: number[];
  // The song bars it plays through, each one from its bar up to but not
  // including the next. A part can drop out and come back, and each entrance
  // can be eased in over its own number of bars.
  spans: { from: number; to: number; fadeIn?: number }[];
};

// The piece the loops are heard in. The clock belongs to the song rather than
// to any one loop, which is what lets loops of different lengths turn at their
// own rate against the same bar count.
export type Song = {
  title: string;
  // The mix the clock is taken from. Everything on screen is turned by where
  // this recording is up to, so the drawing cannot drift away from the music.
  audio: string;
  // Seconds between the start of the file and the first downbeat, which is
  // not always nothing: an AAC file opens with priming samples that not every
  // browser throws away. If the drawing ever reads a touch ahead of or behind
  // what is heard, this is the one number to move.
  audioOffset: number;
  bpm: number;
  beatsPerBar: number;
  // How many complete bars it runs for, counting from bar one: a song of 114
  // bars ends on the line at the top of bar 115.
  bars: number;
  // The bar the whole mix starts fading out on, on its way to nothing at the
  // end. Nothing in the parts themselves says this: it is a hand on a fader.
  fadeOutFrom: number;
  loops: Loop[];
  pads: Pad[];
  pulses: Pulse[];
  chords: Chords[];
  flurries: Flurry[];
  noises: Noise[];
};

export const beatSeconds = (song: Song) => 60 / song.bpm;

export const songBeats = (song: Song) => song.bars * song.beatsPerBar;

export const songSeconds = (song: Song) => beatSeconds(song) * songBeats(song);

// Where the song is at a moment on the transport clock, in beats from its
// first downbeat. Everything else on screen is read off this one number.
export const songAt = (song: Song, elapsed: number) => {
  const seconds = songSeconds(song);
  const played = elapsed - song.audioOffset;

  // Anything before the first downbeat is held at it, rather than wrapped
  // round to the end of a piece that has not started yet.
  if (played <= 0) return 0;

  return ((played % seconds) / seconds) * songBeats(song);
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

// How much of the piece is left at a moment, as a fraction: all of it until
// the fade begins, then easing away to nothing at the last bar. Everything on
// screen is scaled by this, the way the fader takes down the whole mix and
// not one part of it.
export const songFade = (song: Song, beats: number) => {
  const start = (song.fadeOutFrom - 1) * song.beatsPerBar;
  const end = songBeats(song);
  if (beats <= start || end <= start) return 1;

  return Math.max(0, 1 - (beats - start) / (end - start));
};

// How many beats one turn of a part's ring takes.
export const turnBeats = (song: Song, part: Part) =>
  part.bars * song.beatsPerBar;

// And how long that is in seconds.
export const turnSeconds = (song: Song, part: Part) =>
  beatSeconds(song) * turnBeats(song, part);

// Bar one of the part, which is what its turn is counted from, and the moment
// it appears, which is a pickup earlier if it has one.
const downbeat = (song: Song, part: Part) => (part.from - 1) * song.beatsPerBar;
const entrance = (song: Song, part: Part) =>
  downbeat(song, part) - (part.lead ?? 0);
const exit = (song: Song, part: Part) => (part.to - 1) * song.beatsPerBar;

// How far a part has run, in beats from its own downbeat, counted straight
// rather than wrapped at the turn. A loop has no use for this, since one pass
// of it is the same as the next; a part that rolls needs it to know which of
// its notes the ring is carrying.
export const partCursor = (song: Song, part: Part, beats: number) =>
  beats - downbeat(song, part);

// Where a part is in its own turn, as a fraction: 0 is its downbeat at the
// playhead, 1 is a turn later. Null before it comes in and after it drops out,
// when there is nothing of it to draw.
export const partPhase = (song: Song, part: Part, beats: number) => {
  if (beats < entrance(song, part) || beats >= exit(song, part)) return null;

  // A part that comes in on its pickup starts out before its own downbeat,
  // which is the far end of the turn rather than a negative part of one.
  const through = (beats - downbeat(song, part)) / turnBeats(song, part);

  return ((through % 1) + 1) % 1;
};

// A part pops into existence on the bar it comes in on and pops out on the bar
// it leaves, with only enough of a ramp either side to keep the edges from
// tearing. It arrives, rather than fading up.
const POP = 0.12; // beats

export const partPresence = (song: Song, part: Part, beats: number) => {
  if (beats < entrance(song, part) || beats >= exit(song, part)) return 0;

  let presence = Math.min(
    1,
    (beats - entrance(song, part)) / POP,
    (exit(song, part) - beats) / POP,
  );

  // A mute is the same arrival and departure in miniature: the ring is gone
  // for as long as the part is, and the edges get the same short ramp so they
  // do not tear.
  for (const gap of part.gaps ?? []) {
    const from = (gap.from - 1) * song.beatsPerBar;
    const to = (gap.to - 1) * song.beatsPerBar;

    if (beats >= from && beats < to) return 0;

    presence = Math.min(presence, beats < from ? (from - beats) / POP : (beats - to) / POP);
  }

  return Math.max(0, presence);
};

// How long a thump takes to fall away to nothing, in beats. Longer than the
// tighter gaps in a pattern like the kick's, so the paired hits run into each
// other and only the wider gaps go fully dark. A hit landing on one still
// falling just starts it over.
const THUMP_FALL = 0.9;

// Whether a pulse is playing at all, and how far up the fade of the entrance
// it is on it has come. Each entrance eases in on its own terms: the kick
// arrives over four bars at the top of the song and over five when it returns.
export const pulseStrength = (song: Song, pulse: Pulse, beats: number) => {
  const span = pulse.spans.find(
    (candidate) =>
      beats >= (candidate.from - 1) * song.beatsPerBar &&
      beats < (candidate.to - 1) * song.beatsPerBar,
  );
  if (!span) return 0;

  const arrival = (span.from - 1) * song.beatsPerBar;
  const fade = (span.fadeIn ?? 0) * song.beatsPerBar;

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

// Where the fader is on a part that is only a fader, read straight off the
// bars it was written at. Nothing before the first of them and nothing after
// the last, which for a part that fades up out of silence and back down into
// the mix is the same as saying it is not playing.
export const noiseAt = (song: Song, part: Noise, beats: number) => {
  const bar = beats / song.beatsPerBar + 1;
  const points = part.envelope;
  if (bar <= points[0].bar) return points[0].level;

  for (let i = 1; i < points.length; i++) {
    const last = points[i - 1];
    const next = points[i];
    if (bar >= next.bar) continue;

    const through = (bar - last.bar) / (next.bar - last.bar);

    return last.level + (next.level - last.level) * through;
  }

  return points[points.length - 1].level;
};

// Which strike of which run is sounding, and how much of the run is left in
// it. The count runs straight through the piece rather than starting again
// each run, so a drawing can tell a new strike from the one before it by the
// number alone, without knowing anything about where the runs are. Null
// whenever the block is not playing, which is nearly always.
export const flurryAt = (song: Song, part: Flurry, beats: number) => {
  const step = 1 / part.rate;

  for (let run = 0; run < part.bars.length; run++) {
    const start = (part.bars[run] - 1) * song.beatsPerBar + part.offset;
    const into = beats - start;
    if (into < 0 || into >= part.strikes * step) continue;

    const strike = Math.floor(into / step);

    return {
      index: run * part.strikes + strike,
      // Evenly down the run: the first strike has all of it, the last has a
      // strike's worth of nothing.
      level: 1 - strike / part.strikes,
    };
  }

  return null;
};

// How steeply a struck chord gives up its light. This is a curve, not a
// recording: full brightness exactly on the downbeat it is struck on, nothing
// at all by the moment the next one is struck, and steeper at the front than a
// straight line would be, since that is where a struck string loses most of
// what it has. The tremolo steps it down in between, so what you see is a run
// of pulses each dimmer than the last.
const FALL = 3;

const fade = (through: number) =>
  (Math.exp(-FALL * through) - Math.exp(-FALL)) / (1 - Math.exp(-FALL));

// Which chord is sounding and how much of it is left: the colour the screen
// takes, and how far it has fallen since it was struck. Null when the part is
// not playing, which is the same thing as the screen being black again.
export const chordAt = (song: Song, part: Chords, beats: number) => {
  const presence = partPresence(song, part, beats);
  const phase = partPhase(song, part, beats);
  if (phase === null || presence <= 0) return null;

  const turn = turnBeats(song, part);
  const into = phase * turn;

  // The last one struck, which before the first strike of a turn is the one
  // still ringing from the end of the turn before. The beat count arrives by
  // way of a division, so a strike can be read as a hair short of its own
  // downbeat: near enough is struck, or the chord before it would flash back
  // for a frame on every change.
  const struck =
    [...part.chords].reverse().find((chord) => into >= chord.at - 1e-6) ??
    part.chords[part.chords.length - 1];

  const since = into >= struck.at ? into - struck.at : into + turn - struck.at;

  return {
    chord: struck,
    strength: presence * fade(Math.min(1, since / struck.length)),
  };
};

// Where the tremolo is in its own cycle, from open to shut and back. It is
// counted off the song rather than off the part so that it stays with the
// beat however long the chord it is chopping has been ringing, and it is
// counted from open so that a chord is struck at its brightest: the pulse
// that matters most is the one landing with the strike.
export const tremoloAt = (song: Song, part: Chords, beats: number) => {
  const pulses = (beats * part.tremolo) / song.beatsPerBar;

  return 0.5 + 0.5 * Math.cos(pulses * Math.PI * 2);
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
  radius: 0.389,
  from: 5,
  to: 45,
  stem: "/ASharpKnife_harp_stem.m4a",
  notes: RIFF,
};

// The steel drum melody: a two-bar phrase, four times over, each led into by
// three pickup notes on the last three sixteenths of the bar before. Those
// pickups are written at the end of the turn rather than before its downbeat,
// since on a ring the bar before the one is the same place as the last bar.
// Read as beats from the downbeat, the pitch, and how long it is held.
const CALL: [number, string, number][] = [
  [0, "D5", 0.53],
  [0.5, "C5", 0.23],
  [0.75, "Bb4", 0.3],
  [1, "C5", 0.47],
  [1.5, "D5", 2.45], // the phrase lands and holds
  [7.25, "F4", 0.2], // pickup into bar 3
  [7.5, "Bb4", 0.26],
  [7.75, "C5", 0.27],
  [8, "D5", 0.53],
  [8.5, "C5", 0.25],
  [8.75, "Bb4", 0.3],
  [9, "C5", 0.46],
  [9.5, "G4", 2.79], // lands lower this time, and holds longer
  [15.25, "F4", 0.24], // pickup into bar 5
  [15.5, "Bb4", 0.26],
  [15.75, "C5", 0.25],
  [16, "D5", 0.44],
  [16.5, "C5", 0.27],
  [16.75, "Bb4", 0.28],
  [17, "C5", 0.48],
  [17.5, "D5", 1.45], // the same landing, let go sooner
  [23.25, "F4", 0.2], // pickup into bar 7
  [23.5, "Bb4", 0.25],
  [23.75, "C5", 0.28],
  [24, "D5", 0.55],
  [24.5, "C5", 0.24],
  [24.75, "Bb4", 0.3],
  [25, "C5", 0.48],
  [25.5, "G4", 0.98], // shortest of the four, leaving room to come around
  [31.25, "F4", 0.22], // pickup into the top of the next turn
  [31.5, "Bb4", 0.24],
  [31.75, "C5", 0.27],
];

// It comes in at bar 21 and plays to the end. Twelve turns take it to bar 117,
// past where the song comes back around, which is how it runs out the last
// bar rather than stopping short of it.
const LEAD_MELODY: Loop = {
  id: "lead-melody-one",
  label: "Lead melody one",
  bars: 8,
  radius: 0.277,
  from: 21,
  to: 117,
  stem: "/ASharpKnife_melody_stem.m4a",
  // It arrives the same way, on the last three sixteenths of bar 20.
  lead: 0.75,
  notes: CALL.map(([at, pitch, length]) => ({
    at,
    length,
    step: staffStep(pitch),
    pitch,
  })),
};

// The low kick: a boom-bap thump on the one, the two-and, the three and the
// four-and of every bar. It holds the floor from the top of the song, drops
// out for the twenty-one bars from 60, and comes back at 81 to see it out.
const LOW_KICK: Pulse = {
  id: "low-kick",
  label: "Low kick",
  hits: [0, 1.5, 2, 3.5],
  spans: [
    { from: 1, to: 60, fadeIn: 4 },
    { from: 81, to: 116, fadeIn: 5 },
  ],
  stem: "/ASharpKnife_boombap_stem.m4a",
};

// Soft keys under the melody, four bars that hold a low note on each downbeat
// and then fall through a run of sixteenths into the next one. Written as
// beats from the downbeat, the pitch, and how long it is held. The run in the
// last bar is the one that leads back into the top of the turn.
const COUNTERPOINT: [number, string, number][] = [
  [0, "D4", 2.25],
  [2.25, "G4", 0.28],
  [2.5, "F4", 0.33],
  [2.75, "Eb4", 0.29],
  [3, "D4", 0.47],
  [3.5, "Bb3", 0.54],
  [4, "D4", 2.29],
  [6.25, "G4", 0.27],
  [6.5, "F4", 0.35],
  [6.75, "Eb4", 0.25],
  [7, "D4", 0.45],
  [7.5, "Bb3", 0.31],
  [8, "C4", 2.35], // the held note drops a step for the second half
  [10.25, "G4", 0.26],
  [10.5, "F4", 0.29],
  [10.75, "Eb4", 0.23],
  [11, "D4", 0.46],
  [11.5, "Bb3", 0.38],
  [12, "C4", 2],
  [14.25, "G4", 0.27],
  [14.5, "F4", 0.29],
  [14.75, "Eb4", 0.24],
  [15, "D4", 0.5],
  [15.5, "Bb3", 0.6],
];

// It takes over the bar the harpsichord leaves off on and runs to the end,
// turning twice for every turn of the melody it sits inside.
const COUNTERPOINT_MELODY: Loop = {
  id: "counterpoint-melody",
  label: "Counterpoint melody",
  bars: 4,
  radius: 0.191,
  from: 45,
  to: 117,
  stem: "/ASharpKnife_CPmelody_stem.m4a",
  // The first thing heard of it is the run falling into bar 45, which starts
  // on the beat before last of bar 44.
  lead: 1.75,
  notes: COUNTERPOINT.map(([at, pitch, length]) => ({
    at,
    length,
    step: staffStep(pitch),
    pitch,
  })),
};

// The organ solo that ends the piece. It is not a loop: one long turn, coming
// in at bar 81 and playing to the last bar, which is slow enough that the ring
// barely seems to move. It takes the outermost ring of all, outside even the
// drop beat: it is the last part to arrive, so it is the last band out.
//
// Written an octave below where it sounds. The playing climbs to C7, and at
// pitch that would hang half the solo off the top of the staff on ledger
// lines; an octave down it sits across the staff the way the other parts do.
// The colours are unchanged by the move, since seven steps is an octave and
// the rainbow comes back around at the octave.
const END_SOLO: Loop = {
  id: "end-solo",
  label: "End solo",
  bars: 34,
  radius: 0.443,
  from: 81,
  to: 115,
  stem: "/ASharpKnife_endsolo_stem.m4a",
  // Its bar numbers are given up: they would sit outside the staff, which out
  // here is off the edge of the canvas. No loss — thirty-four numbers that
  // never come round again were the least useful thing on the page.
  numbers: false,
  // Thirty-four bars on one turn leaves each note a sliver of arc, so the
  // strike is given twice the swell it gets elsewhere. On this ring that is
  // most of what there is to see a note by.
  swell: 2,
  notes: END_SOLO_NOTES.map(([at, pitch, length]) => ({
    at,
    length,
    step: staffStep(pitch) - 7,
    pitch,
  })),
};

// The bass, and the first part here that is neither a loop nor a single turn.
// It plays for seventy bars and never repeats itself exactly: the figure is
// two bars long, but the fills move, so a ring coming round to the same notes
// would be showing a bass part nobody plays. Instead its ring carries two bars
// of the song at a time, the way a strip of tape passes a head, with what is
// coming up on the right and what has just gone on the left.
//
// It sits tight around the kick, which is the other thing keeping time down
// there, and it is written two octaves up: three notes at the bottom of an
// electric bass would otherwise be a stack of ledger lines. Up here they land
// across the middle of the staff, a step apart, which is what the part is.
const BASS: Loop = {
  id: "bass",
  label: "Bass",
  bars: 2,
  rolls: true,
  radius: 0.064,
  from: 29,
  to: 100,
  stem: "/ASharpKnife_bass_stem.m4a",
  // Enough to have the ring there before its first note reaches the far edge
  // of the window, since on a rolling ring a note is on screen for half a turn
  // before it is heard.
  lead: 4.5,
  notes: BASS_NOTES.map(([at, pitch, length]) => ({
    at,
    length,
    step: staffStep(pitch) + 14,
    pitch,
  })),
};

// The hats, and the first thing here that was programmed rather than played.
// Two bars, four voices, sixteen steps to the bar, and forty-three passes of
// it without a single one differing from another by so much as a velocity. It
// is drawn as what it is: a pattern in a box, not a phrase on a staff.
//
// Read as beats from the downbeat of bar 29, the lane counted outward from
// the innermost, and how hard the strike was.
const HATS: [number, number, number][] = [
  [0, 0, 0.85], // clap
  [0.25, 1, 0.83], // closed
  [0.5, 2, 0.91], // pedal
  [0.75, 3, 0.85], // open
  [1, 1, 0.87], // closed
  [1.25, 2, 0.75], // pedal
  [1.5, 3, 0.85], // open
  [1.75, 1, 0.91], // closed
  [2, 0, 0.73], // clap
  [2.25, 1, 0.83], // closed
  [2.5, 2, 0.91], // pedal
  [2.75, 3, 0.81], // open
  [3, 1, 0.91], // closed
  [3.25, 2, 0.85], // pedal
  [3.5, 3, 0.81], // open
  [3.75, 1, 0.95], // closed
  [4, 0, 0.81], // clap
  [4.25, 1, 0.79], // closed
  [4.5, 2, 0.91], // pedal
  [4.75, 3, 0.83], // open
  [5, 1, 0.87], // closed
  [5.25, 2, 0.79], // pedal
  [5.5, 3, 0.83], // open
  [5.75, 1, 0.87], // closed
  [6, 0, 0.79], // clap
  [6.25, 1, 0.75], // closed
  [6.375, 2, 0.85], // pedal
  [6.5, 3, 0.83], // open
  [6.75, 1, 0.91], // closed
  [7, 2, 0.91], // pedal
  [7.25, 3, 0.83], // open
  [7.5, 1, 0.91], // closed
  [7.75, 3, 0.85], // open
];

const HIGH_HATS: Pad = {
  id: "hats",
  label: "Hats",
  bars: 2,
  radius: 0.116,
  steps: 16,
  // Innermost out, in the order a drum machine lists them, which here is also
  // quietest body to most air.
  voices: ["Clap", "Closed hat", "Pedal hat", "Open hat"],
  from: 29,
  to: 115,
  stem: "/ASharpKnife_hat_stem.m4a",
  // Read off the master rather than the MIDI, which plays the pattern
  // straight through all eighty-six bars: the mix drops it for a bar, and
  // then for twenty-nine, where the harpsichord ends. What fills part of
  // that long silence is another pattern entirely, not this one coming back.
  // The short mute ends a sixteenth early, on the hit leading back in.
  gaps: [
    { from: 36, to: 36 + 15 / 16 },
    { from: 44, to: 73 },
  ],
  hits: HATS.map(([at, lane, force]) => ({ at, lane, force })),
};

// The drop beat: a whole kit on a four-bar turn, in at bar 61 and playing to
// the end. It takes the band the harpsichord left empty at bar 45, where from
// bar 61 to 80 it is the outermost thing turning. The solo arrives outside it
// at 81, which is the order the two of them arrive in.
//
// The two toms share a lane. They play four hits in the fill at the end of the
// turn, hi then low, and a lane each would have cost more room than the band
// has. The rest keep theirs: the pedal hat carries the eighths the pattern
// runs on, the crash marks the top of every turn, and the kick keeps a pattern
// of its own, nothing like the one the boom bap plays, which is how you can
// tell the two apart when both are going after bar 81.
const DROP_BEAT: Pad = {
  id: "drop-beat",
  label: "Drop beat",
  bars: 4,
  radius: 0.364,
  steps: 16,
  // Innermost out, body to air, the same order the hats are read in.
  voices: ["Kick", "Toms", "Snare", "Pedal hat", "Crash"],
  from: 61,
  to: 115,
  stem: "/ASharpKnife_dropbeat_stem.m4a",
  // Read off the master, which drops the kit for two bars where the MIDI keeps
  // playing it. It is out for 71 and 72 and back at the top of 73, where the
  // crash marks the turn.
  gaps: [{ from: 71, to: 73 }],
  hits: DROP_HITS.map(([at, lane, force]) => ({ at, lane, force })),
};

// The guitar, read off the master rather than out of a file, since it was
// played rather than programmed and there is no file of it. An eight-bar turn
// of five strikes on three chords, from bar 13 to the end of the piece: two
// bars, two bars, two bars, a bar, a bar, with the third strike the first chord
// again and the fourth the second.
//
// The roots were read from the harmony at each strike, averaged over the turns
// after bar 45 where the harpsichord has stopped and nothing else is sitting on
// top of the guitar's own octave. They come out as a descent — Bb, then Ab,
// then G at the turn — which the rainbow the staffs read pitch by happens to
// draw as a descent of its own, blue to green to yellow.
//
// Past bar 60 the tremolo stops showing up in that measurement, but it is
// playing: by then there is a whole kit and an organ over it, and what is left
// of a tremolo guitar underneath is not something a band of the spectrum will
// hand back. The part is drawn to the end because that is where it goes.
const GUITAR: Chords = {
  id: "guitar",
  label: "Guitar",
  bars: 8,
  from: 13,
  to: 115,
  tremolo: 16,
  chords: [
    { at: 0, length: 8, root: "Bb2" },
    { at: 8, length: 8, root: "Ab2" },
    { at: 16, length: 8, root: "Bb2" },
    { at: 24, length: 4, root: "Ab2" },
    { at: 28, length: 4, root: "G2" },
  ],
};

// The wood block, and the second part here with no file behind it: it was read
// off the master, the same way the guitar was. Sixteenth-note triplets, six
// strikes to the beat: the spacing measures 105 milliseconds where the grid
// wants 106.4, a percent fast, which over a whole run comes to a frame's worth
// of drift and nothing you could see. Eighteen strikes to a run, which is three
// beats of it falling away evenly to nothing.
//
// The eleven runs are laid out with a regularity nothing else in the piece
// has: a pair of them four bars apart, and that pair again every sixteen bars
// from bar 38, five times over. The eleventh is on its own at 114, under the
// fade, which is why it is the one you have to be told is there.
//
// Every run starts half a step after its bar line rather than on it. That is
// the whole character of the part: struck between the beats the rest of the
// kit is keeping, it reads as something thrown in rather than something
// counting.
const WOOD_BLOCK: Flurry = {
  id: "wood-block",
  label: "Wood block",
  rate: 6,
  offset: 1 / 12,
  strikes: 18,
  bars: [38, 42, 54, 58, 70, 74, 86, 90, 102, 106, 114],
};

// The wind, under the whole first third of the piece and the only part of it
// that is not played on anything. Read off the master the way the guitar and
// the block were, by watching the noise floor high up where a wind machine
// lives and the harpsichord mostly does not, at the quietest moments of each
// bar: silence at the top, up to full by bar 4, held there while the
// harpsichord comes in, and then a long way down.
//
// Where the first stretch of it ends is a judgement rather than a measurement.
// Past bar 28 what is left is no louder than the noise the rest of the mix
// makes on its own, so the envelope follows what is heard — mostly gone by 36 —
// down to nothing at 45, where the harpsichord hands over.
//
// Then it comes back at 61 and climbs the rest of the way to the end, which the
// same measurement follows plainly: nothing through the fifties, lifting from
// 61, and up without stopping from there. How far up is not something that
// measurement can say, since the organ arrives at 81 and sits in the same part
// of the spectrum the wind is being read in; what it can say is that the fader
// only goes one way. So the climb is written as a little past where the first
// stretch peaked, which is what the ear says of it, rather than the two or
// three times over the arithmetic claims with an organ in the way.
//
// The last stretch of it is drawn quieter than it is written, because the mix
// fade from bar 97 takes the wind down with everything else: what the fader
// does and what you hear part company over those last eighteen bars.
const WIND: Noise = {
  id: "wind",
  label: "Wind",
  envelope: [
    { bar: 1, level: 0 },
    { bar: 2, level: 0.05 },
    { bar: 3, level: 0.18 },
    { bar: 4, level: 1 },
    { bar: 11, level: 1 },
    { bar: 12, level: 0.6 },
    { bar: 20, level: 0.42 },
    { bar: 28, level: 0.22 },
    { bar: 36, level: 0.1 },
    { bar: 45, level: 0 },
    // Silent the whole way through the fifties, rather than creeping back up
    // from the moment it left.
    { bar: 60, level: 0 },
    { bar: 61, level: 0.05 },
    { bar: 69, level: 0.25 },
    { bar: 77, level: 0.45 },
    { bar: 85, level: 0.65 },
    { bar: 97, level: 0.9 },
    { bar: 115, level: 1.1 },
  ],
};

export const SNKRWAVS_SONG: Song = {
  title: "A Sharp Knife Is A Safe Knife",
  audio: "/A_Sharp_Knife_Is_A_Safe_Knife__MASTER.m4a",
  // The master accounts for itself exactly: 2112 samples of priming, then
  // 456 beats of music, then 885 samples of padding. Chrome counts the
  // priming in what it plays, so the downbeat lands 2112/44100 in.
  audioOffset: 0.0479,
  bpm: 94,
  beatsPerBar: 4,
  // 114 bars at 94 brings the last downbeat to the line at the top of bar 115,
  // which is where the master runs out: 4:51 of audio against 4:51 of bars.
  bars: 114,
  fadeOutFrom: 97,
  loops: [HARPSICHORD, LEAD_MELODY, COUNTERPOINT_MELODY, END_SOLO, BASS],
  pads: [HIGH_HATS, DROP_BEAT],
  pulses: [LOW_KICK],
  chords: [GUITAR],
  flurries: [WOOD_BLOCK],
  noises: [WIND],
};

// A loop has to come out even: if its span is not a whole number of turns it
// would be cut off mid-pass, which is a mistake in the writing down rather
// than something to draw. A rolling part is under no such obligation, since
// its ring is a window on the song and can stop anywhere, and neither is a
// part still going when the master runs out: there the mix cuts the pass off,
// and the drop beat is two bars into its fourteenth when it does.
for (const part of [
  ...SNKRWAVS_SONG.loops,
  ...SNKRWAVS_SONG.pads,
  ...SNKRWAVS_SONG.chords,
]) {
  const played = part.to - part.from;
  const rolls = "rolls" in part && part.rolls === true;
  const cut = part.to > SNKRWAVS_SONG.bars;

  if (!rolls && !cut && played % part.bars !== 0) {
    throw new Error(
      `${part.id} runs ${played} bars, which is not a whole number of its ${part.bars}-bar turn`,
    );
  }
}
