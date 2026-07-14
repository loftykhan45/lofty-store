"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/StoreProvider";
import { PRODUCTS, CATEGORIES, TESTIMONIALS, money, whatsappProductLink, whatsappLink, type Product } from "@/lib/products";
import Link from "next/link";
import MediaFill from "@/components/MediaFill";
import Icon from "@/components/Icon";

const MAX_SUGGESTIONS = 6;

export default function LandingPage() {
  const { cart, addToCart, setQty, activeCategory, setActiveCategory } = useStore();
  const [query, setQuery] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  // Live suggestions — searches the whole catalog (ignores any active
  // category filter) so a match appears the instant you type, without
  // needing to scroll down to the (possibly filtered) products grid.
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
    ).slice(0, MAX_SUGGESTIONS);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function goToSuggestion(p: Product) {
    setQuery(p.name);
    setActiveCategory(null);
    setSuggestionsOpen(false);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesCategory = !activeCategory || p.cat === activeCategory;
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  // Group by model series (e.g. every "iPhone 15" variant falls under one
  // "iPhone 15" heading) so each variant card visibly belongs to its model.
  // Products without a series (generic accessories) go in a single ungrouped bucket.
  const productGroups = useMemo(() => {
    const groups = new Map<string, Product[]>();
    for (const p of filteredProducts) {
      const key = p.series ?? "";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(p);
    }
    return groups;
  }, [filteredProducts]);
  const isGrouped = [...productGroups.keys()].some((k) => k !== "");

  function renderProductCard(p: Product) {
    const qty = cart[p.id] || 0;
    const isCase = p.cat === "Cases";
    return (
      <div className="product-card glass" key={p.id}>
        {/* Link the photo + name to the product page. This is the internal
            linking that lets crawl authority reach all 122 product URLs. */}
        <Link href={`/product/${p.id}`} className="product-link">
          <div className={`product-photo${isCase ? " product-photo-portrait" : ""}`}>
            <MediaFill image={p.image} label={p.name} fit={isCase ? "contain" : "cover"} />
          </div>
        </Link>
        <div>
          <div className="product-cat">{p.cat}</div>
          <Link href={`/product/${p.id}`} className="product-name product-name-link">{p.name}</Link>
          <div className="product-price-row">
            {money(p.price)}
            {qty > 0 ? (
              <div className="qty-stepper">
                <button type="button" aria-label={`Decrease ${p.name} quantity`} onClick={() => setQty(p.id, qty - 1)}>−</button>
                <span>{qty}</span>
                <button type="button" aria-label={`Increase ${p.name} quantity`} onClick={() => setQty(p.id, qty + 1)}>+</button>
              </div>
            ) : (
              <button className="add-btn" onClick={() => addToCart(p.id)}>Add</button>
            )}
          </div>
          <a
            className="whatsapp-btn-sm"
            href={whatsappProductLink(p, qty || 1)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  function scrollToProducts() {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <section className="hero-section">
        <div className="hero glass">
          <div>
            <div className="hero-eyebrow">Mobile accessories, refined</div>
            <h1 className="hero-title">Every day carry, elevated.</h1>
            <p className="hero-body">Cases, power banks, cables, screen protection, car mounts and airbuds — one clean aesthetic across your whole setup.</p>
            <div className="hero-actions">
              <button className="pill pill-primary" onClick={scrollToProducts}>Shop Now</button>
              <button
                className="pill pill-secondary"
                onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              >
                Our Story
              </button>
            </div>
          </div>
          <div className="hero-image">
            <MediaFill image="/img/hero-17pro.png" label="iPhone 17 Pro and 17 Pro Max" sizes="(max-width: 900px) 100vw, 460px" fit="contain" />
          </div>
        </div>
      </section>

      <div className="search-wrap" ref={searchWrapRef}>
        <div className="search-box glass">
          <span className="search-icon" aria-hidden="true"><Icon name="search" size={18} /></span>
          <input
            className="search-input"
            type="search"
            name="q"
            aria-label="Search products"
            placeholder="Search products — try “case” or “charger”"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSuggestionsOpen(true);
            }}
            onFocus={() => setSuggestionsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSuggestionsOpen(false);
              if (e.key === "Enter") {
                setSuggestionsOpen(false);
                document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
          />
          {query && <button className="search-clear" onClick={() => { setQuery(""); setSuggestionsOpen(false); }}>✕</button>}
        </div>

        {suggestionsOpen && query.trim() && (
          <div className="search-suggestions glass">
            {suggestions.length === 0 ? (
              <div className="search-suggestion-empty">No products match “{query}”.</div>
            ) : (
              suggestions.map((p) => (
                <button
                  key={p.id}
                  className="search-suggestion-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goToSuggestion(p)}
                >
                  <div className="search-suggestion-thumb"><MediaFill image={p.image} label={p.name} sizes="36px" /></div>
                  <div className="search-suggestion-text">
                    <div className="search-suggestion-name">{p.name}</div>
                    <div className="search-suggestion-cat">{p.cat}</div>
                  </div>
                  <div className="search-suggestion-price">{money(p.price)}</div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Feature-Rich Showcase: the value props were previously buried in the
          scrolling marquee. Promoting them to real blocks is the core of the
          pattern — showcase the reasons to buy, don't just list products. */}
      <section className="section feature-section" aria-label="Why shop with Lofty">
        <div className="feature-blocks">
          {[
            { icon: "cash", title: "Cash on Delivery", body: "Pay in cash when your order reaches your door. No card needed." },
            { icon: "truck", title: "Fast nationwide delivery", body: "2–7 days to every city in Pakistan, tracked the whole way." },
            { icon: "shield", title: "Genuine accessories", body: "Sourced from real brands — never counterfeit, always tested." },
            { icon: "refresh", title: "7-day easy replacement", body: "Not the right fit? Swap it within a week, no questions." },
          ].map((f) => (
            <div className="feature-block glass" key={f.title}>
              <div className="feature-icon" aria-hidden="true">
                <Icon name={f.icon as "cash" | "truck" | "shield" | "refresh"} size={22} />
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-body">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="shop">
        <div className="section-kicker">Browse</div>
        <h2 className="section-title">Shop by category</h2>
        <div className="cat-grid">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              className={`cat-card glass ${activeCategory === cat.name ? "active" : ""}`}
              onClick={() => {
                setActiveCategory(activeCategory === cat.name ? null : cat.name);
                scrollToProducts();
              }}
            >
              <div className="cat-image"><MediaFill image={cat.image} label={cat.name} sizes="(max-width: 480px) 45vw, (max-width: 900px) 22vw, 260px" /></div>
              <div className="cat-name">{cat.name}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="section" id="products">
        <div className="section-header">
          <div>
            <div className="section-kicker">Catalog</div>
            <h2 className="section-title">Featured products</h2>
          </div>
          {(activeCategory || query) && (
            <button
              className="section-link"
              onClick={() => {
                setActiveCategory(null);
                setQuery("");
              }}
            >
              Clear filters ✕
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="search-empty">No products match “{query}”.</div>
        ) : isGrouped ? (
          <div className="product-groups">
            {[...productGroups.entries()].map(([series, items]) => (
              <div className="product-group" key={series || "other"}>
                {series && <h3 className="product-group-title">{series}</h3>}
                <div className="product-grid">{items.map(renderProductCard)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="product-grid">{filteredProducts.map(renderProductCard)}</div>
        )}
      </section>

      <section className="section" aria-label="Order on WhatsApp">
        <div className="promo-band glass">
          <div className="promo-band-copy">
            <div className="section-kicker">Prefer to chat?</div>
            <h2 className="promo-band-title">Order on WhatsApp in under a minute.</h2>
            <p className="promo-band-body">
              Send us the product you want and we&apos;ll confirm your order, price and delivery
              date right there. Cash on Delivery, all over Pakistan.
            </p>
          </div>
          <a
            className="whatsapp-btn promo-band-cta"
            href={whatsappLink("Hi Lofty Store! I'd like to place an order.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>

      <section className="section" id="story">
        <div className="section-kicker">Reviews</div>
        <h2 className="section-title">What customers say</h2>
        <div className="testimonial-grid">
          {TESTIMONIALS.map((t) => (
            <div className="testimonial-card glass" key={t.name}>
              <div className="testimonial-stars" aria-hidden="true">★★★★★</div>
              <div className="testimonial-quote">&ldquo;{t.quote}&rdquo;</div>
              <div className="testimonial-footer">
                <div className="testimonial-avatar" aria-hidden="true">{t.name.charAt(0)}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-verified"><Icon name="check" size={13} /> Verified buyer</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-col footer-brand-col">
              <div className="footer-brand">Lofty Store</div>
              <p className="footer-blurb">Genuine mobile accessories for every iPhone — cases, power banks, screen protection, car mounts and audio, delivered across Pakistan.</p>
              <a className="footer-whatsapp-btn" href={whatsappLink("Hi Lofty Store! I have a question.")} target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Shop</div>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  className="footer-link"
                  onClick={() => {
                    setActiveCategory(cat.name);
                    scrollToProducts();
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Support</div>
              <a
                className="footer-link"
                href={whatsappLink("Hi Lofty Store! I have a question.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact us
              </a>
              <div className="footer-static">Cash on Delivery</div>
              <div className="footer-static">7-day easy replacement</div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Lofty Store — mobile accessories, done right.</span>
            <span>Made for iPhone owners across Pakistan</span>
          </div>
        </div>
      </footer>
    </>
  );
}
