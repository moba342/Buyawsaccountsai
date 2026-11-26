import { guides } from "./editorialContent.js";
import { slug } from "./catalogPaths.js";
export const guideRoute = (guide) => "buying-guides/" + slug(guide.title);
export const guideByRoute = (id) =>
  guides.find((guide) => guideRoute(guide) === id);
