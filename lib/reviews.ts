import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";

export type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  body: string;
  createdAt: number;
};

export type Summary = { count: number; average: number };

type Row = {
  id: string;
  product_id: string;
  name: string;
  rating: number;
  body: string;
  created_at: number;
};

const toReview = (r: Row): Review => ({
  id: r.id,
  productId: r.product_id,
  name: r.name,
  rating: r.rating,
  body: r.body,
  createdAt: r.created_at,
});

export function reviewsForProduct(productId: string): Review[] {
  const rows = getDb()
    .prepare(
      "SELECT id, product_id, name, rating, body, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC"
    )
    .all(productId) as Row[];
  return rows.map(toReview);
}

/** Every review, newest first — powers the "What customers say" section. */
export function latestReviews(limit = 6): Review[] {
  const rows = getDb()
    .prepare(
      "SELECT id, product_id, name, rating, body, created_at FROM reviews WHERE body != '' ORDER BY created_at DESC LIMIT ?"
    )
    .all(limit) as Row[];
  return rows.map(toReview);
}

export function summaryFor(productId: string): Summary | null {
  const row = getDb()
    .prepare("SELECT COUNT(*) AS count, AVG(rating) AS average FROM reviews WHERE product_id = ?")
    .get(productId) as { count: number; average: number | null };
  // No reviews means no rating. Returning a fabricated default here is exactly
  // the dishonesty this table exists to remove — and a made-up aggregateRating
  // in JSON-LD can get a merchant flagged.
  if (!row || row.count === 0 || row.average === null) return null;
  return { count: row.count, average: Math.round(row.average * 10) / 10 };
}

export type AddResult =
  | { ok: true; review: Review }
  | { ok: false; error: string; status: number };

/**
 * Adds a review, but only if the order really exists and really contained the
 * product. This is what makes "Verified buyer" true.
 */
export function addReview(input: {
  productId: string;
  orderId: string;
  name: string;
  rating: number;
  body: string;
}): AddResult {
  const db = getDb();

  const order = db
    .prepare("SELECT id, lines_json FROM orders WHERE id = ?")
    .get(input.orderId) as { id: string; lines_json: string } | undefined;

  if (!order) {
    return { ok: false, error: "We couldn't find that order.", status: 404 };
  }

  let lines: { id?: string; productId?: string }[] = [];
  try {
    lines = JSON.parse(order.lines_json);
  } catch {
    lines = [];
  }
  // Orders have stored their line product under slightly different keys over
  // time; accept either rather than silently rejecting a genuine buyer.
  const bought = lines.some(
    (l) => l.productId === input.productId || l.id === input.productId
  );
  if (!bought) {
    return {
      ok: false,
      error: "That order doesn't include this product.",
      status: 403,
    };
  }

  const rating = Math.round(Number(input.rating));
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Rating must be between 1 and 5.", status: 400 };
  }

  const name = input.name.trim().slice(0, 60);
  if (name.length < 2) {
    return { ok: false, error: "Please enter your name.", status: 400 };
  }

  const review: Review = {
    id: randomUUID(),
    productId: input.productId,
    name,
    rating,
    body: input.body.trim().slice(0, 600),
    createdAt: Date.now(),
  };

  try {
    db.prepare(
      "INSERT INTO reviews (id, product_id, order_id, name, rating, body, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(
      review.id,
      review.productId,
      input.orderId,
      review.name,
      review.rating,
      review.body,
      review.createdAt
    );
  } catch (e) {
    // The UNIQUE(order_id, product_id) constraint.
    if (String(e).includes("UNIQUE")) {
      return {
        ok: false,
        error: "You've already reviewed this product for that order.",
        status: 409,
      };
    }
    throw e;
  }

  return { ok: true, review };
}
