import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const VALID_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const status = body?.status;

  if (typeof status !== "string" || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const result = getDb().prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
  if (result.changes === 0) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
