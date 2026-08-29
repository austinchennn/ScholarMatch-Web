import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Static public routes only. Public scholar profiles (/scholars/[id]) are also indexable but
// can't be enumerated here without a backend call to list every scholar — add a dedicated
// app/scholars/sitemap.ts once that listing endpoint exists (see #9).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/legal/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/legal/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
