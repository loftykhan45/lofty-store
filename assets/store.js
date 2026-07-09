// Lofty Store — shared catalog + cart (localStorage-backed, no backend yet)
const CART_KEY = "lofty_cart";
const ORDER_KEY = "lofty_last_order";
const WHATSAPP_NUMBER = "923001234567";

function stripe(hue) {
  return `linear-gradient(135deg, hsl(${hue} 55% 32%) 0%, hsl(${hue} 45% 16%) 100%)`;
}

// Prices in PKR, set to realistic Pakistani retail market rates for generic/unbranded mobile accessories.
// image: null means no verified real photo was found yet — falls back to a gradient swatch.
const PRODUCTS = [
  { id: "aerocase-clear", name: "AeroCase Clear", cat: "Case", price: 450, hue: 180, image: "assets/img/category-cases.jpg", rating: 4.8, reviews: 156, badge: "Bestseller" },
  { id: "magflow-charger", name: "MagFlow Charger", cat: "Charging", price: 1800, hue: 250, image: "assets/img/category-charging.jpg", rating: 4.6, reviews: 98, badge: "In Stock" },
  { id: "armorglass-pro", name: "ArmorGlass Pro", cat: "Protection", price: 250, hue: 320, image: "assets/img/category-protection.png", rating: 4.9, reviews: 212, badge: "Popular" },
  { id: "drivemount-x", name: "DriveMount X", cat: "Car & Travel", price: 800, hue: 150, image: "assets/img/category-car.jpg", rating: 4.5, reviews: 64, badge: "In Stock" },
  { id: "powercell-10k", name: "PowerCell 10K", cat: "Charging", price: 2800, hue: 260, image: "assets/img/product-powercell.jpg", rating: 4.7, reviews: 87, badge: "In Stock" },
  { id: "braidlink-cable", name: "BraidLink Cable", cat: "Charging", price: 350, hue: 200, image: "assets/img/product-cable.jpg", rating: 4.8, reviews: 143, badge: "Bestseller" },
];

const CATEGORIES = [
  { name: "Cases", hue: 180, image: "assets/img/category-cases.jpg" },
  { name: "Charging", hue: 250, image: "assets/img/category-charging.jpg" },
  { name: "Protection", hue: 320, image: "assets/img/category-protection.png" },
  { name: "Car & Travel", hue: 150, image: "assets/img/category-car.jpg" },
];

const TESTIMONIALS = [
  { quote: "The MagFlow charger snaps on perfectly and the glass finish looks incredible on my desk.", name: "Priya R.", rating: 5 },
  { quote: "Ordered a case and screen protector — both fit like factory parts. Shipping was fast too.", name: "Marcus T.", rating: 5 },
  { quote: "Finally a car mount that doesn't wobble on bumpy roads. Worth every cent.", name: "Elena V.", rating: 4 },
];

const SHIPPING_OPTIONS = [
  { name: "Standard Shipping", eta: "5–7 business days", price: 200 },
  { name: "Express Shipping", eta: "2–3 business days", price: 450 },
];

function mediaFill(image, hue, label) {
  if (image) {
    return `<img src="${image}" alt="${label}" loading="lazy" decoding="async" style="width:100%; height:100%; object-fit:cover;">`;
  }
  return `<span class="swatch-label" style="background:${stripe(hue)}; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">${label}</span>`;
}

function starRow(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function whatsappLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function whatsappProductLink(product, qty) {
  return whatsappLink(`Hi! I'd like to order ${qty} x ${product.name} (${money(product.price)} each) from Lofty Store.`);
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}

function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  document.dispatchEvent(new CustomEvent("cart:change", { detail: cart }));
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + qty;
  setCart(cart);
}

function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  setCart(cart);
}

function clearCart() {
  setCart({});
}

function cartLines() {
  const cart = getCart();
  return Object.keys(cart)
    .map((id) => {
      const product = findProduct(id);
      if (!product) return null;
      const qty = cart[id];
      return { product, qty, subtotal: product.price * qty };
    })
    .filter(Boolean);
}

function cartCount() {
  const cart = getCart();
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function cartSubtotal() {
  return cartLines().reduce((sum, line) => sum + line.subtotal, 0);
}

function money(n) {
  return "Rs " + n.toFixed(n % 1 === 0 ? 0 : 2);
}

function saveLastOrder(order) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

function loadLastOrder() {
  try {
    return JSON.parse(localStorage.getItem(ORDER_KEY));
  } catch {
    return null;
  }
}
