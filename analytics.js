// Optional public measurement configuration. No tracker loads without consent and a privacy URL.
const env = import.meta.env || {};
const ga = /^G-[A-Z0-9]+$/.test(env.VITE_GA_MEASUREMENT_ID || "")
  ? env.VITE_GA_MEASUREMENT_ID
  : "";
const gtm = /^GTM-[A-Z0-9]+$/.test(env.VITE_GTM_ID || "")
  ? env.VITE_GTM_ID
  : "";
const privacy = env.VITE_ANALYTICS_PRIVACY_URL || "";
export const analyticsConfiguration = {
  ga,
  gtm,
  privacy,
  enabled: Boolean(
    (ga || gtm) && /^https:\/\/www\.buyawsaccountsai\.com\//.test(privacy),
  ),
};
export const CONSENT_KEY = "baa-analytics-consent-v1";
const allowed = new Set([
  "page_view",
  "view_item_list",
  "select_item",
  "view_item",
  "add_to_cart",
  "remove_from_cart",
  "begin_checkout",
  "add_payment_info",
  "contact_sales",
]);
export function publicAnalyticsItem(product, quantity = 1) {
  return {
    item_id:
      "product/" +
      (product.provider + " " + product.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    item_name: product.provider + " " + product.name,
    item_brand: product.provider,
    price: product.price,
    quantity: Math.max(1, Math.min(99, quantity)),
  };
}
export function sanitizedEvent(name, data = {}) {
  if (!allowed.has(name)) return null;
  const result = {};
  for (const key of ["currency", "payment_type", "method", "item_list_name"])
    if (typeof data[key] === "string") result[key] = data[key].slice(0, 120);
  if (Number.isFinite(data.value) && data.value >= 0) result.value = data.value;
  if (Array.isArray(data.items))
    result.items = data.items
      .slice(0, 100)
      .map((item) =>
        Object.fromEntries(
          ["item_id", "item_name", "item_brand", "price", "quantity"]
            .filter((k) => item[k] !== undefined)
            .map((k) => [k, item[k]]),
        ),
      );
  if (name === "page_view" && typeof data.page_location === "string") {
    try {
      const url = new URL(data.page_location);
      result.page_location = url.origin + url.pathname;
    } catch {}
  }
  return result;
}
export function hasAnalyticsConsent() {
  try {
    return (
      analyticsConfiguration.enabled &&
      localStorage.getItem(CONSENT_KEY) === "granted"
    );
  } catch {
    return false;
  }
}
let loaded = false;
export function initializeAnalytics() {
  if (typeof window === "undefined" || !hasAnalyticsConsent() || loaded)
    return false;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("consent", "update", { analytics_storage: "granted" });
  const script = document.createElement("script");
  script.async = true;
  script.dataset.baaAnalytics = "true";
  if (analyticsConfiguration.gtm) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    script.src =
      "https://www.googletagmanager.com/gtm.js?id=" +
      analyticsConfiguration.gtm;
  } else {
    window.gtag("js", new Date());
    window.gtag("config", analyticsConfiguration.ga, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: location.origin + location.pathname,
      page_referrer: sanitizedReferrer(),
    });
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      analyticsConfiguration.ga;
  }
  document.head.appendChild(script);
  return true;
}
export function setAnalyticsConsent(granted) {
  try {
    localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  } catch {}
  if (granted) initializeAnalytics();
  else if (typeof window !== "undefined") {
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
    document
      .querySelectorAll("script[data-baa-analytics]")
      .forEach((e) => e.remove());
    loaded = false;
  }
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event("baa:analytics-consent"));
}
function sanitizedReferrer() {
  try {
    const url = new URL(document.referrer);
    return url.origin + url.pathname;
  } catch {
    return "";
  }
}
export function trackEvent(name, data) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  const parameters = sanitizedEvent(name, data);
  if (!parameters) return;
  parameters.page_location = location.origin + location.pathname;
  parameters.page_referrer = sanitizedReferrer();
  initializeAnalytics();
  if (analyticsConfiguration.gtm)
    window.dataLayer.push({ event: name, ...parameters });
  else window.gtag?.("event", name, parameters);
}
export function trackProductEvent(name, product, quantity = 1) {
  trackEvent(name, {
    currency: "USD",
    value: product.price * quantity,
    items: [publicAnalyticsItem(product, quantity)],
  });
}
