import { catalogDefinitions } from './catalog-data.js';
import { products } from './catalog.js';
export const providerBuyingNotes = Object.fromEntries(
  catalogDefinitions.map((def) => [def.name, def.overview]),
);
function introduction(product) {
  const label = `${product.provider} ${product.name}`;
  if (product.kind === 'AI')
    return `Explore the ${label} listing at $${product.price.toLocaleString('en-US')} per account. The model names, credit figures, and quota labels in this offer are supplied by the seller. Request the exact service and regional account details before deciding whether this variant fits your intended AI workload.`;
  if (product.kind === 'Credit')
    return `Compare the ${label} account package with your planned cloud budget. Its seller-listed credit value is $${product.credit.toLocaleString('en-US')}, while the account package has a separate reference price of $${product.price.toLocaleString('en-US')}. Review eligibility, redemption, and expiry for the specific offer.`;
  if (product.dailyLimit)
    return `Review the ${label} package as a seller-listed SMTP account option. Ask for evidence of the proposed ${product.dailyLimit.toLocaleString('en-US')} daily sending limit${product.regions ? ' and ' + product.regions + '-region scope' : ''}, along with the permitted use, account responsibilities, and ongoing charges before purchase.`;
  if (product.kind === 'Compute')
    return `Compare the ${label} listing with the compute requirements of your project. The ${product.vcpus} vCPU figure is a seller-listed account-tier label, not a resource reservation. Request the relevant quota, region, resource availability, and billing details before agreeing to the $${product.price.toLocaleString('en-US')} package.`;
  if (product.kind === 'Droplet')
    return `Explore the ${label} account listing for a deployment requiring a seller-listed ${product.capacity}-Droplet capacity and port-25 access. Specify the exact networking use and region, then confirm the proposed permissions, account limits, and recurring resource charges in writing.`;
  if (product.kind === 'Server')
    return `Review the ${label} package with a clear explanation of your intended hosting and networking requirements. Ask what the seller-listed ${product.capacity}-server port-limit label means for the account offered, and confirm locations, approval conditions, and separately billed resources before ordering.`;
  if (product.kind === 'SMTP')
    return `Compare the ${label} listing for a networking-focused account purchase${product.ips ? ' involving a seller-listed allocation of ' + product.ips + ' IPs' : ''}. Discuss the specific port permissions, permitted workload, account administration, and ongoing hosting costs before agreeing to the package and delivery process.`;
  if (product.kind === 'Trial')
    return `Explore the ${label} package for an account evaluation with a defined project goal. Review the seller-listed${product.credit ? ' $' + product.credit.toLocaleString('en-US') + ' credit allowance and' : ''}${product.vcpus ? ' ' + product.vcpus + ' vCPU tier and' : ''}${product.capacity ? ' ' + product.capacity + '-Droplet capacity and' : ''}${product.port25 ? ' port-25 access and' : ''} trial conditions, billing arrangement, and permitted setup before paying the separate $${product.price.toLocaleString('en-US')} account-package price.`;
  return `Review the ${label} listing as a proposed account arrangement for your next deployment. At a reference package price of $${product.price.toLocaleString('en-US')}, this option should be assessed alongside ownership, access administration, billing responsibility, required regions, and the resources you intend to use.`;
}
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
    title: 'Verify the seller-listed AI access and quota details',
    body: 'Ask for the exact AI service, model identifiers, account region, and current RPM or TPM quota shown for the offered account. Model labels are reproduced from the seller list and do not establish official model availability or guaranteed throughput. Where credits are included, confirm their eligibility, redemption conditions, and expiry separately from the AI access arrangement.',
    checks: [
      'Exact service, model identifiers, and account region',
      'Account-specific evidence for seller-listed RPM and TPM labels',
      'Credit conditions, billing responsibility, and permitted account setup',
    ],
  },

  Credit: {
    title: 'Review the credit offer, not just the headline value',
    body: 'Request the eligibility, redemption process, expiry date, and covered usage for the specific offer. Record who owns the billing account and what happens when the allowance is used or expires. A package purchase price and a listed credit value describe different parts of the offer; compare both with your project budget.',
    checks: [
      'Written credit eligibility and redemption details',
      'Expiry date and the scope of covered usage',
      'Billing responsibility for costs outside the allowance',
    ],
  },
  Compute: {
    title: 'Turn the compute-tier label into an account-specific brief',
    body: 'Ask which service quota and region the listed tier refers to, what evidence supports the proposed account limit, and whether the resources you want are available. A vCPU label is not a dedicated server reservation or a guarantee of application performance. Keep the account package separate from the infrastructure you plan to run.',
    checks: [
      'Relevant compute quota and regional details',
      'Ownership, access roles, and billing responsibility',
      'Separate budget for the resources you deploy',
    ],
  },
  Trial: {
    title: 'Check the proposed trial conditions before ordering',
    body: 'Ask what the trial label includes, who is eligible, how billing is arranged, and which account details will be provided. Set an evaluation goal and spending controls before you deploy. The storefront price is the listed account-package charge; it should not be read as a promise of free provider usage or unlimited trial resources.',
    checks: [
      'Trial eligibility and the proposed setup scope',
      'Usage limits and any billing requirements',
      'Plan for the end of the evaluation period',
    ],
  },
  Droplet: {
    title: 'Review capacity and networking as separate requirements',
    body: 'Request the exact account capacity, relevant regions, and proposed networking permissions. Describe any required port by number and intended use rather than assuming that an open-port label covers every connection. Resource sizes, availability, and ongoing charges belong in the deployment plan alongside the account arrangement.',
    checks: [
      'Listed Droplet count and current account limits',
      'Specific port permissions and acceptable-use conditions',
      'Resource availability and recurring usage charges',
    ],
  },
  Server: {
    title: 'Match the capacity tier to your hosting plan',
    body: 'Confirm the proposed account limit, any approval conditions, and the locations relevant to your project. A server-count listing is not a reservation of particular hardware or an inclusion of recurring hosting charges. Ask how the account package, resources you order, and ongoing operational responsibilities fit together.',
    checks: [
      'Account capacity and any approval requirements',
      'Relevant server locations and resource availability',
      'Ownership and recurring server-payment responsibilities',
    ],
  },
  SMTP: {
    title: 'Verify the exact networking scope for your intended use',
    body: 'Request the specific port-access conditions for the offered account and explain the traffic you intend to send. Review provider requirements, access administration, and separate infrastructure charges in the same conversation. An open-port listing is not a promise of message delivery, sender reputation, or permission to send unsolicited email.',
    checks: [
      'Account-specific port-access conditions',
      'Permitted workload and provider requirements',
      'Administration, security, and ongoing hosting costs',
    ],
  },
  Account: {
    title: 'Establish ownership, access, and billing in writing',
    body: 'Request the current account details behind the listing and confirm the proposed ownership or permitted setup arrangement. Identify who administers access, controls recovery, and pays the provider. Where account age, an upgrade, or a business label is part of the offer, ask what that label means for the account actually being supplied.',
    checks: [
      'Proposed account ownership and permitted setup',
      'Billing, recovery, and administration responsibilities',
      'Current account details supporting the listed arrangement',
    ],
  },
};
export function getProductArticle(product, brand) {
  const intro = variantIntroductions[product.provider]?.[product.name];
  if (!intro)
    throw new Error(
      'Missing product article: ' + product.provider + ' ' + product.name,
    );
  const kind = kindCopy[product.kind] || kindCopy.Account;
  const price = '$' + product.price.toLocaleString('en-US');
  return {
    title: `Buying ${brand.full} ${product.name}`,
    intro,
    price,
    sections: [
      {
        title: 'Choose a package around your project',
        paragraphs: [
          providerBuyingNotes[product.provider],
          `At Buy AWS Accounts AI, this ${product.type.toLowerCase()} has a listed reference price of ${price} per account. Tell us the scope you need so your buying discussion starts with the relevant package, rather than a broad account label.`,
        ],
      },
      { title: kind.title, paragraphs: [kind.body], checks: kind.checks },
      {
        title: 'Review the seller and your written quote',
        paragraphs: [
          'Our public seller profile brings the supplied business and contact details into one place. Read the published seller declaration and request the supporting account information relevant to your purchase. Seller-provided documentation is a starting point for review; it is not cloud-provider authorization or an independent certification.',
          `Ask for a written quote naming ${brand.full}, the ${product.name} variant, the final package price, and what will be delivered. Include any agreed account checks, assistance, cancellation conditions, and refund terms so both sides have the same record.`,
        ],
      },
      {
        title: 'Checkout, payment, and delivery',
        paragraphs: [
          'Choose Buy Now to select the package and add it to your cart or continue to checkout. Review quantities and contact details, then select USDT TRC20, BEP20, or ERC20. Confirm the receiving network and agreed amount with the seller before transferring.',
          'After payment, enter the TXID to check the on-chain transfer. The checker compares the approved token, receiving wallet, finality, and listed cart amount. If your agreed quote differs from that amount, request seller review. Send the order details and TXID to the seller to match the payment to your purchase and arrange the agreed delivery.',
          'Keep the written quote, transaction reference, and delivery correspondence together. Review the delivered account details and access responsibilities before deploying your workload, and use the official seller contact for questions about the agreed scope.',
        ],
      },
    ],
  };
}
