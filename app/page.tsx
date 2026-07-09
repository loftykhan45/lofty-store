"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/StoreProvider";
import { PRODUCTS, CATEGORIES, TESTIMONIALS, money } from "@/lib/products";
import MediaFill from "@/components/MediaFill";

export default function LandingPage() {
  const { cart, addToCart, activeCategory, setActiveCategory } = useStore();
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesCategory = !activeCategory || p.cat === activeCategory;
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

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
            <p className="hero-body">Cases, chargers, screen protection and car mounts — one clean aesthetic across your whole setup.</p>
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
            <MediaFill image="/img/hero.jpg" label="Lofty Store mobile accessories" sizes="(max-width: 900px) 100vw, 560px" />
          </div>
        </div>
      </section>

      <div className="search-wrap">
        <div className="search-box glass">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="search"
            placeholder="Search products — try “case” or “charger”"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && <button className="search-clear" onClick={() => setQuery("")}>✕</button>}
        </div>
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
        ) : (
          <div className="product-grid">
            {filteredProducts.map((p) => {
              const inCart = !!cart[p.id];
              return (
                <div className="product-card glass" key={p.id}>
                  <div className="product-photo"><MediaFill image={p.image} label={p.name} /></div>
                  <div>
                    <div className="product-cat">{p.cat}</div>
                    <div className="product-name">{p.name}</div>
                    <div className="product-price-row">
                      {money(p.price)}
                      <button className={`add-btn ${inCart ? "in-cart" : ""}`} onClick={() => addToCart(p.id)}>
                        {inCart ? `In cart (${cart[p.id]})` : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

      <footer className="site-footer">© 2026 Lofty Store — mobile accessories, done right.</footer>
    </>
  );
}
