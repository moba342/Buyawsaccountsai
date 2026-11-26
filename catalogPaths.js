export const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const providerRoute = (brand) => `${slug(brand.name)}-accounts`;
export const productRoute = (product) =>
  `product/${slug(product.provider + " " + product.name)}`;

// Public URLs are independent of stable catalog/order IDs above.
export const buyingKeyword = (name) => "buy " + name.toLowerCase();
export const providerPath = (brand) =>
  "/" + slug(buyingKeyword(brand.name + " Accounts")) + "/";
export const productPath = (product) =>
  "/" + slug(buyingKeyword(product.provider + " " + product.name)) + "/";
