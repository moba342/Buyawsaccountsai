import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const require = createRequire(
    process.env.QA_TOOLS_PACKAGE_JSON || import.meta.url,
  ),
  { chromium } = require("playwright"),
  AxeBuilder = require("@axe-core/playwright").default;
import { products } from "../../catalog.js";
import { productRoute } from "../../catalogPaths.js";
import { paymentMethods } from "../../payments.js";
const base = process.env.QA_URL || "http://localhost:4173",
  out = fileURLToPath(new URL("../../docs/seo/evidence/", import.meta.url));
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch(
    process.env.CHROME_PATH
      ? { executablePath: process.env.CHROME_PATH }
      : { channel: "chrome" },
  ),
  context = await browser.newContext({ reducedMotion: "reduce" }),
  page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const report = {
  date: "2026-11-26",
  pendingVariantPages: 0,
  purchaseActionsDisabled: false,
  legacyCartPreserved: false,
  checkoutWithheld: false,
  apiRejectsPending: false,
  comparison: false,
  contactAndGuides: false,
  mobileMenu: false,
  accessibilityScans: 0,
  violations: [],
  errors,
};
for (const product of products) {
  await page.goto(base + "/" + productRoute(product) + "/");
  await page.locator(".account-purchase-panel").waitFor();
  const buttons = page.locator(
    ".account-purchase-panel button.primary,.account-purchase-panel button.secondary",
  );
  assert.equal(await buttons.count(), 2);
  for (const button of await buttons.all())
    assert(await button.isDisabled(), product.name);
  assert(
    (await page.locator("main").innerText()).includes("Pending verification"),
  );
  report.pendingVariantPages++;
}
report.purchaseActionsDisabled = true;
await page.goto(base + "/cart/");
await page.waitForFunction(() => localStorage.getItem("baa-cart-v2") !== null);
await page.evaluate(() =>
  localStorage.setItem(
    "baa-cart-v2",
    JSON.stringify([
      { id: "product/aws-8-vcpu", quantity: 1 },
      { id: "product/aws-32-vcpu-10-rpm-bedrock-enabled", quantity: 1 },
    ]),
  ),
);
await page.reload();
await page.locator(".commerce-total").waitFor();
assert((await page.locator(".commerce-total").innerText()).includes("$100"));
assert.equal(await page.locator('main a[href="/checkout/"]').count(), 0);
await page
  .getByRole("button", { name: "Increase AWS 8 vCPU quantity", exact: true })
  .click();
assert((await page.locator(".commerce-total").innerText()).includes("$125"));
await page
  .getByRole("button", { name: "Decrease AWS 8 vCPU quantity", exact: true })
  .click();
await page.waitForFunction(
  () =>
    JSON.parse(localStorage.getItem("baa-cart-v2")).find(
      (r) => r.id === "product/aws-8-vcpu",
    ).quantity === 1,
);
report.legacyCartPreserved = true;
await page.goto(base + "/checkout/");
await page
  .getByRole("heading", {
    name: "Ordering is unavailable for these references",
  })
  .waitFor();
assert.equal(
  await page.locator(".commerce-wallet-qr,#payment-txid,form").count(),
  0,
);
for (const method of paymentMethods)
  assert(!(await page.locator("main").innerText()).includes(method.address));
report.checkoutWithheld = true;
for (const width of [320, 375, 390, 414, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 960 });
  for (const path of ["/cart/", "/checkout/"]) {
    await page.goto(base + path);
    await page.waitForFunction(() =>
      document.querySelector("main:not(.route-loading)"),
    );
    await page.waitForTimeout(80);
    assert(
      !(await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      )),
      path + " " + width,
    );
    if ([375, 1440].includes(width)) {
      const a = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      report.accessibilityScans++;
      if (a.violations.length)
        report.violations.push({
          width,
          path,
          violations: a.violations.map((v) => ({
            id: v.id,
            targets: v.nodes.map((n) => n.target),
          })),
        });
    }
  }
}
const api = await page.request.post(base + "/api/verify-payment", {
  data: {
    network: "trc20",
    txid: "a".repeat(64),
    items: [{ id: productRoute(products[0]), quantity: 1 }],
    approved: true,
    publicationReviews: { approved: true },
  },
});
assert.equal(api.status(), 400);
assert.notEqual((await api.json()).status, "confirmed");
report.apiRejectsPending = true;
await page.goto(base + "/compare-products/");
await page.waitForTimeout(250);
const boxes = page.locator("main input[type=checkbox]");
await boxes.nth(1).check();
assert.equal(await page.locator("main input:checked").count(), 3);
for (const button of await page.locator("main button.primary").all())
  assert(await button.isDisabled());
report.comparison = true;
await page.setViewportSize({ width: 375, height: 960 });
await page.goto(base + "/");
await page.waitForTimeout(250);
await page.locator("header .menu").click();
await page.locator("header nav.open").waitFor();
await page.keyboard.press("Escape");
assert.equal(
  await page.locator("header .menu").getAttribute("aria-expanded"),
  "false",
);
report.mobileMenu = true;
await page.goto(base + "/buying-guides/");
const link = page.locator(".guide-card").first();
const href = await link.getAttribute("href");
await link.click();
await page.waitForURL("**" + href);
await page.locator(".guide-article-page").waitFor();
await page.goto(base + "/contact-sales/");
await page.locator("main.contact-page").waitFor();
for (const href of [
  "https://t.me/dexterw4tts",
  "mailto:dexter-watts@buyawsaccountsai.com",
  "tel:+14582624274",
])
  assert(await page.locator('main a[href="' + href + '"]').count());
report.contactAndGuides = true;
await page.goto(base + "/cart/");
await page
  .getByRole("button", { name: "Remove AWS 8 vCPU", exact: true })
  .click();
assert((await page.locator(".commerce-total").innerText()).includes("$75"));
await page.getByRole("button", { name: "Clear cart", exact: true }).click();
await page
  .getByRole("heading", { name: "Your next project starts here." })
  .waitFor();
assert.deepEqual(errors, []);
await fs.writeFile(
  out + "/publication-ui.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
assert.deepEqual(report.violations, []);
