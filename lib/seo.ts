import { Product, money } from "@/lib/products";

// Canonical origin for the site. Search engines need absolute URLs in the
// sitemap, canonical tags and structured data — relative ones are ignored.
//
// NOTE: the sslip.io hostname is an IP-based throwaway and cannot build ranking
// authority. Set NEXT_PUBLIC_SITE_URL to the real domain once it's registered;
// everything below (sitemap, canonicals, JSON-LD) picks it up automatically.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lofty.146-190-77-193.sslip.io"
).replace(/\/$/, "");

export const SITE_NAME = "Lofty Store";
export const CURRENCY = "PKR";
export const COUNTRY = "PK";

export function productUrl(p: Product): string {
  return `${SITE_URL}/product/${p.id}`;
}

// Buyers search by what a thing is and where they are — "iphone 15 pro case
// price in pakistan" — not by our internal product name. Titles are written to
// match that phrasing rather than the catalog label.
export function productTitle(p: Product): string {
  return `${p.name} — Price in Pakistan | ${SITE_NAME}`;
}

export function productDescription(p: Product): string {
  return `Buy ${p.name} in Pakistan for ${money(
    p.price
  )}. Cash on Delivery nationwide, genuine ${p.cat.toLowerCase()} accessories. Order online or on WhatsApp.`;
}

/**
 * Rich Product + Offer JSON-LD.
 *
 * Attribute-rich schema (brand, category, offers with availability, delivery
 * and return policy) is what makes a product eligible for merchant listings and
 * is cited far more often by AI shopping answers than a bare Product blob — so
 * we emit every field we can honestly support. Nothing here is invented: we do
 * not claim ratings or GTINs we don't have, because false schema is a trust
 * violation and can get a merchant account flagged.
 */
export function productJsonLd(
  p: Product,
  rating?: { count: number; average: number } | null
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: productDescription(p),
    image: [`${SITE_URL}${p.image}`],
    sku: p.id,
    category: p.cat,
    brand: { "@type": "Brand", name: brandOf(p) },
    // Emitted only when real reviews exist. An invented aggregateRating is the
    // fastest way to get a merchant account flagged, and it is a lie to buyers.
    ...(rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.average,
            reviewCount: rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: productUrl(p),
      priceCurrency: CURRENCY,
      price: p.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_NAME },
      // COD is the only payment method — stating it explicitly is exactly the
      // kind of concrete fact AI answers surface for "cash on delivery" queries.
      acceptedPaymentMethod: {
        "@type": "PaymentMethod",
        name: "Cash on Delivery",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: COUNTRY,
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
      // No hasMerchantReturnPolicy: the store does not offer a replacement
      // window. Declaring one here would be a machine-readable promise Google
      // can surface in Shopping, so it is omitted rather than asserted. If a
      // real policy is introduced, add it back and make the on-page copy match.
    },
  };
}

// The catalog has no brand column; the brand is the leading token of the name
// for real brands, and Lofty for own-brand/unbranded lines.
const KNOWN_BRANDS = [
  "Anker", "Xiaomi", "Baseus", "Romoss", "Faster", "Joyroom",
  "Remax", "Eloop", "Proda", "Dany", "QCY", "Haylou", "Lofty",
];

export function brandOf(p: Product): string {
  const hit = KNOWN_BRANDS.find((b) =>
    p.name.toLowerCase().startsWith(b.toLowerCase())
  );
  return hit ?? SITE_NAME;
}

export function breadcrumbJsonLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: p.cat,
        item: `${SITE_URL}/#products`,
      },
      { "@type": "ListItem", position: 3, name: p.name, item: productUrl(p) },
    ],
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Mobile accessories in Pakistan — cases, power banks, cables, screen protectors, car mounts and airbuds. Cash on Delivery nationwide.",
    areaServed: { "@type": "Country", name: "Pakistan" },
    paymentAccepted: "Cash on Delivery",
    currenciesAccepted: CURRENCY,
  };
}
