"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useOrder } from "@/lib/useOrder";
import { money } from "@/lib/products";
import MediaFill from "@/components/MediaFill";

function Confirmation() {
  const { order, loading } = useOrder();

  if (loading) return <div className="confirm-wrap" />;

  if (!order) {
    return (
      <div className="confirm-wrap">
        <div className="confirm-card glass">
          <div className="confirm-title" style={{ fontSize: 26 }}>No recent order found</div>
          <p className="confirm-copy">
            Looks like you got here directly. <Link href="/" style={{ color: "#fff", textDecoration: "underline" }}>Return to the store</Link> to place an order.
          </p>
        </div>
      </div>
    );
  }

  const arrival = new Date(order.placedAt);
  arrival.setDate(arrival.getDate() + 4);
  const arrivalEnd = new Date(arrival);
  arrivalEnd.setDate(arrivalEnd.getDate() + 3);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="confirm-wrap">
      <div className="confirm-card glass">
        <div className="confirm-badge">
          <span className="confirm-check">✓</span>
        </div>
        <div className="confirm-title">Order confirmed</div>
        <div className="confirm-copy">
          Thanks, {order.firstName} — your order is being prepared. Pay {money(order.total)} cash when it arrives.
          <br />A confirmation email has been sent to {order.email}
        </div>
        <div className="confirm-stats">
          <div>
            <div className="confirm-stat-label">Order number</div>
            <div className="confirm-stat-value">{order.orderNumber}</div>
          </div>
          <div className="confirm-stat-divider" />
          <div>
            <div className="confirm-stat-label">Estimated arrival</div>
            <div className="confirm-stat-value">{fmt(arrival)} – {fmt(arrivalEnd)}</div>
          </div>
        </div>
      </div>

      <div className="detail-card glass">
        <div className="detail-card-title">Order details</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
          {order.lines.map((l) => (
            <div className="summary-line" key={l.id}>
              <div className="summary-line-swatch"><MediaFill image={l.image} label={l.name} sizes="52px" /></div>
              <div style={{ flex: 1 }}>
                <div className="cart-line-name">{l.name}</div>
                <div className="cart-line-meta">Qty {l.qty}</div>
              </div>
              <div className="cart-line-name">{money(l.subtotal)}</div>
            </div>
          ))}
        </div>
        <div className="summary-divider" style={{ marginBottom: 18 }} />
        <div className="summary-totals" style={{ marginBottom: 18 }}>
          <div className="summary-row"><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{money(order.shippingPrice)}</span></div>
        </div>
        <div className="summary-divider" style={{ marginBottom: 18 }} />
        <div className="summary-grand">
          <div className="summary-grand-label">Total due on delivery</div>
          <div className="summary-grand-value">{money(order.total)}</div>
        </div>
      </div>

      <div className="detail-card glass">
        <div className="detail-card-title">Shipping to</div>
        <div className="ship-to-text">{order.firstName} {order.lastName}<br />{order.address}<br />{order.city}</div>
      </div>

      <div className="confirm-actions">
        <Link href="/" className="pill pill-primary">Continue shopping</Link>
        <Link href={`/order-status?order=${order.id}`} className="pill pill-secondary">View order status</Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="confirm-wrap" />}>
      <Confirmation />
    </Suspense>
  );
}
