import test from "node:test";
import assert from "node:assert/strict";
import { products, brands } from "../catalog.js";
import { productRoute, providerRoute } from "../catalogPaths.js";
import { suppliedProductSeo } from "../product-seo-records.js";
import { publicationReviews } from "../offer-review-records.js";
import {
  productPublication,
  categoryPublication,
} from "../offer-publication.js";
import { approvedReview } from "./fixtures/publication.js";
import { verifyPayment, InputError } from "../server/payment-verifier.js";
test("all 82 supplied records match exactly 14 categories and 68 current variants", () => {
  assert.equal(suppliedProductSeo.length, 82);
  assert.equal(new Set(suppliedProductSeo.map((r) => r.id)).size, 82);
  assert.equal(
    suppliedProductSeo.filter((r) => r.type === "category").length,
    14,
  );
  assert.equal(
    suppliedProductSeo.filter((r) => r.type === "variant").length,
    68,
  );
  for (const r of suppliedProductSeo) {
    assert(r.primaryKeyword.startsWith("buy "));
    assert(r.secondaryKeywords.length >= 5 && r.secondaryKeywords.length <= 8);
    assert(r.seoTitle && r.metaDescription && r.h1);
    assert.equal(r.searchIntent, "Transactional");
    assert(
      r.type === "category"
        ? brands.some((b) => providerRoute(b) === r.id)
        : products.some((p) => productRoute(p) === r.id),
    );
  }
});
test("no record is assumed authorized or available from an SEO proposal", () => {
  assert.deepEqual(publicationReviews, {});
  for (const p of products) {
    const state = productPublication(p);
    assert(!state.published && !state.purchasable);
    assert(state.reasons.length > 5);
  }
  for (const b of brands)
    assert(
      !categoryPublication(
        b,
        products.filter((p) => p.provider === b.name),
      ).published,
    );
});
test("commercial review allows the preserved offer without controlling SEO indexing", () => {
  const p = products[1],
    r = approvedReview(p);
  assert(productPublication(p, r).purchasable);
  assert.equal(productPublication(p, r).indexable, undefined);
  assert(
    productPublication(p, {
      ...r,
      editorialReview: { ...r.editorialReview, indexApproved: false },
    }).published,
  );
  assert(productPublication(p, { ...r, availability: "OutOfStock" }).published);
  assert(
    !productPublication(p, { ...r, availability: "OutOfStock" }).purchasable,
  );
});
test("missing evidence, changed facts, nontransferable programs, false strings and invalid dates fail closed", () => {
  const p = products[0],
    r = approvedReview(p);
  for (const changes of [
    { resaleAuthorized: "true" },
    { transferEligible: false },
    { nonTransferable: true },
    { programPermitted: false },
    { confirmed: false },
    { price: 1 },
    { supportedRegions: [] },
    { reviewedAt: "2026-99-01" },
    { reviewedAt: "2999-01-01" },
    { evidence: [] },
    { evidence: "not an array" },
    { verifiedSpecifications: {} },
    { evidence: r.evidence.filter((e) => e.kind !== "program-terms") },
    { editorialReview: { ...r.editorialReview, actualOfferApproved: false } },
  ])
    assert(
      !productPublication(p, { ...r, ...changes }).published,
      JSON.stringify(changes),
    );
});
test("service proposals do not turn a valid account into an invented consulting service", () => {
  const p = products[0],
    r = approvedReview(p);
  assert(productPublication(p, r).published);
  assert.equal(productPublication(p, r).metadataProposalEligible, undefined);
  const service = { ...p, offeringType: "service" };
  assert(!productPublication(service, r).published);
  const serviceReview = {
    ...r,
    serviceProvided: true,
    customerOwnedAccount: true,
    noAccountTransfer: true,
    creditsIncluded: false,
    serviceScopePermitted: true,
    serviceName: "Test-only documented service",
    serviceScope: "Test-only explicit service scope",
    evidence: [
      ...r.evidence,
      { kind: "service-scope", reference: "TEST ONLY scope record" },
      {
        kind: "customer-authorization",
        reference: "TEST ONLY customer authorization",
      },
    ],
  };
  assert(productPublication(service, serviceReview).published);
  assert(
    productPublication(service, {
      ...serviceReview,
      resaleAuthorized: false,
      transferEligible: false,
      nonTransferable: true,
    }).published,
  );
  assert(
    !productPublication(service, { ...serviceReview, noAccountTransfer: false })
      .published,
  );
  assert(
    !productPublication(service, { ...serviceReview, creditsIncluded: true })
      .published,
  );
});
test("unreviewed model and network quota claims cannot be sold", () => {
  const ai = products.find((p) => p.models),
    mail = products.find((p) => p.port25);
  assert(
    !productPublication(ai, { ...approvedReview(ai), modelsVerified: false })
      .published,
  );
  assert(
    !productPublication(mail, {
      ...approvedReview(mail),
      evidence: approvedReview(mail).evidence.filter(
        (e) => e.kind !== "network-permission",
      ),
    }).published,
  );
});
test("the real payment entry rejects pending references before any RPC; body approval cannot bypass it", async () => {
  let calls = 0;
  const body = {
    network: "trc20",
    txid: "a".repeat(64),
    items: [{ id: productRoute(products[0]), quantity: 1 }],
    approved: true,
    publicationReviews: {},
  };
  await assert.rejects(
    () =>
      verifyPayment(body, {
        fetch: () => {
          calls++;
          throw Error("RPC must not run");
        },
      }),
    InputError,
  );
  assert.equal(calls, 0);
});
