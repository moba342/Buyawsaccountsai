import http from "node:http";
// Full preserved-map and host normalization audit; no hosting mutations.
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import tls from "node:tls";
import { routeIds, routePath } from "../../routing.js";
const config = JSON.parse(await fs.readFile("vercel.json", "utf8"));
const policy = JSON.parse(
  await fs.readFile("hosting-redirect-policy.json", "utf8"),
);
const local = process.env.HOST_AUDIT_MODE === "local",
  qa = process.env.QA_URL || "http://localhost:4173";
const out =
  process.env.QA_EVIDENCE_DIR || "docs/seo/evidence/hosting-redirects";
const rows = config.redirects.filter((r) => !r.has),
  pages = ["/", ...routeIds.map(routePath)],
  report = {
    date: "2026-11-27",
    mode: local ? "local host simulation" : "live actual HTTP/TLS",
    preservedMappings: rows.length,
    legacyChecks: 0,
    redirectHostCanonicalChecks: 0,
    canonicalHostChecks: 0,
    queryPreserved: 0,
    chains: [],
    certificates: [],
    errors: [],
  };
async function request(logical) {
  const u = new URL(logical);
  if (!local) return fetch(logical, { redirect: "manual" });
  return new Promise((resolve, reject) => {
    http
      .get(
        qa + u.pathname + u.search,
        { headers: { Host: u.hostname } },
        (res) => {
          res.resume();
          resolve({
            status: res.statusCode,
            headers: new Headers({ location: res.headers.location || "" }),
          });
        },
      )
      .on("error", reject);
  });
}
async function direct(source, expected, hops) {
  const r = await request(source);
  if (!hops) {
    assert.equal(r.status, 200, source);
    return;
  }
  assert.equal(r.status, 308, source);
  const target = new URL(r.headers.get("location"), source);
  assert.equal(target.href, expected, source + " destination");
  const end = await request(target.href);
  assert.equal(end.status, 200, source + " one-hop final");
  report.queryPreserved++;
}
async function batch(list, fn) {
  for (let i = 0; i < list.length; i += 8)
    await Promise.all(list.slice(i, i + 8).map(fn));
}
const query = "?utm_source=host-audit&keep=a%2Bb";
for (const host of [policy.redirectHost, new URL(policy.canonicalOrigin).hostname])
  await batch(rows, async (r) => {
    await direct(
      "https://" + host + r.source + query,
      r.destination + query,
      1,
    );
    report.legacyChecks++;
  });
await batch(pages, async (p) => {
  await direct(
    "https://" + policy.redirectHost + p + query,
    policy.canonicalOrigin + p + query,
    1,
  );
  report.redirectHostCanonicalChecks++;
  await direct(
    policy.canonicalOrigin + p + query,
    policy.canonicalOrigin + p + query,
    0,
  );
  report.canonicalHostChecks++;
});
report.redirectHostFallbackChecks = [];
for (const [path, finalStatus] of [
  ["/favicon.png", 200],
  ["/definitely-missing-host-audit/", 404],
]) {
  const source = "https://" + policy.redirectHost + path + query,
    r = await request(source);
  assert.equal(r.status, 308, source);
  const target = new URL(r.headers.get("location"), source);
  assert.equal(target.origin, policy.canonicalOrigin);
  assert.equal(target.search, query);
  const end = await request(target.href);
  assert.equal(end.status, finalStatus);
  report.redirectHostFallbackChecks.push({ source, target: target.href, finalStatus });
}
if (!local) {
  const cases = [
    "http://" + policy.apexHost + "/",
    "https://" + policy.apexHost + "/",
    "http://www." + policy.apexHost + "/",
    "https://www." + policy.apexHost + "/",
    ...[
      "http://" + policy.apexHost,
      "http://www." + policy.apexHost,
      "https://" + policy.apexHost,
      "https://www." + policy.apexHost,
    ].flatMap((base) =>
      [
        "/aws-accounts/",
        "/product/aws-8-vcpu/",
        "/buy-aws-accounts",
        "/buy-aws-accounts/",
      ].map((p) => base + p + query),
    ),
  ];
  for (const source of cases) {
    let current = source;
    const hops = [],
      visited = new Set();
    for (let n = 0; n < 6; n++) {
      assert(!visited.has(current), "loop " + source);
      visited.add(current);
      const r = await request(current),
        location = r.headers.get("location");
      hops.push({ url: current, status: r.status, location });
      if (!location) {
        assert.equal(r.status, 200, source);
        break;
      }
      assert([301, 308].includes(r.status), source + " permanent");
      current = new URL(location, current).href;
    }
    assert(hops.at(-1).status === 200, "No final 200 " + source);
    assert(
      current.startsWith(policy.canonicalOrigin + "/"),
      source + " canonical host",
    );
    report.chains.push({ source, redirects: hops.length - 1, hops });
  }
  for (const host of [
    policy.redirectHost,
    new URL(policy.canonicalOrigin).hostname,
  ]) {
    const cert = await new Promise((resolve, reject) => {
      const socket = tls.connect(
        { host, port: 443, servername: host, rejectUnauthorized: true },
        () => {
          const p = socket.getPeerCertificate();
          resolve({
            host,
            authorized: socket.authorized,
            validFrom: p.valid_from,
            validTo: p.valid_to,
            subjectAltName: p.subjectaltname,
          });
          socket.end();
        },
      );
      socket.on("error", reject);
      socket.setTimeout(15000, () => {
        socket.destroy();
        reject(Error("TLS timeout"));
      });
    });
    assert(cert.authorized);
    report.certificates.push(cert);
  }
}
await fs.mkdir(out, { recursive: true });
await fs.writeFile(
  out + (local ? "/local-host-audit.json" : "/live-host-audit.json"),
  JSON.stringify(report, null, 2),
);
console.log(
  JSON.stringify(
    {
      mode: report.mode,
      preservedMappings: report.preservedMappings,
      legacyChecks: report.legacyChecks,
      redirectHostCanonicalChecks: report.redirectHostCanonicalChecks,
      canonicalHostChecks: report.canonicalHostChecks,
      queryPreserved: report.queryPreserved,
      chains: report.chains.map(({ source, redirects }) => ({
        source,
        redirects,
      })),
      certificates: report.certificates,
      errors: report.errors,
    },
    null,
    2,
  ),
);
