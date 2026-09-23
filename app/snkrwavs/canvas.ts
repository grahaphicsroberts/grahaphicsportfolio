// How much of the screen's pixel density a canvas is drawn at.
//
// Not all of it. This page keeps nine canvases and redraws them every frame, so
// every device pixel is paid for nine times over and squared: a phone reporting
// three to the CSS point asks for nine times the area of a laptop's own drawing,
// on a fraction of the bandwidth to push it around. What gives way is frames,
// which is seen as dimming that steps instead of sliding, and as rings that go a
// moment without being repainted at all.
//
// Two is past the point where these hairlines read as drawn rather than computed,
// and it leaves a laptop exactly where it was. A phone is held closer but is the
// machine that can least afford it, and a hairline at one and a half device
// pixels is still a hairline: below this the grain of the screen is doing the
// drawing.
const FINE = 2;
const PHONE = 1.5;

// What counts as a phone here is not what it is but how much of it there is: a
// narrow window on a desktop has the same amount of drawing to do in the same
// number of pixels, and a tablet has the room for the fine version.
const SMALL = 600;

export const density = () => {
  const dpr = window.devicePixelRatio || 1;
  const across = Math.min(window.innerWidth, window.innerHeight);

  return Math.min(dpr, across < SMALL ? PHONE : FINE);
};

// Noise is the exception, and it is the biggest canvas of the lot: static does
// not get better for being drawn finer, it only gets more expensive. Drawn at
// one, the grain is the size the grain should be.
export const noiseDensity = () => 1;

// Fitting a canvas to the ring it draws rather than to the page.
//
// Every ring used to take a canvas the size of the whole drawing, so the bass —
// a ring a fifteenth of the way out — cleared and composited thirty times the
// pixels it draws on, sixty times a second, with six other rings doing the same
// over the top of it. Each one now gets a square of its own reach, centred where
// the rings all turn, and never larger than the stage: the outermost ring is
// exactly as it was and the inner ones cost a fraction of what they did.
//
// Reach is a fraction of the stage's shorter side, which is what every ring
// measures itself in, so that is what comes back rather than the canvas's own
// size. A ring cannot be allowed to change size with the box it is drawn in.
export const fitTo = (canvas: HTMLCanvasElement, reach: number) => {
  const box = canvas.parentElement?.getBoundingClientRect();
  const ctx = canvas.getContext("2d");
  if (!box || !ctx) return null;

  const stage = Math.min(box.width, box.height);
  const want = stage * reach * 2;

  // Whole points, and an even number of them, so that the backing store comes
  // out a whole number of pixels at any of the densities above and the ring is
  // not drawn half a pixel off its own middle. A hairline on a half pixel is a
  // hairline drawn twice as wide and half as bright.
  const even = (n: number) => Math.max(2, Math.floor(n / 2) * 2);
  const width = even(Math.min(box.width, want));
  const height = even(Math.min(box.height, want));

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const dpr = density();
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { width, height, stage };
};
