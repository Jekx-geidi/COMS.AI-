# COMS.AI

**Cebu Outage Monitoring & Intelligence System** — an AI-powered public web platform (mobile + desktop) that turns fragmented power-interruption information into verified, structured, geospatial, personalized outage intelligence for Cebu, Philippines.

Full product/spec source of truth lives in [`Core Docs/`](./Core%20Docs) — read `PLAN-FLOW-REQUIREMENTS.md` first, it is the stage-gated execution plan this codebase follows. A living summary of the product understanding is in [`PROJECT_UNDERSTANDING.md`](./PROJECT_UNDERSTANDING.md).

---

## Architecture decision on top of Core Docs: no login for residents

Core Docs (`BRD.md`, `PRD.md`, `UFR.md`, `PLAN-FLOW-REQUIREMENTS.md` Stage 2, `DATABASE-STRUCTURE.md`) describe a "Registered User" tier that logs in via Supabase Auth to use My Places, notifications, and community reporting.

**This has been superseded by explicit product direction:** the entire resident/public side of COMS.AI — dashboard, map, Locate Me, search, calendar, Ask AI, My Places, notification preferences, and community reporting — is open with **no account and no login**. State for a resident (saved places, notification prefs, submitted reports) is scoped to a **device identity** (a client-generated UUID persisted in browser storage), not a Supabase Auth user.

**Only the Admin / Moderator / Platform Admin console is authenticated**, via Supabase Auth, because it controls what gets published as verified public truth and must stay auditable (NFR-052).

Practical effect on the schema: resident-owned tables (`user_places`, `community_reports`, `notifications`) key off `device_id` (text, client-generated) instead of `auth.users.id`. See `supabase/migrations/0005_user_places.sql`, `0014_community_reports.sql`, `0013_notifications.sql` for the exact shape, and `docs/architecture/system-architecture.md` for the full rationale.

---

## Stack

- Next.js 14 (App Router) + TypeScript (strict)
- Supabase (PostgreSQL + PostGIS + Storage + Auth for admin only)
- Zod for schema validation
- Vitest (unit/integration) + Playwright (e2e)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase project values
npm run supabase:start        # requires the Supabase CLI + Docker
npm run dev
```

Until a real Supabase project/keys, map provider, and AI provider key are configured, the app runs with those integrations stubbed behind their provider abstractions (`src/lib/ai/providers`, `src/lib/geo`, map config in `src/config/map.ts`) — see each file's `NotConfiguredError` for what's missing.

## Environment variables

See [`.env.example`](./.env.example) — every variable is documented there with which stage introduces it.

## Repository layout

Follows [`Core Docs/COMS-AI-FILE-BRANCHING-TREE.md`](./Core%20Docs/COMS-AI-FILE-BRANCHING-TREE.md) exactly. Do not place files outside the categories defined there (app routes, feature modules, shared UI, domain types, services, database, AI, geo, notifications, validation, auth, tests, docs, config).

## Build stages

This codebase is implemented stage-by-stage per `Core Docs/PLAN-FLOW-REQUIREMENTS.md`. Current status is tracked in [`docs/product/roadmap.md`](./docs/product/roadmap.md).

Email: admin.demo@coms.ai
Password: ComsAiDemo!2026