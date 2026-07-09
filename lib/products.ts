export type Product = {
  id: string;
  name: string;
  cat: string;
  price: number;
  image: string;
  series?: string;
};

// Prices in PKR, set to realistic Pakistani retail market rates for these
// product categories (not a currency conversion of a placeholder USD price).
export const PRODUCTS: Product[] = [
  { id: "aerocase-clear", name: "AeroCase Clear", cat: "Cases", price: 450, image: "/img/category-cases.jpg" },
  { id: "magflow-charger", name: "MagFlow Charger", cat: "Charging", price: 1800, image: "/img/category-charging.jpg" },
  { id: "armorglass-pro", name: "ArmorGlass Pro", cat: "Protection", price: 250, image: "/img/category-protection.png" },
  { id: "drivemount-x", name: "DriveMount X", cat: "Car & Travel", price: 800, image: "/img/category-car.jpg" },
  { id: "powercell-10k", name: "PowerCell 10K", cat: "Charging", price: 2800, image: "/img/product-powercell.jpg" },
  { id: "braidlink-cable", name: "BraidLink Cable", cat: "Charging", price: 350, image: "/img/product-cable.jpg" },
  ...(
    [
      ["iPhone X", 350, "iPhone X"],
      ["iPhone XR", 370, "iPhone X"],
      ["iPhone XS", 400, "iPhone X"],
      ["iPhone XS Max", 430, "iPhone X"],
      ["iPhone 11", 390, "iPhone 11"],
      ["iPhone 11 Pro", 450, "iPhone 11"],
      ["iPhone 11 Pro Max", 480, "iPhone 11"],
      ["iPhone 12 mini", 400, "iPhone 12"],
      ["iPhone 12", 420, "iPhone 12"],
      ["iPhone 12 Pro", 480, "iPhone 12"],
      ["iPhone 12 Pro Max", 510, "iPhone 12"],
      ["iPhone 13 mini", 430, "iPhone 13"],
      ["iPhone 13", 450, "iPhone 13"],
      ["iPhone 13 Pro", 510, "iPhone 13"],
      ["iPhone 13 Pro Max", 540, "iPhone 13"],
      ["iPhone 14", 480, "iPhone 14"],
      ["iPhone 14 Plus", 510, "iPhone 14"],
      ["iPhone 14 Pro", 540, "iPhone 14"],
      ["iPhone 14 Pro Max", 570, "iPhone 14"],
      ["iPhone 15", 520, "iPhone 15"],
      ["iPhone 15 Plus", 550, "iPhone 15"],
      ["iPhone 15 Pro", 580, "iPhone 15"],
      ["iPhone 15 Pro Max", 610, "iPhone 15"],
      ["iPhone 16", 560, "iPhone 16"],
      ["iPhone 16 Plus", 590, "iPhone 16"],
      ["iPhone 16 Pro", 620, "iPhone 16"],
      ["iPhone 16 Pro Max", 650, "iPhone 16"],
      ["iPhone 17", 600, "iPhone 17"],
      ["iPhone 17 Air", 630, "iPhone 17"],
      ["iPhone 17 Pro", 660, "iPhone 17"],
      ["iPhone 17 Pro Max", 690, "iPhone 17"],
    ] as [string, number, string][]
  ).map(([model, price, series]) => ({
    id: `case-${model.toLowerCase().replace(/\s+/g, "-")}`,
    name: `${model} Case`,
    cat: "Cases",
    price,
    image: "/img/category-cases.jpg",
    series,
  })),
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
