"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export type OrderLine = { id: string; name: string; image: string; qty: number; subtotal: number };

export type Order = {
  id: string;
  orderNumber: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  shippingName: string;
  shippingPrice: number;
  subtotal: number;
  total: number;
  lines: OrderLine[];
  placedAt: number;
};

export function useOrder() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    fetch(`/api/orders/${orderId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [orderId]);

  return { order, loading };
}
