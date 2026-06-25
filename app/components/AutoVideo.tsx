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

  useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === "undefined") {
      // No observer support: fall back to just playing it.
      v?.play().catch(() => {});
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px 0px", threshold: 0.1 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video ref={ref} loop muted playsInline preload="metadata" {...props}>
      <source src={src} type="video/mp4" />
    </video>
  );
}
