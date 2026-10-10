"use client";

import { useEffect, useRef } from "react";

type AutoVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
};

/**
 * A muted, looping, inline background video that only plays while it's near the
 * viewport. Off-screen videos are paused so the browser isn't decoding many
 * clips at once — which is the main cause of stuttering playback on mobile.
 *
 * Note: no `autoPlay` attribute. The IntersectionObserver starts playback for
 * whatever is in view on mount and pauses everything else.
 */
export default function AutoVideo({ src, ...props }: AutoVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const showing = useRef<string | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // Pointing a <source> child at a new file does not reload the media; the
    // element keeps showing the old clip until it is told to start over. On the
    // first pass the browser is already loading, so only a genuine change asks
    // for another.
    if (showing.current !== null && showing.current !== src) v.load();
    showing.current = src;

    // What the clip should be doing, as distinct from what it is doing. A
    // play() the browser refuses — Low Power Mode, a backgrounded tab, a decode
    // still in flight — used to be dropped on the floor, and nothing was left
    // to try again, so the panel stayed empty.
    let wanted = false;

    const attempt = () => {
      if (wanted && v.paused) v.play().catch(() => {});
    };

    // Each of these is a moment when a refusal might not be refused again.
    const retry = () => attempt();
    v.addEventListener("canplay", retry);
    v.addEventListener("loadeddata", retry);
    document.addEventListener("visibilitychange", retry);
    // A gesture anywhere on the page lifts an autoplay block for everything on
    // it, which is why tapping the dots appeared to be what loaded the clip.
    window.addEventListener("pointerdown", retry, { passive: true });

    let io: IntersectionObserver | undefined;

    if (typeof IntersectionObserver === "undefined") {
      // No observer support: fall back to just playing it.
      wanted = true;
      attempt();
    } else {
      io = new IntersectionObserver(
        ([entry]) => {
          wanted = entry.isIntersecting;
          if (wanted) attempt();
          else v.pause();
        },
        { rootMargin: "200px 0px", threshold: 0.1 },
      );
      io.observe(v);
    }

    return () => {
      io?.disconnect();
      v.removeEventListener("canplay", retry);
      v.removeEventListener("loadeddata", retry);
      document.removeEventListener("visibilitychange", retry);
      window.removeEventListener("pointerdown", retry);
      // Taking the element off the page does not stop it. An unmounted clip
      // goes on decoding and pulling bytes until it is collected, which on a
      // rotating banner means every clip it has ever shown.
      wanted = false;
      v.pause();
    };
  }, [src]);

  return (
    <video ref={ref} loop muted playsInline preload="metadata" {...props}>
      <source src={src} type="video/mp4" />
    </video>
  );
}
