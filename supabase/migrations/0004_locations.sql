-- COMS.AI: normalized geographic entities (Core Docs/DATABASE-STRUCTURE.md #7).

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  country_code text not null default 'PH',
  region text,
  province text,
  city_municipality text,
  barangay text,
  sitio text,
  street text,
  name text not null,
  normalized_name text not null,
  aliases text[] not null default '{}',
  latitude double precision,
  longitude double precision,
  point geography(Point, 4326),
  boundary geometry(MultiPolygon, 4326),
  boundary_source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists locations_normalized_name_idx
  on locations using gin (to_tsvector('simple', normalized_name));

create index if not exists locations_point_gix
  on locations using gist (point);

create index if not exists locations_boundary_gix
  on locations using gist (boundary);
