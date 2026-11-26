import { productPath, providerPath } from "./catalogPaths";
import { productPurchaseState } from "./purchase-state";
import { guides } from "./editorialContent";
import { guideRoute } from "./guideRoutes";
import { providerRoute } from "./catalogPaths";
import React from "react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  ShoppingBag,
  FileText,
} from "lucide-react";
import {
  getProductArticle,
  providerBuyingNotes,
  variantIntroductions,
} from "./productArticles";
import ProviderLogo from "./ProviderLogo";
import { productRoute } from "./catalogPaths";
import { formatPrice } from "./catalog";
export default function ProductBuyingArticle({ product, brand, onOrder }) {
  const publication = productPurchaseState(product);
  const article = getProductArticle(product, brand);
  return (
    <article
      className="product-buying-article"
      aria-labelledby="product-article-title"
    >
      <div className="product-article-heading">
        <span>PRODUCT BUYING GUIDE · {brand.full}</span>
        <h2 id="product-article-title">{article.title}</h2>
        <p data-keyword-description="true">{article.intro}</p>
        <div className="product-article-facts">
          <span>
            {publication.priceLabel} <strong>{article.price} / account</strong>
          </span>
          <span>
            Package <strong>{product.type}</strong>
          </span>
        </div>
      </div>
      <div className="product-article-body">
        <p className="product-article-byline">
          <BookOpen size={16} aria-hidden="true" />
          Original buying guide by Buy AWS Accounts AI
        </p>
        {article.sections.map((section, i) => (
          <section key={section.title}>
            <span className="product-article-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{section.title}</h3>
            {section.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            {section.checks && (
              <ul>
                {section.checks.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <div className="product-article-seller">
          <FileText size={22} aria-hidden="true" />
          <div>
            <h3>Seller information, ready to review.</h3>
            <p>
              Read the seller-supplied profile and public declaration before
              discussing this package.
            </p>
            <a href="/seller-profile/">
              View seller details
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a href="/verification/public-proof/">
              Read public declaration
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
        <nav
          className="product-resource-links"
          aria-label="Related product buying resources"
        >
          <a href={providerPath(brand)}>Buy {brand.name} Accounts: compare variants</a>
          <a href="/compare-products/">Compare product specifications</a>
          <a href={"/" + guideRoute(guides[0]) + "/"}>
            Read the cloud account buying guide
          </a>
          <a href="/help-center/">Product requirements and support</a>
          <a href="/contact-sales/">Ask about applicable policies</a>
        </nav>
        <div className="product-article-actions">
          <button
            className="primary"
            disabled={!publication.purchasable}
            onClick={() => onOrder(product)}
          >
            <ShoppingBag size={16} aria-hidden="true" />
            {publication.purchasable
              ? "Buy " + brand.name + " " + product.name
              : publication.published ? publication.unavailableLabel : "Publication review pending"}
          </button>
          <a className="secondary" href="/contact-sales/">
            Ask about this package
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
export function CatalogBuyingArticles({ brands, products }) {
  return (
    <section
      className="catalog-articles"
      aria-labelledby="catalog-articles-title"
    >
      <div className="catalog-articles-intro">
        <span className="section-label">THE PRODUCT BUYING LIBRARY</span>
        <h2 id="catalog-articles-title">
          Know the package.
          <br />
          <span>Buy with a clear brief.</span>
        </h2>
        <p>
          Shop cloud account and credit packages with product-specific
          information, transparent reference pricing, and direct seller contact.
          Read the original guide for each listing, compare the proposed scope,
          and bring the right questions to your buying conversation.
        </p>
        <p>
          Review <a href="/seller-profile/">our seller profile</a> and the
          published declaration, then request the account details relevant to
          your chosen product. Verification should relate to the account being
          offered, the permitted setup, and the written purchase terms.
        </p>
      </div>
      <div className="catalog-article-providers">
        {brands.map((brand, i) => {
          const list = products.filter((p) => p.provider === brand.name);
          return (
            <details key={brand.name} open={brands.length === 1 || i === 0}>
              <summary>
                <span>
                  <ProviderLogo name={brand.name} decorative />
                  <strong>{brand.full}</strong>
                </span>
                <span>
                  {list.length} product guides
                  <ChevronDown size={18} aria-hidden="true" />
                </span>
              </summary>
              <div className="catalog-provider-reading">
                <p>{providerBuyingNotes[brand.name]}</p>
                <div className="catalog-variant-reading">
                  {list.map((product) => (
                    <article key={productRoute(product)}>
                      <div>
                        <h3>
                          <a href={productPath(product)}>
                            Buy {brand.name} {product.name}
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </a>
                        </h3>
                        <span>
                          {formatPrice(product.price)}
                          <small> / account</small>
                        </span>
                      </div>
                      <p>
                        {variantIntroductions[product.provider][product.name]}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </details>
          );
        })}
      </div>
      <div className="catalog-article-closing">
        <div>
          <h3>From product research to an agreed purchase.</h3>
          <p>
            Review each reference and its requirements. Purchase and payment
            capabilities are reserved for offers that pass publication review.
            No current reference is made eligible by its price or description
            alone.
          </p>
        </div>
        <a className="secondary" href="/contact-sales/">
          Discuss your requirements
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
