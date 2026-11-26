import { publicationReviews } from "./offer-review-records.js";
import { suppliedProductSeo } from "./product-seo-records.js";
import { productRoute, providerRoute } from "./catalogPaths.js";
export const seoRecordById = new Map(suppliedProductSeo.map((r) => [r.id, r]));
const specKeys = [
  "name",
  "kind",
  "vcpus",
  "credit",
  "rpm",
  "tpm",
  "models",
  "capacity",
  "dailyLimit",
  "regions",
  "ips",
  "port25",
];
export const specificationSnapshot = (product) =>
  Object.fromEntries(specKeys.map((k) => [k, product[k] ?? null]));
const evidenceKinds = [
  "provider-authorization",
  "transfer-eligibility",
  "specifications",
  "availability",
  "billing",
];
const validText = (value) =>
  typeof value === "string" && value.trim().length > 2;
const validDate = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value)) &&
  new Date(value).toISOString().slice(0, 10) === value &&
  Date.parse(value) <= Date.now();
const hasEvidence = (review, kind) =>
  Array.isArray(review?.evidence) &&
  review.evidence.some((e) => e?.kind === kind && validText(e.reference));
export function productPublication(
  product,
  review = publicationReviews[productRoute(product)],
) {
  const record = seoRecordById.get(productRoute(product)),
    reasons = [];
  if (!record) reasons.push("No reconciled SEO record");
  if (review?.status !== "approved") reasons.push("Publication review pending");
  if (!validText(review?.reviewedBy) || !validDate(review?.reviewedAt))
    reasons.push("Named human review and genuine review date required");
  const service = product.offeringType === "service";
  if (service) {
    if (
      review?.customerOwnedAccount !== true ||
      review?.noAccountTransfer !== true ||
      review?.creditsIncluded !== false ||
      review?.serviceScopePermitted !== true
    )
      reasons.push(
        "Service must use a customer-owned account without account or promotional-credit resale",
      );
    if (review?.programPermitted !== true)
      reasons.push("Applicable service/program conditions unconfirmed");
  } else {
    if (review?.resaleAuthorized !== true || review?.transferEligible !== true)
      reasons.push(
        "Provider authorization and transfer eligibility unconfirmed",
      );
    if (review?.nonTransferable !== false || review?.programPermitted !== true)
      reasons.push("Applicable program/transfer restrictions unconfirmed");
  }
  for (const kind of evidenceKinds.filter(
    (kind) => !service || kind !== "transfer-eligibility",
  ))
    if (!hasEvidence(review, kind))
      reasons.push("Missing " + kind + " evidence");
  if (
    review?.confirmed !== true ||
    review?.price !== product.price ||
    review?.priceCurrency !== "USD" ||
    review?.priceScopeVerified !== true
  )
    reasons.push("Actual purchase price and scope unconfirmed");
  if (
    ![
      "InStock",
      "LimitedAvailability",
      "OutOfStock",
      "PreOrder",
      "BackOrder",
    ].includes(review?.availability)
  )
    reasons.push("Genuine availability unconfirmed");
  if (
    !Array.isArray(review?.supportedRegions) ||
    !review.supportedRegions.length ||
    !review.supportedRegions.every(validText)
  )
    reasons.push("Supported regions unconfirmed");
  if (
    !specKeys.every(
      (k) =>
        (review?.verifiedSpecifications?.[k] ?? null) === (product[k] ?? null),
    )
  )
    reasons.push("Catalog specifications changed or unverified");
  if (
    (product.vcpus ||
      product.rpm ||
      product.tpm ||
      product.capacity ||
      product.dailyLimit ||
      product.ips) &&
    review?.quotasVerified !== true
  )
    reasons.push("Approved quota/capacity evidence required");
  if (product.models && review?.modelsVerified !== true)
    reasons.push("Exact model/service identifiers unconfirmed");
  if (
    (product.kind === "Credit" || product.kind === "Trial" || product.credit) &&
    !hasEvidence(review, "program-terms")
  )
    reasons.push("Trial/credit program evidence required");
  if (product.port25 && !hasEvidence(review, "network-permission"))
    reasons.push("Provider-approved network permission required");
  if (
    product.offeringType === "service" &&
    (review?.serviceProvided !== true ||
      !validText(review?.serviceScope) ||
      !validText(review?.serviceName) ||
      !hasEvidence(review, "service-scope") ||
      !hasEvidence(review, "customer-authorization"))
  )
    reasons.push("Actual service scope and evidence required");
  if (
    !validText(review?.publicDescription) ||
    review.publicDescription.length < 120
  )
    reasons.push("Reviewed public description required");
  if (!validText(review?.deliveryTerms) || !validText(review?.supportTerms))
    reasons.push("Actual delivery and support terms required");
  if (
    review?.editorialReview?.approved !== true ||
    review?.editorialReview?.actualOfferApproved !== true
  )
    reasons.push("Human editorial/scope review required");
  const published = reasons.length === 0,
    indexable =
      published &&
      review?.editorialReview?.distinctContentApproved === true &&
      review?.editorialReview?.indexApproved === true;
  return {
    id: productRoute(product),
    record,
    status: published ? "APPROVED" : "PENDING VERIFICATION",
    publicationStatus: published ? "published" : "pending-verification",
    published,
    indexable,
    metadataProposalEligible:
      published &&
      record.proposedOfferingType === (product.offeringType || "account") &&
      review.editorialReview.proposalApproved === true &&
      review.editorialReview.metadataMatchesOffering === true,
    purchasable:
      published &&
      ["InStock", "LimitedAvailability"].includes(review.availability),
    review,
    reasons,
    indexingReason: indexable
      ? "Explicit distinct-content indexing approval"
      : published
        ? "Distinct-content/indexing review pending"
        : "Unverified reference; commercial publication withheld",
  };
}
export const canPurchaseProduct = (product) =>
  Boolean(product && productPublication(product).purchasable);
export function categoryPublication(
  brand,
  list,
  review = publicationReviews[providerRoute(brand)],
) {
  const published = list.filter((p) => productPublication(p).published),
    record = seoRecordById.get(providerRoute(brand));
  const approved =
    published.length > 0 &&
    review?.status === "approved" &&
    review?.editorialReview?.approved === true &&
    review?.editorialReview?.actualOfferApproved === true &&
    validText(review.reviewedBy) &&
    validDate(review.reviewedAt);
  return {
    id: providerRoute(brand),
    record,
    review,
    status: approved ? "APPROVED" : "PENDING VERIFICATION",
    publicationStatus: approved ? "published" : "reference-only",
    published: approved,
    metadataProposalEligible:
      approved &&
      review.editorialReview.proposalApproved === true &&
      (record?.proposedOfferingType !== "service" ||
        published.every((p) => p.offeringType === "service")),
    indexable:
      approved &&
      review.editorialReview.distinctContentApproved === true &&
      review.editorialReview.indexApproved === true,
    reasons: approved
      ? []
      : ["Requires eligible child offers and category editorial review"],
    indexingReason: approved
      ? "Category review applies; distinct-content approval required"
      : "No approved category offer; reference only",
  };
}
export const pendingMessage =
  "Publication review pending. This reference is not available to order.";
