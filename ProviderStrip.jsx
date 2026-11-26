import { providerPath } from "./catalogPaths";
import useViewportMotion from "./useViewportMotion";
import "./provider-motion.css";
import React, { useRef } from "react";
import ProviderLogo from "./ProviderLogo";
import { providerRoute } from "./catalogPaths";
export default function ProviderStrip({ brands, navigate }) {
  const root = useRef(null),
    running = useViewportMotion(root);
  return (
    <section
      ref={root}
      data-running={running}
      className="provider-motion-strip"
      aria-label="Cloud providers"
    >
      <div className="provider-motion-window">
        <div className="provider-motion-track">
          {[0, 1].map((copy) => (
            <div
              className="provider-motion-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {brands.map((b) =>
                copy === 0 ? (
                  <a
                    className="provider-motion-item"
                    key={b.name}
                    href={providerPath(b)}
                    onClick={() => navigate(providerRoute(b))}
                  >
                    <ProviderLogo name={b.name} decorative />
                    <span>{b.full}</span>
                  </a>
                ) : (
                  <span className="provider-motion-item" key={b.name}>
                    <ProviderLogo name={b.name} decorative />
                    <span>{b.full}</span>
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
