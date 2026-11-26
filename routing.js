import {guides} from './editorialContent.js';
import {guideRoute} from './guideRoutes.js';
import { brands, products } from './catalog.js';

export const pageSlugs = {
  products: 'marketplace',
  providers: 'cloud-platforms',
  compare: 'compare-products',
  guides: 'buying-guides',
  faq: 'help-center',
  verified: 'seller-profile',
  contact: 'contact-sales',
};
const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
export const routeIds = [
  'cart',
  'checkout',
  'products',
  'providers',
  'compare',
  'guides',
  'faq',
  'contact',
  'verified',
  'verification/public-proof',
  ...guides.map(guideRoute),
  ...brands.map((b) => slug(b.name) + '-accounts'),
  ...products.map((p) => 'product/' + slug(p.provider + ' ' + p.name)),
];
const publicIds = Object.fromEntries(
  Object.entries(pageSlugs).map(([id, path]) => [path, id]),
);
export const validRoute = (id) => routeIds.includes(id);
export const routePath = (id) =>
  '/' + (pageSlugs[id] || id).replace(/^\/+|\/+$/g, '') + '/';
export const pathRoute = (pathname) => {
  if (pathname === '/') return 'products';
  const path = pathname.replace(/^\/+|\/+$/g, '');
  return publicIds[path] || (validRoute(path) ? path : null);
};
export function migrateLegacyRoute() {
  const hashId = window.location.hash.slice(1);
  const id = hashId
    ? pathRoute('/' + hashId + '/')
    : pathRoute(window.location.pathname);
  if (!id || (!hashId && window.location.pathname === '/')) return;
  const path = routePath(id);
  if (hashId || window.location.pathname !== path) {
    window.history.replaceState(null, '', path + window.location.search);
  }
}
export function currentRoute() {
  migrateLegacyRoute();
  return pathRoute(window.location.pathname) || 'not-found';
}
