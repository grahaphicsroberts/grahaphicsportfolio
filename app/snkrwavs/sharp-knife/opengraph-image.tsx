import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SNKRWAVS_SONG as SONG, turnBeats } from "../loop";
import { pitchColour, strike } from "../palette";
import { LANE, STAFF_GAP } from "../rings";

// The card this page shows when it is shared, drawn from the same numbers the
// page is drawn from: every staff at its own radius, every note at its own step
// and beat, in the colour its pitch is given. Nothing here is a picture of the
// page — it is the page's drawing, held still, with every part present at once
// and none of them dimmed, which is a thing the song itself never does.
//
// Close enough that the middle of the rings is off the corner and only their
// arcs cross the frame. A whole record at card size is a small busy circle; a
// crop of one is notation, and notation read this close is the thing that makes
// somebody wonder what they are looking at.

export const alt =
  "A close crop of the snkrwavs drawing of A Sharp Knife Is A Safe Knife: arcs of coloured notes on circular staves";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAU = Math.PI * 2;

// The unit every radius in the song data is a fraction of, and where the middle
// of the rings sits — off the top-left corner, past the edge of the card, so what
// crosses the frame is a wedge of six of the seven parts, their arcs bowing away
// from the corner. Only the bass ring is too near the middle to reach the frame,
// and it is not missed: this is a detail of the drawing, not an inventory of it.
const UNIT = 3600;
const MID = { x: -300, y: -370 };

// How far the drawing is turned before it is cropped, which is really a choice of
// which bars the card is a picture of, since a loop is not evenly busy. This lands
// the frame a little past the middle of every loop, where the melodies are on
// their way back down and their notes stack across the rings in pitch order.
const SPIN = (200 * TAU) / 360;

const INK = {
  staff: "rgba(255, 255, 255, 0.16)",
  bar: "rgba(255, 255, 255, 0.26)",
  downbeat: "rgba(255, 255, 255, 0.5)",
};

// Weights are taken from the zoom rather than chosen, so the drawing keeps the
// proportions it has on screen: a note is a dash several times the width of the
// hairlines it sits across.
const NOTE_INK = 0.85;
const NOTE_WEIGHT = STAFF_GAP * UNIT * 0.4;
const HAIR = NOTE_WEIGHT * 0.26;
const LEAST = NOTE_WEIGHT * 1.1; // pixels of arc a note gets however short it is

// The mark, in the corner the arcs leave empty. Its own spiral is a golden one
// rather than a musical one, but it turns the same way the rings do, and it is the
// only thing on the card that says whose the record is.
const MARK = { width: 98, height: 150, right: 64, bottom: 56 };

const spot = (angle: number, radius: number) => ({
  x: MID.x + Math.cos(angle) * radius,
  y: MID.y + Math.sin(angle) * radius,
});

// Top centre is the playhead, and a turn of the ring is a pass of the loop, so a
// beat of the part is that fraction of the way round from the top.
const angleOf = (beat: number, turn: number) =>
  -Math.PI / 2 + SPIN + (beat / turn) * TAU;

// A dash along the ring: the arc from where the note is struck to where it stops.
const arc = (from: number, to: number, radius: number) => {
  const start = spot(from, radius);
  const end = spot(to, radius);
  const half = to - from >= Math.PI ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${half} 1 ${end.x} ${end.y}`;
};

// Where a step sits on its staff: the bottom line is 0 and the top line 8, and
// neighbouring steps are half a gap apart, so the whole staff is four gaps.
const stepRadius = (radius: number, step: number) =>
  (radius + ((step - 4) * STAFF_GAP) / 2) * UNIT;

// How far the frame is from the middle of the rings at its nearest and furthest
// corners. A ring outside that range is a ring nobody sees, and this close most
// of them are: no sense drawing a thousand notes off the edge of the card.
const corners = [
  [0, 0],
  [size.width, 0],
  [0, size.height],
  [size.width, size.height],
].map(([x, y]) => Math.hypot(x - MID.x, y - MID.y));
const inside =
  MID.x > 0 && MID.x < size.width && MID.y > 0 && MID.y < size.height;
const NEAR = inside ? 0 : Math.min(...corners);
const FAR = Math.max(...corners);
const shows = (part: { radius: number }) =>
  stepRadius(part.radius, 8) > NEAR && stepRadius(part.radius, 0) < FAR;

export default async function Image() {
  // Carried into the card rather than pointed at, because the card is made when
  // the site is built and there is no site yet to fetch it from.
  const mark = await readFile(
    join(process.cwd(), "public/logos/grahaphics-mark.png"),
  );
  const logo = `data:image/png;base64,${mark.toString("base64")}`;

  const marks: React.ReactElement[] = [];

  // The staffs, five lines each, and a bar line across them for every bar of the
  // loop with the downbeat drawn heavier — the same furniture the page draws,
  // which is what makes a ring read as notation rather than as a dial.
  for (const loop of SONG.loops) {
    if (!shows(loop)) continue;

    const turn = turnBeats(SONG, loop);
    const inner = stepRadius(loop.radius, 0);
    const outer = stepRadius(loop.radius, 8);

    for (const step of [0, 2, 4, 6, 8]) {
      marks.push(
        <circle
          key={`${loop.id}-line-${step}`}
          cx={MID.x}
          cy={MID.y}
          r={stepRadius(loop.radius, step)}
          fill="none"
          stroke={INK.staff}
          strokeWidth={HAIR}
        />,
      );
    }

    for (let bar = 0; bar < loop.bars; bar++) {
      const angle = angleOf(bar * SONG.beatsPerBar, turn);
      const from = spot(angle, inner);
      const to = spot(angle, outer);

      marks.push(
        <line
          key={`${loop.id}-bar-${bar}`}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={bar === 0 ? INK.downbeat : INK.bar}
          strokeWidth={HAIR}
        />,
      );
    }

    for (const [index, note] of loop.notes.entries()) {
      const radius = stepRadius(loop.radius, note.step);
      const least = (LEAST / (radius * TAU)) * turn;
      const from = angleOf(note.at, turn);
      const to = angleOf(note.at + Math.max(note.length, least), turn);

      marks.push(
        <path
          key={`${loop.id}-note-${index}`}
          d={arc(from, to, radius)}
          fill="none"
          stroke={pitchColour(note.step, NOTE_INK)}
          strokeWidth={NOTE_WEIGHT}
          strokeLinecap="round"
        />,
      );
    }
  }

  // The programmed parts, which have lanes rather than a staff: one strike is a
  // tick across its own lane, in the colour everything struck shares.
  for (const pad of SONG.pads) {
    if (!shows(pad)) continue;

    const turn = turnBeats(SONG, pad);
    const floor = (pad.radius - (pad.voices.length * LANE) / 2) * UNIT;
    const lane = LANE * UNIT;

    for (const [index, hit] of pad.hits.entries()) {
      const angle = angleOf(hit.at, turn);
      const from = spot(angle, floor + hit.lane * lane);
      const to = spot(angle, floor + (hit.lane + 1) * lane);

      marks.push(
        <line
          key={`${pad.id}-hit-${index}`}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={strike(0.35 + 0.55 * hit.force)}
          strokeWidth={HAIR * 1.6}
          strokeLinecap="round"
        />,
      );
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          background: "#000",
        }}
      >
        <svg
          width={size.width}
          height={size.height}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {marks}
        </svg>

        <img
          src={logo}
          alt=""
          width={MARK.width}
          height={MARK.height}
          style={{
            position: "absolute",
            right: MARK.right,
            bottom: MARK.bottom,
          }}
        />
      </div>
    ),
    size,
  );
}
