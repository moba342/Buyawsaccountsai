import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  pageSlugs,
  routeIds,
  routePath,
  pathRoute,
  currentRoute,
} from "../routing.js";

test("named page URLs round-trip to stable app IDs, with legacy aliases", () => {
  for (const [id, slug] of Object.entries(pageSlugs)) {
    assert.equal(routePath(id), `/${slug}/`);
    assert.equal(pathRoute(`/${slug}/`), id);
    assert.equal(pathRoute(`/${id}/`), id);
  }
  assert.equal(pathRoute("/"), "products");
  assert.equal(pathRoute("/not-a-route/"), null);
  assert.equal(new Set(routeIds.map(routePath)).size, routeIds.length);
  for (const id of routeIds) assert.equal(pathRoute(routePath(id)), id);
});
test("old pages permanently redirect to rewritten canonical pages without redirect chains", () => {
  const config = JSON.parse(
    fs.readFileSync(new URL("../vercel.json", import.meta.url)),
  );
  for (const [id, slug] of Object.entries(pageSlugs)) {
    assert(
      config.redirects.some(
        (r) =>
          r.source === `/${id}/` &&
          new URL(r.destination, "https://www.buyawsaccountsai.com")
            .pathname === `/${slug}/` &&
          r.permanent,
      ),
    );
    assert(
      config.rewrites.some(
        (r) =>
          r.source === `/${slug}/` && r.destination === `/${slug}/index.html`,
      ),
    );
  }
  for (const r of config.redirects)
    assert(
      !config.redirects.some(
        (other) =>
          !other.has &&
          other.source ===
            new URL(r.destination, "https://www.buyawsaccountsai.com").pathname,
      ),
      r.source,
    );
});
test("client migrations preserve query strings and handle legacy hashes", () => {
  const previous = global.window;
  try {
    for (const [pathname, hash, expected] of [
      ["/products/", "", "/marketplace/"],
      ["/", "#verified", "/seller-profile/"],
      ["/", "#cloud-platforms", "/cloud-platforms/"],
    ]) {
      const location = { pathname, hash, search: "?campaign=test" };
      global.window = {
        location,
        history: {
          replaceState(_s, _t, path) {
            const url = new URL(path, "https://example.com");
            location.pathname = url.pathname;
            location.hash = url.hash;
            location.search = url.search;
          },
        },
      };
      currentRoute();
      assert.equal(location.pathname, expected);
      assert.equal(location.search, "?campaign=test");
    }
    global.window = {
      location: { pathname: "/", hash: "", search: "" },
      history: {
        replaceState() {
          assert.fail("home must stay at root");
        },
      },
    };
    assert.equal(currentRoute(), "products");
  } finally {
    global.window = previous;
  }
});
