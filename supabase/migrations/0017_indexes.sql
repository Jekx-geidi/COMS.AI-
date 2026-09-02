-- COMS.AI: additional cross-table indexes not already covered inline with
-- each table's own migration (Core Docs/MIGRATIONS-REQUIREMENTS.md #17).

-- Composite index for the "current verified outages" access pattern
-- (verified + status + active time window).
create index if not exists outage_events_current_lookup_idx
  on outage_events(verified, status, start_at, end_at)
  where verification_state = 'VERIFIED';

create index if not exists community_reports_moderation_idx
  on community_reports(moderation_status, expires_at);
