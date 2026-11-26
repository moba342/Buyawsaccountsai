import { providerPath } from "./catalogPaths";
import CatalogPublicationNotice from "./CatalogPublicationNotice";
import { productPublication } from "./offer-publication";
import { catalogEditorial } from "./catalog-editorial-data";
import { getPageSeo, confirmedOffer } from "./seo";
import ProductVisual from "./ProductVisual";
import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowDown,
  ChevronDown,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  FileText,
  MessageCircle,
  Check,
  Globe,
  Layers,
} from "lucide-react";
import ProductBuyingArticle, {
  CatalogBuyingArticles,
} from "./ProductBuyingArticle";
import CatalogAccountCard from "./CatalogAccountCard";
import ProviderLogo from "./ProviderLogo";
import VariantSelect from "./VariantSelect";
import { providerEditorial, faqs as purchaseFAQs } from "./editorialContent";
import { formatPrice } from "./catalog";
import { providerRoute, productRoute } from "./catalogPaths";
import { productSpecifications } from "./productSpecs";
import { scrollPageTo } from "./SmoothScrolling";
import { sellerDeclaration as seller } from "./sellerDeclaration";
export { slug, providerRoute, productRoute } from "./catalogPaths";
function Collection({ brand, list, product, onOrder, onCompare, onAddToCart }) {
  const [group, setGroup] = useState("All"),
    [query, setQuery] = useState(""),
    [expanded, setExpanded] = useState(false);
  useEffect(() => {
    setGroup("All");
    setQuery("");
    setExpanded(false);
  }, [brand.name, product?.name]);
  const groups = [...new Set(list.map((p) => p.group))],
    options = list.filter((p) => p !== product),
    filtered = options.filter(
      (p) =>
        (group === "All" || p.group === group) &&
        (p.name + " " + p.features.join(" "))
          .toLowerCase()
          .includes(query.toLowerCase()),
    ),
    shown = product && !expanded ? filtered.slice(0, 4) : filtered;
  return (
    <section
      id="package-options"
      className="account-collection"
      aria-labelledby="account-collection-title"
    >
      <div className="account-section-heading">
        <div>
          <span className="account-eyebrow">
            {product ? "CONTINUE EXPLORING" : "THE ACCOUNT COLLECTION"}
          </span>
          <h2 id="account-collection-title">
            {product
              ? "More " + brand.name + " options"
              : "All " + brand.name + " accounts"}
          </h2>
          <p>
            {product
              ? "Compare other variants from this provider."
              : "Compare the listed scope and price, then choose the package you want to discuss."}
          </p>
        </div>
        {product && (
          <a className="account-text-link" href={providerPath(brand)}>
            View all {list.length} variants
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        )}
      </div>
      <div
        className={
          "account-collection-layout " +
          (groups.length === 1 ? "single-group" : "")
        }
      >
        <div className="account-category-nav">
          <span>Account categories</span>
          <button
            aria-pressed={group === "All"}
            onClick={() => {
              setGroup("All");
              setExpanded(true);
            }}
          >
            All packages<strong>{options.length}</strong>
          </button>
          {groups.map((name) => (
            <button
              aria-pressed={group === name}
              key={name}
              onClick={() => {
                setGroup(name);
                setExpanded(true);
              }}
            >
              {name.replace(brand.name + " ", "")}
              <strong>{options.filter((p) => p.group === name).length}</strong>
            </button>
          ))}
          <a href="/contact-sales/">
            Need help choosing?
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
        <div className="account-collection-results">
          <div className="account-collection-toolbar">
            <span>
              {filtered.length} {filtered.length === 1 ? "package" : "packages"}{" "}
              · Prices in USD
            </span>
            <label>
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                aria-label="Search provider packages"
                placeholder="Find a variant…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setExpanded(true);
                }}
              />
            </label>
          </div>
          <div className="account-collection-grid">
            {shown.map((p) => (
              <CatalogAccountCard
                key={productRoute(p)}
                product={p}
                brand={brand}
                onOrder={onOrder}
                onCompare={onCompare}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
          {!shown.length && (
            <div className="account-no-results">
              <h3>No matching packages</h3>
              <p>Try another category or a shorter search.</p>
              <button
                className="secondary"
                onClick={() => {
                  setQuery("");
                  setGroup("All");
                }}
              >
                Reset filters
              </button>
            </div>
          )}
          {shown.length < filtered.length && (
            <button
              className="secondary account-show-more"
              onClick={() => setExpanded(true)}
            >
              Show all {filtered.length} variants
              <ChevronDown size={16} aria-hidden="true" />
            </button>
          )}
          <p className="account-price-note">
            Reference prices apply to the listed account package. Confirm
            availability, the final quote, provider usage charges, and delivery
            terms before payment.
          </p>
        </div>
      </div>
    </section>
  );
}
function BuyingProcess() {
  return (
    <section
      className="account-process"
      aria-labelledby="account-process-title"
    >
      <div className="account-section-heading">
        <div>
          <span className="account-eyebrow">A STRAIGHTFORWARD PURCHASE</span>
          <h2 id="account-process-title">From selection to delivery.</h2>
          <p>
            A clear package, an agreed scope, and a record of your purchase.
          </p>
        </div>
      </div>
      <ol>
        {[
          [
            "Choose your package",
            "Compare the account type, listed price, and proposed scope against your workload.",
          ],
          [
            "Confirm the details",
            "Request current account information, a final quote, delivery arrangements, and support terms in writing.",
          ],
          [
            "Checkout and review",
            "Review your cart, choose the USDT network, and check the TXID after payment. The seller matches the transfer to your order and arranges delivery.",
          ],
        ].map(([title, body], i) => (
          <li key={title}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
function Planning({ brand, copy }) {
  return (
    <section className="account-planning">
      <div className="account-section-heading">
        <div>
          <span className="account-eyebrow">PLAN BEFORE YOU PURCHASE</span>
          <h2>Choose the account around your workload.</h2>
          <p>{copy.about}</p>
        </div>
      </div>
      <div className="account-workloads">
        {[
          [
            "Application hosting",
            "Describe your application and deployment plan so you can check the required services, region, and resource limits.",
          ],
          [
            "Data & storage",
            "Plan storage capacity, data location, and access needs alongside the account package and ongoing usage budget.",
          ],
          [
            "Infrastructure",
            "Review compute quotas, networking requirements, and billing responsibility before selecting the account.",
          ],
          [
            "Automation",
            "Identify scheduled workloads and integration needs so the proposed setup can be evaluated against them.",
          ],
          [
            "AI & experimentation",
            "Estimate the resources and services your experiments need, then confirm access and spending controls.",
          ],
          [
            "Cloud operations",
            "Establish who manages access, recovery, billing, and monitoring after the agreed delivery process.",
          ],
        ].map(([title, body]) => (
          <div key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
      <div className="account-buying-notes">
        <div>
          <h3>A brief that fits your project</h3>
          <p>
            For a new project, compare a focused package for a prototype, test
            environment, or first deployment. For a growing application, review
            the proposed limits and operating costs. For client work, clarify
            the account owner, access roles, and delivery responsibilities.
          </p>
          <p>{copy.review}</p>
        </div>
        <div>
          <h3>For individual builders and teams</h3>
          <p>
            Developers can compare options for testing and application
            development. Startups can plan account requirements alongside launch
            budgets. Agencies should agree client ownership and required access;
            growing teams should review administration and operating costs
            before the next deployment.
          </p>
          <a href={providerPath(brand)} className="account-text-link">
            Explore the {brand.name} collection
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
export function CatalogPage({
  brand,
  product,
  products,
  brands,
  navigate,
  onOrder,
  onCompare,
  onAddToCart,
}) {
  const publication = product ? productPublication(product) : null;
  const list = products.filter((p) => p.provider === brand.name),
    groups = [...new Set(list.map((p) => p.group))],
    copy = providerEditorial[brand.name],
    lowest = Math.min(...list.map((p) => p.price));
  const questions = [
    [
      `Which ${brand.name} accounts are listed?`,
      `${list.length} variants are listed in this collection. Compare the account types and reference prices, then confirm current account details and availability for your selected package.`,
    ],
    purchaseFAQs[0],
    purchaseFAQs[1],
    purchaseFAQs[2],
    purchaseFAQs[7],
  ];
  return (
    <main
      id="page-content"
      tabIndex={-1}
      className="catalog-detail-page"
      data-provider={brand.name}
    >
      <section
        className={
          "account-page-hero " + (product ? "is-product" : "is-collection")
        }
      >
        <div className="account-page-hero-copy">
          <div className="account-provider-lockup">
            <span>
              <ProviderLogo name={brand.name} decorative priority />
            </span>
            <div>
              {product ? (
                <strong>{product.name}</strong>
              ) : (
                <h1 className="account-collection-title">
                  {getPageSeo(providerRoute(brand)).h1}
                </h1>
              )}
              <span>{product ? product.group : "ACCOUNT COLLECTION"}</span>
            </div>
          </div>
          {product ? (
            <>
              <h1>{getPageSeo(productRoute(product)).h1}</h1>
              <CatalogPublicationNotice product={product} />
              <p className="account-product-introduction">
                {publication?.published && publication.review.publicDescription
                  ? publication.review.publicDescription
                  : catalogEditorial[productRoute(product)].intro}
              </p>
              <ProductVisual
                provider={product.provider}
                title={product.name}
                product={product}
              />
              <section
                className="account-product-specs"
                aria-labelledby="account-specs-title"
              >
                <h2 id="account-specs-title">Product specifications</h2>
                <dl>
                  {productSpecifications(product).map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <p>
                  Specification and model labels are supplied by the seller.
                  Confirm the details for the account offered.
                </p>
              </section>
            </>
          ) : (
            <>
              <ProductVisual
                provider={brand.name}
                title={brand.name + " Accounts"}
              />
            </>
          )}
        </div>
        <aside
          className="account-purchase-panel"
          aria-label={
            product ? "Selected package purchase" : "Collection overview"
          }
        >
          <div className="account-purchase-top">
            <span>
              {product ? "YOUR SELECTED PACKAGE" : "COLLECTION OVERVIEW"}
            </span>
            <span>{product ? product.kind : list.length + " variants"}</span>
          </div>
          <div className="account-purchase-price">
            <span>{product ? "Reference package price" : "Packages from"}</span>
            <strong>
              {formatPrice(product ? product.price : lowest)}
              <small>USD</small>
            </strong>
            <p>Per account · Confirm final quote</p>
            {product && (
              <p className="account-availability">
                Publication:{" "}
                {publication.published
                  ? "Reviewed offer"
                  : "Pending verification — not available to order"}
              </p>
            )}
          </div>
          {product ? (
            <>
              <label
                className="account-variant-label"
                htmlFor="account-product-variant"
              >
                Choose your variant
              </label>
              <VariantSelect
                id="account-product-variant"
                label="Choose your variant"
                value={productRoute(product)}
                onChange={navigate}
                options={list.map((p) => ({
                  value: productRoute(p),
                  label: p.name + " — " + formatPrice(p.price),
                }))}
              />
              <ul className="account-purchase-checks">
                {product.features.map((text) => (
                  <li key={text}>
                    <Check size={14} aria-hidden="true" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <button
                className="primary"
                disabled={!publication.purchasable}
                onClick={() => onOrder(product)}
              >
                {publication.purchasable
                  ? "Buy Now"
                  : publication.published
                    ? "Currently unavailable"
                    : "Pending verification"}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button
                className="secondary"
                disabled={!publication.purchasable}
                onClick={() =>
                  onAddToCart ? onAddToCart(product) : onOrder(product)
                }
              >
                <ShoppingCart size={16} aria-hidden="true" />
                Add to cart
              </button>
              <button
                className="account-purchase-compare"
                onClick={() => onCompare(product)}
              >
                <SlidersHorizontal size={14} aria-hidden="true" />
                Compare this package
              </button>
            </>
          ) : (
            <>
              <div className="account-overview-categories">
                {groups.map((group) => (
                  <div key={group}>
                    <span>{group.replace(brand.name + " ", "")}</span>
                    <strong>
                      {list.filter((p) => p.group === group).length}
                    </strong>
                  </div>
                ))}
              </div>
              <button
                className="primary"
                onClick={() =>
                  scrollPageTo(document.getElementById("package-options"))
                }
              >
                View the collection
                <ArrowDown size={16} aria-hidden="true" />
              </button>
            </>
          )}
          <a className="account-panel-seller" href="/seller-profile/">
            <img
              src="/optimized/dexter-watts-400.webp"
              srcSet="/optimized/dexter-watts-240.webp 240w, /optimized/dexter-watts-400.webp 400w, /optimized/dexter-watts-640.webp 640w"
              sizes="(max-width:767px)160px,200px"
              width="36"
              height="36"
              alt=""
            />
            <span>
              <strong>{seller.sellerName}</strong>
              <small>View seller profile</small>
            </span>
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </aside>
      </section>
      <div className="account-assurances">
        {[
          [
            Layers,
            "A defined selection",
            "Account types and variants in one collection.",
          ],
          [
            FileText,
            "Clear purchase terms",
            "Confirm the scope, price, and delivery in writing.",
          ],
          [
            Globe,
            "Account-specific checks",
            "Review region, eligibility, and relevant limits.",
          ],
          [
            MessageCircle,
            "Direct seller contact",
            "Discuss your requirements before ordering.",
          ],
        ].map(([Icon, title, body]) => (
          <div key={title}>
            <Icon size={19} aria-hidden="true" />
            <div>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </div>
      {!product && (
        <Collection
          brand={brand}
          list={list}
          onOrder={onOrder}
          onCompare={onCompare}
          onAddToCart={onAddToCart}
        />
      )}
      <BuyingProcess />
      {product ? (
        <>
          <ProductBuyingArticle
            product={product}
            brand={brand}
            onOrder={onOrder}
          />
          <Collection
            brand={brand}
            product={product}
            list={list}
            onOrder={onOrder}
            onCompare={onCompare}
            onAddToCart={onAddToCart}
          />
        </>
      ) : (
        <>
          <Planning brand={brand} copy={copy} />
          <details className="account-reading-room">
            <summary>
              <span>
                <BookLabel />
                Product buying guides for {brand.name}
              </span>
              <ChevronDown size={18} aria-hidden="true" />
            </summary>
            <CatalogBuyingArticles brands={[brand]} products={list} />
          </details>
        </>
      )}
      <section className="account-faq" aria-labelledby="account-faq-title">
        <div className="account-section-heading">
          <div>
            <span className="account-eyebrow">BEFORE YOU ORDER</span>
            <h2 id="account-faq-title">Questions worth asking.</h2>
            <p>Practical answers for your account purchase.</p>
          </div>
          <a href="/help-center/" className="account-text-link">
            All FAQs
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
        {questions.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <ChevronDown size={17} aria-hidden="true" />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <section className="account-related">
        <div>
          <span className="account-eyebrow">KEEP EXPLORING</span>
          <h2>Find the right fit for your project.</h2>
          <p>
            Compare providers or review our buying guides before choosing your
            next package.
          </p>
          <div>
            <a href="/compare-products/">
              Compare products
              <ArrowRight size={14} aria-hidden="true" />
            </a>
            <a href="/buying-guides/">
              Read buying guides
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="account-related-providers">
          {brands
            .filter((b) => b.name !== brand.name)
            .map((b) => (
              <a key={b.name} href={providerPath(b)}>
                {b.full}
                <ArrowRight size={13} aria-hidden="true" />
              </a>
            ))}
        </div>
      </section>
    </main>
  );
}
function BookLabel() {
  return <FileText size={18} aria-hidden="true" />;
}
