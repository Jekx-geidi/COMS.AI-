-- COMS.AI: trusted/approved source registry (Core Docs/DATABASE-STRUCTURE.md #9).

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type source_type not null,
  official boolean not null default false,
  source_url text,
  trust_level smallint,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, source_url)
);
