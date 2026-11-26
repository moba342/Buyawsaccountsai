import { brands, products } from './catalog.js';
import { productRoute, providerRoute } from './catalogPaths.js';
import { providerEditorial } from './editorialContent.js';
import { pageNames } from './pageNames.js';
import { routePath } from './routing.js';

export const SITE_URL = 'https://www.buyawsaccountsai.com';
export const HOME_SEO = {
  title: 'Buy AWS Accounts & Cloud Credits | BuyAWSAccountsAI',
  description:
    'Buy AWS accounts and explore cloud credits, Bedrock API access, and cloud account options. Compare available plans and pricing for your cloud requirements.',
  keywords: [
    ...new Set([
      'buy AWS accounts',
      'buy AWS account',
      'AWS accounts for sale',
      'buy Amazon AWS account',
      'buy AWS accounts online',
      'AWS cloud accounts for sale',
      'buy AWS credits',
      'buy cloud accounts',
      'buy cloud credits',
      'buy AWS Bedrock account',
      'buy AWS Bedrock API key',
      'AWS account seller',
      'cheap AWS accounts',
      'cloud accounts for sale',
      'buy AWS Bedrock accounts',
      'AWS Bedrock API key',
      'AWS Bedrock accounts for sale',
      'buy Amazon Bedrock API',
      'AWS Bedrock API access',
      'AWS Bedrock API pricing',
    ]),
  ].join(', '),
};
const descriptions = {
  cart: 'Review your selected cloud account products and quantities before checkout.',
  checkout:
    'Prepare your cloud account order and select USDT TRC20, BEP20, or ERC20 payment instructions.',
  'verification/public-proof':
    'Read the seller-supplied public declaration for Dexter Watts and BuyAWSAccountsAI. First-party record BAA-PROOF-2026-0001 with seller-provided identity and contact information.',
  verified:
    'Review seller-provided contact details, the public declaration, and the information to request before buying a cloud account from Buy AWS Accounts AI.',
  products:
    'Compare AWS and multi-cloud account products, credits, and seller-listed AI access. Review prices, account details, and purchase terms in the BuyAWSAccountsAI marketplace.',
  providers:
    'Compare cloud account providers, account types, credit packages, and listed prices. Contact Buy AWS Accounts AI to discuss current account details and purchase terms.',
  compare:
    'Compare up to three cloud account products by price and proposed scope, then confirm account eligibility and final purchase terms with Buy AWS Accounts AI.',
  guides:
    'Read original cloud account buying guides covering product selection, credit conditions, account delivery, and security checks before you order.',
  faq: 'Find answers about buying cloud accounts, verification details, pricing, credit eligibility, delivery, and support at Buy AWS Accounts AI.',
  contact:
    'Contact Buy AWS Accounts AI on Telegram, by email, or by phone to discuss cloud account products, request a quote, or ask about an existing order.',
};
export function getPageSeo(id, pathname = routePath(id)) {
  const home = pathname === '/' && id === 'products';
  const product = products.find((p) => productRoute(p) === id);
  const provider = brands.find((b) => providerRoute(b) === id);
  const title = home
    ? HOME_SEO.title
    : (product
        ? `Buy ${product.provider} ${product.name}`
        : provider
          ? `Buy ${provider.full} Accounts`
          : pageNames[id] || 'Cloud Account Products') +
      ' | Buy AWS Accounts AI';
  const description = home
    ? HOME_SEO.description
    : product
      ? `Review the ${product.provider} ${product.name} account product, listed pricing, buying considerations, and delivery questions before contacting Buy AWS Accounts AI.`
      : provider
        ? providerEditorial[provider.name].summary
        : descriptions[id];
  const canonical = SITE_URL + (home ? '/' : routePath(id));
  return {
    title,
    description,
    canonical,
    home,
    keywords: home ? HOME_SEO.keywords : '',
    robots: ['cart', 'checkout'].includes(id)
      ? 'noindex, nofollow'
      : 'index, follow',
    image: SITE_URL + '/logos/buyawsaccountsai-header-logo.png',
  };
}
export function siteSchema(seo) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': SITE_URL + '/#organization',
        name: 'BuyAWSAccountsAI',
        url: SITE_URL + '/',
        logo: {
          '@type': 'ImageObject',
          url: SITE_URL + '/logos/buyawsaccountsai-header-logo.png',
        },
      },
      {
        '@type': 'WebSite',
        '@id': SITE_URL + '/#website',
        url: SITE_URL + '/',
        name: 'BuyAWSAccountsAI',
        publisher: { '@id': SITE_URL + '/#organization' },
        inLanguage: 'en',
      },
      {
        '@type': 'WebPage',
        '@id': seo.canonical + '#webpage',
        url: seo.canonical,
        name: seo.title,
        description: seo.description,
        isPartOf: { '@id': SITE_URL + '/#website' },
        inLanguage: 'en',
      },
    ],
  };
}
export function applyPageSeo(id, pathname) {
  const seo = getPageSeo(id, pathname);
  document.title = seo.title;
  const meta = (key, value, property = false) => {
    const attr = property ? 'property' : 'name';
    let element = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!value) {
      element?.remove();
      return;
    }
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, key);
      document.head.appendChild(element);
    }
    element.content = value;
  };
  meta('description', seo.description);
  meta('robots', seo.robots);
  meta('keywords', seo.keywords);
  for (const [key, value] of Object.entries({
    title: seo.title,
    description: seo.description,
    url: seo.canonical,
    image: seo.image,
    'image:alt': 'BuyAWSAccountsAI cloud account marketplace',
    type: 'website',
    site_name: 'BuyAWSAccountsAI',
  }))
    meta('og:' + key, value, true);
  for (const [key, value] of Object.entries({
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    image: seo.image,
  }))
    meta('twitter:' + key, value);
  let canonical = document.head.querySelector('link[rel=canonical]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = seo.canonical;
  let schema = document.getElementById('site-seo-schema');
  if (!schema) {
    schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.id = 'site-seo-schema';
    document.head.appendChild(schema);
  }
  schema.textContent = JSON.stringify(siteSchema(seo));
}
