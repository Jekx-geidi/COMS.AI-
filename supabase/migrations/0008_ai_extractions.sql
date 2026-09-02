-- COMS.AI: AI-generated structured interpretation, pre-verification
-- (Core Docs/DATABASE-STRUCTURE.md #11). Never authoritative by itself
-- (CLAUDE.md #4/#13) — retained for auditability regardless of decision.

create table if not exists ai_extractions (
  id uuid primary key default gen_random_uuid(),
  source_document_id uuid not null references source_documents(id) on delete cascade,
  model_provider text,
  model_name text,
  prompt_version text,
  schema_version text,
  extracted_payload jsonb not null,
  confidence numeric(5,4),
  uncertainties jsonb not null default '[]'::jsonb,
  conflicts jsonb not null default '[]'::jsonb,
  review_required boolean not null default true,
  status verification_state not null default 'DRAFT',
  created_at timestamptz not null default now()
);

create index if not exists ai_extractions_source_document_idx on ai_extractions(source_document_id);
