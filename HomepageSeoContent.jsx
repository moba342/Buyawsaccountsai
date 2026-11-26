import React from 'react';
export default function HomepageSeoContent() {
  return (
    <section
      className="home-section buying-article"
      aria-labelledby="aws-account-buying-title"
    >
      <div className="buying-article-heading">
        <span className="home-kicker">AWS ACCOUNTS & CLOUD ACCESS</span>
        <h2 id="aws-account-buying-title">
          Buy AWS accounts.
          <br />
          <span>Find the right access for your project.</span>
        </h2>
        <p>
          Explore AWS accounts for sale, cloud credit packages, and
          seller-listed Bedrock-enabled options. Compare the account
          specification, listed price, and purchase terms against the
          requirements of your workload.
        </p>
      </div>
      <div className="buying-article-grid">
        <article>
          <span>ACCOUNTS & COMPUTE</span>
          <h3>AWS cloud accounts and vCPU options</h3>
          <p>
            Compare AWS account products from free-trial options to
            higher-capacity vCPU listings. If you are comparing cheap AWS
            accounts, review the proposed capacity, account eligibility, region,
            billing setup, and ongoing usage costs alongside the reference
            price.
          </p>
          <a className="text-button" href="/aws-accounts/">
            Explore AWS accounts
          </a>
        </article>
        <article>
          <span>CREDITS & PLATFORMS</span>
          <h3>Buy AWS credits and compare cloud plans</h3>
          <p>
            Review AWS credit accounts and explore cloud account options across
            Google Cloud, Azure, and other listed platforms. Before you buy
            cloud credits, ask which services are covered, when credits expire,
            and which charges remain outside the listed offer.
          </p>
          <a className="text-button" href="/marketplace/">
            Compare cloud accounts and credits
          </a>
        </article>
        <article>
          <span>BEDROCK & API ACCESS</span>
          <h3>AWS Bedrock accounts and API access</h3>
          <p>
            Review seller-listed AWS Bedrock account options, including stated
            request quotas and model-access details. If you want to buy an AWS
            Bedrock API key or need Amazon Bedrock API access, confirm the
            permitted credential setup, account ownership, model permissions,
            and exact scope of the offer.
          </p>
          <p>
            For AWS Bedrock API pricing, ask about provider usage charges and
            credit conditions separately from the account purchase price.
          </p>
          <a className="text-button" href="/aws-accounts/#package-options">
            Review Bedrock-enabled options
          </a>
        </article>
      </div>
    </section>
  );
}
