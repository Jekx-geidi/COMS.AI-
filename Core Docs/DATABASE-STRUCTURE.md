# COMS.AI
## Cebu Outage Monitoring & Intelligence System
### DATABASE-STRUCTURE.md

**Version:** 1.0  
**Status:** Implementation Ready  
**Database:** PostgreSQL / Supabase  
**Required Extension:** PostGIS  
**Primary Timezone for user-facing interpretation:** Asia/Manila  
**Primary Key Strategy:** UUID

---

# 1. Purpose

This document defines the production database structure for COMS.AI.

The database is the source of truth for:

- users
- saved places
- locations
- sources
- source documents
- outage events
- outage event geography
- outage event versions
- AI extraction results
- human verification
- notifications
- community reports
- community clusters
- audit logs

The AI must retrieve current outage information from this database before answering users.

---

# 2. Core Database Principles

1. Use UUID primary keys.
2. Use persistent PostgreSQL storage.
3. Use PostGIS for geographic matching.
4. Never use local JSON as the production source of truth.
5. Preserve source evidence.
6. Preserve event history.
7. Never silently overwrite advisory versions.
8. Store timestamps in UTC.
9. Render Cebu-facing dates/times using Asia/Manila.
10. Separate official/verified data from community data.
11. Use foreign keys.
12. Use migration files for schema changes.
13. Apply Row Level Security where appropriate.
14. Use indexes for map, location, time, and status queries.

---

# 3. Relationship Overview

```text
auth.users
    |
    +---- user_profiles
    |
    +---- user_places
    |        |
    |        +---- locations
    |
    +---- community_reports
    |
    +---- notifications
    |
    +---- verification_reviews
    |
    +---- audit_logs

sources
    |
    +---- source_documents
              |
              +---- ai_extractions
              |
              +---- outage_events
                        |
                        +---- outage_event_locations
                        |         |
                        |         +---- locations
                        |
                        +---- outage_event_versions
                        |
                        +---- verification_reviews
                        |
                        +---- notifications
                        |
                        +---- community_report_clusters
```

---

# 4. Extensions

Required:

```sql
create extension if not exists pgcrypto;
create extension if not exists postgis;
```

Optional:

```sql
create extension if not exists vector;
```

Only use vector search if needed for source-document retrieval.

---

# 5. Enums

Recommended database enums or constrained text types.

## outage_status

```text
NORMAL
MONITORING
POSSIBLE
SCHEDULED
CONFIRMED
ONGOING
RESTORING
RESTORED
CANCELLED
COMPLETED
UNKNOWN
```

## coverage_type

```text
FULL
PARTIAL
STREET
SITIO
LANDMARK_AREA
POINT
POLYGON
UNKNOWN_EXTENT
```

## verification_state

```text
DRAFT
REVIEW_REQUIRED
VERIFIED
REJECTED
SUPERSEDED
```

## source_type

```text
UTILITY
GRID_OPERATOR
GOVERNMENT
LGU
SOCIAL_MEDIA
WEBSITE
MANUAL
OTHER
```

## report_type

```text
POWER_OUT
POWER_RESTORED
FLICKERING
LOW_VOLTAGE
INTERMITTENT
```

## moderation_status

```text
PENDING
APPROVED
REJECTED
EXPIRED
```

## notification_type

```text
NEW_ADVISORY
TOMORROW_REMINDER
PREPARATION_REMINDER
STARTED
CHANGED
CANCELLED
RESTORED
COMMUNITY_CLUSTER
```

## notification_channel

```text
IN_APP
WEB_PUSH
EMAIL
SMS
MESSENGER
VIBER
TELEGRAM
```

---

# 6. user_profiles

Supabase Auth remains the canonical authentication identity.

```sql
user_profiles
-------------
id uuid primary key references auth.users(id)
display_name text
preferred_language text default 'en'
timezone text default 'Asia/Manila'
role text default 'USER'
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

Rules:

- `id` must equal `auth.users.id`.
- Do not create a second unrelated user UUID.
- Admin roles must be validated server-side.

---

# 7. locations

Normalized geographic entities.

```sql
locations
---------
id uuid primary key default gen_random_uuid()
country_code text not null default 'PH'
region text
province text
city_municipality text
barangay text
sitio text
street text
name text not null
normalized_name text not null
aliases text[] default '{}'
latitude double precision
longitude double precision
point geography(Point, 4326)
boundary geometry(MultiPolygon, 4326)
boundary_source text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

Recommended indexes:

```sql
create index locations_normalized_name_idx
on locations using gin (to_tsvector('simple', normalized_name));

create index locations_point_gix
on locations using gist (point);

create index locations_boundary_gix
on locations using gist (boundary);
```

---

# 8. user_places

Saved user locations.

```sql
user_places
-----------
id uuid primary key default gen_random_uuid()
user_id uuid not null references auth.users(id) on delete cascade
location_id uuid references locations(id)
label text not null
custom_address text
latitude double precision
longitude double precision
point geography(Point, 4326)
notification_enabled boolean not null default true
preparedness_profile text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

Rules:

- Private per user.
- Never publicly expose exact coordinates.
- RLS required.

Indexes:

```sql
create index user_places_user_idx on user_places(user_id);
create index user_places_point_gix on user_places using gist(point);
```

---

# 9. sources

Trusted or approved source registry.

```sql
sources
-------
id uuid primary key default gen_random_uuid()
name text not null
type source_type not null
official boolean not null default false
source_url text
trust_level smallint
active boolean not null default true
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

Optional uniqueness:

```sql
unique(name, source_url)
```

---

# 10. source_documents

Original source evidence.

```sql
source_documents
----------------
id uuid primary key default gen_random_uuid()
source_id uuid not null references sources(id)
source_url text
raw_text text
image_path text
published_at timestamptz
captured_at timestamptz not null default now()
checksum text
metadata jsonb not null default '{}'::jsonb
created_by uuid references auth.users(id)
created_at timestamptz not null default now()
```

Rules:

- Preserve original input.
- Do not rewrite original text.
- `image_path` should point to private object storage.
- Checksum can be used for duplicate detection.

Indexes:

```sql
create index source_documents_source_idx on source_documents(source_id);
create index source_documents_checksum_idx on source_documents(checksum);
create index source_documents_published_idx on source_documents(published_at);
```

---

# 11. ai_extractions

Stores AI-generated structured interpretation before verification.

```sql
ai_extractions
--------------
id uuid primary key default gen_random_uuid()
source_document_id uuid not null references source_documents(id) on delete cascade
model_provider text
model_name text
prompt_version text
schema_version text
extracted_payload jsonb not null
confidence numeric(5,4)
uncertainties jsonb not null default '[]'::jsonb
conflicts jsonb not null default '[]'::jsonb
review_required boolean not null default true
status verification_state not null default 'DRAFT'
created_at timestamptz not null default now()
```

Rules:

- AI extraction is never authoritative by itself.
- Retain original AI output for auditability.

---

# 12. outage_events

Canonical outage event record.

```sql
outage_events
-------------
id uuid primary key default gen_random_uuid()
event_code text unique
event_type text not null
status outage_status not null
verification_state verification_state not null default 'DRAFT'
source_id uuid not null references sources(id)
source_document_id uuid references source_documents(id)
current_version_id uuid
effective_date date
start_at timestamptz
end_at timestamptz
reason text
verified boolean not null default false
confidence numeric(5,4)
verified_by uuid references auth.users(id)
verified_at timestamptz
created_by uuid references auth.users(id)
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

Rules:

- `event_code` is human-readable only.
- UUID `id` is canonical.
- Public AI should query verified current events.
- `current_version_id` should reference the latest verified version after the version table exists.

Indexes:

```sql
create index outage_events_status_idx on outage_events(status);
create index outage_events_time_idx on outage_events(start_at, end_at);
create index outage_events_verified_idx on outage_events(verified, verification_state);
create index outage_events_source_idx on outage_events(source_id);
```

---

# 13. outage_event_locations

Many-to-many event-to-location relationship.

```sql
outage_event_locations
----------------------
id uuid primary key default gen_random_uuid()
outage_event_id uuid not null references outage_events(id) on delete cascade
location_id uuid references locations(id)
coverage_type coverage_type not null
coverage_description text
confidence numeric(5,4)
point geography(Point, 4326)
geometry geometry(MultiPolygon, 4326)
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

Rules:

- Use `geometry` only when a valid area is available.
- Never invent polygon geometry from vague text.
- `PARTIAL` can exist without geometry.
- `coverage_description` must preserve wording such as "portion of Lahug."

Indexes:

```sql
create index outage_event_locations_event_idx
on outage_event_locations(outage_event_id);

create index outage_event_locations_location_idx
on outage_event_locations(location_id);

create index outage_event_locations_point_gix
on outage_event_locations using gist(point);

create index outage_event_locations_geometry_gix
on outage_event_locations using gist(geometry);
```

---

# 14. outage_event_versions

Immutable event change history.

```sql
outage_event_versions
---------------------
id uuid primary key default gen_random_uuid()
outage_event_id uuid not null references outage_events(id) on delete cascade
version_number integer not null
status outage_status not null
effective_date date
start_at timestamptz
end_at timestamptz
reason text
locations_snapshot jsonb not null default '[]'::jsonb
payload jsonb not null
change_type text not null
verification_state verification_state not null
changed_by uuid references auth.users(id)
verified_by uuid references auth.users(id)
verified_at timestamptz
created_at timestamptz not null default now()
```

Constraint:

```sql
unique(outage_event_id, version_number)
```

Rules:

- Never update a prior version's meaning.
- Append a new version.
- Old versions remain queryable.
- Latest verified version becomes `current_version_id`.

---

# 15. verification_reviews

Human review record.

```sql
verification_reviews
--------------------
id uuid primary key default gen_random_uuid()
outage_event_id uuid references outage_events(id)
ai_extraction_id uuid references ai_extractions(id)
reviewer_id uuid not null references auth.users(id)
decision text not null
corrections jsonb not null default '{}'::jsonb
notes text
reviewed_at timestamptz not null default now()
```

Suggested decisions:

```text
APPROVED
EDITED_AND_APPROVED
REANALYZE
REJECTED
```

---

# 16. notifications

```sql
notifications
-------------
id uuid primary key default gen_random_uuid()
user_id uuid not null references auth.users(id) on delete cascade
outage_event_id uuid references outage_events(id) on delete cascade
event_version_id uuid references outage_event_versions(id)
user_place_id uuid references user_places(id) on delete cascade
notification_type notification_type not null
channel notification_channel not null
title text not null
body text not null
idempotency_key text not null unique
scheduled_at timestamptz
sent_at timestamptz
delivery_status text not null default 'PENDING'
opened_at timestamptz
error_message text
created_at timestamptz not null default now()
```

Indexes:

```sql
create index notifications_user_idx on notifications(user_id);
create index notifications_schedule_idx on notifications(scheduled_at, delivery_status);
```

---

# 17. community_reports

```sql
community_reports
-----------------
id uuid primary key default gen_random_uuid()
user_id uuid not null references auth.users(id) on delete cascade
report_type report_type not null
location_id uuid references locations(id)
location_text text
latitude double precision
longitude double precision
point geography(Point, 4326)
note text
trust_score numeric(5,4)
moderation_status moderation_status not null default 'PENDING'
created_at timestamptz not null default now()
expires_at timestamptz
```

Rules:

- Community report is not official.
- Report should expire from active map display.
- Exact reporter identity must not be public.

Indexes:

```sql
create index community_reports_point_gix on community_reports using gist(point);
create index community_reports_time_idx on community_reports(created_at);
```

---

# 18. community_report_clusters

```sql
community_report_clusters
-------------------------
id uuid primary key default gen_random_uuid()
cluster_type report_type not null
center geography(Point, 4326)
geometry geometry(MultiPolygon, 4326)
report_count integer not null default 0
first_reported_at timestamptz
last_reported_at timestamptz
confidence numeric(5,4)
linked_outage_event_id uuid references outage_events(id)
status text not null default 'ACTIVE'
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

Rules:

- Cluster does not become verified event automatically.
- If linked to an official event, preserve the separation.

---

# 19. audit_logs

Append-oriented audit log.

```sql
audit_logs
----------
id uuid primary key default gen_random_uuid()
actor_id uuid references auth.users(id)
action text not null
entity_type text not null
entity_id uuid
before_data jsonb
after_data jsonb
ip_address inet
user_agent text
correlation_id uuid
created_at timestamptz not null default now()
```

Rules:

- Do not allow normal users to modify audit logs.
- Critical admin actions must be recorded.

---

# 20. Recommended Views

## current_verified_outages

Returns only:

- verified events
- current version
- active/scheduled relevant time window
- non-superseded records

## user_place_outage_matches

Used for notifications and My Places.

## active_community_clusters

Only non-expired active community clusters.

## latest_source_documents

Latest source evidence per source.

---

# 21. Locate Me Query Logic

Recommended geospatial logic:

```text
1. Receive user coordinate.
2. Find current verified outage_event_locations.
3. If polygon contains point:
   MATCH_CONFIRMED.
4. Else if location-level event is PARTIAL:
   MATCH_PARTIAL_AREA.
5. Else if within configured distance:
   MATCH_NEARBY.
6. Else:
   NO_VERIFIED_MATCH.
7. If matching data exceeds freshness rule:
   DATA_STALE.
```

Never store anonymous coordinate unless required.

---

# 22. Public Query Rules

Public API must not expose:

- user IDs
- reviewer personal details
- admin-only notes
- private source storage paths
- exact private user places
- internal trust scores
- raw audit logs

---

# 23. RLS Summary

## user_profiles
User can read/update own profile.

## user_places
User can CRUD own rows only.

## notifications
User can read own rows only.

## community_reports
User can create own report and read allowed public projection.

## admin tables
Restricted to admin/server roles.

## outage_events
Public read for verified public records only.

---

# 24. Data Retention

Suggested:

- verified outage events: retain long-term
- event versions: retain long-term
- source documents: retain for audit
- AI extractions: retain for QA/audit
- community reports: expire from active display, retain per policy
- notifications: retain for a limited operational period
- audit logs: retain according to security policy

---

# 25. Database Definition of Done

Database foundation is complete when:

- UUID keys are consistent
- PostGIS works
- current outage query works
- Locate Me query works
- event versioning works
- source evidence is preserved
- user places are private
- community data is separated
- audit history works
- RLS tests pass
- migrations run cleanly from an empty database
