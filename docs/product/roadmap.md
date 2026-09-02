# COMS.AI implementation roadmap

This is the current implementation record for the stage-gated plan in `Core Docs/PLAN-FLOW-REQUIREMENTS.md`.

## Stage 0 — Project Initialization

**Status: PASS (local)**

The Next.js project, TypeScript strict mode, linting, environment template, documentation, and local development shell are present. `npm run build` passes.

## Stage 1 — Architecture and Data Foundation

**Status: PARTIAL**

The migration set, core domain types, PostGIS extension migration, indexes, RLS policies, and Cebu map fixtures are present. Live database migration, persistence after restart, and PostGIS query acceptance still require a running configured Supabase environment.

## Stage 2 — Authentication, Roles, and Security Base

**Status: PARTIAL**

### Implemented

- Admin-only Supabase password sign-in at `/admin/login`.
- Middleware redirects unauthenticated `/admin` requests to the sign-in route.
- Server-side authorization verifies the Supabase user and `user_profiles.role` before granting admin access.
- Only `MODERATOR`, `ADMIN`, and `SUPER_ADMIN` roles are accepted.
- Residents remain account-free, per the product decision recorded in `README.md`.
- Unit tests cover accepted and rejected role values.

### Verified locally

- `npm run typecheck`
- `npm run lint`
- `npm test` — 9 passing staff-role tests
- `npm run build`
- unauthenticated `/admin` redirects to `/admin/login`

### Gate blockers

- A real provisioned staff account and `user_profiles` role are needed to test successful admin access.
- A real Supabase instance is needed to confirm RLS policy enforcement and resident-owned data isolation.

**Ready for Stage 3: NO.** The Stage 2 live acceptance gate must be completed first.
