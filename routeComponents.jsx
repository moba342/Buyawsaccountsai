import React, { lazy } from "react";
// Preload the initial route before hydration. Cart/storage effects must not replace
// already-rendered HTML with a Suspense fallback while its route chunk downloads.
function loadable(loader) {
  let Component, pending;
  const load = () =>
    (pending ||= loader().then((module) => {
      Component = module.default;
      return module;
    }));
  const Lazy = lazy(load);
  function View(props) {
    const Current = Component || Lazy;
    return <Current {...props} />;
  }
  return { View, load };
}
const routes = {
  providers: loadable(() => import("./ProvidersPage")),
  catalog: loadable(() =>
    import("./DetailPages").then((m) => ({ default: m.CatalogPage })),
  ),
  contact: loadable(() => import("./ContactPage")),
  verified: loadable(() => import("./SellerVerificationPage")),
  proof: loadable(() => import("./PublicProofPage")),
  article: loadable(() => import("./GuideArticlePage")),
  cart: loadable(() =>
    import("./CommercePages").then((m) => ({ default: m.CartPage })),
  ),
  checkout: loadable(() =>
    import("./CommercePages").then((m) => ({ default: m.CheckoutPage })),
  ),
};
export const ProvidersPage = routes.providers.View,
  CatalogPage = routes.catalog.View,
  ContactPage = routes.contact.View,
  SellerVerificationPage = routes.verified.View,
  PublicProofPage = routes.proof.View,
  GuideArticlePage = routes.article.View,
  CartPage = routes.cart.View,
  CheckoutPage = routes.checkout.View;
export function preloadRoute(id) {
  const key =
    id.startsWith("product/") || id.endsWith("-accounts")
      ? "catalog"
      : id.startsWith("buying-guides/")
        ? "article"
        : id === "verification/public-proof"
          ? "proof"
          : id;
  return routes[key]?.load() || Promise.resolve();
}
