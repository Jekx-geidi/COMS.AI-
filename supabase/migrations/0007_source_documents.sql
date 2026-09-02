-- COMS.AI: original source evidence (Core Docs/DATABASE-STRUCTURE.md #10).
-- Original text/image must never be rewritten (CLAUDE.md #13).

create table if not exists source_documents (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id),
  source_url text,
  raw_text text,
  image_path text,
  published_at timestamptz,
  captured_at timestamptz not null default now(),
  checksum text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists source_documents_source_idx on source_documents(source_id);
create index if not exists source_documents_checksum_idx on source_documents(checksum);
create index if not exists source_documents_published_idx on source_documents(published_at);
