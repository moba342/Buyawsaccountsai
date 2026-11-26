// Browser QA is optional tooling, intentionally separate from runtime dependencies.
// Set QA_TOOLS_PACKAGE_JSON to a tools package with playwright and @axe-core/playwright.
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(
  process.env.QA_TOOLS_PACKAGE_JSON || import.meta.url,
);
const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const evidence = fileURLToPath(new URL("../../seo-evidence/", import.meta.url));
const chrome = process.env.CHROME_PATH
  ? { executablePath: process.env.CHROME_PATH }
  : { channel: "chrome" };
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { paymentMethods } from "../../payments.js";
const base = "http://localhost:4173",
  browser = await chromium.launch({ ...chrome }),
  context = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
    reducedMotion: "reduce",
  }),
  p = await context.newPage(),
  errors = [];
p.on("pageerror", (e) => errors.push(e.message));
const report = {
  cart: false,
  persistedCart: false,
  paymentNetworks: [],
  paymentStates: [],
  orderRequest: false,
  productActions: false,
  comparison: false,
  mobileMenu: false,
  guideNavigation: false,
  contactLinks: false,
  errors,
};
await p.goto(base + "/cart/");
await p
  .getByRole("heading", { name: "Your next project starts here." })
  .waitFor();
await p.evaluate(() =>
  localStorage.setItem(
    "baa-cart-v2",
    JSON.stringify([
      { id: "product/aws-8-vcpu", quantity: 1 },
      { id: "product/aws-32-vcpu-10-rpm-bedrock-enabled", quantity: 1 },
    ]),
  ),
);
await p.reload();
await p.locator(".commerce-total").waitFor();
assert((await p.locator(".commerce-total").innerText()).includes("$100"));
report.persistedCart = true;
await p
  .getByRole("button", { name: "Increase AWS 8 vCPU quantity", exact: true })
  .click();
assert((await p.locator(".commerce-total").innerText()).includes("$125"));
await p
  .getByRole("button", { name: "Decrease AWS 8 vCPU quantity", exact: true })
  .click();
assert((await p.locator(".commerce-total").innerText()).includes("$100"));
await p.goto(base + "/checkout/");
await p.locator(".commerce-wallet-qr").waitFor();
for (const m of paymentMethods) {
  await p.getByRole("radio", { name: new RegExp(m.id.toUpperCase()) }).check();
  assert.equal(
    await p
      .getByRole("textbox", { name: m.label + " receiving wallet" })
      .inputValue(),
    m.address,
  );
  assert(
    (await p.locator(".commerce-wallet-qr img").getAttribute("src")).includes(
      m.id,
    ),
  );
  await p.getByRole("button", { name: "Copy wallet address" }).click();
  assert.equal(
    await p.evaluate(() => navigator.clipboard.readText()),
    m.address,
  );
  report.paymentNetworks.push(m.id);
}
await p.getByRole("radio", { name: /TRC20/ }).check();
const txid = "a".repeat(64);
await p.locator("#payment-txid").fill(txid);
let status = "pending",
  network = "trc20",
  http = 200;
await p.route("**/api/verify-payment", (route) =>
  route.fulfill({
    status: http,
    contentType: "application/json",
    body: JSON.stringify({
      status,
      network,
      txid,
      message: "Controlled test response",
      receivedAmount: status === "confirmed" ? "100" : undefined,
      expectedAmount: "100",
    }),
  }),
);
for (const [s, title] of [
  ["pending", "Awaiting network finality"],
  ["not_found", "Transaction not found yet"],
  ["failed", "Transaction failed"],
  ["unmatched", "Payment does not match"],
  ["amount_mismatch", "Payment amount does not match"],
  ["unavailable", "Unable to check payment"],
  ["invalid", "Check your transaction details"],
  ["confirmed", "Payment confirmed on-chain"],
]) {
  status = s;
  await p.locator(".commerce-check-payment").click();
  await p.getByRole("heading", { name: title, exact: true }).waitFor();
  report.paymentStates.push(s);
}
// A purported success with the wrong network or failing HTTP status must fail closed.
network = "erc20";
await p.locator(".commerce-check-payment").click();
await p
  .getByRole("heading", { name: "Unable to check payment", exact: true })
  .waitFor();
network = "trc20";
http = 500;
await p.locator(".commerce-check-payment").click();
await p
  .getByRole("heading", { name: "Unable to check payment", exact: true })
  .waitFor();
report.paymentStates.push(
  "mismatched-network-rejected",
  "http-error-confirmed-rejected",
);
await p
  .getByRole("textbox", { name: "Your name", exact: true })
  .fill("SEO Test Buyer");
await p
  .getByRole("textbox", { name: "Email address", exact: true })
  .fill("seo-test@example.com");
await p.getByRole("textbox", { name: /Phone/ }).fill("+12025550123");
await p.locator(".commerce-agreement input").check();
await p.getByRole("button", { name: "Prepare order request" }).click();
await p
  .getByRole("heading", { name: "Your request is ready to send." })
  .waitFor();
assert(
  (
    await p
      .getByRole("textbox", { name: "Prepared order request" })
      .inputValue()
  ).includes("seo-test@example.com"),
);
report.orderRequest = true;
await p.goto(base + "/cart/");
await p.getByRole("button", { name: "Remove AWS 8 vCPU", exact: true }).click();
assert((await p.locator(".commerce-total").innerText()).includes("$75"));
await p.getByRole("button", { name: "Clear cart", exact: true }).click();
await p
  .getByRole("heading", { name: "Your next project starts here." })
  .waitFor();
report.cart = true;
await p.goto(base + "/product/aws-free-trial/");
// Initial HTML is available before interactive route hydration completes.
await p.waitForFunction(() => {
  const button = document.querySelector(".account-purchase-panel button");
  return (
    button && Object.keys(button).some((key) => key.startsWith("__reactProps"))
  );
});
await p
  .locator(".account-purchase-panel")
  .getByRole("button", { name: "Add to cart", exact: true })
  .click();
await p.waitForURL("**/cart/");
assert((await p.locator(".commerce-total").innerText()).includes("$15"));
await p.waitForFunction(() => {
  const lines = JSON.parse(localStorage.getItem("baa-cart-v2") || "[]");
  return lines.some(
    (line) => line.id === "product/aws-free-trial" && line.quantity === 1,
  );
});
await p.goto(base + "/product/aws-free-trial/");
// Initial HTML is available before interactive route hydration completes.
await p.waitForFunction(() => {
  const button = document.querySelector(".account-purchase-panel button");
  return (
    button && Object.keys(button).some((key) => key.startsWith("__reactProps"))
  );
});
await p.locator(".header-cart-count").waitFor();
assert.equal(await p.locator(".header-cart-count").innerText(), "1");
await p
  .locator(".account-purchase-panel")
  .getByRole("button", { name: "Buy Now", exact: true })
  .click();
await p
  .getByRole("dialog")
  .getByRole("button", { name: "Checkout", exact: true })
  .click();
await p.waitForURL("**/checkout/");
assert((await p.locator(".commerce-total").innerText()).includes("$30"));
report.productActions = true;
await p.goto(base + "/compare-products/");
const checks = p.locator("main input[type=checkbox]");
await checks.first().waitFor();
await checks.nth(1).check();
assert.equal(await p.locator("main input[type=checkbox]:checked").count(), 3);
assert((await p.locator("main").innerText()).includes("Free Trial"));
report.comparison = true;
await p.setViewportSize({ width: 375, height: 900 });
await p.goto(base + "/");
await p.locator("header .menu").click();
await p.locator("header nav.open").waitFor();
assert.equal(
  await p.locator("header .menu").getAttribute("aria-expanded"),
  "true",
);
await p.keyboard.press("Escape");
assert.equal(
  await p.locator("header .menu").getAttribute("aria-expanded"),
  "false",
);
await p.locator("header .menu").click();
await p.locator('header nav a[href="/marketplace/"]').click();
await p.waitForURL("**/marketplace/");
assert.equal(
  await p.locator("header .menu").getAttribute("aria-expanded"),
  "false",
);
report.mobileMenu = true;
await p.goto(base + "/buying-guides/");
const href = await p.locator(".guide-card").first().getAttribute("href");
await p.locator(".guide-card").first().click();
await p.waitForURL("**" + href);
await p.locator(".guide-article-page").waitFor();
assert.equal(await p.locator("h1").count(), 1);
report.guideNavigation = true;
await p.goto(base + "/contact-sales/");
await p.locator("main.contact-page").waitFor();
for (const href of [
  "https://t.me/dexterw4tts",
  "mailto:dexter-watts@buyawsaccountsai.com",
  "tel:+14582624274",
])
  assert(await p.locator('main a[href="' + href + '"]').count());
report.contactLinks = true;
assert.deepEqual(errors, []);
await fs.writeFile(
  evidence + "commerce-qa.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
