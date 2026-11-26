import { productPublication } from "../offer-publication.js";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { products } from "../catalog.js";
import { productRoute } from "../catalogPaths.js";
import { providerAssets } from "../providerAssets.js";
const root = path.resolve("public");
await fs.mkdir(path.join(root, "optimized"), { recursive: true });
const resize = async (source, name, width) =>
  sharp(path.join(root, source))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(root, "optimized", `${name}-${width}.webp`));
for (const width of [240, 400, 640, 960])
  await resize("seller/dexter-watts-profile.png", "dexter-watts", width);
for (const width of [480, 840, 1200]) {
  await resize("logos/buyawsaccountsai-logo.png", "brand-header", width);
  await resize("logos/buyawsaccountsai-footer-logo.png", "brand-footer", width);
}
const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
function wrap(value, max = 33) {
  const lines = [];
  let current = "";
  for (const word of value.split(/\s+/)) {
    if ((current + " " + word).trim().length > max && current) {
      lines.push(current);
      current = word;
    } else current = (current + " " + word).trim();
  }
  if (current) lines.push(current);
  return lines.slice(0, 4);
}
async function artwork(product) {
  const published = product && productPublication(product).published;
  const name = product
    ? product.provider + " " + product.name
    : "Cloud accounts. Clearer choices.";
  const logo = await fs.readFile(
    path.join(
      root,
      "logos",
      product
        ? providerAssets[product.provider]
        : "buyawsaccountsai-logo-840.png",
    ),
  );
  const imageType =
    product && providerAssets[product.provider].endsWith(".svg")
      ? "image/svg+xml"
      : "image/png";
  const lines = wrap(name);
  const fontSize = lines.length > 3 ? 40 : 48;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#263D68"/><stop offset=".5" stop-color="#142440"/><stop offset="1" stop-color="#080F24"/></linearGradient></defs><rect width="1200" height="630" fill="#F8FAFC"/><rect x="28" y="28" width="1144" height="574" rx="26" fill="url(#bg)"/><path d="M70 480h1060M900 70v370" stroke="#6C82A3" opacity=".35"/><text x="74" y="99" font-family="Arial,sans-serif" font-size="23" font-weight="600" fill="#CBD5E1">BuyAWSAccountsAI</text><text x="74" y="139" font-family="Arial,sans-serif" font-size="15" letter-spacing="2" fill="#FFB347">${product ? (published ? "CLOUD ACCOUNT PRODUCT" : "CATALOG REFERENCE · PENDING REVIEW") : "CLOUD ACCOUNTS &amp; CREDITS"}</text>${lines.map((line, i) => `<text x="74" y="${210 + i * 58}" font-family="Arial,sans-serif" font-size="${fontSize}" font-weight="700" fill="#FFFFFF">${escape(line)}</text>`).join("")}<rect x="940" y="114" width="172" height="172" rx="24" fill="#FFFFFF"/><image x="960" y="134" width="132" height="132" preserveAspectRatio="xMidYMid meet" href="data:${imageType};base64,${logo.toString("base64")}"/><text x="74" y="529" font-family="Arial,sans-serif" font-size="21" fill="#CBD5E1">${product ? (published ? "Reviewed scope · confirm current terms" : "Reference only · not available to order") : "Compare products, specifications and listed prices"}</text>${product ? `<text x="74" y="572" font-family="Arial,sans-serif" font-size="33" font-weight="700" fill="#FFFFFF">${published ? "$" + product.price.toLocaleString("en-US") + " USD / account" : "Publication verification required"}</text>` : '<text x="74" y="572" font-family="Arial,sans-serif" font-size="21" fill="#FFFFFF">www.buyawsaccountsai.com</text>'}</svg>`;
  const file = product
    ? "social/products/" + productRoute(product).split("/").pop() + ".png"
    : "social/cloud-account-marketplace.png";
  await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true });
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, file));
}
await artwork(null);
for (const product of products) await artwork(product);
console.log(
  `Generated responsive brand/portrait WebP assets and ${products.length + 1} branded 1200×630 social images.`,
);
