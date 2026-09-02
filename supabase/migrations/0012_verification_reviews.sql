-- COMS.AI: human review record (Core Docs/DATABASE-STRUCTURE.md #15).
-- reviewer_id is always staff (auth.users) — residents never review.

create table if not exists verification_reviews (
  id uuid primary key default gen_random_uuid(),
  outage_event_id uuid references outage_events(id),
  ai_extraction_id uuid references ai_extractions(id),
  reviewer_id uuid not null references auth.users(id),
  decision text not null,
  corrections jsonb not null default '{}'::jsonb,
  notes text,
  reviewed_at timestamptz not null default now()
);

create index if not exists verification_reviews_event_idx on verification_reviews(outage_event_id);
create index if not exists verification_reviews_extraction_idx on verification_reviews(ai_extraction_id);
