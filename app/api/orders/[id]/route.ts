import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = getDb().prepare("SELECT * FROM orders WHERE id = ?").get(id) as
    | {
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
      }
    | undefined;

  if (!row) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
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
  });
}
