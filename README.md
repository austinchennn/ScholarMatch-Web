# ScholarMatch Web

*An "Academic Matchmaking and Collaboration Network" for researchers and students — a
recommendation feed for finding collaborators, a job board for research postings, and private
messaging for confirmed matches.*

> 🌐 This is the web rebuild of **ScholarMatch**, originally a Java desktop app built as a
> CSC207 (Software Design) course project at the University of Toronto. Full credit to the
> original team and repo: [Guancheng-Chen/ScholarMatch](https://github.com/Guancheng-Chen/ScholarMatch).
> The original desktop client is kept for reference at [`legacy-desktop/`](./legacy-desktop).

This app is a Next.js (App Router, TypeScript, Tailwind, shadcn/ui) client talking to the
`scholarmatch-server` Spring Boot API — the same backend the desktop client used.

## Setup

```bash
cp .env.local.example .env.local
# point API_BASE_URL at a running scholarmatch-server instance
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture notes

- **Auth is a BFF (backend-for-frontend) pattern**: `src/app/actions/auth.ts` runs
  server-side Server Actions that call the Spring Boot API and store the returned
  JWT in an `httpOnly` cookie (`src/lib/session.ts`) — the token is never exposed
  to browser JS. `src/lib/api.ts` is the typed fetch wrapper for the backend API.
- **`API_BASE_URL`** is a server-only env var (no `NEXT_PUBLIC_` prefix) since all
  API calls happen in Server Components/Actions, not the browser.
- `scholarmatch-server` has CORS configured (`CORS_ALLOWED_ORIGINS`) for future
  client-side calls, but this app currently calls the API exclusively server-side,
  so CORS isn't actually load-bearing yet.
- Implemented so far: landing page, register (email verification code → account
  creation), login, dashboard, and a full profile-edit page. Recommend/connect,
  matches, messaging, postings, and account settings are not yet ported — see the
  open issues on this repo for the rest of the roadmap.

## Repo layout

- `src/` — the Next.js app (this is the whole point of the repo now)
- `legacy-desktop/` — the original Java Swing desktop client, archived, not developed further
- `docs/api/` — the backend API contract (shared reference for both the web and legacy desktop clients)
