// Landing page: category filter, product grid, cart drawer wiring
let activeCategory = null;

function renderCategories() {
  const grid = document.getElementById("catGrid");
  grid.innerHTML = CATEGORIES.map((cat) => `
    <button class="cat-card glass ${activeCategory === cat.name ? "active" : ""}" data-cat="${cat.name}">
      <div class="cat-image" style="background:${stripe(cat.hue)}"><span class="ig-label">${cat.name}</span></div>
      <div class="cat-name">${cat.name}</div>
    </button>
  `).join("");
  grid.querySelectorAll(".cat-card").forEach((el) => {
    el.addEventListener("click", () => {
      const cat = el.dataset.cat;
      activeCategory = activeCategory === cat ? null : cat;
      renderCategories();
      renderProducts();
    });
  });
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const cart = getCart();
  const list = PRODUCTS.filter((p) => !activeCategory || p.cat === activeCategory);
  grid.innerHTML = list.map((p) => {
    const inCart = !!cart[p.id];
    return `
    <div class="product-card glass">
      <div class="product-photo" style="background:${stripe(p.hue)}"><span class="swatch-label">product photo</span></div>
      <div>
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price-row">
          ${money(p.price)}
          <button class="add-btn ${inCart ? "in-cart" : ""}" data-id="${p.id}">${inCart ? `In cart (${cart[p.id]})` : "Add"}</button>
        </div>
      </div>
    </div>`;
  }).join("");
  grid.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });

  document.getElementById("filterLabel").textContent = activeCategory ? "Clear filter ✕" : "View all →";
}

document.getElementById("filterLabel").addEventListener("click", () => {
  if (activeCategory) {
    activeCategory = null;
    renderCategories();
    renderProducts();
  }
});

function renderTestimonials() {
  document.getElementById("testimonialGrid").innerHTML = TESTIMONIALS.map((t) => `
    <div class="testimonial-card glass">
      <div class="testimonial-quote">&ldquo;${t.quote}&rdquo;</div>
      <div class="testimonial-name">— ${t.name}</div>
    </div>
  `).join("");
}

function renderInstagram() {
  document.getElementById("igGrid").innerHTML = IG_HUES.map((hue) => `
    <div class="ig-tile" style="background:${stripe(hue)}"><span class="ig-label">@loftystore</span></div>
  `).join("");
}

function renderCartDrawer() {
  const lines = cartLines();
  const badge = document.getElementById("cartBadge");
  const count = cartCount();
  badge.textContent = count;
  badge.classList.toggle("hidden", count === 0);

  const body = document.getElementById("cartBody");
  if (lines.length === 0) {
    body.innerHTML = `<div class="cart-empty">Your cart is empty. Add something you'll love.</div>`;
    return;
  }
  body.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:14px;">
      ${lines.map((line) => `
        <div class="cart-line">
          <div class="cart-line-swatch" style="background:${stripe(line.product.hue)}"></div>
          <div style="flex:1;">
            <div class="cart-line-name">${line.product.name}</div>
            <div class="cart-line-meta">Qty ${line.qty} · ${money(line.subtotal)}</div>
          </div>
          <button class="cart-line-remove" data-id="${line.product.id}">Remove</button>
        </div>
      `).join("")}
    </div>
    <div class="cart-total-row">
      <div class="cart-total-label">Total</div>
      <div class="cart-total-value">${money(cartSubtotal())}</div>
    </div>
    <a href="checkout.html" class="pill pill-primary cart-checkout-btn">Checkout</a>
  `;
  body.querySelectorAll(".cart-line-remove").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id));
  });
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
}
function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}

document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
menuToggle.addEventListener("click", () => mobileMenu.classList.toggle("open"));
mobileMenu.addEventListener("click", () => mobileMenu.classList.remove("open"));

document.addEventListener("cart:change", renderCartDrawer);
document.addEventListener("cart:change", renderProducts);

renderCategories();
renderProducts();
renderTestimonials();
renderInstagram();
renderCartDrawer();
