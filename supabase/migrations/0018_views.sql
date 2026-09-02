-- COMS.AI: safe reusable views (Core Docs/DATABASE-STRUCTURE.md #20).
-- `user_place_outage_matches` is deferred to the outage repository as a
-- parameterized PostGIS query (distance thresholds vary by call site) rather
-- than a fixed view — see MIGRATIONS-REQUIREMENTS.md #19 "functions ...
-- geospatial matching only when it improves consistency".

create or replace view current_verified_outages as
select e.*
from outage_events e
where e.verified = true
  and e.verification_state = 'VERIFIED';

comment on view current_verified_outages is
  'Authoritative public read surface — the only source of truth for "is there a verified outage" (CLAUDE.md #4).';

create or replace view active_community_clusters as
select c.*
from community_report_clusters c
where c.status = 'ACTIVE';

create or replace view latest_source_documents as
select distinct on (source_id) *
from source_documents
order by source_id, captured_at desc;
