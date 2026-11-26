import { catalogSeoById } from "./catalog-seo.js";
import {
  productPublication,
  categoryPublication,
} from "./offer-publication.js";
import { catalogEditorial } from "./catalog-editorial-data.js";
import { brands, products } from "./catalog.js";
import { productRoute, providerRoute } from "./catalogPaths.js";
import { guides } from "./editorialContent.js";
import { pageNames } from "./pageNames.js";
import { routePath } from "./routing.js";
import { SITE, pageSeo } from "./site-config.js";
import { seoOverrides, confirmedCommerceFacts } from "./seo-overrides.js";
import { guideByRoute, guideRoute } from "./guideRoutes.js";
import { breadcrumbsFor } from "./breadcrumbData.js";
import { productSpecifications } from "./productSpecs.js";
import { getProductArticle } from "./productArticles.js";
export const SITE_URL = SITE.url;
export const HOME_SEO = pageSeo.home;
export const publicProductName = (product) =>
  `${product.provider} ${product.name}`;
export const productImage = (product) =>
  "/social/products/" + productRoute(product).split("/").pop() + ".png";
const short = (value, length = 158) =>
  value.length <= length
    ? value
    : value.slice(0, length - 1).replace(/\s+\S*$/, "") + "…";
const absolute = (value) => new URL(value, SITE_URL + "/").href;
function productTitle(product) {
  if (product.kind === "AI")
    return (
      [
        product.provider,
        product.vcpus && `${product.vcpus} vCPU`,
        product.credit && `$${product.credit.toLocaleString("en-US")} Credits`,
        product.provider === "AWS"
          ? "Bedrock"
          : product.provider === "Azure"
            ? product.tpm
              ? "GPT 6 Astra T5"
              : "GPT Enabled"
            : "Gemini AI",
        product.rpm,
      ]
        .filter(Boolean)
        .join(" ") +
      " | " +
      SITE.name
    );
  return SITE.titleTemplate.replace("%s", publicProductName(product));
}
export function getPageSeo(id, pathname = routePath(id)) {
  const home = pathname === "/" && id === "products",
    product = products.find((p) => productRoute(p) === id),
    provider = brands.find((b) => providerRoute(b) === id),
    guide = guideByRoute(id),
    notFound = id === "not-found";
  const publication = product
    ? productPublication(product)
    : provider
      ? categoryPublication(
          provider,
          products.filter((p) => p.provider === provider.name),
        )
      : null;
  const record = catalogSeoById.get(id);
  const planned = catalogSeoById.get(id);
  const core = home ? pageSeo.home : pageSeo[id];
  const override = seoOverrides[home ? "home" : id] || {};
  const title =
    override.title ||
    core?.title ||
    planned?.seoTitle ||
    (notFound
      ? "Page Not Found | " + SITE.name
      : product
        ? (publication.published ? "Buy " : "Reference: ") +
          productTitle(product).replace(/ \| .*$/, "")
        : provider
          ? publication.published
            ? `Buy ${provider.name} Accounts | Product Requirements`
            : `${provider.name} Account Reference Catalog | Review Details`
          : guide
            ? guide.title + " | " + SITE.name
            : (pageNames[id] || "Cloud Products") + " | " + SITE.name);
  const description =
    override.description ||
    core?.description ||
    planned?.metaDescription ||
    (product
      ? short(
          publication.published
            ? publication.review.publicDescription
            : catalogEditorial[productRoute(product)].intro,
        )
      : provider
        ? short(
            `Review ${provider.full} catalog references, specifications and publication requirements. ${products.filter((p) => p.provider === provider.name).length} seller-listed variations await authorization and availability review.`,
          )
        : guide
          ? short(guide.text)
          : notFound
            ? "This page could not be found. Browse the current cloud account marketplace or contact sales for help."
            : id === "cart"
              ? "Review your selected cloud account products and quantities before checkout."
              : id === "checkout"
                ? "Prepare your cloud account order and select USDT TRC20, BEP20, or ERC20 payment instructions."
                : "Read the first-party seller declaration and supplied business information for BuyAWSAccountsAI.");
  const url = SITE_URL + (home ? "/" : notFound ? pathname : routePath(id));
  return {
    id,
    home,
    notFound,
    product,
    provider,
    guide,
    publication,
    record,
    seoRecord: planned,
    title,
    description,
    h1:
      override.h1 ||
      core?.h1 ||
      planned?.h1 ||
      (product &&
        (publication.published
          ? "Buy " + publicProductName(product)
          : "Review " + publicProductName(product) + " reference")) ||
      guide?.title ||
      (provider
        ? provider.name + " reference collection"
        : notFound
          ? "We couldn’t find that page."
          : id === "cart"
            ? "Shopping Cart."
            : id === "checkout"
              ? "Checkout."
              : id === "verification/public-proof"
                ? "Seller Declaration.\nA record of supplied information."
                : pageNames[id] || SITE.name),
    primaryKeyword:
      override.primaryKeyword ||
      core?.primaryKeyword ||
      planned?.primaryKeyword ||
      (product
        ? publication.published
          ? "buy " + publicProductName(product).toLowerCase()
          : publicProductName(product).toLowerCase() + " reference"
        : provider
          ? provider.name.toLowerCase() + " account references"
          : guide
            ? guide.title.toLowerCase()
            : ""),
    secondaryKeywords:
      override.secondaryKeywords ||
      core?.secondaryKeywords ||
      planned?.secondaryKeywords ||
      (product
        ? publication.published
          ? [
              "buy " + publicProductName(product).toLowerCase() + " online",
              "purchase " + publicProductName(product).toLowerCase(),
              "order " + publicProductName(product).toLowerCase(),
              "shop " + publicProductName(product).toLowerCase(),
              publicProductName(product).toLowerCase() +
                " pricing and requirements",
              publicProductName(product).toLowerCase() + " account terms",
            ]
          : [
              publicProductName(product).toLowerCase() + " reference",
              product.group.toLowerCase(),
            ]
        : provider && publication.published
          ? [
              "buy " + provider.name.toLowerCase() + " accounts online",
              "purchase " + provider.name.toLowerCase() + " accounts",
              "order " + provider.name.toLowerCase() + " accounts",
              "shop " + provider.name.toLowerCase() + " accounts",
              provider.name.toLowerCase() + " account pricing",
              provider.name.toLowerCase() + " account requirements",
            ]
          : []),
    longTailKeywords: planned?.longTailKeywords || [],
    searchIntent:
      planned?.searchIntent ||
      (publication?.published
        ? "Transactional"
        : publication
          ? "Reference / informational"
          : core?.primaryKeyword?.startsWith("buy ")
            ? "Transactional"
            : "Informational"),
    canonical: notFound ? null : url,
    url,
    robots:
      notFound || ["cart", "checkout"].includes(id) || override.noindex
        ? "noindex, follow"
        : "index, follow",
    image: absolute(
      override.image || (product ? productImage(product) : SITE.defaultImage),
    ),
    imageAlt:
      override.imageAlt ||
      (product
        ? publicProductName(product) +
          (publication.published
            ? " — cloud account product"
            : " — catalog reference illustration")
        : SITE.name + " cloud account marketplace"),
    imageWidth: SITE.imageWidth,
    imageHeight: SITE.imageHeight,
  };
}
export function confirmedOffer(
  product,
  facts = confirmedCommerceFacts[productRoute(product)],
) {
  if (!productPublication(product, facts).published) return null;
  return {
    "@type": "Offer",
    url: SITE_URL + routePath(productRoute(product)),
    price: facts.price,
    priceCurrency: "USD",
    availability: "https://schema.org/" + facts.availability,
    seller: { "@id": SITE_URL + "/#organization" },
    ...(facts.priceValidUntil &&
    /^\d{4}-\d{2}-\d{2}$/.test(facts.priceValidUntil)
      ? { priceValidUntil: facts.priceValidUntil }
      : {}),
  };
}
export function siteSchema(seo) {
  if (seo.notFound) return null;
  const webPage = {
    "@type":
      seo.provider ||
      (seo.id === "products" && !seo.home) ||
      seo.id === "guides"
        ? "CollectionPage"
        : seo.guide
          ? "Article"
          : "WebPage",
    "@id": seo.url + "#webpage",
    url: seo.url,
    name: seo.title,
    description: seo.description,
    isPartOf: { "@id": SITE_URL + "/#website" },
    inLanguage: SITE.language,
  };
  if (seo.guide)
    Object.assign(webPage, {
      headline: seo.guide.title,
      author: { "@id": SITE_URL + "/#organization" },
      publisher: { "@id": SITE_URL + "/#organization" },
    });
  const graph = [
    {
      "@type": "Organization",
      "@id": SITE_URL + "/#organization",
      name: SITE.name,
      url: SITE_URL + "/",
      description: SITE.description,
      logo: {
        "@type": "ImageObject",
        url: SITE_URL + "/logos/buyawsaccountsai-header-logo.png",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        url: SITE_URL + "/contact-sales/",
        email: SITE.email,
        telephone: SITE.telephone,
        availableLanguage: "English",
      },
    },
    {
      "@type": "WebSite",
      "@id": SITE_URL + "/#website",
      url: SITE_URL + "/",
      name: SITE.name,
      publisher: { "@id": SITE_URL + "/#organization" },
      inLanguage: SITE.language,
    },
    webPage,
  ];
  const crumbs = breadcrumbsFor(seo.id, seo.home ? "/" : routePath(seo.id));
  if (crumbs.length)
    graph.push({
      "@type": "BreadcrumbList",
      "@id": seo.url + "#breadcrumbs",
      itemListElement: crumbs.map((c, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: c.name,
        item: SITE_URL + c.path,
      })),
    });
  if (seo.product) {
    const brand = brands.find((b) => b.name === seo.product.provider),
      offer = confirmedOffer(seo.product);
    const item = {
      "@type": seo.product.offeringType === "service" ? "Service" : "Product",
      "@id": seo.url + "#product",
      name:
        seo.product.offeringType === "service"
          ? seo.publication.review?.serviceName ||
            publicProductName(seo.product)
          : publicProductName(seo.product),
      description: getProductArticle(seo.product, brand).intro,
      url: seo.url,
      image: [seo.image],
      category: seo.product.group,
      additionalProperty: [
        ...productSpecifications(seo.product).map(([name, value]) => ({
          "@type": "PropertyValue",
          name,
          value,
        })),
        {
          "@type": "PropertyValue",
          name: "Reference price (USD)",
          value: seo.product.price,
        },
      ],
    };
    if (seo.product.offeringType === "service") {
      delete item.additionalProperty;
      delete item.category;
      item.serviceType = seo.product.group;
      item.provider = { "@id": SITE_URL + "/#organization" };
    }
    if (offer) item.offers = offer;
    const sku = confirmedCommerceFacts[productRoute(seo.product)]?.sku;
    if (item["@type"] === "Product" && typeof sku === "string" && sku.trim())
      item.sku = sku;
    graph.push(item);
    webPage.mainEntity = { "@id": item["@id"] };
  }
  const candidates = seo.provider
    ? products.filter((p) => p.provider === seo.provider.name)
    : seo.id === "products"
      ? seo.home
        ? products.slice(0, 6)
        : products
      : null;
  const list = candidates?.filter(
    (p) => !getPageSeo(productRoute(p)).robots.startsWith("noindex"),
  );
  if (list?.length)
    graph.push({
      "@type": "ItemList",
      "@id": seo.url + "#products",
      numberOfItems: list.length,
      itemListElement: list.map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: publicProductName(p),
        url: SITE_URL + routePath(productRoute(p)),
      })),
    });
  if (seo.id === "guides")
    graph.push({
      "@type": "ItemList",
      "@id": seo.url + "#guides",
      numberOfItems: guides.length,
      itemListElement: guides.map((g, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: g.title,
        url: SITE_URL + routePath(guideRoute(g)),
      })),
    });
  return { "@context": "https://schema.org", "@graph": graph };
}
export const safeJson = (value) =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
export const socialEntries = (seo) => ({
  "og:title": seo.title,
  "og:description": seo.description,
  "og:url": seo.url,
  "og:image": seo.image,
  "og:image:alt": seo.imageAlt,
  "og:image:width": String(seo.imageWidth),
  "og:image:height": String(seo.imageHeight),
  "og:type": seo.guide ? "article" : "website",
  "og:site_name": SITE.name,
  "og:locale": SITE.locale,
});
export const twitterEntries = (seo) => ({
  "twitter:card": "summary_large_image",
  "twitter:title": seo.title,
  "twitter:description": seo.description,
  "twitter:image": seo.image,
  "twitter:image:alt": seo.imageAlt,
});
export function applyPageSeo(id, pathname) {
  const seo = getPageSeo(id, pathname);
  document.title = seo.title;
  const meta = (key, value, property = false) => {
    const attr = property ? "property" : "name";
    let e = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!value) {
      e?.remove();
      return;
    }
    if (!e) {
      e = document.createElement("meta");
      e.setAttribute(attr, key);
      document.head.appendChild(e);
    }
    e.content = value;
  };
  meta("description", seo.description);
  meta("robots", seo.robots);
  meta("keywords", "");
  for (const [key, value] of Object.entries(socialEntries(seo)))
    meta(key, value, true);
  for (const [key, value] of Object.entries(twitterEntries(seo)))
    meta(key, value);
  let canonical = document.head.querySelector("link[rel=canonical]");
  if (!seo.canonical) canonical?.remove();
  else {
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = seo.canonical;
  }
  let schema = document.getElementById("site-seo-schema");
  const value = siteSchema(seo);
  if (!value) schema?.remove();
  else {
    if (!schema) {
      schema = document.createElement("script");
      schema.type = "application/ld+json";
      schema.id = "site-seo-schema";
      document.head.appendChild(schema);
    }
    schema.textContent = safeJson(value);
  }
}
