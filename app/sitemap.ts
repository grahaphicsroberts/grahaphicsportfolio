import type { MetadataRoute } from "next";
import { INDEXABLE_ROUTES, SITE_URL } from "./lib/site";

// The homepage and the two pages that sell the practice lead; the case studies
// sit behind them. Google ignores priority, but other crawlers still read it.
const PRIORITY: Record<string, number> = {
  "/": 1,
  "/studio": 0.9,
  "/about": 0.9,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map((route) => ({
    url: `${SITE_URL}${route === "/" ? "" : route}`,
    priority: PRIORITY[route] ?? 0.7,
  }));
}
