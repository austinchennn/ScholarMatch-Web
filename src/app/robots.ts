import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Everything under the (app) route group requires a logged-in session and redirects anonymous
// visitors to /login, so there's nothing there for a crawler to index. The public surface is
// the landing page, auth pages, legal pages, and public scholar profiles (/scholars/[id]).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/recommend",
        "/matches",
        "/notifications",
        "/search",
        "/settings",
        "/billing",
        "/admin",
        "/applications",
        "/profile",
        "/postings/mine",
        "/postings/new",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
