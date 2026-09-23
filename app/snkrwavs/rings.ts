import {
  type Loop,
  type Pad,
  type Pulse,
  type Song,
  partPresence,
  pulseStrength,
} from "./loop";

// Where the rings sit, kept in one place because two things need to agree about
// it: the drawing, and the hand pointing at the drawing. A ring you can click is
// a ring whose band has to be known outside the component that draws it.

// One space of a staff. Every staff in the piece is drawn with the same gap
// whatever size its ring is, so a five-line staff is always four of these
// across.
export const STAFF_GAP = 0.0105;

// One voice's lane on a pattern, drawn the same width as a staff gap so a
// programmed part and a played one read as the same size of thing.
export const LANE = 0.0105;

// The band a part's drawing takes, in fractions of the shorter side of the
// canvas, measured out from the middle. A staff is two gaps either side of its
// radius; a pattern is half a lane for each voice.
// How wide the coin in the middle is drawn, of the shorter side, which the hand
// pointing at it has to agree about too. Small enough that the bass can have its
// ring around it without the two ever touching, since what swells here on the
// beat is the thing that ring is keeping time with.
export const COIN = 0.04;

// How far out from the middle a click still means the coin: a disc twice the
// coin's width. The coin is a fifth the size of the smallest ring and spends
// most of each beat fading, and a thumb on a phone is wider than that, so what
// answers has to be the room around it rather than the ink. The bass band starts
// beyond this, so nothing is taken from it but a sliver of its slack.
const MIDDLE = COIN;

export const bandOf = (part: Loop | Pad) => {
  const half =
    "voices" in part ? (part.voices.length * LANE) / 2 : STAFF_GAP * 2;

  return { inner: part.radius - half, outer: part.radius + half };
};

// How far either side of its band a ring still answers to a click. A staff is
// four hairlines and some dashes: asking for a hit on the ink itself would make
// the smaller rings nearly unclickable, and the bands are far enough apart that
// a gap either side takes nothing from the ring next door.
const REACH = STAFF_GAP * 1.6;

// Which ring a click at this distance from the middle has landed on, if any.
// Only parts with a stem to play can be soloed, and only while they are on
// screen: a band that has nothing turning in it is empty space, and a click
// there means what a click on empty space means.
//
// Radius is a fraction of the shorter side, the same way the rings measure
// themselves, so this works at any size of window without being told the size.
export const ringAt = (song: Song, beats: number, radius: number) => {
  // The middle first, since it is the one part whose region is a disc and not a
  // band, and the only one a click can land in the centre of.
  for (const pulse of song.pulses) {
    if (!pulse.stem) continue;
    if (pulseStrength(song, pulse, beats) <= 0) continue;
    if (radius <= MIDDLE) return pulse;
  }

  let closest: Loop | Pad | Pulse | null = null;
  let nearest = Infinity;

  for (const part of [...song.loops, ...song.pads]) {
    if (!part.stem) continue;
    if (partPresence(song, part, beats) <= 0) continue;

    const { inner, outer } = bandOf(part);
    if (radius < inner - REACH || radius > outer + REACH) continue;

    // Bands can only overlap through the reach either side of them, and there
    // the nearer of the two ought to win.
    const off = Math.abs(radius - part.radius);
    if (off < nearest) {
      nearest = off;
      closest = part;
    }
  }

  return closest;
};
