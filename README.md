# ScholarMatch Web

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/shadcn%2Fui-base--ui-000000?style=flat-square" alt="shadcn/ui"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="TanStack Query"/>
  <img src="https://img.shields.io/badge/API-Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot API"/>
  <img src="https://img.shields.io/badge/auth-JWT%20%2B%20BFF%20cookie-8A2BE2?style=flat-square" alt="Auth"/>
</p>

*An "Academic Matchmaking and Collaboration Network" for researchers and students — a
recommendation feed for finding collaborators, a job board for research postings, and private
messaging for confirmed matches.*

> 🌐 This is the web rebuild of **ScholarMatch**, originally a Java desktop app built as a
> CSC207 (Software Design) course project at the University of Toronto. Full credit to the
> original team and repo: [Guancheng-Chen/ScholarMatch](https://github.com/Guancheng-Chen/ScholarMatch).

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com) primitives |
| Server state | [TanStack Query](https://tanstack.com/query) |
| Forms/mutations | React Server Functions (`"use server"` actions), not client-side REST calls |
| Auth | JWT issued by the backend, held server-side in an `httpOnly` cookie (BFF pattern) — see [Architecture notes](#architecture-notes) |
| Backend | [Spring Boot](https://spring.io/projects/spring-boot) + Postgres/pgvector (`scholarmatch-server`, separate repo) |
| Toasts/notifications | [Sonner](https://sonner.emilkowal.ski) |
| Hosting (planned) | [Vercel](https://vercel.com) for this app, [Railway](https://railway.app) for the API |

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

- `src/` — the Next.js app
- `docs/api/` — the backend API contract
