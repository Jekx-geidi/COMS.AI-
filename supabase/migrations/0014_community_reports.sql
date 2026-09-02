-- COMS.AI: community-reported (non-official) signals.
-- ADAPTED from Core Docs/DATABASE-STRUCTURE.md #17: device_id instead of
-- user_id — no login required to submit (README "Architecture decision").
-- Never automatically becomes a verified outage event (CLAUDE.md #18).

create table if not exists community_reports (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  report_type report_type not null,
  location_id uuid references locations(id),
  location_text text,
  latitude double precision,
  longitude double precision,
  point geography(Point, 4326),
  note text,
  trust_score numeric(5,4),
  moderation_status moderation_status not null default 'PENDING',
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists community_reports_point_gix on community_reports using gist(point);
create index if not exists community_reports_time_idx on community_reports(created_at);
create index if not exists community_reports_device_idx on community_reports(device_id);
