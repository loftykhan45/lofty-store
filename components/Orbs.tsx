"use client";

import { usePathname } from "next/navigation";

/**
 * Ambient backdrop: three slow gold light fields.
 *
 * The floating glass bubbles that used to live here were removed at the user's
 * request. What remains is just the light — it gives the dark page depth and
 * warmth without putting anything in front of the product.
 */
export default function Orbs() {
  const pathname = usePathname();
  const success = pathname === "/confirmation" || pathname === "/order-status";

  return (
    <div className={`fx${success ? " fx-success" : ""}`} aria-hidden="true">
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />
    </div>
  );
}
