// One-hop canonical redirects; existing catalog/cart IDs remain stable.
import fs from "node:fs/promises";
import { routeIds, routePath, pathRoute } from "../routing.js";
import { catalogSeoRecords } from "../catalog-seo.js";
import { SITE } from "../site-config.js";
const config = JSON.parse(await fs.readFile("vercel.json", "utf8"));
const legacy = JSON.parse(
  await fs.readFile("legacy-url-redirects.json", "utf8"),
);
const map = new Map();
function add(source, destination) {
  if (source === destination) return;
  if (map.has(source) && map.get(source) !== destination)
    throw Error("Conflicting redirect " + source);
  map.set(source, destination);
}
for (const r of legacy) {
  if (r.has || /[:*]/.test(r.source))
    throw Error("Review nonliteral legacy redirect before generation");
  const id = pathRoute(r.destination);
  const destination = id ? routePath(id) : r.destination;
  add(r.source, destination);
  add(r.source.replace(/\/$/, ""), destination);
}
for (const record of catalogSeoRecords) {
  const old = "/" + record.id + "/";
  const target = routePath(record.id);
  add(old, target);
  add(old.slice(0, -1), target);
  add(old + "index.html", target);
}
for (const id of routeIds) {
  const target = routePath(id);
  add(target.slice(0, -1), target);
  add(target + "index.html", target);
}
add("/index.html", "/");
for (const [source, destination] of map) {
  if (map.has(destination))
    throw Error("Redirect chain " + source + " -> " + destination);
  if (!pathRoute(destination))
    throw Error("Unknown redirect destination " + destination);
}
// Explicit slash/non-slash redirects avoid global slash normalization before a legacy redirect.
delete config.trailingSlash;
config.redirects = [...map].map(([source, destination]) => ({
  source,
  destination: SITE.url + destination,
  permanent: true,
}));
// Domain-level apex redirects must be disabled only AFTER this routing is deployed.
// Exact canonical paths avoid a catch-all dropping the trailing slash and adding a hop.
const apexHost = new URL(SITE.url).hostname.replace(/^www\./, "");
const hostCondition = [{ type: "host", value: apexHost }];
for (const source of ["/", ...routeIds.map(routePath)])
  config.redirects.push({
    source,
    destination: SITE.url + source,
    has: hostCondition,
    permanent: true,
  });
config.redirects.push({
  source: "/:path*/",
  destination: SITE.url + "/:path*/",
  has: hostCondition,
  permanent: true,
});
config.redirects.push({
  source: "/:path*",
  destination: SITE.url + "/:path*",
  has: hostCondition,
  permanent: true,
});
config.rewrites = routeIds.map((id) => ({
  source: routePath(id),
  destination: routePath(id) + "index.html",
}));
await fs.writeFile("vercel.json", JSON.stringify(config, null, 2) + "\n");
console.log(
  `URL configuration: ${catalogSeoRecords.length} keyword paths; ${map.size} preserved permanent mappings plus ${config.redirects.length - map.size} apex-host rules; ${routeIds.length} exact static rewrites.`,
);
