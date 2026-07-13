"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/StoreProvider";
import { PRODUCTS, SHIPPING_OPTIONS, money } from "@/lib/products";
import MediaFill from "@/components/MediaFill";

type Errors = Record<string, boolean>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useStore();
  const [shippingIndex, setShippingIndex] = useState(0);
  const [form, setForm] = useState({ email: "", phone: "", firstName: "", lastName: "", address: "", city: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const product = PRODUCTS.find((p) => p.id === id);
          return product ? { product, qty, subtotal: product.price * qty } : null;
        })
        .filter((l): l is NonNullable<typeof l> => l !== null),
    [cart]
  );

  const subtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
  const shippingCost = SHIPPING_OPTIONS[shippingIndex].price;
  const total = subtotal + shippingCost;

  function setField(name: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate(): boolean {
    const next: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = true;
    // Pakistani mobile numbers are 11 digits local (03xx…) or 12 with the 92
    // country code. Accept either, ignoring spaces/dashes the user may type.
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) next.phone = true;
    (["firstName", "lastName", "address", "city"] as const).forEach((k) => {
      if (!form[k].trim()) next[k] = true;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) return;
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          shippingIndex,
          cart: Object.entries(cart).map(([id, qty]) => ({ id, qty })),
        }),
      });
      if (!res.ok) throw new Error("Order failed");
      const data = await res.json();
      clearCart();
      router.push(`/confirmation?order=${data.id}`);
    } catch {
      setSubmitError("Something went wrong placing your order. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="checkout-wrap">
      <h1 className="checkout-title">Checkout</h1>

      {lines.length === 0 && (
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, marginBottom: 24 }}>
          Your cart is empty. <Link href="/" style={{ color: "#fff", textDecoration: "underline" }}>Go back to shopping</Link>.
        </p>
      )}

      <form className="checkout-grid" onSubmit={placeOrder}>
        <div className="checkout-forms">
          <div className="form-card glass">
            <div className="form-card-title">Contact</div>
            <input
              className={`form-input ${errors.email ? "invalid" : ""}`}
              type="email"
              name="email"
              autoComplete="email"
              aria-label="Email address"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              style={{ marginBottom: 12 }}
            />
            {errors.email && <div className="field-error" style={{ display: "block" }}>Enter a valid email address.</div>}
            <input
              className={`form-input ${errors.phone ? "invalid" : ""}`}
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              aria-label="Phone number"
              placeholder="Phone number (e.g. 0300 1234567)"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
            />
            {errors.phone ? (
              <div className="field-error" style={{ display: "block" }}>Enter a valid phone number.</div>
            ) : (
              <div className="field-hint">Our courier calls this number to confirm your Cash on Delivery order.</div>
            )}
          </div>

          <div className="form-card glass">
            <div className="form-card-title">Shipping address</div>
            <div className="form-row-2">
              <input
                className={`form-input ${errors.firstName ? "invalid" : ""}`}
                name="firstName"
                autoComplete="given-name"
                aria-label="First name"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
              />
              <input
                className={`form-input ${errors.lastName ? "invalid" : ""}`}
                name="lastName"
                autoComplete="family-name"
                aria-label="Last name"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
              />
            </div>
            <input
              className={`form-input ${errors.address ? "invalid" : ""}`}
              name="address"
              autoComplete="street-address"
              aria-label="Street address"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <input
              className={`form-input ${errors.city ? "invalid" : ""}`}
              name="city"
              autoComplete="address-level2"
              aria-label="City"
              placeholder="City"
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
            />
          </div>

          <div className="form-card glass">
            <div className="form-card-title">Shipping method</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SHIPPING_OPTIONS.map((opt, idx) => (
                <div
                  key={opt.name}
                  className={`ship-option ${idx === shippingIndex ? "selected" : ""}`}
                  onClick={() => setShippingIndex(idx)}
                >
                  <div className="ship-option-left">
                    <div className="ship-dot"><div className="ship-dot-fill" /></div>
                    <div>
                      <div className="ship-name">{opt.name}</div>
                      <div className="ship-eta">{opt.eta}</div>
                    </div>
                  </div>
                  <div className="ship-price">{money(opt.price)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-card glass">
            <div className="form-card-title">Payment</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderRadius: 16, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.4)" }}>
              <div className="ship-dot" style={{ borderColor: "#fff" }}><div className="ship-dot-fill" style={{ display: "block" }} /></div>
              <div>
                <div className="ship-name">Cash on Delivery</div>
                <div className="ship-eta">Pay with cash when your order arrives.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-card glass">
          <div className="summary-title">Order summary</div>
          <div className="summary-lines">
            {lines.map((l) => (
              <div className="summary-line" key={l.product.id}>
                <div className="summary-line-swatch"><MediaFill image={l.product.image} label={l.product.name} sizes="52px" /></div>
                <div style={{ flex: 1 }}>
                  <div className="cart-line-name">{l.product.name}</div>
                  <div className="cart-line-meta">Qty {l.qty}</div>
                </div>
                <div className="cart-line-name">{money(l.subtotal)}</div>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-totals">
            <div className="summary-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{money(shippingCost)}</span></div>
          </div>
          <div className="summary-divider" />
          <div className="summary-grand">
            <div className="summary-grand-label">Total</div>
            <div className="summary-grand-value">{money(total)}</div>
          </div>
          <button type="submit" className="pay-btn pill-primary" disabled={lines.length === 0 || submitting}>
            {submitting ? "Placing order…" : `Place order — Pay ${money(total)} on delivery`}
          </button>
          {submitError && <div className="field-error" style={{ display: "block", textAlign: "center" }}>{submitError}</div>}
        </div>
      </form>
    </div>
  );
}
