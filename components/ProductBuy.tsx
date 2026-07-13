"use client";

import { useState } from "react";
import { useStore } from "@/lib/StoreProvider";
import { money, whatsappProductLink, type Product } from "@/lib/products";

// The product page itself is a server component so its HTML (and JSON-LD) is
// fully rendered for crawlers. Only the interactive buy controls are a client
// island.
export default function ProductBuy({ product }: { product: Product }) {
  // addToCart only takes an id, so set the line quantity explicitly afterwards.
  const { addToCart, setQty: setCartQty } = useStore();
  const [qty, setQty] = useState(1);

  function add() {
    addToCart(product.id);
    if (qty > 1) setCartQty(product.id, qty);
  }

  return (
    <div className="pdp-buy">
      <div className="qty-stepper">
        <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
        <span>{qty}</span>
        <button aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>+</button>
      </div>

      <button className="pill pill-primary pdp-add" onClick={add}>
        Add to cart · {money(product.price * qty)}
      </button>

      <a
        className="whatsapp-btn pdp-whatsapp"
        href={whatsappProductLink(product, qty)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Order on WhatsApp
      </a>
    </div>
  );
}
