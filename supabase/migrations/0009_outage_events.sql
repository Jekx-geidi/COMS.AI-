-- COMS.AI: canonical outage event record (Core Docs/DATABASE-STRUCTURE.md #12).
-- Public retrieval must only ever use verified, non-superseded events
-- (CLAUDE.md #4/#10).

create table if not exists outage_events (
  id uuid primary key default gen_random_uuid(),
  event_code text unique,
  event_type text not null,
  status outage_status not null,
  verification_state verification_state not null default 'DRAFT',
  source_id uuid not null references sources(id),
  source_document_id uuid references source_documents(id),
  current_version_id uuid,
  effective_date date,
  start_at timestamptz,
  end_at timestamptz,
  reason text,
  verified boolean not null default false,
  confidence numeric(5,4),
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists outage_events_status_idx on outage_events(status);
create index if not exists outage_events_time_idx on outage_events(start_at, end_at);
create index if not exists outage_events_verified_idx on outage_events(verified, verification_state);
create index if not exists outage_events_source_idx on outage_events(source_id);
