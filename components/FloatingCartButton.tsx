"use client";

import { usePathname } from "next/navigation";
import { useStore } from "@/lib/StoreProvider";

export default function FloatingCartButton() {
  const pathname = usePathname();
  const { cartCount, cartOpen, setCartOpen } = useStore();

  if (pathname.startsWith("/admin") || cartOpen) return null;

  return (
    <button className="floating-cart-btn" aria-label="Open cart" onClick={() => setCartOpen(true)}>
      🛒
      <span className={`cart-badge ${cartCount === 0 ? "hidden" : ""}`}>{cartCount}</span>
    </button>
  );
}
