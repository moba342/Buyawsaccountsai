import { createRequire } from "node:module";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const require = createRequire(process.env.QA_TOOLS_PACKAGE_JSON || import.meta.url);
const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const base = process.env.QA_URL || "http://localhost:4176";
const out = process.env.QA_EVIDENCE_DIR || "docs/seo/evidence/payment-refund-policy/local";
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
const report = { base, widths: [], accessibilityScans: 0, violations: [], errors: [] };
page.on("pageerror", error => report.errors.push(error.message));
try {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    const response = await page.goto(base + "/payment-refund-policy/");
    assert.equal(response.status(), 200);
    await page.locator("#payment-policy-heading").waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "index, follow");
    assert.equal(await page.locator(".payment-policy-draft").count(), 0);
    assert.equal(await page.locator(".payment-policy-networks article").count(), 3);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    report.widths.push(width);
    if (width === 375 || width === 1440) {
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      report.accessibilityScans++;
      report.violations.push(...axe.violations.map(value => ({ id: value.id, nodes: value.nodes.map(node => node.target) })));
      await page.screenshot({ path: out + "/policy-" + width + ".png", fullPage: true });
    }
  }
  await page.goto(base + "/checkout/");
  assert(await page.locator('main a[href="/payment-refund-policy/"]').count());
  await page.locator('main a[href="/payment-refund-policy/"]').first().click();
  await page.waitForURL("**/payment-refund-policy/");
  assert.equal(await page.locator("#payment-policy-heading").innerText(), "Payment & Refund Policy");
  assert(await page.locator('footer a[href="/payment-refund-policy/"]').count());
  report.checkoutAndFooterLinks = true;
  assert.deepEqual(report.violations, []);
  assert.deepEqual(report.errors, []);
  await fs.writeFile(out + "/browser.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
