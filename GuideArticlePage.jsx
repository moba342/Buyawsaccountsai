import { pageHeading } from "./site-config";
import React from "react";
import { guideByRoute } from "./guideRoutes";
export default function GuideArticlePage({ id }) {
  const guide = guideByRoute(id);
  return (
    <main
      id="page-content"
      tabIndex={-1}
      className="section inner guide-article-page"
    >
      <article>
        <span className="section-label">{guide.category}</span>
        <h1>{pageHeading(id, guide.title)}</h1>
        <p className="guide-article-byline">
          Buying guidance from BuyAWSAccountsAI · Account conditions should be
          confirmed before purchase.
        </p>
        <p>{guide.text}</p>
        <h2>Before you place an order</h2>
        <ol>
          {guide.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <h2>Review the products and purchase terms</h2>
        <p>
          Use the listed specifications and reference prices to prepare a
          shortlist. Confirm account ownership, provider requirements,
          availability, final pricing and delivery terms directly with the
          seller.
        </p>
        <nav aria-label="Related buying resources">
          <a href="/buy-aws-accounts/">Explore AWS account products</a>
          <a href="/marketplace/">Browse the cloud marketplace</a>
          <a href="/help-center/">Read purchase and payment questions</a>
          <a href="/contact-sales/">Contact sales</a>
        </nav>
      </article>
    </main>
  );
}
