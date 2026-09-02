-- COMS.AI: immutable event change history (Core Docs/DATABASE-STRUCTURE.md #14).
-- Never update a prior version's meaning — append a new version instead
-- (CLAUDE.md #10 / #22).

create table if not exists outage_event_versions (
  id uuid primary key default gen_random_uuid(),
  outage_event_id uuid not null references outage_events(id) on delete cascade,
  version_number integer not null,
  status outage_status not null,
  effective_date date,
  start_at timestamptz,
  end_at timestamptz,
  reason text,
  locations_snapshot jsonb not null default '[]'::jsonb,
  payload jsonb not null,
  change_type text not null,
  verification_state verification_state not null,
  changed_by uuid references auth.users(id),
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (outage_event_id, version_number)
);

create index if not exists outage_event_versions_event_idx on outage_event_versions(outage_event_id);

-- Now that outage_event_versions exists, wire the forward reference from
-- outage_events.current_version_id (deferred from 0009 to avoid a circular
-- table dependency).
alter table outage_events
  add constraint outage_events_current_version_fk
  foreign key (current_version_id) references outage_event_versions(id);
