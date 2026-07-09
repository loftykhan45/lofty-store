import { ANNOUNCEMENTS } from "@/lib/products";

export default function AnnounceBar() {
  const items = ANNOUNCEMENTS;
  return (
    <div className="announce-bar" aria-hidden="true">
      <div className="announce-track">
        {[...items, ...items].map((text, i) => (
          <span className="announce-item" key={i}>
            <span className="announce-dot">✦</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
