"use client";

import Link from "next/link";
import { useStore } from "@/lib/StoreProvider";
import { PRODUCTS, money } from "@/lib/products";
import MediaFill from "@/components/MediaFill";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, removeFromCart, cartSubtotal } = useStore();
  const lines = Object.entries(cart)
    .map(([id, qty]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      return product ? { product, qty, subtotal: product.price * qty } : null;
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  return (
    <>
      <div className={`cart-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? "open" : ""}`} aria-label="Shopping cart">
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">Your Cart</div>
          <button className="cart-drawer-close" aria-label="Close cart" onClick={onClose}>×</button>
        </div>

        {lines.length === 0 ? (
          <div className="cart-empty">Your cart is empty. Add something you&apos;ll love.</div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {lines.map((line) => (
                <div className="cart-line" key={line.product.id}>
                  <div className="cart-line-swatch"><MediaFill image={line.product.image} label={line.product.name} sizes="48px" /></div>
                  <div style={{ flex: 1 }}>
                    <div className="cart-line-name">{line.product.name}</div>
                    <div className="cart-line-meta">Qty {line.qty} · {money(line.subtotal)}</div>
                  </div>
                  <button className="cart-line-remove" onClick={() => removeFromCart(line.product.id)}>Remove</button>
                </div>
              ))}
            </div>
            <div className="cart-total-row">
              <div className="cart-total-label">Total</div>
              <div className="cart-total-value">{money(cartSubtotal)}</div>
            </div>
            <Link href="/checkout" className="pill pill-primary cart-checkout-btn" onClick={onClose}>Checkout</Link>
          </>
        )}
      </aside>
    </>
  );
}
