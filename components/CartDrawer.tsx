"use client";

import Link from "next/link";
import { useStore } from "@/lib/StoreProvider";
import { PRODUCTS, money, whatsappCartLink } from "@/lib/products";
import MediaFill from "@/components/MediaFill";
import Icon from "@/components/Icon";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, removeFromCart, setQty, clearCart, cartCount, cartSubtotal } = useStore();
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
          <button className="cart-drawer-back" aria-label="Close cart" onClick={onClose}>
            <Icon name="arrowLeft" size={18} />
          </button>
          <div>
            <div className="cart-drawer-title">Your Cart</div>
            <div className="cart-drawer-subtitle">
              {cartCount === 0 ? "Your cart is empty" : `${cartCount} item${cartCount === 1 ? "" : "s"} · Cash on Delivery`}
            </div>
          </div>
          {lines.length > 0 && (
            <button className="cart-drawer-empty" onClick={clearCart}>Empty</button>
          )}
        </div>

        {lines.length === 0 ? (
          <div className="cart-empty">Your cart is empty. Add something you&apos;ll love.</div>
        ) : (
          <>
            <div className="cart-lines">
              {lines.map((line) => (
                <div className="cart-line" key={line.product.id}>
                  <div className="cart-line-swatch"><MediaFill image={line.product.image} label={line.product.name} sizes="48px" /></div>
                  <div className="cart-line-body">
                    <div className="cart-line-name">{line.product.name}</div>
                    <div className="cart-line-meta">{money(line.product.price)} each</div>
                    <div className="qty-stepper qty-stepper-sm">
                      <button
                        type="button"
                        aria-label={`Decrease ${line.product.name} quantity`}
                        onClick={() => setQty(line.product.id, line.qty - 1)}
                      >
                        −
                      </button>
                      <span>{line.qty}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${line.product.name} quantity`}
                        onClick={() => setQty(line.product.id, line.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-line-right">
                    <button className="cart-line-close" aria-label={`Remove ${line.product.name}`} onClick={() => removeFromCart(line.product.id)}>
                      <Icon name="close" size={15} />
                    </button>
                    <div className="cart-line-price">{money(line.subtotal)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>{money(cartSubtotal)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="cart-total-row">
                <div className="cart-total-label">Total</div>
                <div className="cart-total-value">{money(cartSubtotal)}</div>
              </div>
            </div>

            <div className="cart-note"><Icon name="cash" size={16} /> Cash on Delivery available on every order.</div>

            <a
              className="cart-whatsapp-btn"
              href={whatsappCartLink(lines, cartSubtotal)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order on WhatsApp instead
            </a>

            <button className="cart-continue-btn" onClick={onClose}>
              <Icon name="arrowLeft" size={15} /> Continue shopping
            </button>
          </>
        )}

        {lines.length > 0 && (
          <div className="cart-drawer-footer">
            <Link href="/checkout" className="pill pill-primary cart-checkout-btn" onClick={onClose}>
              Checkout · {money(cartSubtotal)}
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
