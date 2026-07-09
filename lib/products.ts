export type Product = {
  id: string;
  name: string;
  cat: string;
  price: number;
  image: string;
};

// Prices in PKR, set to realistic Pakistani retail market rates for these
// product categories (not a currency conversion of a placeholder USD price).
export const PRODUCTS: Product[] = [
  { id: "aerocase-clear", name: "AeroCase Clear", cat: "Case", price: 450, image: "/img/category-cases.jpg" },
  { id: "magflow-charger", name: "MagFlow Charger", cat: "Charging", price: 1800, image: "/img/category-charging.jpg" },
  { id: "armorglass-pro", name: "ArmorGlass Pro", cat: "Protection", price: 250, image: "/img/category-protection.png" },
  { id: "drivemount-x", name: "DriveMount X", cat: "Car & Travel", price: 800, image: "/img/category-car.jpg" },
  { id: "powercell-10k", name: "PowerCell 10K", cat: "Charging", price: 2800, image: "/img/product-powercell.jpg" },
  { id: "braidlink-cable", name: "BraidLink Cable", cat: "Charging", price: 350, image: "/img/product-cable.jpg" },
];

export const CATEGORIES = [
  { name: "Cases", image: "/img/category-cases.jpg" },
  { name: "Charging", image: "/img/category-charging.jpg" },
  { name: "Protection", image: "/img/category-protection.png" },
  { name: "Car & Travel", image: "/img/category-car.jpg" },
];

export const TESTIMONIALS = [
  { quote: "The MagFlow charger snaps on perfectly and the glass finish looks incredible on my desk.", name: "Priya R." },
  { quote: "Ordered a case and screen protector — both fit like factory parts. Shipping was fast too.", name: "Marcus T." },
  { quote: "Finally a car mount that doesn't wobble on bumpy roads. Worth every cent.", name: "Elena V." },
];

export const SHIPPING_OPTIONS = [
  { name: "Standard Shipping", eta: "5–7 business days", price: 200 },
  { name: "Express Shipping", eta: "2–3 business days", price: 450 },
];

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function money(n: number): string {
  return "Rs " + n.toFixed(n % 1 === 0 ? 0 : 2);
}

// WhatsApp ordering — number in E.164 without the leading "+" (wa.me format).
export const WHATSAPP_NUMBER = "923236526569";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappProductLink(product: Product, qty: number = 1): string {
  const message = `Hi Lofty Store! I'd like to order:\n${qty} x ${product.name} — ${money(product.price * qty)}`;
  return whatsappLink(message);
}

export const ANNOUNCEMENTS = [
  "Cash on Delivery available",
  "Fast delivery all over Pakistan",
  "Genuine accessories, always",
  "7-day easy replacement",
];
