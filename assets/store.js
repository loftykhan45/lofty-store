// Lofty Store — shared catalog + cart (localStorage-backed, no backend yet)
const CART_KEY = "lofty_cart";
const ORDER_KEY = "lofty_last_order";

function stripe(hue) {
  return `linear-gradient(135deg, hsl(${hue} 55% 32%) 0%, hsl(${hue} 45% 16%) 100%)`;
}

// Prices in PKR, converted from the original USD design at ~278 PKR/USD (Jul 2026 rate), rounded to nearest 50.
const PRODUCTS = [
  { id: "aerocase-clear", name: "AeroCase Clear", cat: "Case", price: 6650, hue: 180 },
  { id: "magflow-charger", name: "MagFlow Charger", cat: "Charging", price: 10850, hue: 250 },
  { id: "armorglass-pro", name: "ArmorGlass Pro", cat: "Protection", price: 5300, hue: 320 },
  { id: "drivemount-x", name: "DriveMount X", cat: "Car & Travel", price: 8050, hue: 150 },
  { id: "powercell-10k", name: "PowerCell 10K", cat: "Charging", price: 12500, hue: 260 },
  { id: "braidlink-cable", name: "BraidLink Cable", cat: "Charging", price: 4450, hue: 200 },
];

const CATEGORIES = [
  { name: "Cases", hue: 180 },
  { name: "Charging", hue: 250 },
  { name: "Protection", hue: 320 },
  { name: "Car & Travel", hue: 150 },
];

const TESTIMONIALS = [
  { quote: "The MagFlow charger snaps on perfectly and the glass finish looks incredible on my desk.", name: "Priya R." },
  { quote: "Ordered a case and screen protector — both fit like factory parts. Shipping was fast too.", name: "Marcus T." },
  { quote: "Finally a car mount that doesn't wobble on bumpy roads. Worth every cent.", name: "Elena V." },
];

const IG_HUES = [180, 250, 320, 150, 260, 200];

const SHIPPING_OPTIONS = [
  { name: "Standard Shipping", eta: "5–7 business days", price: 1400 },
  { name: "Express Shipping", eta: "2–3 business days", price: 4150 },
];

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

function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
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
