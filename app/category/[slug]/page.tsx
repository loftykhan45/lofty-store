import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { money } from "@/lib/products";
import {
  CATEGORY_PAGES,
  findCategoryPage,
  productsInCategory,
  priceRange,
} from "@/lib/categories";
import { SITE_URL, SITE_NAME, CURRENCY } from "@/lib/seo";
import MediaFill from "@/components/MediaFill";
import Icon from "@/components/Icon";

export function generateStaticParams() {
  return CATEGORY_PAGES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = findCategoryPage(slug);
  if (!page) return { title: "Category not found" };

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/category/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${SITE_URL}/category/${page.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = findCategoryPage(slug);
  if (!page) notFound();

  const products = productsInCategory(page);
  const range = priceRange(page);
  const url = `${SITE_URL}/category/${page.slug}`;

  // ItemList tells Google this is a real category of N products, not a doorway.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.h1,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 30).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/product/${p.id}`,
      name: p.name,
    })),
  };

  // FAQPage schema can win a rich result in Google — and the answers are all
  // things the store genuinely does.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: page.label, item: url },
    ],
  };

  return (
    <div className="pdp-wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav className="pdp-crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep" aria-hidden="true"><Icon name="chevronRight" size={12} /></span>
        <span aria-current="page">{page.label}</span>
      </nav>

      <header className="cat-page-head">
        <h1 className="cat-page-title">{page.h1}</h1>
        {range && (
          <p className="cat-page-price">
            {products.length} products · {money(range.min)} – {money(range.max)}
          </p>
        )}
        <p className="cat-page-intro">{page.intro}</p>
        <ul className="pdp-facts cat-page-facts">
          <li><Icon name="cash" size={16} /> <span>Cash on Delivery across Pakistan</span></li>
          <li><Icon name="truck" size={16} /> <span>Delivery in 2–7 business days</span></li>
          <li><Icon name="shield" size={16} /> <span>Genuine products, not counterfeits</span></li>
        </ul>
      </header>

      <section className="cat-page-products">
        <h2 className="section-title">All {page.label}</h2>
        <div className="pdp-related-grid cat-page-grid">
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} className="pdp-related-card glass">
              <div className="pdp-related-photo">
                <MediaFill image={p.image} label={p.name} sizes="220px" />
              </div>
              <div className="pdp-related-name">{p.name}</div>
              <div className="pdp-related-price">{money(p.price)}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cat-page-faq">
        <h2 className="section-title">Frequently asked questions</h2>
        <div className="faq-list">
          {page.faqs.map((f) => (
            <details className="faq-item glass" key={f.q}>
              <summary className="faq-q">{f.q}</summary>
              <p className="faq-a">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Internal links between categories: this is how crawl authority spreads
          across the site instead of pooling on the homepage. */}
      <section className="cat-page-others">
        <h2 className="section-title">Browse other categories</h2>
        <div className="cat-page-links">
          {CATEGORY_PAGES.filter((c) => c.slug !== page.slug).map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="cat-page-link glass">
              {c.label}
              <Icon name="chevronRight" size={14} />
            </Link>
          ))}
        </div>
      </section>

      <p className="cat-page-note">
        Prices in {CURRENCY}. {SITE_NAME} delivers across Pakistan with Cash on
        Delivery. Need help choosing?{" "}
        <Link href="/#products">Browse the full catalogue</Link>.
      </p>
    </div>
  );
}
