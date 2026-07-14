"use client";

import { useEffect, useRef, useState } from "react";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import Reveal from "@/components/Reveal";

type Stat = {
  /** Numbers count up on first view; strings are shown as-is. */
  value: number | string;
  label: string;
};

// Counts come from the catalog itself rather than being typed in, so they stay
// true as products are added instead of quietly becoming a lie.
//
// "COD / Pay on delivery" and "7 / Day replacement" used to sit here too, but
// they duplicated the Cash-on-Delivery and 7-day-replacement feature cards
// directly below. Saying the same thing twice, one above the other, just made
// the page feel padded — these two are the facts the feature cards do NOT state.
const STATS: Stat[] = [
  { value: PRODUCTS.length, label: "Products in stock" },
  { value: CATEGORIES.length, label: "Categories" },
];

const COUNT_MS = 900;

function CountUp({ target, run }: { target: number; run: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!run) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      // power2.out — the same easing curve the rest of the page's motion uses,
      // so the number settles with the card it sits in.
      const eased = 1 - (1 - t) * (1 - t);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);

  return <>{value}</>;
}

export default function StatRow() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRun(true);
        obs.disconnect();
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="stat-row" ref={ref}>
      {STATS.map((s, i) => (
        <Reveal className="stat-tile glass" index={i} key={s.label}>
          <div className="stat-value">
            {typeof s.value === "number" ? <CountUp target={s.value} run={run} /> : s.value}
          </div>
          <div className="stat-label">{s.label}</div>
        </Reveal>
      ))}
    </div>
  );
}
