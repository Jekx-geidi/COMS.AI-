-- COMS.AI: helper function used by RLS policies (0020) to check staff role
-- membership. Kept minimal per MIGRATIONS-REQUIREMENTS.md #19 ("use functions
-- only when they improve consistency") — event-code allocation and
-- geospatial-matching functions are deferred until a real caller needs them.

create or replace function is_staff(required_roles staff_role[] default null)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from user_profiles p
    where p.id = auth.uid()
      and (required_roles is null or p.role = any(required_roles))
  );
$$;

comment on function is_staff is
  'True if the current auth.uid() is a staff account, optionally restricted to specific roles. Used by RLS policies — never trust a client-supplied role.';
