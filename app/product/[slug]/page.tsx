import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, findProduct, money } from "@/lib/products";
import {
  productTitle,
  productDescription,
  productJsonLd,
  breadcrumbJsonLd,
  productUrl,
  brandOf,
} from "@/lib/seo";
import MediaFill from "@/components/MediaFill";
import ProductBuy from "@/components/ProductBuy";
import Icon from "@/components/Icon";

// Pre-render all 122 at build time: they're static content, so they should be
// static HTML — fast for users and trivially crawlable.
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.id }));
}

// `params` is a Promise in this version of Next.js.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: productTitle(product),
    description: productDescription(product),
    alternates: { canonical: `/product/${product.id}` },
    openGraph: {
      title: productTitle(product),
      description: productDescription(product),
      url: productUrl(product),
      type: "website",
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  const related = PRODUCTS.filter(
    (p) => p.cat === product.cat && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="pdp-wrap">
      {/* Structured data: this is what makes the page eligible for merchant
          listings and is what AI shopping answers actually read. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(product)) }}
      />

      <nav className="pdp-crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep" aria-hidden="true"><Icon name="chevronRight" size={12} /></span>
        <Link href="/#products">{product.cat}</Link>
        <span className="sep" aria-hidden="true"><Icon name="chevronRight" size={12} /></span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="pdp-grid">
        <div className={`pdp-photo glass ${product.cat === "Cases" ? "pdp-photo-square" : ""}`}>
          <MediaFill
            image={product.image}
            label={product.name}
            sizes="(max-width: 900px) 100vw, 520px"
            fit={product.cat === "Cases" ? "contain" : "cover"}
          />
        </div>

        <div className="pdp-info">
          <div className="pdp-brand">{brandOf(product)}</div>
          <h1 className="pdp-title">{product.name}</h1>
          <div className="pdp-price">{money(product.price)}</div>

          {/* Answering the buyer's real questions in the first screen is both
              good UX and what retrieval-based AI reads to decide whether to
              cite the page. */}
          <p className="pdp-lede">
            {product.name} available in Pakistan for {money(product.price)}.
            Pay <strong>cash on delivery</strong> — no card needed. Delivered in
            2–7 days nationwide, with a 7-day easy replacement if it isn&apos;t
            the right fit.
          </p>

          <ProductBuy product={product} />

          <ul className="pdp-facts">
            <li><Icon name="cash" size={16} /> <span>Cash on Delivery across Pakistan</span></li>
            <li><Icon name="truck" size={16} /> <span>Delivery in 2–7 business days</span></li>
            <li><Icon name="shield" size={16} /> <span>Genuine product, not a counterfeit</span></li>
            <li><Icon name="refresh" size={16} /> <span>7-day easy replacement</span></li>
          </ul>

          <dl className="pdp-specs">
            <div><dt>Category</dt><dd>{product.cat}</dd></div>
            <div><dt>Brand</dt><dd>{brandOf(product)}</dd></div>
            {product.series && <div><dt>Fits</dt><dd>{product.series}</dd></div>}
            <div><dt>Price</dt><dd>{money(product.price)}</dd></div>
            <div><dt>Payment</dt><dd>Cash on Delivery</dd></div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="pdp-related">
          <h2 className="section-title">More in {product.cat}</h2>
          <div className="pdp-related-grid">
            {related.map((r) => (
              <Link key={r.id} href={`/product/${r.id}`} className="pdp-related-card glass">
                <div className="pdp-related-photo">
                  <MediaFill image={r.image} label={r.name} sizes="220px" />
                </div>
                <div className="pdp-related-name">{r.name}</div>
                <div className="pdp-related-price">{money(r.price)}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
