<h1 align="center">Jottr</h1>

<p align="center">Notes that summarize themselves — a cloud notebook with on-demand AI summaries.</p>

<p align="center">
  <a href="https://jottr.app"><strong>jottr.app »</strong></a>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18.3-149eca?logo=react&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white">
  <img alt="Node" src="https://img.shields.io/badge/Node-22-5fa04e?logo=nodedotjs&logoColor=white">
  <img alt="Tests" src="https://img.shields.io/badge/tests-36%20passing-success">
</p>

---

## Overview

Jottr is a personal note-taking app for the thoughts, reminders, and loose ideas worth keeping. Notes are saved to the cloud the moment you add them and reachable from any device. When a note runs long, one tap turns it into a concise, AI-written summary — generated on demand by Google's Gemini, never automatically.

## Features

- **Notes CRUD** with optimistic UI — adds, edits, and deletes feel instant and roll back on error.
- **On-demand AI summaries** — summarize any note in a tap; results are cached per note for the session.
- **Undo delete** — a 10-second window to bring a note back before it's really gone.
- **JWT authentication** — sign up, log in, and reach your notes from anywhere.
- **Responsive, accessible UI** — a frosted-glass design built on Radix primitives, down to mobile.

## Tech stack

**Frontend** — Vite · React 18 · React Router 7 (data API) · TanStack Query (server state) · Zustand (client state) · Tailwind CSS v4 · Radix UI · day.js

**Backend** — Node · Express · Mongoose (MongoDB Atlas) · JSON Web Tokens · bcrypt · Helmet · express-rate-limit · express-validator

**AI** — Google Gemini 2.5 Flash

**Testing** — Vitest · React Testing Library · jsdom (36 tests, ~89% line coverage)

**Hosting** — Netlify (client) · Google Cloud Run (API) · MongoDB Atlas (data)

## Architecture

```
client/                          server/
  React SPA (Vite)                 Express REST API
  ├─ TanStack Query  ──HTTP──►      ├─ routes/       (auth, notes)
  │   optimistic cache             ├─ middleware/   (JWT verify)
  ├─ Zustand  (alerts, modals)     ├─ models/       (Mongoose schemas)
  └─ Radix + Tailwind UI           └─ lib/          (Gemini, quota, validation)
                                        │
                                   MongoDB Atlas
```

Server state lives in TanStack Query — one source of truth, optimistic updates with rollback. Zustand holds only ephemeral client state (toasts, modal open-state); no server data is mirrored into a store. The API is a thin REST layer: components call typed `api/*` functions through `use*` hooks, never `fetch` directly.

## Design decisions

- **Optimistic UI with rollback.** Mutations update the cache immediately and revert on error, so the app feels instant without losing correctness.
- **Server vs. client state, kept separate.** TanStack Query owns anything from the API; Zustand owns only UI state.
- **CSS-first Tailwind v4.** Design tokens and the frosted-glass surface live in one stylesheet via `@theme` / `@utility`; Radix supplies accessible modal and menu behavior.
- **AI summaries are explicit and bounded.** They run only when requested, cap output length, and the prompt is hardened against injection from note content.

## Security

- **CORS** locked to the canonical origin (`https://jottr.app`); other origins are rejected server-side.
- **Authentication** via JWT signed with a pinned `HS256` algorithm; passwords hashed with bcrypt (input capped at bcrypt's 72-byte limit).
- **Rate limiting** per IP, split by endpoint — failed logins, account creation, and summary requests each have their own budget.
- **Hardened headers** with Helmet, an 18 kB JSON body limit, and boot-time validation that refuses to start without the required environment variables.
- **AI guardrails** — the note is fenced as untrusted data in the prompt, with a per-user daily summary quota enforced in the database.

## Getting started

### Prerequisites

- Node 22+
- A MongoDB connection (Atlas or local)
- A Google Gemini API key

### Environment variables

`server/.env`

```
MONGO_USERNAME=...
MONGO_PASSWORD=...
MONGO_CLUSTER=...
MONGO_DBNAME=...
JWT_SECRET_KEY=...
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=...
```

`client/.env`

```
VITE_HOST=http://localhost:8080
```

### Install and run

```bash
# install dependencies
cd client && npm install
cd ../server && npm install

# run both from the repo root (client on :5173, API on :8080)
npm run dev
```

### Scripts (client)

```bash
npm run dev          # start the dev server
npm run build        # production build → dist/
npm run lint         # ESLint
npm run test:run     # run the test suite once
npm run coverage     # tests with a coverage report
```

## Deployment

- **Client** → Netlify. Build `npm run build`, publish `dist/`, Node 22. SPA routing via `client/public/_redirects`.
- **API** → Google Cloud Run, with the runtime environment variables above set on the service.
- **Data** → MongoDB Atlas.

## License

ISC © Malhar
