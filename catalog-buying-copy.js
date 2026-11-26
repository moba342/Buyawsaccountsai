// Buying guidance describes supplied records; it does not activate commercial offers.
import { productRoute } from './catalogPaths.js';
import { catalogEditorial } from './catalog-editorial-data.js';
import { catalogMetadataCopy } from './catalog-metadata-copy.js';
export const categoryBuyerFocus = {
 AWS: 'Compare vCPU tiers, credit values and seller-listed Bedrock configurations. Keep account limits separate from reserved compute capacity and ongoing AWS usage charges.',
 Azure: 'Separate trial and pay-as-you-go billing from credit packages and seller-listed GPT access. Compare the listed credit value, account price and AI configuration independently.',
 DigitalOcean: 'Compare Droplet counts and any listed port 25 option against the workload you plan to run. Account limits do not specify the size or recurring price of each Droplet.',
 'Google Cloud': 'Distinguish trial credits, paid-account credit packages and seller-listed Vertex/Gemini configurations. Review credit conditions and model/quota labels as separate requirements.',
 Hetzner: 'Compare the trial entry with the seller-listed server-limit option. A server-count label is an account limit rather than a reservation of running machines.',
 Kamatera: 'Compare the trial and port 25 entries by their proposed connectivity and billing scope. Specify the region and intended network use when reviewing an account.',
 Linode: 'Compare trial access with the listed port 25 and IP-allocation tiers. Check the IP count, intended use and recurring infrastructure charges independently.',
 'Oracle Cloud': 'Separate trial eligibility from pay-as-you-go billing. Decide who administers the account and how resource usage will be charged before choosing a configuration.',
 OVHcloud: 'Compare the trial and paid 34 vCPU references without treating a quota as dedicated hardware. Ask about the relevant service, region and billing arrangement.',
 'Amazon SES': 'Compare daily sending limits and the explicitly listed multi-region option. Sending quota, regional setup and the account charge describe different parts of the arrangement.',
 UpCloud: 'Compare the trial and paid account entries by their access and billing scope. Include the expected region and infrastructure usage in your buying requirements.',
 'IBM Cloud': 'Compare trial, pay-as-you-go and listed port 25 entries separately. Billing type and network permissions should match the services you actually plan to deploy.',
 Heroku: 'Compare the trial/port 25 entry with the separate connectivity option. Clarify application access, network permissions and ongoing billing before choosing an account.',
 Vultr: 'Compare each listed credit value against its account price and credit conditions. The allowance is not the same as the recurring cost or performance of a deployed instance.',
};
export const productName = p => p.provider + ' ' + p.name;
export function productOpening(p) {
 const body=catalogMetadataCopy[productRoute(p)]?.descriptionBody;
 if(!body)throw Error('Missing product-specific buying focus '+productRoute(p));
 return `Buy ${productName(p)} online: ${body}`;
}
export function productBuyingDescription(p) {
 const original=catalogEditorial[productRoute(p)]?.intro;
 if(!original)throw Error('Missing original product description '+productRoute(p));
 return `This guide explains what to review before you buy ${productName(p)}. ${original}`;
}
export function categoryOpening(brand) {
 const focus=categoryBuyerFocus[brand.name];if(!focus)throw Error('Missing provider buying focus '+brand.name);
 return `Before you buy ${brand.name} Accounts online, compare the listed account types and purchase requirements. ${focus}`;
}
export function purchaseQuestion(name) {return `What should I confirm before I order ${name}?`}
