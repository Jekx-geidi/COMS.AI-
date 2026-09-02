-- COMS.AI: staff profiles only (Admin / Moderator / Super Admin).
-- Residents never get a row here — they have no account (README
-- "Architecture decision: no login for residents"). Rows are created only
-- through a controlled staff-invite flow (Stage 2 app code), never
-- automatically on every auth.users signup, since public sign-up is not
-- offered at all.

create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role staff_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table user_profiles is 'Staff (Admin/Moderator/Super Admin) accounts only. Residents are never rows here.';
