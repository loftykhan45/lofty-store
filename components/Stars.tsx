/** Star row. Server-safe (no "use client") so product pages stay static HTML. */
export default function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.round(rating);
  return (
    <span className="stars" style={{ fontSize: size }} aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= full ? "star-on" : "star-off"} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}
