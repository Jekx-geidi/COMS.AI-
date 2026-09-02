-- COMS.AI: saved resident places.
-- ADAPTED from Core Docs/DATABASE-STRUCTURE.md #8: no login exists for
-- residents, so this is keyed by a client-generated device_id (see
-- src/lib/utils/device-id.ts) instead of auth.users(id). See README
-- "Architecture decision: no login for residents".

create table if not exists user_places (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  location_id uuid references locations(id),
  label text not null,
  custom_address text,
  latitude double precision,
  longitude double precision,
  point geography(Point, 4326),
  notification_enabled boolean not null default true,
  preparedness_profile text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table user_places is 'Device-scoped saved places. Never publicly exposed; never expose across devices.';

create index if not exists user_places_device_idx on user_places(device_id);
create index if not exists user_places_point_gix on user_places using gist(point);
