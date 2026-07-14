"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

type Line = { id: string; name: string };

/**
 * Shown on the order-status page, where a real buyer arrives holding their own
 * order id. That id is what the server checks the review against, so only
 * someone who actually bought the product can review it.
 */
export default function ReviewForm({
  orderId,
  lines,
  buyerName,
}: {
  orderId: string;
  lines: Line[];
  buyerName: string;
}) {
  const [productId, setProductId] = useState(lines[0]?.id ?? "");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState(buyerName);
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  if (lines.length === 0) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }

    setState("saving");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, orderId, name, rating, body }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Something went wrong. Please try again.");
      setState("idle");
      return;
    }
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="review-done glass">
        <Icon name="check" size={18} />
        <div>
          <strong>Thank you.</strong> Your review is live on the product page.
        </div>
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <form className="review-form glass" onSubmit={submit}>
      <h2 className="review-form-title">Review your purchase</h2>
      <p className="review-form-sub">
        Only customers who actually bought the product can review it — so your
        review shows as a verified purchase.
      </p>

      {lines.length > 1 && (
        <label className="field">
          <span className="field-label">Which product?</span>
          <select
            className="field-input"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            {lines.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="field">
        <span className="field-label">Your rating</span>
        {/* Radio inputs, not clickable spans: this stays keyboard-operable and
            announces properly to a screen reader. */}
        <div className="star-input" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className={`star ${shown >= n ? "on" : ""}`}
              onMouseEnter={() => setHover(n)}
            >
              <input
                type="radio"
                name="rating"
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
              />
              <span aria-hidden="true">★</span>
              <span className="sr-only">{n} star{n > 1 ? "s" : ""}</span>
            </label>
          ))}
        </div>
      </div>

      <label className="field">
        <span className="field-label">Your name</span>
        <input
          className="field-input"
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />
      </label>

      <label className="field">
        <span className="field-label">Your review <span className="field-optional">(optional)</span></span>
        <textarea
          className="field-input review-textarea"
          value={body}
          maxLength={600}
          rows={4}
          placeholder="How was the product? Did it arrive on time?"
          onChange={(e) => setBody(e.target.value)}
        />
      </label>

      {error && <div className="field-error" role="alert">{error}</div>}

      <button className="pill pill-primary" type="submit" disabled={state === "saving"}>
        {state === "saving" ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
