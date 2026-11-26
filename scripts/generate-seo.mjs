import fs from "node:fs/promises";
import path from "node:path";
import {
  getPageSeo,
  siteSchema,
  safeJson,
  socialEntries,
  twitterEntries,
  SITE_URL,
} from "../seo.js";
import { routeIds, routePath } from "../routing.js";
import { render } from "../.ssg-build/entry-server.js";
const output = path.resolve("dist"),
  template = await fs.readFile(path.join(output, "index.html"), "utf8");
const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
const verification = (process.env.GOOGLE_SITE_VERIFICATION || "").trim();
if (verification && !/^[A-Za-z0-9_-]{10,256}$/.test(verification))
  throw new Error(
    "Invalid GOOGLE_SITE_VERIFICATION format. Supply the actual public HTML verification token.",
  );
async function pageHtml(id, pathname) {
  const seo = getPageSeo(id, pathname),
    schema = siteSchema(seo),
    body = await render(id, pathname);
  const meta = (key, value, property = false) =>
    `<meta ${property ? "property" : "name"}="${key}" content="${escape(value)}"/>`;
  const tags = [
    ...(seo.canonical
      ? [`<link rel="canonical" href="${escape(seo.canonical)}"/>`]
      : []),
    meta("robots", seo.robots),
    ...Object.entries(socialEntries(seo)).map(([k, v]) => meta(k, v, true)),
    ...Object.entries(twitterEntries(seo)).map(([k, v]) => meta(k, v)),
    ...(schema
      ? [
          `<script id="site-seo-schema" type="application/ld+json">${safeJson(schema)}</script>`,
        ]
      : []),
    ...(verification && !template.includes(`content="${verification}"`)
      ? [meta("google-site-verification", verification)]
      : []),
  ].join("");
  return template
    .replace(
      /<title>[^]*?<\/title>/,
      "<title>" + escape(seo.title) + "</title>",
    )
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?\s*>/,
      meta("description", seo.description),
    )
    .replace(/<meta name="keywords" content="[^"]*"\s*\/?\s*>/g, "")
    .replace("</head>", tags + "</head>")
    .replace(
      '<div id="root"></div>',
      `<div id="root" data-prerendered="true" data-route="${escape(id)}" data-path="${escape(pathname)}">${body}</div>`,
    );
}
await fs.writeFile(
  path.join(output, "index.html"),
  await pageHtml("products", "/"),
);
for (const id of routeIds) {
  const pathname = routePath(id),
    file = path.join(output, pathname, "index.html");
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, await pageHtml(id, pathname));
}
await fs.writeFile(
  path.join(output, "404.html"),
  await pageHtml("not-found", "/404/"),
);
const urls = [
  SITE_URL + "/",
  ...routeIds
    .filter((id) => !getPageSeo(id).robots.startsWith("noindex"))
    .map((id) => SITE_URL + routePath(id)),
];
await fs.writeFile(
  path.join(output, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((url) => `  <url><loc>${escape(url)}</loc></url>`).join("\n") +
    "\n</urlset>\n",
);
// Cart/checkout remain crawlable so their noindex directives can be processed.
await fs.writeFile(
  path.join(output, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);
await fs.writeFile(
  path.join(output, "seo-build-manifest.json"),
  JSON.stringify(
    {
      prerenderedPages: routeIds.length + 1,
      sitemapUrls: urls.length,
      verificationConfigured: Boolean(verification),
      routes: routeIds.map((id) => ({
        id,
        path: routePath(id),
        title: getPageSeo(id).title,
        indexable: !getPageSeo(id).robots.startsWith("noindex"),
      })),
    },
    null,
    2,
  ),
);
console.log(
  `Prerendered ${routeIds.length + 1} pages and custom 404 with complete React content; ${urls.length} canonical sitemap URLs. Search Console token: ${verification ? "configured" : "not configured"}.`,
);

await import("./generate-catalog-seo.mjs");

await import("./generate-url-mapping.mjs");
