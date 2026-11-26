import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { routeIds, routePath } from "../routing.js";
const config = JSON.parse(
  fs.readFileSync(new URL("../vercel.json", import.meta.url)),
);
const policy = JSON.parse(
  fs.readFileSync(new URL("../hosting-redirect-policy.json", import.meta.url)),
);
test("all 535 production redirect mappings are preserved with final absolute HTTPS non-WWW destinations", () => {
  const rules = config.redirects.filter((r) => !r.has);
  assert.equal(rules.length, policy.preservedMappings);
  const rows = rules
    .map((r) => {
      const u = new URL(r.destination);
      assert.equal(u.origin, policy.canonicalOrigin);
      assert(r.permanent);
      return [r.source, u.pathname, r.permanent];
    })
    .sort((a, b) => a[0].localeCompare(b[0]));
  assert.equal(
    createHash("sha256").update(JSON.stringify(rows)).digest("hex"),
    policy.mappingSha256,
  );
});
test("noncanonical host pages have direct host-conditional redirects before the fallback", () => {
  const rules = config.redirects.filter((r) => r.has);
  assert.equal(rules.length, 98);
  for (const source of ["/", ...routeIds.map(routePath)]) {
    const rule = rules.find((r) => r.source === source);
    assert(rule);
    assert.deepEqual(rule.has, [{ type: "host", value: policy.redirectHost }]);
    assert.equal(rule.destination, policy.canonicalOrigin + source);
    assert(rule.permanent);
  }
  assert.equal(config.redirects.at(-2).source, "/:path*/");
  assert.equal(
    config.redirects.at(-2).destination,
    policy.canonicalOrigin + "/:path*/",
  );
  assert.equal(config.redirects.at(-1).source, "/:path*");
  assert.deepEqual(config.redirects.at(-1).has, [
    { type: "host", value: policy.redirectHost },
  ]);
  assert.equal(
    config.redirects.at(-1).destination,
    policy.canonicalOrigin + "/:path*",
  );
  assert(config.redirects.slice(0, 535).every((r) => !r.has));
});

test("canonical domain cannot match a host redirect rule", () => {
  const canonicalHost = new URL(policy.canonicalOrigin).hostname;
  assert.equal(canonicalHost, policy.apexHost);
  assert.notEqual(policy.redirectHost, canonicalHost);
  for (const rule of config.redirects.filter(r => r.has)) assert(rule.has.every(c => c.type !== "host" || c.value !== canonicalHost));
});
