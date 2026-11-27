import { products } from "./catalog.js";
import { productPublication } from "./offer-publication.js";
export const hasPurchasableOffers = products.some(p => productPublication(p).purchasable);
export const hasPublishedOffers = products.some(
  (p) => productPublication(p).published,
);
import { seoOverrides } from "./seo-overrides.js";
export const SITE = {
  url: "https://buyawsaccountsai.com",
  name: "BuyAWSAccountsAI",
  defaultTitle: "Cloud Account Products | BuyAWSAccountsAI",
  titleTemplate: "%s | BuyAWSAccountsAI",
  language: "en",
  locale: "en_US",
  description:
    "Cloud account products, credit options and seller-listed AI access with clear specifications and purchase terms.",
  defaultImage: "/social/cloud-account-marketplace.png",
  imageWidth: 1200,
  imageHeight: 630,
  email: "dexter-watts@buyawsaccountsai.com",
  telephone: "+14582624274",
  whatsapp: { number: "+12513532578", display: "+1 251 353 2578", url: "https://wa.me/12513532578" },
};
export const pageSeo = {
  home: {
    primaryKeyword: "buy AWS accounts & cloud credits",
    title: "Buy AWS Accounts & Cloud Credits | BuyAWSAccountsAI",
    description:
      "Buy AWS accounts and explore cloud credits, Bedrock API access, and cloud account options. Compare available plans and pricing for your cloud requirements.",
    h1: "Buy AWS accounts & cloud credits.",
  },
  products: {
    primaryKeyword: "cloud accounts marketplace",
    title: "Cloud Accounts Marketplace | Buy Accounts & Credits",
    description:
      "Shop cloud accounts, cloud credits and AI API access in one marketplace. Compare listed products, account specifications and pricing before buying.",
    h1: "Cloud Accounts, Credits & AI API Marketplace",
  },
  providers: {
    primaryKeyword: "buy cloud accounts",
    title: "Buy Cloud Accounts | AWS, Azure, Google Cloud & IBM",
    description:
      "Explore cloud account options across AWS, Azure, Google Cloud and IBM Cloud. Compare listed products, cloud credits, features and pricing.",
    h1: "Explore Cloud Accounts Across Leading Cloud Platforms",
  },
  compare: {
    primaryKeyword: "compare cloud accounts",
    title: "Compare Cloud Accounts, Credits & API Pricing",
    description:
      "Compare cloud accounts, credits, AI API access, product features and pricing. Find the right cloud product for your development needs and budget.",
    h1: "Compare Cloud Products, Features & Pricing",
  },
  guides: {
    primaryKeyword: "AWS account buying guide",
    title: "AWS Account Buying Guide | Cloud Accounts & Credits",
    description:
      "Explore buying guides for AWS accounts, cloud credits and AI API access. Understand product features, pricing and requirements before making a purchase.",
    h1: "Cloud Account & AWS Product Buying Guides",
  },
  faq: {
    primaryKeyword: "cloud account help center",
    title: "Cloud Account Help Center | Orders & Customer Support",
    description:
      "Find answers about cloud account purchases, payments, product requirements, order processing and customer support in our cloud product help center.",
    h1: "Cloud Account Help Center & Customer Support",
  },
  verified: {
    primaryKeyword: "AWS account seller",
    title: "AWS Account Seller Profile | BuyAWSAccountsAI",
    description:
      "Learn about BuyAWSAccountsAI, our cloud product offerings, seller information, business policies and customer support before purchasing.",
    h1: "Meet Your Cloud Account Seller",
  },
  contact: {
    primaryKeyword: "cloud account sales",
    title: "Contact Cloud Account Sales | BuyAWSAccountsAI",
    description:
      "Contact our sales team for cloud account purchases, AWS credits, AI API access, product availability, pricing and cloud service inquiries.",
    h1: "Contact Our Cloud Product Sales Team",
  },
};

export const pageHeading = (id, fallback = "") =>
  seoOverrides[id]?.h1 || pageSeo[id]?.h1 || fallback;

const secondaryTargets = {
  home: [
    "buy AWS account",
    "AWS accounts for sale",
    "buy AWS accounts online",
    "buy AWS credits",
    "buy cloud accounts",
    "buy AWS Bedrock account",
    "buy AWS Bedrock API key",
  ],
  products: [
    "cloud accounts for sale",
    "cloud credits marketplace",
    "cloud account store",
    "cloud products for sale",
    "AI API marketplace",
  ],
  providers: [
    "buy Azure accounts",
    "buy Google Cloud accounts",
    "buy GCP accounts",
    "buy IBM Cloud accounts",
    "cloud platform accounts",
  ],
  compare: [
    "cloud account comparison",
    "cloud account pricing",
    "AWS account pricing",
    "compare cloud credits",
    "cloud API pricing",
  ],
  guides: [
    "how to buy AWS accounts",
    "where to buy AWS accounts",
    "cloud account buying guide",
    "AWS credits guide",
    "AWS Bedrock API guide",
  ],
  faq: [
    "AWS account purchase support",
    "cloud account FAQ",
    "cloud product support",
    "cloud account payment support",
  ],
  verified: [
    "cloud account seller",
    "cloud product seller",
    "AWS credits seller",
    "cloud marketplace seller",
  ],
  contact: [
    "AWS account sales",
    "cloud credits sales",
    "cloud product sales support",
    "cloud account inquiries",
  ],
};
for (const [id, keywords] of Object.entries(secondaryTargets))
  pageSeo[id].secondaryKeywords = keywords;
