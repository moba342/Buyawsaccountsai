import test from "node:test";
import assert from "node:assert/strict";
import {
  analyticsConfiguration,
  hasAnalyticsConsent,
  initializeAnalytics,
  sanitizedEvent,
  publicAnalyticsItem,
} from "../analytics.js";
import { products } from "../catalog.js";
import { productRoute } from "../catalogPaths.js";
test("unconfigured analytics never initializes or assumes consent", () => {
  assert.equal(analyticsConfiguration.enabled, false);
  assert.equal(hasAnalyticsConsent(), false);
  assert.equal(initializeAnalytics(), false);
});
test("only public commerce fields are forwarded; private contact/payment inputs are omitted", () => {
  const value = sanitizedEvent("add_payment_info", {
    currency: "USD",
    payment_type: "USDT TRC20",
    email: "private@example.com",
    phone: "123",
    txid: "secret",
    wallet: "secret",
    items: [
      {
        ...publicAnalyticsItem(products[0]),
        email: "private",
        txid: "private",
      },
    ],
  });
  assert.deepEqual(Object.keys(value).sort(), [
    "currency",
    "items",
    "payment_type",
  ]);
  assert(!JSON.stringify(value).includes("private"));
  assert.equal(value.items[0].item_id, productRoute(products[0]));
  assert.equal(sanitizedEvent("purchase", {}), null);
  assert.equal(sanitizedEvent("generate_lead", {}), null);
});
test("page view drops query/hash identifiers and item quantities are bounded", () => {
  assert.deepEqual(
    sanitizedEvent("page_view", {
      page_location:
        "https://www.buyawsaccountsai.com/cart/?email=private#secret",
    }),
    { page_location: "https://www.buyawsaccountsai.com/cart/" },
  );
  assert.equal(publicAnalyticsItem(products[0], 999).quantity, 99);
});
