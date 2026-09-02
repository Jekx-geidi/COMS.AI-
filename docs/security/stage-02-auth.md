# Stage 2 — Authentication, Roles, and Security Base

## Scope

COMS.AI residents do not sign in. Only existing Supabase staff accounts may access `/admin`.

## Authorization boundary

1. Middleware refreshes an existing Supabase session and redirects unauthenticated `/admin` visits to `/admin/login`.
2. The server-only `getStaffAccess()` helper calls `auth.getUser()` and then reads `user_profiles`.
3. Access is granted only for `MODERATOR`, `ADMIN`, or `SUPER_ADMIN`; a valid session without one of those roles receives an access-denied screen.

No role value from a browser, email domain, or URL parameter is trusted. RLS remains the data-layer enforcement in `supabase/migrations/0020_rls.sql`.

## Staff provisioning

There is intentionally no public registration or staff-invite endpoint. A privileged operator must provision the Supabase Auth user and its `user_profiles` row through the controlled staff-invite process before that person can sign in.

## Verification

- Unit tests cover accepted and rejected staff roles.
- Manual acceptance still requires a configured Supabase project with a real staff profile to validate the authenticated success path and RLS against the live database.
