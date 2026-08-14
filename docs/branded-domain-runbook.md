# Branded Domain & Email Deliverability Runbook

**Status:** Runbook only — no domain has been purchased. This is almost entirely a
purchase/DNS decision, not a code task, so nothing here can be "built" ahead of time. Follow
this checklist once a domain name is chosen; the remaining execution is tracked in a separate
follow-up issue.

## Why this matters

Two separate problems, one fix:

1. **Email deliverability:** verification/OTP emails currently send from
   `verify@registerservice.xyz` — a generic `.xyz` domain with no sending reputation and no
   relation to the ScholarMatch brand. This is the root cause of emails landing in spam (see
   [[scholarmatch_email_deliverability]] memory / prior session investigation), not the email
   content or template.
2. **Web app hosting:** the Next.js app isn't deployed to production hosting yet (still only
   run locally this session via `npm run dev`/`npm run build` for verification) — a branded
   domain implies it should be live at that domain, not `*.vercel.app`.

## Step 1 — Pick a domain

Any registrar works (Namecheap, Cloudflare Registrar, Google Domains successor, etc.).
Cloudflare Registrar is worth considering since it also gives free DNS management with a fast
API, useful if DNS ever needs to be scripted later.

## Step 2 — Deploy the web app to Vercel (if not already done)

1. Connect the `austinchennn/ScholarMatch-Web` repo to a new Vercel project.
2. Set the `API_BASE_URL` environment variable to the Railway backend URL
   (`https://scholarmatch-server-production.up.railway.app`, or a future `api.yourdomain.com`
   once Step 4 is done).
3. Deploy — confirm the default `*.vercel.app` URL works end-to-end before touching DNS.

## Step 3 — Point the domain at Vercel

1. In Vercel: Project → Settings → Domains → add `yourdomain.com` (and `www.yourdomain.com`).
2. Vercel will show the exact DNS records to add (typically an `A` record to Vercel's IP and/or
   a `CNAME` for `www`). Add them at the registrar/DNS provider.
3. Wait for DNS propagation and Vercel's automatic SSL certificate to issue.

## Step 4 — (Optional) Give the API a branded subdomain

Railway supports custom domains per service. In Railway: `scholarmatch-server` service →
Settings → Networking → Custom Domain → add `api.yourdomain.com`, then add the CNAME record
Railway shows. Update the web app's `API_BASE_URL` to match, and `CORS_ALLOWED_ORIGINS` on the
backend to include `https://yourdomain.com`.

## Step 5 — Fix email deliverability (the actual bug)

1. In Resend: add `yourdomain.com` as a sending domain.
2. Resend will show SPF, DKIM, and DMARC DNS records to add — add them exactly as shown (don't
   guess the values, they're domain-specific keys Resend generates).
3. Wait for Resend to verify the domain (usually minutes, can take longer depending on DNS TTL).
4. Update the `RESEND_FROM_EMAIL` env var on Railway to something like
   `ScholarMatch <verify@yourdomain.com>` — **remember the space before `<`** (see the #16-era
   incident where a missing space caused Resend to reject every send with a 422).
5. Send a real test verification email post-cutover and confirm inbox placement (not spam)
   across at least Gmail and Outlook.

## Step 6 — Cutover checklist

- [ ] Domain purchased
- [ ] Web app live at the domain via Vercel, SSL issued
- [ ] (Optional) API live at `api.yourdomain.com` via Railway
- [ ] Resend domain verified (SPF/DKIM/DMARC all green in Resend's dashboard)
- [ ] `RESEND_FROM_EMAIL` updated and redeployed
- [ ] Test verification email confirmed landing in inbox, not spam
- [ ] Update `docs/api/BACKEND_SERVER_API.md`'s server base URL reference if the API subdomain changed
