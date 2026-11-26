import React from "react";
import { breadcrumbsFor } from "./breadcrumbData";
export default function SiteBreadcrumbs({ page, pathname }) {
  const crumbs = breadcrumbsFor(page, pathname);
  if (!crumbs.length) return null;
  return (
    <nav className="site-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((crumb, index) => (
          <li key={crumb.path}>
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === crumbs.length - 1 ? (
              <span aria-current="page" title={crumb.name}>
                {crumb.name}
              </span>
            ) : (
              <a href={crumb.path}>{crumb.name}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
