import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Nothing is disallowed, deliberately. The private and retired routes keep
    // themselves out of search with noindex, and a crawler has to be able to
    // fetch a page to read that tag: blocking them here would strand any that
    // are already indexed, with no way for them to drop back out.
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
