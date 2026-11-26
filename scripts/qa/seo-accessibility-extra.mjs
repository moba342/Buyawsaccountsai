// Browser QA is optional tooling, intentionally separate from runtime dependencies.
// Set QA_TOOLS_PACKAGE_JSON to a tools package with playwright and @axe-core/playwright.
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(
  process.env.QA_TOOLS_PACKAGE_JSON || import.meta.url,
);
const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const evidence = fileURLToPath(
  new URL("../../docs/seo/evidence/", import.meta.url),
);
const chrome = process.env.CHROME_PATH
  ? { executablePath: process.env.CHROME_PATH }
  : { channel: "chrome" };
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { guides } from "../../editorialContent.js";
import { guideRoute } from "../../guideRoutes.js";
const b = await chromium.launch({ ...chrome }),
  c = await b.newContext({ reducedMotion: "reduce" }),
  p = await c.newPage(),
  result = {
    scans: 0,
    violations: [],
    spaMetadata: false,
    stickyHeader: false,
  };
await c.addInitScript(() => {
  window.__initialRouteFallbacks = 0;
  new MutationObserver((records) => {
    for (const record of records)
      for (const node of record.addedNodes)
        if (
          node.nodeType === 1 &&
          (node.matches?.(".route-loading") ||
            node.querySelector?.(".route-loading"))
        )
          window.__initialRouteFallbacks++;
  }).observe(document, { childList: true, subtree: true });
});
for (const width of [375, 1440]) {
  await p.setViewportSize({ width, height: 960 });
  for (const path of [
    "/help-center/",
    "/compare-products/",
    "/buying-guides/",
    "/cloud-platforms/",
    "/product/aws-free-trial/",
    "/" + guideRoute(guides[0]) + "/",
  ]) {
    await p.goto("http://localhost:4173" + path);
    await p.waitForFunction(() =>
      document.querySelector("main:not(.route-loading)"),
    );
    const a = await new AxeBuilder({ page: p })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    result.scans++;
    if (a.violations.length)
      result.violations.push({
        width,
        path,
        violations: a.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      });
  }
}
// Reproduce the discovered race with a delayed initial route chunk.
await p.route("**/assets/DetailPages-*.js", async (route) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  await route.continue();
});
await p.goto("http://localhost:4173/product/aws-free-trial/");
await p.waitForTimeout(1200);
result.initialHydrationFallbacks = await p.evaluate(
  () => window.__initialRouteFallbacks,
);
assert.equal(
  result.initialHydrationFallbacks,
  0,
  "prerendered product must not flash a loading fallback",
);
assert.equal(
  await p.locator("h1").innerText(),
  "Review AWS Free Trial reference",
);
await p.unroute("**/assets/DetailPages-*.js");
await p.goto("http://localhost:4173/");
await p.locator('a.home-quiet-link[href="/compare-products/"]').click();
await p.waitForURL("**/compare-products/");
await p.waitForFunction(
  () => document.title === "Compare Cloud Accounts, Credits & API Pricing",
);
assert.equal(
  await p.locator("link[rel=canonical]").getAttribute("href"),
  "https://www.buyawsaccountsai.com/compare-products/",
);
assert(
  (await p.locator("#site-seo-schema").textContent()).includes(
    "Compare Cloud Accounts",
  ),
);
result.spaMetadata = true;
await p.evaluate(() => window.scrollTo(0, 1000));
await p.waitForTimeout(150);
const header = await p.locator("header").boundingBox();
assert(header.y >= 0 && header.y < 60);
result.stickyHeader = true;
await fs.writeFile(
  evidence + "accessibility-extra.json",
  JSON.stringify(result, null, 2),
);
await b.close();
console.log(JSON.stringify(result, null, 2));
assert.deepEqual(result.violations, []);
