import { brands, products } from "./catalog.js";
import { productRoute, providerRoute } from "./catalogPaths.js";
import { guideByRoute } from "./guideRoutes.js";
import { pageNames } from "./pageNames.js";
import { routePath } from "./routing.js";
export function breadcrumbsFor(id, pathname = routePath(id)) {
  if (pathname === "/" || ["cart", "checkout", "not-found"].includes(id))
    return [];
  const home = { name: "Home", path: "/" };
  const product = products.find((p) => productRoute(p) === id),
    provider = brands.find((b) => providerRoute(b) === id),
    guide = guideByRoute(id);
  if (product) {
    const brand = brands.find((b) => b.name === product.provider);
    return [
      home,
      { name: "Marketplace", path: "/marketplace/" },
      { name: brand.name + " Accounts", path: routePath(providerRoute(brand)) },
      { name: product.name, path: routePath(id) },
    ];
  }
  if (provider)
    return [
      home,
      { name: "Cloud Platforms", path: "/cloud-platforms/" },
      { name: provider.name + " Accounts", path: routePath(id) },
    ];
  if (guide)
    return [
      home,
      { name: "Buying Guides", path: "/buying-guides/" },
      { name: guide.title, path: routePath(id) },
    ];
  if (id === "verification/public-proof")
    return [
      home,
      { name: "Seller Profile", path: "/seller-profile/" },
      { name: "Seller Declaration", path: routePath(id) },
    ];
  return [home, { name: pageNames[id] || "Page", path: routePath(id) }];
}
