import { PRODUCTS, type Product } from "@/lib/products";

/**
 * Category landing pages — the site's actual ranking assets.
 *
 * Individual product pages can't win search: the products are called things
 * like "AeroCase Clear", which nobody types into Google. These pages target the
 * phrases Pakistani buyers really search ("power bank price in pakistan",
 * "iphone cover", "tempered glass"), and each one is a real page with copy, a
 * product grid, and an FAQ — not a thin doorway.
 *
 * Every factual claim below is one the store can actually stand behind: prices
 * are computed from the live catalogue, delivery is 2–7 days, payment is COD.
 * Nothing here is invented.
 */
export type CategoryPage = {
  slug: string;
  /** The `cat` value in PRODUCTS this page collects. */
  cat: string;
  /** Nav/breadcrumb label. */
  label: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  faqs: { q: string; a: string }[];
};

export const CATEGORY_PAGES: CategoryPage[] = [
  {
    slug: "iphone-cases",
    cat: "Cases",
    label: "iPhone Cases",
    h1: "iPhone Cases & Covers in Pakistan",
    title: "iPhone Cases & Covers Price in Pakistan | Cash on Delivery",
    description:
      "Buy iPhone cases and back covers in Pakistan for every model from iPhone X to iPhone 17. Cash on Delivery nationwide, delivered in 2–7 days.",
    intro:
      "Covers and back cases for every iPhone from the X through to the 17 series, including the Pro and Pro Max models. Each case is cut for its exact model, so the camera, buttons and charging port all line up properly. Pay cash when the courier reaches your door — no card, no advance payment — and expect delivery in 2 to 7 days anywhere in Pakistan.",
    faqs: [
      {
        q: "Do you have a cover for my iPhone model?",
        a: "We stock cases for iPhone X, XR, XS, 11, 12, 13, 14, 15, 16 and 17, including the Pro, Pro Max, mini and Plus variants. Use the search bar to find your exact model.",
      },
      {
        q: "Can I pay cash on delivery for a phone case?",
        a: "Yes. Cash on Delivery is the only payment method we use. You pay the rider in cash when the order reaches you.",
      },
      {
        q: "How long does delivery take?",
        a: "2 to 7 days to every city in Pakistan, depending on your location.",
      },
    ],
  },
  {
    slug: "power-banks",
    cat: "Powerbank",
    label: "Power Banks",
    h1: "Power Banks & Chargers in Pakistan",
    title: "Power Bank Price in Pakistan | Anker, Xiaomi, Baseus | COD",
    description:
      "Buy power banks and fast chargers in Pakistan — Anker, Xiaomi, Romoss, Baseus and more. Cash on Delivery nationwide, delivered in 2–7 days.",
    intro:
      "Power banks, wall chargers and charging cables from brands including Anker, Xiaomi, Romoss and Baseus, alongside our own range. Capacities suited to a full day away from a socket, plus fast-charging adapters and braided cables that survive being thrown in a bag. Cash on Delivery across Pakistan, delivered in 2 to 7 days.",
    faqs: [
      {
        q: "Which power bank brands do you sell?",
        a: "Anker, Xiaomi, Romoss, Baseus, Faster, Joyroom, Remax, Eloop, Proda and Dany, plus our own Lofty range.",
      },
      {
        q: "Is the power bank genuine?",
        a: "Yes — we source from real brands and do not sell counterfeit stock.",
      },
      {
        q: "Can I pay on delivery?",
        a: "Yes, Cash on Delivery is our only payment method. Pay the rider in cash when your order arrives.",
      },
    ],
  },
  {
    slug: "screen-protectors",
    cat: "Protection",
    label: "Screen Protectors",
    h1: "Tempered Glass Screen Protectors in Pakistan",
    title: "Tempered Glass Screen Protector Price in Pakistan | COD",
    description:
      "Buy tempered glass screen protectors for iPhone in Pakistan. Full-coverage protection, Cash on Delivery, delivered in 2–7 days.",
    intro:
      "Tempered glass screen protection for every iPhone model we carry. Glass rather than plastic film, so it takes the impact of a drop instead of scratching and peeling. Cash on Delivery anywhere in Pakistan, with delivery in 2 to 7 days.",
    faqs: [
      {
        q: "Will the tempered glass fit my iPhone?",
        a: "We list a protector for each iPhone model we stock. Search for your model to find the right one.",
      },
      {
        q: "Is it real tempered glass?",
        a: "Yes — tempered glass, not plastic film.",
      },
      {
        q: "How do I pay?",
        a: "Cash on Delivery only. You pay when the order reaches your door.",
      },
    ],
  },
  {
    slug: "car-mounts",
    cat: "Car & Travel",
    label: "Car Mounts",
    h1: "Car Mobile Holders & Mounts in Pakistan",
    title: "Car Mobile Holder Price in Pakistan | Cash on Delivery",
    description:
      "Buy car mobile holders and phone mounts in Pakistan. Universal fit, Cash on Delivery nationwide, delivered in 2–7 days.",
    intro:
      "Car mounts and mobile holders that keep your phone in view while you drive. Universal fit, so one mount works across iPhone models rather than being tied to a single handset. Cash on Delivery all over Pakistan, delivered in 2 to 7 days.",
    faqs: [
      {
        q: "Will the car mount fit my phone?",
        a: "Our car mounts are universal fit and hold any iPhone model we stock.",
      },
      {
        q: "Do you deliver outside the major cities?",
        a: "Yes — we deliver to every city in Pakistan, in 2 to 7 days.",
      },
      {
        q: "Can I pay cash?",
        a: "Yes. Cash on Delivery is the only payment method.",
      },
    ],
  },
  {
    slug: "airbuds",
    cat: "Audio",
    label: "Airbuds",
    h1: "Wireless Airbuds & Earbuds in Pakistan",
    title: "Wireless Earbuds & Airbuds Price in Pakistan | COD",
    description:
      "Buy wireless airbuds and Bluetooth earbuds in Pakistan. Cash on Delivery nationwide, delivered in 2–7 days.",
    intro:
      "Wireless Bluetooth earbuds for calls, music and commuting, including our own Lofty range alongside brands like QCY and Haylou. Every pair here connects over Bluetooth, so they work with any iPhone as well as Android handsets — there is no cable to lose and nothing to plug in. Cash on Delivery across Pakistan, delivered in 2 to 7 days: you pay the rider in cash when they reach your door, so there is no advance payment and no card needed.",
    faqs: [
      {
        q: "Do the airbuds work with iPhone?",
        a: "Yes. Every pair we sell connects over standard Bluetooth, so they pair with any iPhone. They work with Android phones and laptops too — Bluetooth is not tied to one brand of handset.",
      },
      {
        q: "Is Cash on Delivery available on airbuds?",
        a: "Yes, and it is our only payment method. You pay the courier in cash when the order arrives at your address. There is no advance payment, no bank transfer and no card required.",
      },
      {
        q: "How fast is delivery, and where do you deliver?",
        a: "We deliver to every city in Pakistan, and orders typically arrive within 2 to 7 days. Larger cities are usually at the faster end of that range.",
      },
      {
        q: "Are the airbuds genuine?",
        a: "Yes. We source from real brands and do not sell counterfeit stock. If a product is our own Lofty line, it is labelled as such rather than being passed off as another brand.",
      },
      {
        q: "Can I order airbuds on WhatsApp instead?",
        a: "Yes. Every product page has an 'Order on WhatsApp' button that opens a chat with the product and price already filled in, and we confirm your order, price and delivery date in the chat.",
      },
    ],
  },
];

export function findCategoryPage(slug: string): CategoryPage | undefined {
  return CATEGORY_PAGES.find((c) => c.slug === slug);
}

export function productsInCategory(page: CategoryPage): Product[] {
  return PRODUCTS.filter((p) => p.cat === page.cat);
}

/** Real price range, read off the catalogue — never a typed-in number. */
export function priceRange(page: CategoryPage): { min: number; max: number } | null {
  const prices = productsInCategory(page).map((p) => p.price);
  if (prices.length === 0) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
