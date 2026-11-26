import React from "react";
export default function NotFoundPage() {
  return (
    <main
      id="page-content"
      tabIndex={-1}
      className="section inner not-found-page"
    >
      <span className="section-label">PAGE NOT FOUND · 404</span>
      <h1>We couldn’t find that page.</h1>
      <p>
        The link may have changed or the product may no longer be listed. Browse
        the current collection or contact the seller for help.
      </p>
      <div>
        <a className="primary" href="/marketplace/">
          Browse the marketplace
        </a>
        <a className="secondary" href="/contact-sales/">
          Contact sales
        </a>
      </div>
    </main>
  );
}
