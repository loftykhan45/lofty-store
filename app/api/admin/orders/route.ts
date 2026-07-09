import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

type OrderRow = {
  id: string;
  order_number: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  shipping_name: string;
  shipping_price: number;
  subtotal: number;
  total: number;
  lines_json: string;
  placed_at: number;
  status: string;
};

export async function GET() {
  const rows = getDb().prepare("SELECT * FROM orders ORDER BY placed_at DESC").all() as OrderRow[];

  const orders = rows.map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    address: row.address,
    city: row.city,
    shippingName: row.shipping_name,
    shippingPrice: row.shipping_price,
    subtotal: row.subtotal,
    total: row.total,
    lines: JSON.parse(row.lines_json),
    placedAt: row.placed_at,
    status: row.status,
  }));

  return NextResponse.json(orders);
}
