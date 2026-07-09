"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/lib/StoreProvider";
import CartDrawer from "@/components/CartDrawer";
import { whatsappLink } from "@/lib/products";

const NAV_LINKS = ["Shop", "Cases", "Powerbank", "Protection", "Car & Travel", "Audio"];

const BREADCRUMB_STEPS: Record<string, string[]> = {
  "/checkout": ["Cart", "Checkout", "Confirmation"],
  "/confirmation": ["Cart", "Checkout", "Confirmation"],
  "/order-status": ["Cart", "Checkout", "Confirmation", "Status"],
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount, cartOpen, setCartOpen, mobileMenuOpen, setMobileMenuOpen, setActiveCategory } = useStore();

  const isLanding = pathname === "/";
  const breadcrumb = BREADCRUMB_STEPS[pathname];

  function goToShop(name: string) {
    setActiveCategory(name === "Shop" ? null : name);
    setMobileMenuOpen(false);
    if (isLanding) {
      const target = document.getElementById(name === "Shop" ? "shop" : "products");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(name === "Shop" ? "/#shop" : "/#products");
    }
  }

  return (
    <>
      <nav className="nav glass" style={breadcrumb ? { maxWidth: 760 } : undefined}>
        <Link href="/" className="nav-brand">Lofty Store</Link>

        {breadcrumb ? (
          <div className="nav-breadcrumb">
            {breadcrumb.map((step, i) => {
              const isCurrent =
                (pathname === "/checkout" && step === "Checkout") ||
                (pathname === "/confirmation" && step === "Confirmation") ||
                (pathname === "/order-status" && step === "Status");
              return (
                <span key={step}>
                  {i > 0 && <span className="sep">→</span>}
                  <span className={isCurrent ? "active" : ""} style={!isCurrent ? { opacity: 0.5 } : undefined}>{step}</span>
                </span>
              );
            })}
          </div>
        ) : (
          <ul className="nav-links">
            {NAV_LINKS.map((name) => (
              <li key={name} style={{ cursor: "pointer" }} onClick={() => goToShop(name)}>{name}</li>
            ))}
          </ul>
        )}

        <div className="nav-right">
          <a
            className="whatsapp-btn"
            href={whatsappLink("Hi Lofty Store! I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <button className="pill pill-primary cart-btn" aria-label="Open cart" onClick={() => setCartOpen(true)}>
            Cart
            <span className={`cart-badge ${cartCount === 0 ? "hidden" : ""}`}>{cartCount}</span>
          </button>
          {isLanding && (
            <button className="menu-btn" aria-label="Open menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>
          )}
        </div>
      </nav>

      {isLanding && (
        <ul className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          {NAV_LINKS.map((name) => (
            <li key={name} onClick={() => goToShop(name)}>{name}</li>
          ))}
        </ul>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
