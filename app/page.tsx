"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/StoreProvider";
import { PRODUCTS, CATEGORIES, TESTIMONIALS, money, whatsappProductLink, whatsappLink, type Product } from "@/lib/products";
import MediaFill from "@/components/MediaFill";

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
    return (
      <div className="product-card glass" key={p.id}>
        <div className="product-photo"><MediaFill image={p.image} label={p.name} /></div>
        <div>
          <div className="product-cat">{p.cat}</div>
          <div className="product-name">{p.name}</div>
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
            <MediaFill image="/img/hero.jpg" label="Lofty Store mobile accessories" sizes="(max-width: 900px) 100vw, 560px" fit="contain" />
          </div>
        </div>
      </section>

      <div className="search-wrap" ref={searchWrapRef}>
        <div className="search-box glass">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="search"
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

      <section className="section" id="shop">
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
          <h2 className="section-title">Featured products</h2>
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

      <section className="section" id="story">
        <h2 className="section-title">What customers say</h2>
        <div className="testimonial-grid">
          {TESTIMONIALS.map((t) => (
            <div className="testimonial-card glass" key={t.name}>
              <div className="testimonial-quote">&ldquo;{t.quote}&rdquo;</div>
              <div className="testimonial-name">— {t.name}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div>© 2026 Lofty Store — mobile accessories, done right.</div>
        <a className="footer-whatsapp" href={whatsappLink("Hi Lofty Store! I have a question.")} target="_blank" rel="noopener noreferrer">
          Chat with us on WhatsApp
        </a>
      </footer>
    </>
  );
}
