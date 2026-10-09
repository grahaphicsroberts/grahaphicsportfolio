"use client";

import React from "react";
import AutoVideo from "./AutoVideo";

// What the studio is doing right now, in one place because two pages carry it:
// the banner under the homepage hero and the studio page. Each page reads the
// entries it wants in the order it wants them, so this is keyed rather than
// sequenced.

// Titles of works are set in italics, but the text has to survive as a plain
// string as well: the dot that jumps to a lockup is labelled with its headline.
// So *asterisks* mark what leans over, and the markers are stripped for labels.
const ITALIC = /(\*[^*]+\*)/;

export function leaned(text: string) {
  return text.split(ITALIC).map((piece, index) =>
    ITALIC.test(piece) ? (
      <em key={index} className="italic">
        {piece.slice(1, -1)}
      </em>
    ) : (
      piece
    ),
  );
}

export function plain(text: string) {
  return text.replace(/\*/g, "");
}

export type Notable = {
  eyebrow: string;
  headline: string;
  copy: string;
  // `veil` is for work that can be mentioned but not shown. The file in
  // public/ is already blurred past legibility — the stamp labels it, it does
  // not protect it — and `tone` says which way a veiled frame needs pushing:
  // dark media gets lifted so the panel is not just a black rectangle.
  media: {
    src: string;
    kind: "image" | "video";
    alt: string;
    veil?: string;
    tone?: "light" | "dark";
    // Panels crop a different way at every breakpoint. `anchor` pins the edge
    // that has something on it worth keeping, for frames where the middle is
    // not the point.
    anchor?: "top";
  };
  link?: { href: string; label: string };
};

const ITEMS = {
  moma: {
    eyebrow: "On view at MoMA",
    headline: "Work featured in the Museum of Modern Art",
    copy: "*Full Disclosure: The Edge of Information Design* features my forensic reconstruction of the 2019 fire at Notre Dame, through June 2027.",
    media: {
      src: "/NotreDameMoMA.jpg",
      kind: "image",
      alt: "The Notre Dame reconstruction on a screen in a MoMA gallery.",
    },
    link: { href: "/immersive-web#notre-dame", label: "See the project" },
  },
  deepmind: {
    eyebrow: "In the studio",
    headline: "Visualization at the AI frontier",
    copy: "Recently the studio has explored translating AI policy research with Google DeepMind.",
    media: {
      src: "/deepmindProposal.jpg",
      kind: "image",
      alt: "",
      veil: "Under NDA",
      tone: "dark",
    },
    link: { href: "/studio", label: "Visit the studio" },
  },
  snkrwavs: {
    eyebrow: "In the studio",
    headline: "The launch of *snkrwavs*",
    copy: "Grahaphics studio presents *snkrwavs*, an original music + visualization art project. The first interactive song is now live.",
    media: {
      src: "/snkrwavs_carousel.mp4",
      kind: "video",
      alt: "",
    },
    link: { href: "/snkrwavs/sharp-knife", label: "Hear the first song" },
  },
  "kimberly-clark": {
    eyebrow: "In the studio",
    headline: "Digital storytelling sprint for Kimberly-Clark",
    copy: "The studio recently completed a project in partnership with sprint facilitator Mesa to highlight a ground-breaking absorption technology.",
    media: {
      src: "/KC_clip_carousel.mp4",
      kind: "video",
      alt: "",
      anchor: "top",
    },
    link: { href: "/studio", label: "Visit the studio" },
  },
} satisfies Record<string, Notable>;

export type NotableId = keyof typeof ITEMS;

export function notable(id: NotableId): Notable {
  return ITEMS[id];
}

// The frame fills whatever panel it is handed — the banner's fixed strip or a
// feature panel on the studio page — so the veil treatment travels with the
// media rather than being written out once per page. The panel it sits in has
// to be `relative` and has to have a height.
export function NotableFrame({
  media,
  stamp = "compact",
}: {
  media: Notable["media"];
  stamp?: "compact" | "feature";
}) {
  const { veil, tone, anchor } = media;

  // The blur lives in the asset itself, not here: a CSS filter leaves the
  // original a URL away. What is left to do is a matter of tone — a frame that
  // was already dark collapses into nothing, so it gets lifted.
  const veiled = veil && tone === "dark" ? "brightness-[1.6] saturate-150" : "";
  const held = anchor === "top" ? "object-top" : "";
  const scrim = tone === "dark" ? "bg-black/20" : "bg-black/40";

  return (
    <>
      {media.kind === "video" ? (
        <AutoVideo
          src={media.src}
          className={`h-full w-full object-cover ${held} ${veiled}`}
          aria-hidden="true"
        />
      ) : (
        <img
          src={media.src}
          alt={veil ? "" : media.alt}
          className={`h-full w-full object-cover ${held} ${veiled}`}
        />
      )}

      {veil && (
        <div
          className={`absolute inset-0 flex items-center justify-center px-2 ${scrim}`}
        >
          <span
            className={`rounded-full border border-white/30 bg-black/50 text-center font-mono font-bold uppercase leading-none tracking-widest text-white/90 ${
              stamp === "feature"
                ? "px-4 py-2 text-[0.7rem] md:px-5 md:py-2.5 md:text-sm"
                : "px-2 py-1 text-[0.55rem] sm:px-3 sm:py-1.5 sm:text-[0.6rem] lg:text-xs"
            }`}
          >
            {veil}
          </span>
        </div>
      )}
    </>
  );
}
