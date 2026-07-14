"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Liquid-glass backdrop.
 *
 * Three things make this read as glass rather than as coloured circles:
 *   1. an aurora underneath, so there is something *worth* refracting;
 *   2. `backdrop-filter` on each bubble, so it genuinely distorts and brightens
 *      what sits behind it instead of just being a translucent fill;
 *   3. chromatic fringing on the rim (a warm ring and a cool ring, offset), which
 *      is what real glass does to light and what the eye reads as "expensive".
 *
 * Bubbles are split across three depth layers. Far ones are small, dim and
 * slightly blurred (depth of field); near ones are large, crisp and parallax
 * fastest. That depth cue is what stops it looking like flat stickers.
 */

type Bubble = { x: number; size: number; delay: number; duration: number; drift: number };

// Fixed values, never Math.random(): random would differ between the server
// render and hydration, and React would throw a mismatch.
const LAYERS: Bubble[][] = [
  // far — small, slow, hazy
  [
    { x: 6, size: 26, delay: 0, duration: 42, drift: 18 },
    { x: 17, size: 20, delay: 11, duration: 48, drift: -14 },
    { x: 29, size: 32, delay: 22, duration: 39, drift: 22 },
    { x: 44, size: 22, delay: 6, duration: 45, drift: -18 },
    { x: 58, size: 30, delay: 30, duration: 41, drift: 16 },
    { x: 71, size: 18, delay: 16, duration: 50, drift: -20 },
    { x: 83, size: 28, delay: 25, duration: 44, drift: 24 },
    { x: 94, size: 24, delay: 8, duration: 46, drift: -16 },
  ],
  // mid
  [
    { x: 11, size: 58, delay: 4, duration: 32, drift: 34 },
    { x: 26, size: 44, delay: 18, duration: 36, drift: -28 },
    { x: 40, size: 66, delay: 9, duration: 30, drift: 40 },
    { x: 54, size: 38, delay: 26, duration: 34, drift: -24 },
    { x: 67, size: 62, delay: 14, duration: 31, drift: 36 },
    { x: 81, size: 46, delay: 2, duration: 35, drift: -30 },
    { x: 92, size: 54, delay: 21, duration: 33, drift: 26 },
  ],
  // near — big, crisp, fastest
  [
    { x: 8, size: 108, delay: 7, duration: 24, drift: 56 },
    { x: 33, size: 132, delay: 19, duration: 22, drift: -48 },
    { x: 62, size: 96, delay: 3, duration: 26, drift: 52 },
    { x: 88, size: 120, delay: 13, duration: 23, drift: -44 },
  ],
];

// How far each layer shifts with the pointer. Near layers move most — that
// difference *is* the depth illusion.
const PARALLAX = [6, 14, 26];

export default function Orbs() {
  const pathname = usePathname();
  const success = pathname === "/confirmation" || pathname === "/order-status";
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Pointer parallax is a mouse affordance: skip it on touch (there is no
    // hover) and when the user has asked for reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;

    function onMove(e: PointerEvent) {
      // -0.5..0.5 from centre.
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (raf) return; // coalesce to one write per frame
      raf = requestAnimationFrame(() => {
        raf = 0;
        root!.style.setProperty("--mx", tx.toFixed(4));
        root!.style.setProperty("--my", ty.toFixed(4));
      });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`fx${success ? " fx-success" : ""}`} ref={rootRef} aria-hidden="true">
      {/* The aurora is the thing the glass refracts. Without it the bubbles have
          nothing to bend and fall straight back to looking like flat discs. */}
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />

      {LAYERS.map((bubbles, layer) => (
        <div
          className={`blayer blayer-${layer + 1}`}
          key={layer}
          style={{ "--px": PARALLAX[layer] } as React.CSSProperties}
        >
          {bubbles.map((b, i) => (
            <span
              className="glassball"
              key={i}
              style={
                {
                  left: `${b.x}%`,
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  animationDelay: `-${b.delay}s`,
                  animationDuration: `${b.duration}s`,
                  "--drift": `${b.drift}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
