import React from "react";
export default function HomepageSeoContent() {
  return (
    <section
      className="home-section buying-article"
      aria-labelledby="aws-account-buying-title"
    >
      <div className="buying-article-heading">
        <span className="home-kicker">AWS ACCOUNTS & CLOUD ACCESS</span>
        <h2 id="aws-account-buying-title">
          Understand AWS account requirements.
          <br />
          <span>Review the proposed scope first.</span>
        </h2>
        <p>
          Use the AWS reference collection to review compute tiers, credit
          conditions and seller-listed AI labels. Publication and purchasing
          remain unavailable until authorization, scope and availability are
          documented.
        </p>
      </div>
      <div className="buying-article-grid">
        <article>
          <span>ACCOUNTS & COMPUTE</span>
          <h3>AWS cloud accounts and vCPU options</h3>
          <p>
            Compare AWS account products from free-trial options to
            higher-capacity vCPU listings. For each reference, review the
            proposed capacity, account eligibility, region, billing setup, and
            ongoing usage costs alongside the reference price.
          </p>
          <a className="text-button" href="/aws-accounts/">
            Explore AWS accounts
          </a>
        </article>
        <article>
          <span>CREDITS & PLATFORMS</span>
          <h3>Understand credit eligibility and cloud costs</h3>
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
            request quotas and model-access details. For any intended Amazon
            Bedrock API integration, confirm the permitted credential setup,
            account ownership, model permissions, and exact scope of the offer.
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
