import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import { findProduct, SHIPPING_OPTIONS } from "@/lib/products";

type CartLine = { id: string; qty: number };

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, phone, firstName, lastName, address, city, shippingIndex, cart } = body as {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    shippingIndex: number;
    cart: CartLine[];
  };

  if (!email || !phone || !firstName || !lastName || !address || !city || !Array.isArray(cart) || cart.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Courier needs a reachable number for COD; reject obvious junk server-side
  // rather than trusting the client-side check alone.
  if (phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  const shipping = SHIPPING_OPTIONS[shippingIndex] ?? SHIPPING_OPTIONS[0];

  const lines = cart
    .map((line) => {
      const product = findProduct(line.id);
      if (!product) return null;
      const qty = Math.max(1, Math.floor(line.qty));
      return { id: product.id, name: product.name, image: product.image, qty, subtotal: product.price * qty };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  if (lines.length === 0) {
    return NextResponse.json({ error: "Cart contains no valid items" }, { status: 400 });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
  const total = subtotal + shipping.price;
  const id = randomUUID();
  const orderNumber = "#LS-" + Math.floor(10000 + Math.random() * 89999);
  const placedAt = Date.now();

  getDb()
    .prepare(
      `INSERT INTO orders (id, order_number, email, phone, first_name, last_name, address, city, shipping_name, shipping_price, subtotal, total, lines_json, placed_at)
       VALUES (@id, @orderNumber, @email, @phone, @firstName, @lastName, @address, @city, @shippingName, @shippingPrice, @subtotal, @total, @linesJson, @placedAt)`
    )
    .run({
      id,
      orderNumber,
      email,
      phone,
      firstName,
      lastName,
      address,
      city,
      shippingName: shipping.name,
      shippingPrice: shipping.price,
      subtotal,
      total,
      linesJson: JSON.stringify(lines),
      placedAt,
    });

  return NextResponse.json({ id, orderNumber });
}
