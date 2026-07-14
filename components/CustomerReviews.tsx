"use client";

import { useEffect, useState } from "react";
import { findProduct } from "@/lib/products";
import Icon from "@/components/Icon";
import Stars from "@/components/Stars";

type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  body: string;
  createdAt: number;
};

/**
 * Replaces the invented testimonials. These are real reviews written by people
 * who really placed an order — and if nobody has reviewed anything yet, the
 * section renders nothing at all rather than inventing social proof.
 */
export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    fetch("/api/reviews?latest=6")
      .then((r) => (r.ok ? r.json() : { reviews: [] }))
      .then((d) => setReviews(d.reviews ?? []))
      .catch(() => setReviews([]));
  }, []);

  // null = still loading, [] = genuinely none. Render nothing either way; an
  // empty "What customers say" heading over a blank space looks broken.
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="section" id="story">
      <div className="section-kicker">Reviews</div>
      <h2 className="section-title">What customers say</h2>
      <div className="testimonial-grid">
        {reviews.map((r) => {
          const product = findProduct(r.productId);
          return (
            <div className="testimonial-card glass" key={r.id}>
              <Stars rating={r.rating} size={15} />
              {r.body && <div className="testimonial-quote">&ldquo;{r.body}&rdquo;</div>}
              <div className="testimonial-footer">
                <div className="testimonial-avatar" aria-hidden="true">
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="testimonial-name">{r.name}</div>
                  <div className="testimonial-verified">
                    <Icon name="check" size={13} /> Verified purchase
                    {product ? ` · ${product.name}` : ""}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
