// One place for the facts that metadata, the sitemap, robots.txt, and the
// structured data all have to agree on.

export const SITE_URL = "https://www.grahaphics.com";

// The pages that belong in search results. Everything else under app/ is a
// private deck, an unshipped preview, or one of the old standalone case
// studies the category pages replaced, and each of those carries its own
// noindex.
export const INDEXABLE_ROUTES = [
  "/",
  "/studio",
  "/about",
  "/immersive-web",
  "/nyt-ar",
  "/nyt-vr",
  "/google-trends",
  "/video-innovation",
  "/havas",
  "/recognition",
  "/speaking",
] as const;
