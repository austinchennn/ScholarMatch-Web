// The app's canonical public origin, used for absolute URLs in metadata, robots.txt, and the
// sitemap. Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://scholarmatch.example) — this
// is the one place a `NEXT_PUBLIC_` var is needed, since these files are generated at the edge
// and can't read the server-only `API_BASE_URL`. Falls back to localhost for local dev.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
