import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // These are private or per-user pages. /admin especially: it currently has
      // no auth, so at minimum keep it out of the index. (robots.txt is not a
      // security control — it only stops well-behaved crawlers.)
      disallow: ["/admin", "/checkout", "/confirmation", "/order-status", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
