// Original product-specific reference copy. Human commercial-scope review is still required.
export const catalogEditorial = {
  "product/aws-free-trial": {
    intro:
      "An AWS trial reference needs an eligibility check before it can become an offer. Establish who opens the account, which trial terms apply, and who accepts the billing agreement; an account-package charge is separate from provider usage.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-8-vcpu": {
    intro:
      "The 8 vCPU label is a starting point for a modest development environment. Ask which EC2 quota and instance families it covers, then size memory and storage separately; it does not describe a reserved eight-core machine.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-32-vcpu": {
    intro:
      "For a 32 vCPU project, decide how capacity will be divided between application servers and background jobs. Regional quota, instance availability, and recurring usage charges need separate confirmation before a compute arrangement can be offered.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-64-vcpu": {
    intro:
      "A 64 vCPU reference may be relevant when planning parallel jobs, but CPU count alone says little about throughput. Check the intended instance family, memory per task, storage access, and applicable regional quota.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-128-vcpu": {
    intro:
      "Planning around 128 vCPUs calls for a clear concurrency target. Document how many jobs run together, what happens when work queues grow, and whether the relevant account quota applies to the instance families your application needs.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-256-vcpu": {
    intro:
      "At the 256 vCPU reference tier, deployment architecture matters as much as the headline count. Review worker isolation, storage traffic, and operating cost before treating an account quota as usable application capacity.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-512-vcpu": {
    intro:
      "A 512 vCPU deployment plan needs more than a larger account limit. Record the required regions, availability zones, network throughput, and provisioning conditions; this reference does not reserve resources in any location.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-640-vcpu": {
    intro:
      "The 640 vCPU label should be checked against the exact regional service quota rather than interpreted as one machine size. A capacity review should also identify instance-family restrictions and the proposed billing responsibility.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-1920-vcpu": {
    intro:
      "A project targeting 1,920 vCPUs needs an account-specific capacity assessment. Quota approval and actual regional resource availability are different questions, so neither can be inferred from this seller-supplied tier alone.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-5k-credits": {
    intro:
      "The $5,000 AWS credit reference describes a face value, not the purchase price or a transferable entitlement. Identify the issuing program and its permitted use before assessing whether any commercial arrangement is allowed.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-10k-credits": {
    intro:
      "When reviewing a $10,000 AWS credit reference, start with eligible services and expected monthly usage. Expiry, redemption, and the account that receives the credit determine its practical relevance; none establishes resale permission.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-25k-credits": {
    intro:
      "The $25,000 credit entry requires an explanation of ownership and program conditions. Confirm where redemption occurs, who is entitled to the benefit, and how charges outside eligible usage would be paid.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-100k-credits": {
    intro:
      "A $100,000 credit headline warrants a documented program review rather than an assumption of enterprise entitlement. Credit restrictions, account ownership, and the separate catalog selling price must all be reviewed before ordering.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-32-vcpu-10-rpm-bedrock-enabled": {
    intro:
      "The 32 vCPU and 10 RPM Bedrock labels describe different dimensions of this reference. CPU quota does not establish model access, and the request limit must be checked for the exact model, account, and region.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-32-vcpu-50-rpm-bedrock-enabled": {
    intro:
      "For the 50 RPM Bedrock reference, clarify the application's request pattern and token size. A per-minute request label does not establish concurrent request capacity or latency, and the 32 vCPU figure needs its own quota evidence.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-256-vcpu-10k-rpm-bedrock-enabled": {
    intro:
      "The 10,000 RPM target alongside 256 vCPUs requires service-specific evidence. Identify the Bedrock model and regional request quota separately from compute limits; a larger EC2 tier does not imply a larger AI allowance.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-512-vcpu-10k-rpm-high-tpm-bedrock-enabled": {
    intro:
      "The 512 vCPU entry adds a High TPM label without a numeric token limit. Obtain the exact input/output token quotas and model identifiers before comparing it with a request-rate-only reference.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-640-vcpu-10k-rpm-high-tpm-bedrock-f5-2": {
    intro:
      "The F5.2 text in the 640 vCPU Bedrock reference is a seller-supplied model label. It must be reconciled to an actual supported service identifier, account entitlement, and throughput approval before any model-access claim is published.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-1920-vcpu-10k-rpm-high-tpm-4-6-4-7-4-8-opus-5-fable-5": {
    intro:
      "This 1,920 vCPU entry includes several seller model references, including Opus 5 and Fable 5. Those labels are retained for review, not presented as verified model identifiers or an assurance that the models are available.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-5k-credits-10k-rpm-bedrock-enabled": {
    intro:
      "The $5,000 credit and 10,000 RPM Bedrock reference needs two independent reviews: credit-program permission and model-specific quota approval. Neither the listed allowance nor the request-rate label proves that the combined arrangement can be sold.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-10k-credits-10k-rpm-bedrock-enabled": {
    intro:
      "The $10,000 Bedrock credit reference has the same seller-listed package price as the $5,000 variant. Preserve both figures while requesting a written scope explanation; the larger face value does not establish eligibility or a better authorized offer.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/aws-25k-credits-10k-rpm-bedrock-enabled": {
    intro:
      "For the $25,000 Bedrock credit reference, separate budget coverage from API capacity. Program restrictions, covered services, expiry, and model-level request limits must be established independently before a combined package is published.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/azure-free-trial-200-credits": {
    intro:
      "The Azure $200 trial reference needs confirmation of new-customer eligibility and billing conditions. A trial benefit is not evidence of a transferable subscription, and a seller's setup-service proposal needs its own documented scope.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/azure-pay-as-you-go": {
    intro:
      "An Azure pay-as-you-go subscription incurs usage charges under its billing agreement. The catalog's separate reference charge does not include an unspecified quantity of compute, storage, or AI usage.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/azure-5k-credits": {
    intro:
      "The Azure $5,000 credit reference lists the credit amount and package charge as separate figures. Review their relationship alongside the issuing program, permitted account ownership, and redemption conditions before considering publication.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/azure-10k-credits-gpt-enabled": {
    intro:
      "The GPT Enabled label on this $10,000 Azure credit reference does not identify a deployable model or approved quota. Request the exact Azure service, model deployment, region, and credit conditions as separate verification items.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/azure-5k-credits-gpt-6-astra-high-tpm-t5": {
    intro:
      "The $5,000 GPT 6 Astra reference includes a High TPM T5 label that is not verified model documentation. Match those seller terms to actual deployment identifiers and supported quotas before discussing an AI service scope.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/azure-10k-credits-gpt-6-astra-high-tpm-t5": {
    intro:
      "For the $10,000 Azure AI reference, record how input and output tokens would be metered for the actual deployment. The stated credit value, model label, and High TPM T5 notation do not establish an approved token allowance.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/azure-25k-credits-gpt-6-astra-high-tpm-t5": {
    intro:
      "The $25,000 Azure AI reference needs a region-and-model availability review as well as credit-program evidence. Retaining a seller's model name in the catalog does not confirm that a customer can deploy it in a chosen region.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/azure-100k-credits-gpt-6-astra-high-tpm-t5": {
    intro:
      "At the $100,000 Azure AI reference level, establish whether the proposed quota applies to a model deployment, subscription, or another scope. Credit eligibility and infrastructure charges also need a documented review rather than an enterprise guarantee.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/digitalocean-3-droplets-free-trial": {
    intro:
      "The three-Droplet trial reference describes a seller-listed capacity count, not three reserved virtual machines. Check trial eligibility, available instance sizes, and the billing arrangement before deciding what an evaluation could include.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/digitalocean-10-droplets-free-trial": {
    intro:
      "A ten-Droplet trial reference may support planning a small multi-node environment, subject to actual eligibility and quotas. Specify the size of each node and the permitted trial conditions; the count alone does not define infrastructure capacity.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/digitalocean-200-droplets-port-25-open": {
    intro:
      "The 200-Droplet reference combines a capacity label with a port-25 claim. Verify both with the provider for the intended workload; the listing is not a way to bypass networking restrictions or obtain a delivery guarantee.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/digitalocean-500-droplets-port-25-open": {
    intro:
      "The 500-Droplet entry requires a documented capacity and network-permission assessment. Clarify the deployment region, instance sizes, and ongoing charges independently of the catalog's separate account-selling price.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/google-cloud-free-trial-300-credits": {
    intro:
      "The Google Cloud $300 trial reference depends on the actual trial program and customer eligibility. Confirm billing-account ownership and covered services before assuming that a credit label can be transferred or commercially supplied.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/google-cloud-300-credits-paid-account": {
    intro:
      "The paid-account $300 credit reference should be reviewed as two claims: an active billing arrangement and an eligible credit allowance. Identify the responsible billing owner and the conditions attached to the stated benefit.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/google-cloud-2k-credits-paid-account": {
    intro:
      "A $2,000 Google Cloud credit reference can inform a budget discussion only after its program and expiry are known. Billing alerts and credit balances do not, by themselves, establish spending caps or a transferable commercial benefit.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/google-cloud-5k-credits-paid-account": {
    intro:
      "For the $5,000 paid Google Cloud reference, list the services your project expects to use and compare them with actual credit coverage. Resource quotas, account permissions, and credit eligibility need separate evidence.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/google-cloud-10k-credits-paid-account": {
    intro:
      "The $10,000 Google Cloud reference needs clarity about which projects may use the billing account. Review the required access roles and any organizational restrictions before treating a listed allowance as available deployment budget.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/google-cloud-25k-credits-paid-account": {
    intro:
      "The $25,000 paid-account credit reference calls for a written account and program scope. Verify ownership, redemption, eligible usage, and expiry; a larger headline value does not authorize account transfer or guarantee resource capacity.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/google-cloud-2k-credits-vt-gemini-ai-f5-2-and-f5-2": {
    intro:
      "The $2,000 VT Gemini AI reference contains F5.2 and F5.2 seller labels. Confirm the actual AI service and model identifiers rather than silently expanding VT into Vertex AI or treating the model text as provider documentation.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/google-cloud-5k-credits-vt-gemini-ai-f5-2-and-f5-2": {
    intro:
      "For the $5,000 AI credit reference, distinguish access to a model from credits that can pay for its use. Service entitlement, billing eligibility, and model-specific quotas must all match the intended project.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/google-cloud-10k-credits-vt-gemini-ai-f5-2-and-f5-2": {
    intro:
      "The $10,000 VT Gemini AI reference needs a permissions review across the proposed project, billing account, and AI service. The seller's model notation does not establish customer access or an approved request rate.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/google-cloud-25k-credits-vt-gemini-ai-f5-2-and-f5-2": {
    intro:
      "The $25,000 AI credit reference should be assessed against the actual regional model deployment and billing scope. Program restrictions and approved token/request quotas remain separate requirements even when credit and AI labels appear together.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/hetzner-free-trial": {
    intro:
      "The Hetzner trial reference does not document a current trial entitlement, duration, or included resources. Establish the actual program and customer's billing responsibility before describing any setup as free or available to purchase.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/hetzner-port-limit-50-servers": {
    intro:
      "The Hetzner 50-server port-limit wording needs clarification before it becomes a specification. Ask whether it refers to server count, network ports, or another account limit; do not translate an ambiguous label into guaranteed capacity.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/kamatera-free-trial": {
    intro:
      "The Kamatera trial entry needs a defined evaluation scope, resource allowance, and billing agreement. The selling price alone does not identify trial eligibility, an included server size, or a transferable account arrangement.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/kamatera-port-25-open": {
    intro:
      "The Kamatera port-25 reference requires provider-approved network permission for the actual account and workload. It does not establish an email integration service, sender reputation, or permission to bypass platform controls.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/linode-free-trial": {
    intro:
      "The Linode trial reference needs confirmation of the applicable promotion and account responsibilities. Identify who controls billing and recovery before treating a trial label as an offer that can be commercially supplied.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/linode-port-25-open-10-ips": {
    intro:
      "The Linode 10-IP reference combines address allocation with port-25 access. Establish the allocation scope, region, approved purpose, and provider permission; IP count does not promise outbound mail delivery.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/linode-port-25-open-50-ips": {
    intro:
      "The 50-IP Linode reference requires an account-specific allocation review. Clarify the number and type of addresses, applicable regional limits, and the permitted network use before publishing any infrastructure service claim.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/oracle-cloud-free-trial": {
    intro:
      "The Oracle Cloud trial reference should be distinguished from any separately defined always-free benefits. Verify the actual trial program, identity eligibility, account ownership, and billing transition conditions before presenting an offer.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/oracle-cloud-pay-as-you-go": {
    intro:
      "Oracle Cloud pay-as-you-go describes a billing model rather than an included resource package. The catalog reference charge does not reserve capacity or replace the provider's metered infrastructure fees.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/ovhcloud-free-trial-34-vcpu": {
    intro:
      "The OVHcloud trial entry includes a seller-listed 34 vCPU figure whose scope needs confirmation. Determine whether it describes an account quota or an actual resource configuration, along with trial eligibility and billing terms.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/ovhcloud-paid-account-34-vcpu": {
    intro:
      "The paid OVHcloud 34 vCPU reference does not identify memory, storage, or a dedicated host. Review the quota or resource definition and recurring charges separately from the account-selling price.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/amazon-ses-smtp-50k-daily-limit": {
    intro:
      "The Amazon SES 50,000 daily-limit reference needs evidence from the applicable account and region. Production sending access, verified identities, the rolling sending quota, and the maximum sending rate are distinct requirements.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/amazon-ses-smtp-50k-daily-limit-3-regions": {
    intro:
      "The SES 50,000-limit, three-region reference does not say whether the limit applies separately in each region. Verify each regional approval and quota rather than multiplying the headline count into an unsupported total.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/amazon-ses-smtp-100k-daily-limit": {
    intro:
      "The SES 100,000 daily-limit entry requires current production-access and quota evidence. A daily limit does not establish a per-second sending rate, message deliverability, or permission to send unsolicited email.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/upcloud-free-trial": {
    intro:
      "The UpCloud trial reference needs a specific program, eligible customer, and resource scope. Confirm how billing and account control are arranged before assuming that a listed trial can be transferred or sold.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/upcloud-paid-account": {
    intro:
      "The paid UpCloud account reference is separate from the servers and resources a project might deploy. Establish access administration, regional capacity, and ongoing charges before treating the account charge as an infrastructure plan.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/ibm-cloud-free-trial": {
    intro:
      "The IBM Cloud trial entry requires confirmation of the current trial terms and permitted ownership arrangement. The catalog selling price does not establish a free usage entitlement or a verified setup service.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/ibm-cloud-pay-as-you-go": {
    intro:
      "IBM Cloud pay-as-you-go requires a clear billing and access agreement. Compare the separate reference charge with expected metered usage, and identify who administers the account and pays recurring provider fees.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/ibm-cloud-port-25-open": {
    intro:
      "The IBM Cloud port-25 reference must be checked against the actual service and region. Obtain explicit network-use permission before proposing an email integration; the label does not establish a policy exception.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/heroku-free-trial-port-25-open": {
    intro:
      "The Heroku trial and port-25 entry combines two claims that require independent evidence. Confirm the actual trial program and networking policy without assuming that a free platform plan or an SMTP entitlement is available.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/heroku-port-25-open": {
    intro:
      "The Heroku port-25 reference needs a documented outbound networking scope for the intended application. A port label alone is not an email delivery service or permission to bypass the platform's controls.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/vultr-200-credits": {
    intro:
      "The Vultr $200 credit reference separates a promotional face value from the seller's account-reference charge. Review program eligibility, redemption, expiry, and transfer conditions before considering any commercial offer.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/vultr-250-credits": {
    intro:
      "The $250 Vultr credit reference needs its own program documentation rather than an inference from another credit tier. Covered usage, the receiving account, and redemption restrictions determine what the stated allowance means.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
  "product/vultr-95-credits": {
    intro:
      "The Vultr $95 credit entry has the same reference charge as the $250 entry but a different stated allowance. Preserve those seller figures while requesting an explanation of the actual program and permitted scope.",
    editorialStatus: "PENDING HUMAN REVIEW",
  },
};
