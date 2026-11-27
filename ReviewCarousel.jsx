import { productPath } from "./catalogPaths";
import React, { useRef } from "react";
import { Cpu, Layers, ArrowUpRight } from "lucide-react";
import ProviderLogo from "./ProviderLogo";
import { products, formatPrice } from "./catalog";
import { productPurchaseState } from "./purchase-state";
import "./reviews.css";
import useViewportMotion from "./useViewportMotion";
const scenarios = [
  {
    provider: "AWS",
    title: "Compute planning",
    body: "Separate the EC2 vCPU quota from the size of an individual instance. Region, memory, storage and recurring costs belong in the same deployment brief.",
    tag: "Compute",
  },
  {
    provider: "Google Cloud",
    title: "AI and billing scope",
    body: "Review model identifiers, project permissions and the billing arrangement independently. A credit label does not establish access to an AI service.",
    tag: "AI & data",
  },
  {
    provider: "Azure",
    title: "Application requirements",
    body: "Identify the intended Azure services and deployment region before comparing tiers. Confirm subscription permissions and any model-specific quota.",
    tag: "Applications",
  },
  {
    provider: "Hetzner",
    title: "Infrastructure capacity",
    body: "Clarify server-count and port-limit labels with account-specific evidence. A catalog reference does not reserve hardware or include recurring hosting charges.",
    tag: "Infrastructure",
  },
  {
    provider: "DigitalOcean",
    title: "Multi-node hosting",
    body: "Define the size of each Droplet and the network access your workload requires. Capacity and provider-approved networking are separate requirements.",
    tag: "Cloud hosting",
  },
  {
    provider: "Linode",
    title: "Network allocation",
    body: "Document the intended use, address allocation and permitted outbound traffic. IP counts and port labels do not establish mail delivery or policy exemptions.",
    tag: "Networking",
  },
];
export default function ReviewCarousel() {
  const root = useRef(null),
    visible = useViewportMotion(root);
  return (
    <section
      ref={root}
      className="review-showcase"
      aria-labelledby="review-heading"
      data-running={visible}
    >
      <div className="review-heading">
        <span className="eyebrow">
          <Layers size={13} aria-hidden="true" /> BUYING SCENARIOS
        </span>
        <h2 id="review-heading">
          Different workloads.
          <br className="review-mobile-break" /> Specific requirements.
        </h2>
        <p>
          Use these planning examples to prepare a clear project brief and
          identify the evidence each catalog reference needs.
        </p>
      </div>
      <div className="review-viewport">
        <div className="review-track">
          {[0, 1].map((copy) => (
            <div
              className="review-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {scenarios.map((s) => {
                const account = products.find((p) => p.provider === s.provider);
                const purchase = productPurchaseState(account);
                return (
                  <article className="review-card" key={s.provider}>
                    <div className="review-card-top">
                      <Cpu size={25} aria-hidden="true" />
                      <span className="review-provider">
                        <ProviderLogo name={s.provider} decorative />
                      </span>
                    </div>
                    <blockquote>{s.body}</blockquote>
                    <div className="review-person">
                      <span className="review-avatar" aria-hidden="true">
                        <Layers size={20} />
                      </span>
                      <div>
                        <strong>{s.title}</strong>
                        <span className="review-role">Planning checklist</span>
                      </div>
                      <span className="review-tag">{s.tag}</span>
                    </div>
                    <div className="review-account">
                      <div>
                        <small>Product details</small>
                        <strong>
                          {account.provider} · {account.name}
                        </strong>
                        <span>{purchase.statusText} · {formatPrice(purchase.price)} / account</span>
                      </div>
                      <a
                        className="review-buy"
                        tabIndex={copy === 1 ? -1 : 0}
                        href={productPath(account)}
                      >
                        View product{" "}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="review-controls">
        <span>Review the scope. Document the requirements.</span>
      </div>
    </section>
  );
}
