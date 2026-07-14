import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { CATEGORY_PAGES } from "@/lib/categories";
import { SITE_URL } from "@/lib/seo";

// Every product gets a URL here, which is how Google discovers all 122 of them.
// Before this existed the crawler had exactly one page to index.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
  ];

  // Ranked above individual products on purpose: the category pages are what
  // target the phrases people actually search, so they are the pages we most
  // want crawled and indexed.
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_PAGES.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${SITE_URL}/product/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
