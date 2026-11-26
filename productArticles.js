import { productBuyingDescription, productName } from "./catalog-buying-copy.js";
import { productRoute } from "./catalogPaths.js";
import { productPublication } from "./offer-publication.js";
import { catalogDefinitions } from "./catalog-data.js";
import { products } from "./catalog.js";
export const providerBuyingNotes = Object.fromEntries(
  catalogDefinitions.map((def) => [def.name, def.overview]),
);
function introduction(product) { return productBuyingDescription(product); }
export const variantIntroductions = Object.fromEntries(
  catalogDefinitions.map((def) => [
    def.name,
    Object.fromEntries(
      products
        .filter((p) => p.provider === def.name)
        .map((product) => [product.name, introduction(product)]),
    ),
  ]),
);
const kindCopy = {
  AI: {
    title: "Verify the seller-listed AI access and quota details",
    body: "Ask for the exact AI service, model identifiers, account region, and current RPM or TPM quota shown for the offered account. Model labels are reproduced from the seller list and do not establish official model availability or guaranteed throughput. Where credits are included, confirm their eligibility, redemption conditions, and expiry separately from the AI access arrangement.",
    checks: [
      "Exact service, model identifiers, and account region",
      "Account-specific evidence for seller-listed RPM and TPM labels",
      "Credit conditions, billing responsibility, and permitted account setup",
    ],
  },

  Credit: {
    title: "Review the credit offer, not just the headline value",
    body: "Request the eligibility, redemption process, expiry date, and covered usage for the specific offer. Record who owns the billing account and what happens when the allowance is used or expires. A package purchase price and a listed credit value describe different parts of the offer; compare both with your project budget.",
    checks: [
      "Written credit eligibility and redemption details",
      "Expiry date and the scope of covered usage",
      "Billing responsibility for costs outside the allowance",
    ],
  },
  Compute: {
    title: "Turn the compute-tier label into an account-specific brief",
    body: "Ask which service quota and region the listed tier refers to, what evidence supports the proposed account limit, and whether the resources you want are available. A vCPU label is not a dedicated server reservation or a guarantee of application performance. Keep the account package separate from the infrastructure you plan to run.",
    checks: [
      "Relevant compute quota and regional details",
      "Ownership, access roles, and billing responsibility",
      "Separate budget for the resources you deploy",
    ],
  },
  Trial: {
    title: "Check the proposed trial conditions before ordering",
    body: "Ask what the trial label includes, who is eligible, how billing is arranged, and which account details will be provided. Set an evaluation goal and spending controls before you deploy. The storefront price is the listed account-package charge; it should not be read as a promise of free provider usage or unlimited trial resources.",
    checks: [
      "Trial eligibility and the proposed setup scope",
      "Usage limits and any billing requirements",
      "Plan for the end of the evaluation period",
    ],
  },
  Droplet: {
    title: "Review capacity and networking as separate requirements",
    body: "Request the exact account capacity, relevant regions, and proposed networking permissions. Describe any required port by number and intended use rather than assuming that an open-port label covers every connection. Resource sizes, availability, and ongoing charges belong in the deployment plan alongside the account arrangement.",
    checks: [
      "Listed Droplet count and current account limits",
      "Specific port permissions and acceptable-use conditions",
      "Resource availability and recurring usage charges",
    ],
  },
  Server: {
    title: "Match the capacity tier to your hosting plan",
    body: "Confirm the proposed account limit, any approval conditions, and the locations relevant to your project. A server-count listing is not a reservation of particular hardware or an inclusion of recurring hosting charges. Ask how the account package, resources you order, and ongoing operational responsibilities fit together.",
    checks: [
      "Account capacity and any approval requirements",
      "Relevant server locations and resource availability",
      "Ownership and recurring server-payment responsibilities",
    ],
  },
  SMTP: {
    title: "Verify the exact networking scope for your intended use",
    body: "Request the specific port-access conditions for the offered account and explain the traffic you intend to send. Review provider requirements, access administration, and separate infrastructure charges in the same conversation. An open-port listing is not a promise of message delivery, sender reputation, or permission to send unsolicited email.",
    checks: [
      "Account-specific port-access conditions",
      "Permitted workload and provider requirements",
      "Administration, security, and ongoing hosting costs",
    ],
  },
  Account: {
    title: "Establish ownership, access, and billing in writing",
    body: "Request the current account details behind the listing and confirm the proposed ownership or permitted setup arrangement. Identify who administers access, controls recovery, and pays the provider. Where account age, an upgrade, or a business label is part of the offer, ask what that label means for the account actually being supplied.",
    checks: [
      "Proposed account ownership and permitted setup",
      "Billing, recovery, and administration responsibilities",
      "Current account details supporting the listed arrangement",
    ],
  },
};
export function getProductArticle(product, brand) {
  const publication = productPublication(product),
    kind = kindCopy[product.kind] || kindCopy.Account;
  const intro =
    publication.published && publication.review.publicDescription
      ? publication.review.publicDescription
      : variantIntroductions[product.provider]?.[product.name];
  if (!intro) throw new Error("Missing article " + productRoute(product));
  const price = "$" + product.price.toLocaleString("en-US");
  const peers = products
    .filter(
      (p) =>
        p.provider === product.provider &&
        p.group === product.group &&
        p.name !== product.name,
    )
    .slice(0, 3);
  return {
    title: "Buying guide: " + brand.full + " " + product.name,
    intro,
    price,
    sections: [
      {
        title: "Compare " + productName(product),
        paragraphs: [
          peers.length
            ? "Compare this " +
              product.group +
              " reference with " +
              peers.map((p) => p.name).join(", ") +
              ". These are separate seller-supplied records; compare their specifications and applicable provider conditions individually."
            : "This is a distinct entry in the " +
              product.group +
              " group. Review its exact seller-listed scope rather than assuming another provider package has the same account rights or limits.",
          providerBuyingNotes[product.provider],
        ],
      },
      { title: kind.title, paragraphs: [kind.body], checks: kind.checks },
      {
        title: productName(product) + " pricing and billing",
        paragraphs: [
          publication.published
            ? "Before you purchase " + productName(product) + ", review the confirmed product price of " + price + " per account. Infrastructure usage and any separate provider charges are not included unless stated in the product details."
            : "Before you purchase " + brand.name + " " + product.name + ", review the listed reference price of " + price + " per account. It is not an infrastructure usage budget, a resource reservation, or a currently payable offer while publication review is pending.",
          product.credit
            ? "The separate listed credit face value is $" +
              product.credit.toLocaleString("en-US") +
              ". Program eligibility, redemption, expiry, and permitted account use must be verified independently; face value must never be substituted for the purchase price."
            : "Ask who pays the provider’s recurring charges and which resources would be billed separately. An account-reference charge does not define the price of every workload you might deploy.",
        ],
      },
      {
        title: "Purchase requirements and commercial eligibility",
        paragraphs: [
          publication.published
            ? "Stock is confirmed by the website owner. Review the product specifications and applicable provider conditions before ordering. Stock confirmation does not imply independent certification or provider endorsement."
            : "This reference is pending verification and is not available to order. Required evidence includes provider authorization, transfer eligibility, program conditions, availability, exact specifications, and confirmation of the actual price and scope. A proposed SEO title is not evidence that a consulting or setup service exists.",
          "The seller profile and declaration identify the seller-supplied contact details. They do not independently certify account ownership, establish provider permission, or approve a model, quota, or credit program.",
        ],
      },
      {
        title: "Delivery or deployment conditions",
        paragraphs: publication.published
          ? [publication.review.deliveryTerms || "Delivery is arranged with the seller after payment has been matched to your order. Contact Sales for the delivery format and timing for this product.", publication.review.supportTerms || "For product access and support, contact the seller using your order details and transaction hash. No automatic access delivery or fixed support response time is promised."]
          : [
              "No delivery time or deployment service is promised for this pending record. The seller must first document what can legitimately be supplied, who administers access, and the applicable billing, support, cancellation, and refund conditions.",
              "Cart and payment capabilities remain available in the application for approved offers. This record cannot be added as a new purchase or used to start payment verification until its publication requirements are satisfied.",
            ],
      },
      {
        title: "Compare plans and discuss requirements",
        paragraphs: [
          "Use the related records and comparison page to identify specification differences, then prepare questions about the account arrangement. A higher numeric tier does not itself establish better permissions, available resources, or an approved commercial offer.",
          "Review the buying guides and Help Center for the questions to ask before any agreement. Contact Sales can receive an inquiry; it does not automatically validate this record or place a paid order.",
        ],
      },
    ],
  };
}
