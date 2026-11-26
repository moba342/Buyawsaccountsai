// The storefront currently confirms refund conditions in each written order.
// No fixed refund window, eligibility guarantee or fee schedule was supplied.
export const refundPolicy = {
  mode: "written-order-terms",
  terms: null,
};
const terms = refundPolicy.terms;
const complete = Boolean(
  terms && ["window", "processingTime", "returnNetwork", "fees"].every(key => typeof terms[key] === "string" && terms[key].trim()) && Array.isArray(terms.eligible) && Array.isArray(terms.exclusions)
);

export const confirmedRefundTerms = complete ? terms : null;
export const refundPolicyReady = refundPolicy.mode === "written-order-terms" || complete;
