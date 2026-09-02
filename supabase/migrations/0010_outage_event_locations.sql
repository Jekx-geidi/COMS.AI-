-- COMS.AI: many-to-many event-to-location relationship
-- (Core Docs/DATABASE-STRUCTURE.md #13). PARTIAL coverage can exist without
-- geometry — never invent a polygon from vague text (CLAUDE.md #12).

create table if not exists outage_event_locations (
  id uuid primary key default gen_random_uuid(),
  outage_event_id uuid not null references outage_events(id) on delete cascade,
  location_id uuid references locations(id),
  coverage_type coverage_type not null,
  coverage_description text,
  confidence numeric(5,4),
  point geography(Point, 4326),
  geometry geometry(MultiPolygon, 4326),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists outage_event_locations_event_idx on outage_event_locations(outage_event_id);
create index if not exists outage_event_locations_location_idx on outage_event_locations(location_id);
create index if not exists outage_event_locations_point_gix on outage_event_locations using gist(point);
create index if not exists outage_event_locations_geometry_gix on outage_event_locations using gist(geometry);
