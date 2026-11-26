import test from "node:test";
import assert from "node:assert/strict";
import { products } from "../catalog.js";
import { productPurchaseState } from "../purchase-state.js";
import { approvedReview } from "./fixtures/publication.js";
import { verifyPayment, InputError } from "../server/payment-verifier.js";
import { productRoute } from "../catalogPaths.js";

test("pending, approved-stock and approved-unavailable states have truthful prices and actions", () => {
  const product=products[1];
  const pending=productPurchaseState(product);
  assert.equal(pending.priceLabel,"Reference price");
  assert.equal(pending.cartLabel,"Pending review");
  assert(!pending.purchasable);
  for(const availability of ["InStock","LimitedAvailability","OutOfStock","PreOrder","BackOrder"]){
    const state=productPurchaseState(product,approvedReview(product,{availability}));
    assert(state.published);
    assert.equal(state.priceLabel,"Price");
    assert.equal(state.price,product.price);
    assert(!state.statusText.includes("Pending"));
    assert(!state.buyLabel.includes("Pending"));
    assert.equal(state.purchasable,["InStock","LimitedAvailability"].includes(availability));
  }
});
test("an approved but out-of-stock offer is rejected as unavailable before RPC", async () => {
  const product=products[1];let calls=0;
  await assert.rejects(()=>verifyPayment({network:"trc20",txid:"a".repeat(64),items:[{id:productRoute(product),quantity:1}]},{publicationReviews:{[productRoute(product)]:approvedReview(product,{availability:"OutOfStock"})},fetch:async()=>{calls++;throw Error("Must not call RPC");}}),error=>error instanceof InputError && /currently unavailable/.test(error.message));
  assert.equal(calls,0);
});
