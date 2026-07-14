"use client";

import { usePathname } from "next/navigation";

// Crisp bubbles, deliberately NOT a blurred blob field. Each one has a defined
// rim, a specular highlight and a glassy body, so it reads as an actual bubble
// rather than a smear of colour. (The old version was three 560px circles under
// filter: blur(140px), which is why they looked like fog.)
//
// The values are a fixed list rather than Math.random(): random values would
// differ between the server render and the client hydration, and React would
// throw a mismatch.
type Bubble = { left: number; size: number; delay: number; duration: number; drift: number; opacity: number };

const BUBBLES: Bubble[] = [
  { left: 4, size: 84, delay: 0, duration: 26, drift: 34, opacity: 0.5 },
  { left: 12, size: 38, delay: 6, duration: 19, drift: -22, opacity: 0.42 },
  { left: 19, size: 120, delay: 12, duration: 32, drift: 44, opacity: 0.34 },
  { left: 27, size: 26, delay: 3, duration: 16, drift: 18, opacity: 0.55 },
  { left: 34, size: 64, delay: 17, duration: 24, drift: -30, opacity: 0.45 },
  { left: 42, size: 44, delay: 9, duration: 21, drift: 26, opacity: 0.5 },
  { left: 49, size: 98, delay: 22, duration: 30, drift: -38, opacity: 0.33 },
  { left: 57, size: 30, delay: 14, duration: 18, drift: 20, opacity: 0.52 },
  { left: 64, size: 72, delay: 5, duration: 27, drift: -26, opacity: 0.44 },
  { left: 71, size: 50, delay: 19, duration: 22, drift: 32, opacity: 0.48 },
  { left: 78, size: 110, delay: 11, duration: 34, drift: -42, opacity: 0.32 },
  { left: 85, size: 34, delay: 25, duration: 17, drift: 22, opacity: 0.54 },
  { left: 91, size: 68, delay: 2, duration: 25, drift: -28, opacity: 0.43 },
  { left: 97, size: 46, delay: 15, duration: 20, drift: 24, opacity: 0.47 },
];

export default function Orbs() {
  const pathname = usePathname();
  const success = pathname === "/confirmation" || pathname === "/order-status";

  return (
    <div className="orbs" aria-hidden="true">
      {/* Two soft glows stay, purely for depth behind the bubbles — but they are
          gold now, not the blue left over from the old theme. */}
      <div className={`glow glow-1${success ? " glow-success" : ""}`} />
      <div className="glow glow-2" />

      <div className="bubbles">
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className={`bubble${success ? " bubble-success" : ""}`}
            style={
              {
                left: `${b.left}%`,
                width: `${b.size}px`,
                height: `${b.size}px`,
                animationDelay: `-${b.delay}s`,
                animationDuration: `${b.duration}s`,
                opacity: b.opacity,
                "--drift": `${b.drift}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
