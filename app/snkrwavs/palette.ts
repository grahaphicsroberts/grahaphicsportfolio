// The colour percussion strikes in. Pitch has the rainbow, which is what the
// staffs read by; the drums have no pitch to spend it on, so they get this
// instead, and it is the one colour shared by everything that is hit rather
// than played.
export const STRIKE = [56, 189, 248] as const;

export const strike = (alpha = 1) =>
  `rgba(${STRIKE[0]}, ${STRIKE[1]}, ${STRIKE[2]}, ${alpha})`;

// The rainbow pitch is read by. Seven colours across seven diatonic steps
// means it repeats at the octave, so a note and its octave share a colour and
// a staff runs low to high as red to violet, the way light itself does. A
// chord takes the colour of its root, which puts the guitar and the notes on
// the same scale even though one is drawn and the other is only lit.
export const ROYGBIV = [
  [255, 69, 58],
  [255, 159, 10],
  [255, 214, 10],
  [48, 209, 88],
  [10, 132, 255],
  [94, 92, 230],
  [191, 90, 242],
] as const;

// Steps below the staff run negative, and a remainder has to stay positive
// for the octave to come back around to the same colour.
export const pitchColour = (step: number, alpha = 1) => {
  const [r, g, b] =
    ROYGBIV[((step % ROYGBIV.length) + ROYGBIV.length) % ROYGBIV.length];

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
