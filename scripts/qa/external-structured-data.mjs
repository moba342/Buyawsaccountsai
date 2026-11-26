// Optional external validators; failures/login requests are not validation passes.
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import { getPageSeo, siteSchema, safeJson } from "../../seo.js";
const require = createRequire(
  process.env.QA_TOOLS_PACKAGE_JSON || import.meta.url,
);
const { chromium } = require("playwright");
const out = process.env.QA_EVIDENCE_DIR || "docs/seo/evidence/independent-seo";
await fs.mkdir(path.join(out, "structured-data-samples"), { recursive: true });
const samples = {
  homepage: getPageSeo("products", "/"),
  marketplace: getPageSeo("products"),
  "aws-collection": getPageSeo("aws-accounts"),
  "aws-product": getPageSeo("product/aws-free-trial"),
};
for (const [name, seo] of Object.entries(samples))
  await fs.writeFile(
    path.join(out, "structured-data-samples", name + ".json"),
    JSON.stringify(siteSchema(seo), null, 2),
  );
const browser = await chromium.launch({ channel: "chrome" }),
  results = [];
for (const name of ["homepage", "aws-product"]) {
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);
  try {
    await page.goto("https://validator.schema.org/", {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });
    await page.getByText("Code snippet", { exact: true }).click();
    await page.evaluate(
      (value) => {
        document
          .querySelector("#new-test-textarea")
          .nextElementSibling.CodeMirror.setValue(value);
      },
      '<script type="application/ld+json">' +
        safeJson(siteSchema(samples[name])) +
        "</script>",
    );
    await page.locator("#new-test-submit-button").click();
    await page.waitForTimeout(5000);
    const text = await page.locator("body").innerText();
    results.push({
      tool: "Schema.org Validator",
      sample: name,
      status:
        /0 ERRORS/.test(text) && /0 WARNINGS/.test(text)
          ? "PASS"
          : "MANUAL REVIEW",
      text: text.slice(-10000),
    });
  } catch (e) {
    results.push({
      tool: "Schema.org Validator",
      sample: name,
      status: "MANUAL ACTION REQUIRED",
      error: e.message,
    });
  }
  await page.close();
}
const page = await browser.newPage();
page.setDefaultTimeout(10000);
try {
  await page.goto("https://search.google.com/test/rich-results", {
    waitUntil: "load",
    timeout: 20000,
  });
  await page.getByRole("tab", { name: /code/i }).click();
  await page.locator(".CodeMirror:visible").first().waitFor();
  await page.evaluate(
    (value) =>
      [...document.querySelectorAll(".CodeMirror")]
        .find((e) => e.offsetWidth > 0)
        .CodeMirror.setValue(value),
    '<script type="application/ld+json">' +
      safeJson(siteSchema(samples["aws-product"])) +
      "</script>",
  );
  await page.getByRole("button", { name: /^test code$/i }).click();
  await page.waitForTimeout(15000);
  results.push({
    tool: "Google Rich Results Test",
    sample: "aws-product",
    status: "MANUAL REVIEW",
    text: (await page.locator("body").innerText()).slice(-12000),
    note: "No Offer/reviews are invented. This information-only Product is not eligible for Google product snippets.",
  });
} catch (e) {
  results.push({
    tool: "Google Rich Results Test",
    status: "MANUAL ACTION REQUIRED",
    error: e.message,
  });
}
await browser.close();
await fs.writeFile(
  path.join(out, "external-validators.json"),
  JSON.stringify(
    {
      date: "2026-11-27",
      source: "Independent SEO source build; not current live deployment",
      results,
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify(
    results.map(({ text, ...r }) => r),
    null,
    2,
  ),
);
