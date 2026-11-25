export const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
export const providerRoute = (brand) => `${slug(brand.name)}-accounts`;
export const productRoute = (product) =>
  `product/${slug(product.provider + ' ' + product.name)}`;
