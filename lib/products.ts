export type Product = {
  id: string;
  name: string;
  cat: string;
  price: number;
  image: string;
  series?: string;
};

// Case variants cycle through these four real silicone-case colorways so the
// catalog shows genuine style/color variety instead of one repeated photo.
// Full case shown (every corner, uncropped) via a portrait photo box + contain
// fit, so the whole product is visible instead of a zoomed-in fragment.
const CASE_COLORS = [
  { name: "Blush Pink", image: "/img/case-blush-v8.jpg" },
  { name: "Charcoal", image: "/img/case-charcoal-v8.jpg" },
  { name: "Mint", image: "/img/case-mint-v8.jpg" },
  { name: "Coral", image: "/img/case-coral-v8.jpg" },
];

// Models with a real photo of the correct device shape (e.g. triple-camera
// iPhone 11 Pro/Pro Max) override the generic colorway cycle above so the
// card doesn't show a mismatched case silhouette (see iPhone X vs 11 mixup).
const CASE_MODEL_OVERRIDES: Record<string, string> = {
  "iPhone 11 Pro": "/img/case-11pro-v1.jpg",
  "iPhone 11 Pro Max": "/img/case-11pro-v1.jpg",
  "iPhone 12 mini": "/img/case-12.jpg",
  "iPhone 12": "/img/case-12.jpg",
  "iPhone 12 Pro": "/img/case-12pro.jpg",
  "iPhone 12 Pro Max": "/img/case-12pro.jpg",
  "iPhone 13 mini": "/img/case-13.jpg",
  "iPhone 13": "/img/case-13.jpg",
  "iPhone 13 Pro": "/img/case-13pro.jpg",
  "iPhone 13 Pro Max": "/img/case-13pro.jpg",
  "iPhone 14": "/img/case-14.jpg",
  "iPhone 14 Plus": "/img/case-14.jpg",
  "iPhone 14 Pro": "/img/case-14pro.jpg",
  "iPhone 14 Pro Max": "/img/case-14pro.jpg",
  "iPhone 15": "/img/case-15.jpg",
  "iPhone 15 Plus": "/img/case-15.jpg",
  "iPhone 15 Pro": "/img/case-15pro.jpg",
  "iPhone 15 Pro Max": "/img/case-15pro.jpg",
  "iPhone 16": "/img/case-16.jpg",
  "iPhone 16 Plus": "/img/case-16.jpg",
  "iPhone 16 Pro": "/img/case-16pro.jpg",
  "iPhone 16 Pro Max": "/img/case-16pro.jpg",
  "iPhone 17": "/img/case-17.jpg",
  "iPhone 17 Pro": "/img/case-17pro.jpg",
  "iPhone 17 Pro Max": "/img/case-17pro.jpg",
};

// Prices in PKR, set to realistic Pakistani retail market rates for these
// product categories (not a currency conversion of a placeholder USD price).
export const PRODUCTS: Product[] = [
  { id: "aerocase-clear", name: "AeroCase Clear", cat: "Cases", price: 450, image: "/img/category-cases.jpg" },
  { id: "magflow-charger", name: "MagFlow Charger", cat: "Powerbank", price: 1800, image: "/img/category-charging.jpg" },
  { id: "armorglass-pro", name: "ArmorGlass Pro", cat: "Protection", price: 250, image: "/img/protector.jpg" },
  { id: "drivemount-x", name: "DriveMount X", cat: "Car & Travel", price: 800, image: "/img/car-mount.jpg" },
  { id: "powercell-10k", name: "PowerCell 10K", cat: "Powerbank", price: 2800, image: "/img/product-powercell.jpg" },
  { id: "braidlink-cable", name: "BraidLink Cable", cat: "Powerbank", price: 350, image: "/img/product-cable.jpg" },
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
  ).map(([model, price, series], i) => ({
    id: `case-${model.toLowerCase().replace(/\s+/g, "-")}`,
    name: `${model} Case — ${CASE_COLORS[i % CASE_COLORS.length].name}`,
    cat: "Cases",
    price,
    image: CASE_MODEL_OVERRIDES[model] ?? CASE_COLORS[i % CASE_COLORS.length].image,
    series,
  })),
  ...(
    [
      ["Anker", "PowerCore 10000mAh", 3200, "/img/pb-anker.jpg"],
      ["Xiaomi", "Mi Power Bank 3 10000mAh", 2600, "/img/pb-xiaomi.jpg"],
      ["Baseus", "Bipow 10000mAh", 2400, "/img/pb-baseus.jpg"],
      ["Romoss", "Sense 8 20000mAh", 3000, "/img/pb-romoss.jpg"],
      ["Faster", "FPB-i 10000mAh", 1800, "/img/pb-faster.jpg"],
      ["Joyroom", "JR-PBX01 10000mAh", 2000, "/img/pb-joyroom.jpg"],
      ["Remax", "RPP-53 10000mAh", 1900, "/img/pb-remax.jpg"],
      ["Eloop", "E37 20000mAh", 2200, "/img/pb-eloop.jpg"],
      ["Proda", "Chicken 10000mAh", 2100, "/img/pb-proda.jpg"],
      ["Dany Technologies", "PB-118 10000mAh", 1700, "/img/pb-dany.jpg"],
    ] as [string, string, number, string][]
  ).map(([brand, model, price, image]) => ({
    id: `powerbank-${brand.toLowerCase().replace(/\s+/g, "-")}`,
    name: `${brand} ${model}`,
    cat: "Powerbank",
    price,
    image,
    series: "Power Banks",
  })),
  ...(
    [
      ["USB-A to Lightning Cable 1m", 250, "/img/cable-lightning.jpg"],
      ["USB-A to Type-C Cable 1m", 250, "/img/cable-usbc.jpg"],
      ["Type-C to Type-C Cable 1m", 280, "/img/cable-usbc.jpg"],
      ["Braided USB-A to Type-C Cable 2m", 450, "/img/cable-usbc.jpg"],
      ["20W USB-C Power Adapter", 900, "/img/adapter-20w.jpg"],
      ["35W Dual-Port Fast Charger Adapter", 1600, "/img/adapter-35w.jpg"],
      ["65W GaN Charger Adapter", 3200, "/img/adapter-65w.jpg"],
    ] as [string, number, string][]
  ).map(([name, price, image]) => ({
    id: `cable-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    name,
    cat: "Powerbank",
    price,
    image,
    series: "Cables & Adapters",
  })),
  ...(
    [
      // The two Lofty own-brand products deliberately use the logo-free photos.
      ["Lofty Airbuds Classic", 1800, "/img/audio-1.jpg"],
      ["QCY T13 Wireless Earbuds", 2200, "/img/audio-2.jpg"],
      ["Haylou GT7 Wireless Earbuds", 2800, "/img/audio-3.jpg"],
      ["Xiaomi Redmi Buds 5", 3200, "/img/audio-4.jpg"],
      ["Anker Soundcore P20i", 3600, "/img/audio-5.jpg"],
      ["Lofty Airbuds Pro ANC", 4500, "/img/audio-6.jpg"],
    ] as [string, number, string][]
  ).map(([name, price, image]) => ({
    id: `audio-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    name,
    cat: "Audio",
    price,
    image,
    series: "Airbuds",
  })),
  ...(
    [
      ["iPhone X", 180, "iPhone X"],
      ["iPhone XR", 190, "iPhone X"],
      ["iPhone XS", 200, "iPhone X"],
      ["iPhone XS Max", 210, "iPhone X"],
      ["iPhone 11", 195, "iPhone 11"],
      ["iPhone 11 Pro", 220, "iPhone 11"],
      ["iPhone 11 Pro Max", 230, "iPhone 11"],
      ["iPhone 12 mini", 200, "iPhone 12"],
      ["iPhone 12", 210, "iPhone 12"],
      ["iPhone 12 Pro", 230, "iPhone 12"],
      ["iPhone 12 Pro Max", 240, "iPhone 12"],
      ["iPhone 13 mini", 210, "iPhone 13"],
      ["iPhone 13", 220, "iPhone 13"],
      ["iPhone 13 Pro", 240, "iPhone 13"],
      ["iPhone 13 Pro Max", 250, "iPhone 13"],
      ["iPhone 14", 230, "iPhone 14"],
      ["iPhone 14 Plus", 240, "iPhone 14"],
      ["iPhone 14 Pro", 250, "iPhone 14"],
      ["iPhone 14 Pro Max", 260, "iPhone 14"],
      ["iPhone 15", 250, "iPhone 15"],
      ["iPhone 15 Plus", 260, "iPhone 15"],
      ["iPhone 15 Pro", 270, "iPhone 15"],
      ["iPhone 15 Pro Max", 280, "iPhone 15"],
      ["iPhone 16", 270, "iPhone 16"],
      ["iPhone 16 Plus", 280, "iPhone 16"],
      ["iPhone 16 Pro", 290, "iPhone 16"],
      ["iPhone 16 Pro Max", 300, "iPhone 16"],
      ["iPhone 17", 290, "iPhone 17"],
      ["iPhone 17 Air", 300, "iPhone 17"],
      ["iPhone 17 Pro", 310, "iPhone 17"],
      ["iPhone 17 Pro Max", 320, "iPhone 17"],
    ] as [string, number, string][]
  ).map(([model, price, series]) => ({
    id: `protector-${model.toLowerCase().replace(/\s+/g, "-")}`,
    name: `${model} Screen Protector`,
    cat: "Protection",
    price,
    image: "/img/protector.jpg",
    series,
  })),
  ...(
    [
      ["iPhone X", 650, "iPhone X"],
      ["iPhone XR", 660, "iPhone X"],
      ["iPhone XS", 670, "iPhone X"],
      ["iPhone XS Max", 680, "iPhone X"],
      ["iPhone 11", 665, "iPhone 11"],
      ["iPhone 11 Pro", 700, "iPhone 11"],
      ["iPhone 11 Pro Max", 710, "iPhone 11"],
      ["iPhone 12 mini", 670, "iPhone 12"],
      ["iPhone 12", 680, "iPhone 12"],
      ["iPhone 12 Pro", 710, "iPhone 12"],
      ["iPhone 12 Pro Max", 720, "iPhone 12"],
      ["iPhone 13 mini", 680, "iPhone 13"],
      ["iPhone 13", 690, "iPhone 13"],
      ["iPhone 13 Pro", 720, "iPhone 13"],
      ["iPhone 13 Pro Max", 730, "iPhone 13"],
      ["iPhone 14", 700, "iPhone 14"],
      ["iPhone 14 Plus", 710, "iPhone 14"],
      ["iPhone 14 Pro", 730, "iPhone 14"],
      ["iPhone 14 Pro Max", 740, "iPhone 14"],
      ["iPhone 15", 720, "iPhone 15"],
      ["iPhone 15 Plus", 730, "iPhone 15"],
      ["iPhone 15 Pro", 750, "iPhone 15"],
      ["iPhone 15 Pro Max", 760, "iPhone 15"],
      ["iPhone 16", 740, "iPhone 16"],
      ["iPhone 16 Plus", 750, "iPhone 16"],
      ["iPhone 16 Pro", 770, "iPhone 16"],
      ["iPhone 16 Pro Max", 780, "iPhone 16"],
      ["iPhone 17", 760, "iPhone 17"],
      ["iPhone 17 Air", 770, "iPhone 17"],
      ["iPhone 17 Pro", 790, "iPhone 17"],
      ["iPhone 17 Pro Max", 800, "iPhone 17"],
    ] as [string, number, string][]
  ).map(([model, price, series]) => ({
    id: `carmount-${model.toLowerCase().replace(/\s+/g, "-")}`,
    name: `${model} Car Mount`,
    cat: "Car & Travel",
    price,
    image: "/img/car-mount.jpg",
    series,
  })),
];

export const CATEGORIES = [
  { name: "Cases", image: "/img/category-cases.jpg" },
  { name: "Powerbank", image: "/img/pb-anker.jpg" },
  { name: "Protection", image: "/img/category-protection.jpg" },
  { name: "Car & Travel", image: "/img/category-car.jpg" },
  { name: "Audio", image: "/img/category-audio.jpg" },
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

export function whatsappCartLink(lines: { product: Product; qty: number; subtotal: number }[], total: number): string {
  const itemLines = lines.map((l) => `${l.qty} x ${l.product.name} — ${money(l.subtotal)}`).join("\n");
  const message = `Hi Lofty Store! I'd like to order:\n${itemLines}\n\nTotal: ${money(total)}`;
  return whatsappLink(message);
}

export const ANNOUNCEMENTS = [
  "Cash on Delivery available",
  "Fast delivery all over Pakistan",
  "Genuine accessories, always",
  "Order on WhatsApp",
];
