import fs from 'node:fs/promises';
import path from 'node:path';
import { HOME_SEO, SITE_URL, getPageSeo, siteSchema } from '../seo.js';
import { routeIds, routePath } from '../routing.js';

const output = path.resolve('dist');
const template = await fs.readFile(path.join(output, 'index.html'), 'utf8');
const escape = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
function pageHtml(seo) {
  const meta = (name, value, property = false) =>
    `<meta ${property ? 'property' : 'name'}="${name}" content="${escape(value)}"/>`;
  const tags = [
    `<link rel="canonical" href="${escape(seo.canonical)}"/>`,
    meta('robots', seo.robots),
    ...(seo.keywords ? [meta('keywords', seo.keywords)] : []),
    ...Object.entries({
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      image: seo.image,
      'image:alt': 'BuyAWSAccountsAI cloud account marketplace',
      type: 'website',
      site_name: 'BuyAWSAccountsAI',
    }).map(([key, value]) => meta('og:' + key, value, true)),
    ...Object.entries({
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      image: seo.image,
    }).map(([key, value]) => meta('twitter:' + key, value)),
    `<script id="site-seo-schema" type="application/ld+json">${JSON.stringify(siteSchema(seo)).replace(/</g, '\\u003c')}</script>`,
  ].join('');
  return template
    .replace(
      /<title>[^]*?<\/title>/,
      '<title>' + escape(seo.title) + '</title>',
    )
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?\s*>/,
      meta('description', seo.description),
    )
    .replace('</head>', tags + '</head>');
}
await fs.writeFile(
  path.join(output, 'index.html'),
  pageHtml(getPageSeo('products', '/')),
);
for (const id of routeIds) {
  const file = path.join(output, routePath(id), 'index.html');
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, pageHtml(getPageSeo(id)));
}
const urls = [
  SITE_URL + '/',
  ...routeIds
    .filter((id) => !['cart', 'checkout'].includes(id))
    .map((id) => SITE_URL + routePath(id)),
];
await fs.writeFile(
  path.join(output, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((url) => `  <url><loc>${escape(url)}</loc></url>`).join('\n') +
    '\n</urlset>\n',
);
await fs.writeFile(
  path.join(output, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);
console.log(
  `Generated static SEO heads for home and ${routeIds.length} routes, plus ${urls.length} sitemap URLs. Homepage: ${HOME_SEO.title}`,
);
