"use client";

import { useCallback, useEffect, useRef } from "react";

type AutoVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
};

// How often to ask again, and for how long. Long enough to outlast a panel
// fading in or a clip still arriving over a phone connection; short enough that
// a clip which is never going to play stops costing anything.
const BEAT = 400;
const PATIENCE = 10000;

/**
 * A muted, looping, inline background video that only plays while it's near the
 * viewport. Off-screen videos are paused so the browser isn't decoding many
 * clips at once — which is the main cause of stuttering playback on mobile.
 *
 * Note: no `autoPlay` attribute by default. The IntersectionObserver starts
 * playback for whatever is in view on mount and pauses everything else. A
 * caller whose clip is the content rather than the backdrop can pass it to get
 * the browser's own autoplay handling as well.
 */
export default function AutoVideo({ src, className, ...props }: AutoVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const showing = useRef<string | null>(null);

  // React applies `muted` as a property and never as an attribute, and iOS
  // reads the attribute when it decides whether a clip may start unasked.
  // Server-rendered markup happens to carry it; an element the client builds
  // for a slide that has just come around does not, so iOS took the clip for
  // one with sound and offered its own play button over the poster instead.
  // Set here rather than in the effect below, because by then the browser has
  // already chosen what to load and on what terms.
  const hold = useCallback((el: HTMLVideoElement | null) => {
    ref.current = el;
    if (!el) return;
    el.setAttribute("muted", "");
    el.muted = true;
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // Pointing a <source> child at a new file does not reload the media; the
    // element keeps showing the old clip until it is told to start over. On the
    // first pass the browser is already loading, so only a genuine change asks
    // for another.
    if (showing.current !== null && showing.current !== src) v.load();
    showing.current = src;

    // What the clip should be doing, as distinct from what it is doing.
    let wanted = false;
    let until = 0;
    let ticker: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      if (ticker !== undefined) {
        clearInterval(ticker);
        ticker = undefined;
      }
    };

    const ask = () => {
      if (wanted && v.paused) v.play().catch(() => {});
    };

    // WebKit refuses an unattended play() rather than holding onto it, and
    // refuses it for anything it does not judge to be on screen — a panel part
    // way through fading in counts as not on screen, and a refusal also stops
    // the clip loading, so the events that would have been the cue to try again
    // never arrive. Nothing announces that a refusal would now be allowed, so
    // the only way through is to keep asking for a while.
    const press = () => {
      until = Date.now() + PATIENCE;
      ask();
      if (ticker !== undefined) return;
      ticker = setInterval(() => {
        if (!wanted || !v.paused || Date.now() > until) stop();
        else ask();
      }, BEAT);
    };

    const nudge = () => {
      if (wanted) press();
    };

    // Each of these is a moment when a refusal might not be refused again.
    v.addEventListener("canplay", nudge);
    v.addEventListener("loadeddata", nudge);
    document.addEventListener("visibilitychange", nudge);
    // A gesture anywhere on the page lifts an autoplay block for everything on
    // it, which is why tapping the dots appeared to be what loaded the clip.
    window.addEventListener("pointerdown", nudge, { passive: true });
    window.addEventListener("touchend", nudge, { passive: true });

    let io: IntersectionObserver | undefined;

    if (typeof IntersectionObserver === "undefined") {
      // No observer support: fall back to just playing it.
      wanted = true;
      press();
    } else {
      io = new IntersectionObserver(
        ([entry]) => {
          wanted = entry.isIntersecting;
          if (wanted) press();
          else {
            stop();
            v.pause();
          }
        },
        { rootMargin: "200px 0px", threshold: 0.1 },
      );
      io.observe(v);
    }

    return () => {
      io?.disconnect();
      v.removeEventListener("canplay", nudge);
      v.removeEventListener("loadeddata", nudge);
      document.removeEventListener("visibilitychange", nudge);
      window.removeEventListener("pointerdown", nudge);
      window.removeEventListener("touchend", nudge);
      // Taking the element off the page does not stop it. An unmounted clip
      // goes on decoding and pulling bytes until it is collected, which on a
      // rotating banner means every clip it has ever shown.
      wanted = false;
      stop();
      v.pause();
    };
  }, [src]);

  return (
    <video
      ref={hold}
      loop
      muted
      playsInline
      preload="metadata"
      className={`bare-video${className ? ` ${className}` : ""}`}
      {...props}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
