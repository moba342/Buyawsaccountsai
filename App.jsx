import {
  ProvidersPage,
  CatalogPage,
  ContactPage,
  SellerVerificationPage,
  PublicProofPage,
  GuideArticlePage,
  CartPage,
  CheckoutPage,
} from "./routeComponents";
import AnalyticsConsent from "./AnalyticsConsent";
import SiteBreadcrumbs from "./SiteBreadcrumbs";
import NotFoundPage from "./NotFoundPage";
import { guideByRoute, guideRoute } from "./guideRoutes";
import { pageHeading } from "./site-config";
import { applyPageSeo } from "./seo";
import GuideArtwork from "./GuideArtwork";
import { navigationNames } from "./pageNames";
import HeaderActions from "./HeaderActions";
import WebsiteMotion from "./WebsiteMotion";
import "./website-motion.css";
import SmoothScrolling, { scrollPageTo } from "./SmoothScrolling";
import { useCart } from "./cart";
import PageIntro from "./PageIntro";
import { faqs, guides } from "./editorialContent";
import {
  currentRoute,
  migrateLegacyRoute,
  pathRoute,
  routePath,
  validRoute,
} from "./routing";
import "./provider-directory.css";
import FooterWordmark from "./FooterWordmark";
import Modal from "./Modal";
import HomePage from "./HomePage";
import ProviderStrip from "./ProviderStrip";
import VariantSelect from "./VariantSelect";
import ProviderLogo from "./ProviderLogo";
import { brands, products, formatPrice } from "./catalog";
import { slug, providerRoute, productRoute } from "./catalogPaths";
import React, { useState, useEffect, Suspense } from "react";
import {
  Cloud,
  Menu,
  X,
  Check,
  ShieldCheck,
  Search,
  ChevronDown,
  Layers,
  Globe,
  BookOpen,
  SlidersHorizontal,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import "./style.css";
import "./typography.css";
import "./responsive.css";
import "./provider-cards.css";
import "./theme.css";
import "./buttons.css";
import "./product-catalog.css";
import "./products-intro.css";
import "./buying-article.css";
import "./professional-layout.css";
import "./seller-verification.css";
import "./public-seller-profile.css";
import "./commerce.css";
import "./hero-profile.css";
import "./product-articles.css";
import "./scroll-performance.css";
import "./catalog-pages.css";
import "./header-actions.css";
import "./card-refinement.css";
import "./commerce-refinement.css";
import "./product-visual.css";
import "./guide-artwork.css";
import "./technical-seo.css";

const detailRoutes = [
  ...brands.map(providerRoute),
  ...products.map(productRoute),
];
export default function App({ initialRoute, initialPathname } = {}) {
  const cart = useCart();
  const valid = [
    "products",
    "providers",
    "compare",
    "guides",
    "faq",
    "verified",
    "contact",
  ];
  let [page, setPage] = useState(() => initialRoute || currentRoute()),
    [pathname, setPathname] = useState(
      () =>
        initialPathname ||
        (typeof location !== "undefined" ? location.pathname : "/"),
    ),
    [menu, setMenu] = useState(false),
    [filter, setFilter] = useState("All"),
    [search, setSearch] = useState(""),
    [selected, setSelected] = useState([0, 3]),
    [order, setOrder] = useState(null),
    [guide, setGuide] = useState(null);
  const navigate = (p) => {
    if (!validRoute(p)) return;
    const path = routePath(p);
    if (location.pathname !== path || location.hash)
      history.pushState(null, "", path);
    setPage(p);
    setPathname(location.pathname);
    setMenu(false);
    scrollPageTo(0, { immediate: true });
  };
  useEffect(() => {
    if (menu) document.querySelector("#site-navigation a")?.focus();
  }, [menu]);
  useEffect(() => {
    const sync = () => {
      migrateLegacyRoute();
      setPage(currentRoute());
      setPathname(location.pathname);
      setMenu(false);
      setOrder(null);
      setGuide(null);
    };
    const intercept = (event) => {
      const link = event.target.closest?.("a[href]");
      if (!link) return;
      const url = new URL(link.href, location.href),
        route = pathRoute(url.pathname);
      if (
        url.origin !== location.origin ||
        !route ||
        url.pathname === "/" ||
        url.hash ||
        link.target === "_blank" ||
        link.hasAttribute("download")
      )
        return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        event.stopPropagation();
        return;
      }
      if (event.button !== 0) return;
      event.preventDefault();
    };
    const follow = (event) => {
      const link = event.target.closest?.("a[href]");
      if (!link || !event.defaultPrevented) return;
      const url = new URL(link.href, location.href),
        route = pathRoute(url.pathname);
      if (
        url.origin === location.origin &&
        route &&
        url.pathname !== "/" &&
        !url.hash
      )
        navigate(route);
    };
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    document.addEventListener("click", intercept, true);
    document.addEventListener("click", follow);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
      document.removeEventListener("click", intercept, true);
      document.removeEventListener("click", follow);
    };
  }, []);
  useEffect(() => {
    applyPageSeo(page, pathname);
  }, [page, pathname]);
  useEffect(() => {
    function close(e) {
      if (e.key === "Escape") {
        setOrder(null);
        setGuide(null);
        if (menu) document.querySelector("header .menu")?.focus();
        setMenu(false);
      }
    }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  const browse = (provider = "All") => {
    setFilter(provider);
    setSearch("");
    navigate("products");
    setTimeout(() => scrollPageTo(document.getElementById("catalog")), 100);
  };
  const toggle = (i) =>
    setSelected((s) =>
      s.includes(i) ? s.filter((x) => x !== i) : s.length < 3 ? [...s, i] : s,
    );
  const matched = products.filter(
    (p) =>
      (filter === "All" || p.provider === filter) &&
      (p.name + " " + p.provider).toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <AnalyticsConsent page={page} pathname={pathname} cart={cart} />
      <WebsiteMotion routeKey={pathname} paused={!!order || !!guide || menu} />
      <SmoothScrolling
        paused={!!order || !!guide || menu}
        routeKey={pathname}
      />
      <a
        className="skip-link"
        href="#page-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("page-content")?.focus();
          scrollPageTo(document.getElementById("page-content"), {
            immediate: true,
          });
        }}
      >
        Skip to content
      </a>
      <header>
        <a className="brand" href="https://www.buyawsaccountsai.com/">
          <img
            className="site-brand-logo"
            src="/optimized/brand-header-480.webp"
            srcSet="/optimized/brand-header-480.webp 480w, /optimized/brand-header-840.webp 840w, /optimized/brand-header-1200.webp 1200w"
            sizes="(max-width:767px)210px,230px"
            alt="Buy AWS Accounts AI"
            width="2172"
            height="724"
          />
        </a>
        <nav
          id="site-navigation"
          aria-label="Main navigation"
          className={menu ? "open" : ""}
        >
          {valid.map((p) => (
            <a
              href={routePath(p)}
              onClick={() => navigate(p)}
              className={
                (page === p ? "active " : "") + (p === "cart" ? "nav-cart" : "")
              }
              aria-current={page === p ? "page" : undefined}
              key={p}
            >
              {p === "cart" ? (
                <>
                  <ShoppingCart size={17} aria-hidden="true" />
                  Cart
                  <span aria-label={`${cart.count} accounts`}>
                    {cart.count}
                  </span>
                </>
              ) : (
                navigationNames[p]
              )}
            </a>
          ))}
        </nav>
        <HeaderActions count={cart.count} />
        <button
          className="icon menu"
          aria-label="Toggle navigation"
          aria-expanded={menu}
          aria-controls="site-navigation"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <SiteBreadcrumbs page={page} pathname={pathname} />
      <Suspense
        fallback={
          <main
            id="page-content"
            tabIndex={-1}
            className="route-loading"
            role="status"
          >
            Loading page…
          </main>
        }
      >
        {page === "not-found" ? (
          <NotFoundPage />
        ) : guideByRoute(page) ? (
          <GuideArticlePage id={page} />
        ) : page === "cart" ? (
          <CartPage cart={cart} />
        ) : page === "checkout" ? (
          <CheckoutPage cart={cart} />
        ) : page === "verification/public-proof" ? (
          <PublicProofPage />
        ) : page === "verified" ? (
          <SellerVerificationPage />
        ) : page === "contact" ? (
          <ContactPage navigate={navigate} />
        ) : detailRoutes.includes(page) ? (
          <CatalogPage
            brand={
              brands.find((b) => providerRoute(b) === page) ||
              brands.find(
                (b) =>
                  b.name ===
                  products.find((p) => productRoute(p) === page)?.provider,
              )
            }
            product={products.find((p) => productRoute(p) === page)}
            products={products}
            brands={brands}
            navigate={navigate}
            onAddToCart={(p) => {
              cart.add(p);
              navigate("cart");
            }}
            onOrder={(p) => {
              setOrder(p);
            }}
            onCompare={(p) => {
              setSelected((s) =>
                s.includes(products.indexOf(p))
                  ? s
                  : [products.indexOf(p), ...s].slice(0, 3),
              );
              navigate("compare");
            }}
          />
        ) : page === "products" ? (
          <HomePage
            standalone={pathname !== "/"}
            brands={brands}
            products={products}
            navigate={navigate}
            faqs={faqs}
            onAddToCart={(p) => {
              cart.add(p);
              navigate("cart");
            }}
            onOrder={(p) => {
              setOrder(p);
            }}
            onCompare={(p) => {
              setSelected((s) =>
                s.includes(products.indexOf(p))
                  ? s
                  : [products.indexOf(p), ...s].slice(0, 3),
              );
              navigate("compare");
            }}
          />
        ) : page === "providers" ? (
          <ProvidersPage
            brands={brands}
            products={products}
            navigate={navigate}
          />
        ) : page === "compare" ? (
          <main
            id="page-content"
            tabIndex={-1}
            className="section inner compare-page"
          >
            <PageIntro
              eyebrow="COMPARE YOUR OPTIONS"
              title={pageHeading("compare")}
              description="Review account packages side by side. Compare the listed price and proposed scope, then confirm the account details that matter to your project."
              kind="compare"
              label="YOUR SHORTLIST"
              metric={selected.length + " / 3"}
              asideTitle="Choose up to three packages"
              asideBody="Start with the platforms and account types you need. You can change your shortlist at any time."
            />
            <div className="compare-selection-heading">
              <div>
                <span className="section-label">THE ACCOUNT COLLECTION</span>
                <h2>Build your shortlist</h2>
                <p>Select up to three account variants below.</p>
              </div>
              <button
                className="secondary"
                onClick={() => setSelected([])}
                disabled={!selected.length}
              >
                Clear selection
              </button>
            </div>
            <div className="selection-grid">
              {products.map((p, i) => (
                <label
                  className={selected.includes(i) ? "checked" : ""}
                  key={productRoute(p)}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(i)}
                    disabled={!selected.includes(i) && selected.length === 3}
                    onChange={() => toggle(i)}
                  />
                  <div>
                    <strong>
                      <ProviderLogo name={p.provider} decorative /> {p.provider}{" "}
                      · {p.name}
                    </strong>
                    <small>{formatPrice(p.price)} / account</small>
                  </div>
                </label>
              ))}
            </div>
            {selected.length ? (
              <div
                className="table-scroll"
                role="region"
                aria-label="Package comparison"
                tabIndex={0}
              >
                <table>
                  <thead>
                    <tr>
                      <th>Package details</th>
                      {selected.map((i) => (
                        <th key={i}>
                          {products[i].provider}
                          <br />
                          <strong>{products[i].name}</strong>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Reference price", (p) => `${formatPrice(p.price)}`],
                      ["Package type", (p) => p.type],
                      ["Included service", (p) => p.features[0]],
                      ["Guidance", (p) => p.features[1]],
                      ["Support", (p) => p.features[2]],
                      ["Final terms", () => "Confirmed before payment"],
                    ].map(([label, fn]) => (
                      <tr key={label}>
                        <th>{label}</th>
                        {selected.map((i) => (
                          <td key={i}>{fn(products[i])}</td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <th>Next step</th>
                      {selected.map((i) => (
                        <td key={i}>
                          <button
                            className="primary"
                            onClick={() => {
                              setOrder(products[i]);
                            }}
                          >
                            Buy Now
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty">
                Select a package above to start comparing.
              </div>
            )}
            <p className="catalog-note">
              Comparison shows reference variants and listed prices. Confirm
              provider requirements and availability before payment.
            </p>
          </main>
        ) : page === "guides" ? (
          <main
            id="page-content"
            tabIndex={-1}
            className="section inner guides-page"
          >
            <PageIntro
              eyebrow="THE BUYER’S READING ROOM"
              title={pageHeading("guides")}
              description="Original buying guides covering account selection, credit conditions, and delivery checks. Read the details, prepare your questions, and order with a clearer plan."
              kind="guide"
              label="PRACTICAL BUYING ADVICE"
              metric={String(guides.length).padStart(2, "0")}
              asideTitle="Guides for each buying stage"
              asideBody="From selecting a package to reviewing account access, keep the important questions in view."
            />
            <div className="editorial-section-heading">
              <span className="section-label">READ. REVIEW. DECIDE.</span>
              <h2>The buying essentials</h2>
            </div>
            <div className="guide-grid">
              {guides.map((g, i) => (
                <a
                  className="guide-card"
                  key={g.title}
                  href={routePath(guideRoute(g))}
                >
                  <GuideArtwork index={i} />
                  <div className="guide-copy">
                    <div className="eyebrow">{g.category}</div>
                    <h2>{g.title}</h2>
                    <p>{g.text.slice(0, 110)}…</p>
                    <span className="text-button">Read guide</span>
                  </div>
                </a>
              ))}
            </div>
          </main>
        ) : (
          <main
            id="page-content"
            tabIndex={-1}
            className="section inner faq-page"
          >
            <PageIntro
              eyebrow="BEFORE YOU PLACE AN ORDER"
              title={pageHeading("faq")}
              description="Understand account checks, credit eligibility, pricing, delivery, and support. These answers help you prepare for a direct purchase discussion."
              label="BUYER SUPPORT"
              metric={String(faqs.length).padStart(2, "0")}
              asideTitle="Answers to common questions"
              asideBody="Have a question about a specific account? Share the provider and package name with our sales team."
            />
            <div className="editorial-section-heading">
              <span className="section-label">ACCOUNT PURCHASE FAQ</span>
              <h2>What would you like to know?</h2>
            </div>
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <ChevronDown size={18} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </main>
        )}
      </Suspense>
      <footer className="store-footer">
        <div className="footer-shell">
          <section className="footer-callout">
            <div>
              <a className="brand" href="https://www.buyawsaccountsai.com/">
                <img
                  className="site-brand-logo"
                  src="/optimized/brand-footer-480.webp"
                  srcSet="/optimized/brand-footer-480.webp 480w, /optimized/brand-footer-840.webp 840w"
                  sizes="320px"
                  loading="lazy"
                  alt="Buy AWS Accounts AI"
                  width="2172"
                  height="724"
                />
              </a>
              <h2>Your next cloud purchase starts with a conversation.</h2>
              <p>
                Explore the account collection, compare your options, and ask us
                for the details you need before ordering.
              </p>
              <p className="footer-description">
                Buy AWS Accounts AI is an independent storefront for cloud
                account and credit package inquiries. We help you compare listed
                options and confirm the proposed purchase terms directly.
              </p>
            </div>
            <div className="footer-contact-card">
              <span className="footer-contact-label">
                LET’S BUILD WHAT’S NEXT
              </span>
              <h3>Discuss your cloud account requirements.</h3>
              <p>
                Ask about package availability, account checks, and a final
                quote.
              </p>
              <a
                className="primary"
                href="https://t.me/dexterw4tts"
                target="_blank"
                rel="noopener noreferrer"
              >
                Talk on Telegram ↗
              </a>
              <button className="secondary" onClick={() => browse()}>
                Explore products
              </button>
            </div>
          </section>
          <div className="store-footer-columns">
            <div>
              <h3>CLOUD PROVIDERS</h3>
              {brands.map((b) => (
                <a
                  key={b.name}
                  href={"/" + providerRoute(b) + "/"}
                  onClick={() => navigate(providerRoute(b))}
                >
                  {b.full}
                </a>
              ))}
            </div>
            <div>
              <h3>EXPLORE</h3>
              <a href="/cart/">Shopping Cart</a>
              <a href="/checkout/">Checkout</a>
              <a href="/contact-sales/" onClick={() => navigate("contact")}>
                Contact Sales
              </a>
              <a href="/marketplace/" onClick={() => navigate("products")}>
                Cloud Marketplace
              </a>
              <a href="/cloud-platforms/" onClick={() => navigate("providers")}>
                Cloud Platforms
              </a>
              <a href="/compare-products/" onClick={() => navigate("compare")}>
                Compare products
              </a>
              <a href="/help-center/" onClick={() => navigate("faq")}>
                Help Center
              </a>
              <a href="/seller-profile/" onClick={() => navigate("verified")}>
                Seller Profile
              </a>
              <a
                href="/verification/public-proof/"
                onClick={() => navigate("verification/public-proof")}
              >
                Public seller declaration
              </a>
            </div>
            <div>
              <h3>BUYING GUIDES</h3>
              {guides.map((g) => (
                <a key={g.title} href={routePath(guideRoute(g))}>
                  {g.title}
                </a>
              ))}
            </div>
            <div>
              <h3>POPULAR PACKAGES</h3>
              {products.slice(0, 4).map((p) => (
                <a
                  key={productRoute(p)}
                  href={"/" + productRoute(p) + "/"}
                  onClick={() => navigate(productRoute(p))}
                >
                  {p.provider} {p.name}
                </a>
              ))}
            </div>
          </div>
          <div className="footer-stage">
            <div className="footer-horizon" aria-hidden="true" />
            <FooterWordmark />
            <div className="footer-bottom">
              <span>© 2026 Buy AWS Accounts AI. All rights reserved.</span>
              <span>
                Independent seller. Not affiliated with cloud providers.
              </span>
              <a
                className="footer-back-top"
                href="#page-content"
                onClick={(e) => {
                  e.preventDefault();
                  scrollPageTo(0);
                  document
                    .querySelector("header .brand")
                    ?.focus({ preventScroll: true });
                }}
              >
                Back to top ↑
              </a>
            </div>
          </div>
        </div>
      </footer>
      {!order && !guide && !["cart", "checkout"].includes(page) && (
        <a
          className="telegram-floating"
          href="https://t.me/dexterw4tts"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on Telegram"
        >
          <span className="telegram-floating-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M21.4 3.5 18.2 20c-.2 1.2-.9 1.5-1.9.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L5.7 13.8.9 12.3c-1-.3-1-1 .2-1.5L20 3.2c.9-.3 1.7.2 1.4.3Z" />
            </svg>
          </span>
          <span>Contact us</span>
        </a>
      )}
      {(order || guide) && (
        <Modal
          onClose={() => {
            setOrder(null);
            setGuide(null);
          }}
        >
          <button
            className="icon close"
            aria-label="Close dialog"
            onClick={() => {
              setOrder(null);
              setGuide(null);
            }}
          >
            <X />
          </button>
          {order ? (
            <>
              <ShoppingBag className="orange" />
              <h2 id="dialog-title" className="order-provider-title">
                <ProviderLogo name={order.provider} />
                {order.provider} · {order.name}
              </h2>
              <div className="variant-label">
                Product variant
                <VariantSelect
                  label="Product variant"
                  value={productRoute(order)}
                  onChange={(value) => {
                    setOrder(products.find((p) => productRoute(p) === value));
                  }}
                  options={products
                    .filter((p) => p.provider === order.provider)
                    .map((p) => ({
                      value: productRoute(p),
                      label: `${p.name} — ${formatPrice(p.price)}`,
                    }))}
                />
              </div>
              <div className="price">
                {formatPrice(order.price)}
                <span>/ account</span>
              </div>
              <ul>
                {order.features.map((f) => (
                  <li key={f}>
                    <Check size={16} />
                    {f}
                  </li>
                ))}
              </ul>
              <p>
                Add this package to your cart, or continue to checkout. Review
                your selection and choose USDT TRC20, BEP20, or ERC20 before
                confirming payment instructions with the seller.
              </p>
              <div className="order-cart-actions">
                <button
                  className="secondary"
                  onClick={() => {
                    cart.add(order);
                    setOrder(null);
                    navigate("cart");
                  }}
                >
                  <ShoppingBag size={16} aria-hidden="true" />
                  Add to cart
                </button>
                <button
                  className="primary"
                  onClick={() => {
                    cart.add(order);
                    setOrder(null);
                    navigate("checkout");
                  }}
                >
                  Checkout
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
              </div>
              <a
                className="order-contact commerce-back"
                href="https://t.me/dexterw4tts"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask the seller on Telegram
              </a>
            </>
          ) : (
            <>
              <BookOpen className="orange" />
              <div className="eyebrow">{guide.category}</div>
              <h2 id="dialog-title">{guide.title}</h2>
              <p>{guide.text}</p>
              <ol>
                {guide.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <button
                className="primary"
                onClick={() => {
                  setGuide(null);
                  browse();
                }}
              >
                Explore packages
              </button>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
