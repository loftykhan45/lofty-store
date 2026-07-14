import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/StoreProvider";
import Header from "@/components/Header";
import Orbs from "@/components/Orbs";
import AnnounceBar from "@/components/AnnounceBar";
import FloatingCartButton from "@/components/FloatingCartButton";
import { SITE_URL, SITE_NAME, organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  // Without metadataBase, canonical and Open Graph URLs resolve relative and
  // break in production — this is the single most-missed Next.js SEO setting.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Buy Mobile Accessories in Pakistan — Cash on Delivery | Lofty Store",
    template: `%s`,
  },
  description:
    "Buy phone cases, power banks, cables, screen protectors, car mounts and airbuds in Pakistan. Cash on Delivery nationwide, genuine accessories from real brands.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_PK",
    type: "website",
    url: SITE_URL,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PK">
      <body>
        {/* Marks JS as available before first paint, which is what gates the
            scroll-reveal styles. Without it a no-JS visitor (or a crawler that
            doesn't execute scripts) would get a page of permanently invisible
            sections, since nothing would ever add the .is-in class. */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js")` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <StoreProvider>
          <Orbs />
          <div className="page">
            <AnnounceBar />
            <Header />
            {children}
            <FloatingCartButton />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
