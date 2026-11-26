import { preloadRoute } from "./routeComponents";
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { currentRoute } from "./routing";
const root = document.getElementById("root");
const route = currentRoute(),
  pathname = location.pathname;
const app = <App initialRoute={route} initialPathname={pathname} />;
async function mount() {
  await preloadRoute(route);
  if (
    root.dataset.prerendered === "true" &&
    root.dataset.route === route &&
    root.dataset.path === pathname
  )
    hydrateRoot(root, app);
  else createRoot(root).render(app);
}
mount().catch((error) =>
  console.error("The interactive page could not load.", error),
);
