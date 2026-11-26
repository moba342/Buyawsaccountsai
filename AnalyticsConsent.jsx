import { productPath } from "./catalogPaths";
import { productPublication, canPurchaseProduct } from "./offer-publication";
import React, { useEffect, useRef, useState } from "react";
import {
  analyticsConfiguration,
  CONSENT_KEY,
  hasAnalyticsConsent,
  initializeAnalytics,
  setAnalyticsConsent,
  trackEvent,
  publicAnalyticsItem,
} from "./analytics";
import { brands, products } from "./catalog";
import { productRoute, providerRoute } from "./catalogPaths";
export default function AnalyticsConsent({ page, pathname, cart }) {
  const [decision, setDecision] = useState(""),
    [settings, setSettings] = useState(false),
    last = useRef(""),
    lastCheckout = useRef("");
  useEffect(() => {
    if (!analyticsConfiguration.enabled) return;
    const sync = (event) => {
      if (event?.type === "storage" && event.key !== CONSENT_KEY) return;
      if (!hasAnalyticsConsent()) {
        last.current = "";
        lastCheckout.current = "";
      }
      try {
        setDecision(localStorage.getItem(CONSENT_KEY) || "");
      } catch {
        setDecision("denied");
      }
    };
    sync();
    window.addEventListener("baa:analytics-consent", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("baa:analytics-consent", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  useEffect(() => {
    if (!hasAnalyticsConsent()) return;
    initializeAnalytics();
    const navigationChanged = last.current !== pathname;
    if (navigationChanged) {
      last.current = pathname;
      trackEvent("page_view", { page_location: location.origin + pathname });
    }
    const product = products.find((p) => productRoute(p) === page),
      provider = brands.find((b) => providerRoute(b) === page);
    if (navigationChanged && product && productPublication(product).published)
      trackEvent("view_item", {
        currency: "USD",
        value: product.price,
        items: [publicAnalyticsItem(product)],
      });
    if (navigationChanged && (page === "products" || provider)) {
      const list = provider
        ? products.filter((p) => p.provider === provider.name)
        : pathname === "/"
          ? products.slice(0, 6)
          : products;
      trackEvent("view_item_list", {
        item_list_name: provider?.name || "Marketplace",
        items: list
          .filter((p) => productPublication(p).published)
          .map((p) => publicAnalyticsItem(p)),
      });
    }
    if (page !== "checkout") lastCheckout.current = "";
    const checkoutSignature = cart.lines
      .map((l) => l.id + ":" + l.quantity)
      .join(",");
    if (
      page === "checkout" &&
      cart.lines.length &&
      cart.lines.every((l) => canPurchaseProduct(l.product)) &&
      checkoutSignature !== lastCheckout.current
    ) {
      lastCheckout.current = checkoutSignature;
      trackEvent("begin_checkout", {
        currency: "USD",
        value: cart.total,
        items: cart.lines.map((l) =>
          publicAnalyticsItem(l.product, l.quantity),
        ),
      });
    }
  }, [page, pathname, decision, cart.lines, cart.total]);
  useEffect(() => {
    if (!analyticsConfiguration.enabled) return;
    const click = (event) => {
      const a = event.target.closest?.("a[href]");
      if (!a) return;
      const url = new URL(a.href, location.href),
        product = products.find((p) => url.pathname === productPath(p));
      if (product && productPublication(product).published)
        trackEvent("select_item", { items: [publicAnalyticsItem(product)] });
      const method =
        url.hostname === "t.me"
          ? "Telegram"
          : url.protocol === "mailto:"
            ? "Email"
            : url.protocol === "tel:"
              ? "Phone"
              : url.pathname === "/contact-sales/"
                ? "Website"
                : "";
      if (method) trackEvent("contact_sales", { method });
    };
    document.addEventListener("click", click, { capture: true });
    return () => document.removeEventListener("click", click, true);
  }, []);
  if (!analyticsConfiguration.enabled) return null;
  if (decision && !settings)
    return (
      <button
        type="button"
        className="analytics-settings"
        onClick={() => setSettings(true)}
      >
        Analytics settings
      </button>
    );
  return (
    <section
      className="analytics-consent"
      aria-label="Optional analytics preferences"
    >
      <div>
        <strong>Optional analytics</strong>
        <p>
          Allow analytics to help us understand how this website is used?
          Shopping works either way.{" "}
          <a href={analyticsConfiguration.privacy}>Read the privacy notice</a>.
        </p>
      </div>
      <button
        type="button"
        className="secondary"
        onClick={() => {
          setAnalyticsConsent(false);
          setSettings(false);
        }}
      >
        Decline
      </button>
      <button
        type="button"
        className="primary"
        onClick={() => {
          setAnalyticsConsent(true);
          setSettings(false);
        }}
      >
        Allow analytics
      </button>
    </section>
  );
}
