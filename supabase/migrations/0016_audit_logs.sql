-- COMS.AI: append-oriented audit log for staff actions
-- (Core Docs/DATABASE-STRUCTURE.md #19). Never editable by ordinary users
-- (CLAUDE.md #11 / NFR-170).

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  ip_address inet,
  user_agent text,
  correlation_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_entity_idx on audit_logs(entity_type, entity_id);
create index if not exists audit_logs_actor_idx on audit_logs(actor_id);
create index if not exists audit_logs_time_idx on audit_logs(created_at);
