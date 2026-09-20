// How much of the screen's pixel density to draw at.
//
// A phone reports three device pixels to the CSS point and cannot afford them
// here: this page keeps nine canvases and redraws every one of them every frame,
// so at three the work and the memory are nine times the area rather than four,
// and what gives way is frames — which shows up as dimming that steps instead of
// sliding, and as rings that go a moment without being repainted at all.
//
// Two is past the point where these hairlines read as drawn rather than
// computed, and it leaves a laptop exactly where it was.
export const density = () => Math.min(window.devicePixelRatio || 1, 2);
