"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

// One observer shared by every Reveal on the page. A separate observer per
// element means a separate intersection computation per element on each scroll
// tick, which this page — with 100+ product cards below the fold — would feel.
let shared: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (shared) return shared;
  shared = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        // The reveal is one-way. Unobserving here stops it replaying every
        // time the user scrolls back up past the same section.
        shared!.unobserve(entry.target);
      }
    },
    // Fire slightly before the element is fully on screen, so the motion has
    // finished by the time the user is actually looking at it.
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  return shared;
}

type Props = {
  children: ReactNode;
  className?: string;
  /**
   * Position within a staggered group. Each step adds 60ms of delay.
   * Keep groups to 8 or fewer — past that the last item lands late enough to
   * read as lag rather than choreography.
   */
  index?: number;
};

export default function Reveal({ children, className, index = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = getObserver();
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-reveal=""
      style={{ "--reveal-i": index } as CSSProperties}
    >
      {children}
    </div>
  );
}
