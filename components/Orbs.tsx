"use client";

import { usePathname } from "next/navigation";

export default function Orbs() {
  const pathname = usePathname();
  const success = pathname === "/confirmation" || pathname === "/order-status";
  return (
    <div className="orbs">
      <div className="orb orb-1" />
      <div className="orb orb-2" style={success ? { background: "oklch(0.6 0.17 155)" } : undefined} />
      {!success && <div className="orb orb-3" />}
    </div>
  );
}
