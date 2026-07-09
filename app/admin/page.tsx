"use client";

import { useEffect, useState, useCallback } from "react";
import { money } from "@/lib/products";
import type { Order } from "@/lib/useOrder";

type AdminOrder = Order & { status: string };

const STATUS_FLOW: Record<string, string | null> = {
  pending: "confirmed",
  confirmed: "shipped",
  shipped: "delivered",
  delivered: null,
  cancelled: null,
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function AdminPage() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load orders");
        return res.json();
      })
      .then(setOrders)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      setOrders((prev) => prev && prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1 className="admin-title">Orders</h1>
        <button className="pill pill-secondary" onClick={load}>Refresh</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {!orders ? (
        <div className="admin-empty">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">No orders yet.</div>
      ) : (
        <div className="admin-table-wrap glass">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>City</th>
                <th>Items</th>
                <th>Total</th>
                <th>Placed</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const next = STATUS_FLOW[o.status];
                return (
                  <tr key={o.id}>
                    <td>
                      <div className="admin-order-number">{o.orderNumber}</div>
                      <div className="admin-order-email">{o.email}</div>
                    </td>
                    <td>{o.firstName} {o.lastName}<div className="admin-order-address">{o.address}</div></td>
                    <td>{o.city}</td>
                    <td>{o.lines.reduce((s, l) => s + l.qty, 0)} item(s)</td>
                    <td>{money(o.total)}</td>
                    <td>{new Date(o.placedAt).toLocaleString()}</td>
                    <td><span className={`status-badge status-${o.status}`}>{STATUS_LABEL[o.status] ?? o.status}</span></td>
                    <td>
                      <div className="admin-actions">
                        {next && (
                          <button
                            className="pill pill-primary admin-action-btn"
                            disabled={updating === o.id}
                            onClick={() => setStatus(o.id, next)}
                          >
                            Mark {STATUS_LABEL[next]}
                          </button>
                        )}
                        {o.status !== "cancelled" && o.status !== "delivered" && (
                          <button
                            className="admin-cancel-btn"
                            disabled={updating === o.id}
                            onClick={() => setStatus(o.id, "cancelled")}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
