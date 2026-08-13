# ScholarMatch Web

Next.js (App Router, TypeScript, Tailwind, shadcn/ui) client for ScholarMatch,
talking to the `scholarmatch-server` Spring Boot API.

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
- The backend currently has **no CORS configuration** — since this app calls it
  exclusively from the server side (Server Components/Actions), that's fine for
  now, but any future client-side `fetch` to the API directly will need CORS
  added to `scholarmatch-server`'s `SecurityConfig`.
- Implemented so far: landing page, register (email verification code → account
  creation), login, and a dashboard that reads the caller's own profile. Matches,
  messaging, postings, and account settings are not yet ported — see the project
  plan for the rest of Phase 1.
