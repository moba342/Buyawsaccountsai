// Synthetic, test-only approval records. These are never imported by storefront code.
import { specificationSnapshot } from "../../offer-publication.js";
export function approvedReview(product, changes = {}) {
  return {
    status: "approved",
    confirmed: true,
    reviewedBy: "Test fixture reviewer",
    reviewedAt: "2026-01-01",
    resaleAuthorized: true,
    transferEligible: true,
    nonTransferable: false,
    programPermitted: true,
    price: product.price,
    priceCurrency: "USD",
    priceScopeVerified: true,
    availability: "InStock",
    supportedRegions: ["test-region-1"],
    verifiedSpecifications: specificationSnapshot(product),
    quotasVerified: true,
    modelsVerified: true,
    publicDescription:
      "Synthetic test-only description for the actual catalog scope, used to exercise publication and receipt validation without asserting any real authorization or availability.",
    deliveryTerms: "Test-only agreed delivery scope.",
    supportTerms: "Test-only agreed support scope.",
    editorialReview: {
      approved: true,
      actualOfferApproved: true,
      metadataMatchesOffering: true,
      proposalApproved: true,
      distinctContentApproved: true,
      indexApproved: true,
    },
    evidence: [
      "provider-authorization",
      "transfer-eligibility",
      "specifications",
      "availability",
      "billing",
      "program-terms",
      "network-permission",
    ].map((kind) => ({ kind, reference: "TEST FIXTURE ONLY: " + kind })),
    ...changes,
  };
}
