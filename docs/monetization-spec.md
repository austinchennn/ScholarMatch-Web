# Monetization & Pricing Spec (Proposal)

**Status:** Draft proposal — pricing and gating decisions below are recommendations, not final.
This doc exists so #14 (Stripe integration) and #15 (boosted postings) have something concrete
to build against, but the actual numbers need the user's sign-off before implementation.

## Principle

Keep the core matching/collaboration loop (recommend, connect, matches, messaging, one research
posting at a time) free and unrestricted. Charge for *volume* and *visibility*, not for the
basic ability to find a collaborator — a paywalled core loop would kill adoption before the
product has any users to monetize.

## Proposed tiers

### Free
- Full recommend/connect/dislike loop, unlimited matches, unlimited messaging
- Up to 1 active research posting at a time
- Public profile page

### ScholarMatch Plus — proposed $6/month or $50/year
- Unlimited active postings
- Boosted/pinned postings (see #15) — a limited number of boost credits per month (e.g. 3),
  not unlimited, so boosting stays meaningful
- "Who viewed your profile" (requires tracking profile views — not currently implemented;
  would need a small additive `profile_views` table, same additive-only pattern as
  notifications in #11)
- Priority placement in the recommend feed (subtle ranking boost, not a full takeover of
  relevance — the recommend feed's value depends on staying genuinely useful)

### Institutional / Recruiter — proposed custom pricing, not self-serve at launch
- For labs/companies posting multiple openings regularly
- Everything in Plus, plus: multiple simultaneous boosted postings, a lightweight applicant
  dashboard (already exists via #6, would just need multi-posting aggregation)
- Recommend starting this as a manually-arranged plan (invoice, not Stripe self-serve) until
  there's demand to justify building a proper team/org billing model

## What's explicitly NOT proposed for paywalling

- Messaging — a paywalled inbox is one of the most common complaints about matching products;
  don't repeat that mistake
- Basic search (#10) — gating discovery defeats the growth purpose of having it
- Public profile pages (#9) — these are for SEO/growth, must stay free and indexable

## Implementation dependencies

- **#14 (Stripe)** needs: a real Stripe account, API keys (test + live), and a decision on
  whether subscriptions are monthly/annual/both. None of this can be built end-to-end without
  those credentials — Claude can write the integration code and webhook handling, but cannot
  create the Stripe account or test a real checkout without the user providing keys.
- **#15 (boosted postings)** only needs a `boosted` flag + sort-order change — buildable now,
  independent of Stripe, with boost-granting hardcoded/manual until #14 exists to sell it.
- Profile-view tracking ("who viewed you") is scoped out of the initial Plus tier build unless
  requested — it's a privacy-sensitive feature (tracking who looked at whom) worth a separate
  discussion before building.

## Open questions for the user

1. Do the proposed price points ($6/mo, $50/yr) seem right, or is there a target number already
   in mind?
2. Is "Institutional" a real near-term priority, or should it be deferred entirely until there's
   organic demand?
3. Is profile-view tracking wanted, given the privacy trade-off?
