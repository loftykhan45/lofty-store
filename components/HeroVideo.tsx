"use client";

// Footage: Mixkit "Stardust golden background" (clip 46392), Mixkit Free
// License — free for commercial use, no attribution required. 360p is
// deliberate: the clip is an out-of-focus particle field behind a scrim, so
// upscaling costs nothing visible, while 720p would have cost 5.5MB instead
// of 1.1MB.
import { useEffect, useState } from "react";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

export default function HeroVideo() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Decoration is the first thing to cut. The clip is ~1.1MB, and a large
    // share of Lofty's customers are on Pakistani mobile data — so it only
    // loads when the connection can clearly afford it. Everyone else keeps the
    // poster still, which is 26KB and looks near-identical when static.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && conn.effectiveType !== "4g") return;

    setEnabled(true);
  }, []);

  if (!enabled) return null;

  return (
    <video
      className="hero-video"
      src="/video/hero-gold.mp4"
      poster="/img/hero-video-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      // Purely decorative: keep it out of the accessibility tree and the tab order.
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
