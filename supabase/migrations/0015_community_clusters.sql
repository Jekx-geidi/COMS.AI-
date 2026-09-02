-- COMS.AI: clustered community signals (Core Docs/DATABASE-STRUCTURE.md #18).
-- If linked to an official event, the separation must still be preserved
-- (CLAUDE.md #18).

create table if not exists community_report_clusters (
  id uuid primary key default gen_random_uuid(),
  cluster_type report_type not null,
  center geography(Point, 4326),
  geometry geometry(MultiPolygon, 4326),
  report_count integer not null default 0,
  first_reported_at timestamptz,
  last_reported_at timestamptz,
  confidence numeric(5,4),
  linked_outage_event_id uuid references outage_events(id),
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_clusters_center_gix on community_report_clusters using gist(center);
