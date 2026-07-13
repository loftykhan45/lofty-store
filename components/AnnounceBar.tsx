import { ANNOUNCEMENTS } from "@/lib/products";
import Icon from "@/components/Icon";

export default function AnnounceBar() {
  const items = ANNOUNCEMENTS;
  return (
    <div className="announce-bar" aria-hidden="true">
      <div className="announce-track">
        {[...items, ...items].map((text, i) => (
          <span className="announce-item" key={i}>
            <span className="announce-dot"><Icon name="sparkle" size={11} /></span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
