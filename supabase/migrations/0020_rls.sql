-- COMS.AI: Row Level Security (Core Docs/MIGRATIONS-REQUIREMENTS.md #13 /
-- NFR-052/053/054/072/073).
--
-- Model:
--   * Public (anon) may only ever read verified/approved/active rows.
--   * Staff (is_staff()) reads/writes admin-facing tables directly.
--   * Resident-owned tables (user_places, notifications) and the
--     community-report *write* path have NO client-facing policies at all —
--     residents have no Supabase Auth session to key RLS off of (no login),
--     so those flows go through server-side API routes using the service
--     role (which bypasses RLS) with device identity enforced in app code,
--     never trusted from a client-supplied value inside Postgres itself.

alter table user_profiles enable row level security;
alter table locations enable row level security;
alter table user_places enable row level security;
alter table sources enable row level security;
alter table source_documents enable row level security;
alter table ai_extractions enable row level security;
alter table outage_events enable row level security;
alter table outage_event_locations enable row level security;
alter table outage_event_versions enable row level security;
alter table verification_reviews enable row level security;
alter table notifications enable row level security;
alter table community_reports enable row level security;
alter table community_report_clusters enable row level security;
alter table audit_logs enable row level security;

-- user_profiles: staff can see/update only their own profile row.
create policy user_profiles_self_select on user_profiles
  for select using (id = auth.uid());
create policy user_profiles_self_update on user_profiles
  for update using (id = auth.uid());

-- locations: public read (needed for search/map/event display); staff writes.
create policy locations_public_select on locations
  for select using (true);
create policy locations_staff_write on locations
  for all using (is_staff()) with check (is_staff());

-- user_places: no client-facing policies. Access only via service role
-- (server-side API route enforcing device_id ownership in app code).

-- sources: public read (source transparency, UFR-170/171); staff writes.
create policy sources_public_select on sources
  for select using (true);
create policy sources_staff_write on sources
  for all using (is_staff()) with check (is_staff());

-- source_documents: staff only (may contain unpublished/raw admin input).
create policy source_documents_staff_all on source_documents
  for all using (is_staff()) with check (is_staff());

-- ai_extractions: staff only.
create policy ai_extractions_staff_all on ai_extractions
  for all using (is_staff()) with check (is_staff());

-- outage_events: public read of verified events only; staff sees/writes all.
create policy outage_events_public_select on outage_events
  for select using (verified = true and verification_state = 'VERIFIED');
create policy outage_events_staff_all on outage_events
  for all using (is_staff()) with check (is_staff());

-- outage_event_locations / versions: same trust boundary as their parent event.
create policy outage_event_locations_public_select on outage_event_locations
  for select using (
    exists (
      select 1 from outage_events e
      where e.id = outage_event_locations.outage_event_id
        and e.verified = true and e.verification_state = 'VERIFIED'
    )
  );
create policy outage_event_locations_staff_all on outage_event_locations
  for all using (is_staff()) with check (is_staff());

create policy outage_event_versions_public_select on outage_event_versions
  for select using (
    exists (
      select 1 from outage_events e
      where e.id = outage_event_versions.outage_event_id
        and e.verified = true and e.verification_state = 'VERIFIED'
    )
  );
create policy outage_event_versions_staff_all on outage_event_versions
  for all using (is_staff()) with check (is_staff());

-- verification_reviews: staff only.
create policy verification_reviews_staff_all on verification_reviews
  for all using (is_staff()) with check (is_staff());

-- notifications: no client-facing policies (service role only, see user_places).

-- community_reports: public read of already-approved reports only; the
-- submission write path goes through a service-role API route (rate
-- limiting/duplicate detection happen there, not in RLS). Staff moderates.
create policy community_reports_public_select on community_reports
  for select using (moderation_status = 'APPROVED');
create policy community_reports_staff_all on community_reports
  for all using (is_staff()) with check (is_staff());

-- community_report_clusters: public read of active clusters; staff writes.
create policy community_clusters_public_select on community_report_clusters
  for select using (status = 'ACTIVE');
create policy community_clusters_staff_all on community_report_clusters
  for all using (is_staff()) with check (is_staff());

-- audit_logs: staff may read (admin Audit Logs screen); nobody may write
-- through the client — only server-side code using the service role appends.
create policy audit_logs_staff_select on audit_logs
  for select using (is_staff());
