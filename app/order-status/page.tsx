"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useOrder } from "@/lib/useOrder";
import { money } from "@/lib/products";
import MediaFill from "@/components/MediaFill";

const STAGE_MINUTES = [0, 1, 5, 15];
const STAGES = [
  { title: "Order placed", desc: "We've received your order and it's confirmed." },
  { title: "Preparing your order", desc: "Your items are being picked and packed." },
  { title: "Out for delivery", desc: "Your order has left the warehouse and is on its way." },
  { title: "Delivered", desc: "Handed to you — pay the rider in cash." },
];

function formatTime(ms: number) {
  return new Date(ms).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function OrderStatus() {
  const { order, loading } = useOrder();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <div className="confirm-wrap" />;

  if (!order) {
    return (
      <div className="confirm-wrap">
        <div className="confirm-card glass">
          <div className="confirm-title" style={{ fontSize: 26 }}>No recent order found</div>
          <p className="confirm-copy">
            Place an order to see its status here. <Link href="/" style={{ color: "#fff", textDecoration: "underline" }}>Return to the store</Link>.
          </p>
        </div>
      </div>
    );
  }

  const elapsedMinutes = (now - order.placedAt) / 60000;
  let stageIdx = 0;
  STAGE_MINUTES.forEach((m, i) => { if (elapsedMinutes >= m) stageIdx = i; });

  return (
    <div className="confirm-wrap">
      <div className="confirm-card glass" style={{ textAlign: "left", padding: 36 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 26, flexWrap: "wrap" }}>
          <div>
            <div className="confirm-stat-label">Order number</div>
            <div className="confirm-stat-value" style={{ fontSize: 18 }}>{order.orderNumber}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="confirm-stat-label">Total due on delivery</div>
            <div className="confirm-stat-value" style={{ fontSize: 18 }}>{money(order.total)}</div>
          </div>
        </div>
        <div className="status-timeline">
          {STAGES.map((stage, i) => {
            const state = i < stageIdx ? "done" : i === stageIdx ? "current" : "pending";
            const stageTime = order.placedAt + STAGE_MINUTES[i] * 60000;
            return (
              <div className={`status-step ${state}`} key={stage.title}>
                {i < STAGES.length - 1 && <div className="status-line" />}
                <div className="status-dot">{state === "done" ? "✓" : i + 1}</div>
                <div className="status-body">
                  <div className="status-title">{stage.title}</div>
                  <div className="status-desc">{stage.desc}</div>
                  {state !== "pending" && <div className="status-time">{formatTime(stageTime)}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="detail-card glass">
        <div className="detail-card-title">Items</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
      </div>

      <div className="detail-card glass">
        <div className="detail-card-title">Shipping to</div>
        <div className="ship-to-text">{order.firstName} {order.lastName}<br />{order.address}<br />{order.city}</div>
      </div>

      <div className="confirm-actions">
        <Link href="/" className="pill pill-primary">Continue shopping</Link>
      </div>
    </div>
  );
}

export default function OrderStatusPage() {
  return (
    <Suspense fallback={<div className="confirm-wrap" />}>
      <OrderStatus />
    </Suspense>
  );
}
