import { NextRequest, NextResponse } from "next/server";
import { addReview, latestReviews, reviewsForProduct, summaryFor } from "@/lib/reviews";
import { findProduct } from "@/lib/products";

export async function GET(req: NextRequest) {
  // ?latest=N powers the homepage "What customers say" section.
  const latest = req.nextUrl.searchParams.get("latest");
  if (latest !== null) {
    const n = Math.min(12, Math.max(1, Number(latest) || 6));
    return NextResponse.json({ reviews: latestReviews(n) });
  }

  const productId = req.nextUrl.searchParams.get("product");
  if (!productId) {
    return NextResponse.json({ error: "Missing product" }, { status: 400 });
  }
  return NextResponse.json({
    reviews: reviewsForProduct(productId),
    summary: summaryFor(productId),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, orderId, name, rating, body: text } = body as {
    productId?: string;
    orderId?: string;
    name?: string;
    rating?: number;
    body?: string;
  };

  if (!productId || !orderId || !name || rating === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!findProduct(productId)) {
    return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  }

  const result = addReview({
    productId,
    orderId,
    name,
    rating,
    body: text ?? "",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ review: result.review });
}
