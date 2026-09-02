# COMS.AI
## Cebu Outage Monitoring & Intelligence System
### UID-UUID-REQUIREMENTS.md

**Version:** 1.0  
**Purpose:** Define unique identifier strategy for users, events, locations, sources, notifications, and migrations.

---

# 1. Primary Identifier Standard

COMS.AI shall use:

> **UUID as the canonical primary identifier for persistent database entities.**

Recommended generation:

```sql
gen_random_uuid()
```

Do not use sequential integers as public canonical identifiers for core records.

---

# 2. User Identity Rule

Supabase Auth is the canonical source of user identity.

Use:

```text
auth.users.id
```

as the user UUID everywhere.

Do not generate a second unrelated application user ID.

Correct:

```text
auth.users.id
     |
     +--> user_profiles.id
     +--> user_places.user_id
     +--> notifications.user_id
     +--> community_reports.user_id
     +--> audit_logs.actor_id
```

---

# 3. Required UUID Entities

Use UUID primary keys for:

```text
user_profiles
locations
user_places
sources
source_documents
ai_extractions
outage_events
outage_event_locations
outage_event_versions
verification_reviews
notifications
community_reports
community_report_clusters
audit_logs
```

---

# 4. Human-Readable IDs

Some entities may also have a human-readable code.

Example outage event:

```text
COMS-2026-000124
```

This code is for:

- UI
- support
- admin reference
- logs

It must not replace the UUID primary key.

Example:

```text
id:
8f744a9a-f55d-4a40-bef4-24998ad77f73

event_code:
COMS-2026-000124
```

---

# 5. Event Code Requirements

Recommended format:

```text
COMS-{YEAR}-{SEQUENCE}
```

Example:

```text
COMS-2026-000001
COMS-2026-000002
```

Generation must be collision-safe.

Do not use row count as the sequence source.

---

# 6. UUID Exposure

Public APIs may expose outage event UUIDs when needed.

Do not expose private entity UUIDs unnecessarily.

Avoid exposing:

- internal reviewer IDs
- admin IDs
- private user place IDs to unrelated users
- audit actor IDs in public APIs

---

# 7. Foreign Key Rule

All relationships must use canonical UUIDs.

Example:

```text
outage_event_locations.outage_event_id
    -> outage_events.id
```

Do not join entities by:

- display name
- email
- location text
- event code
- source name

unless used only for search/resolution.

---

# 8. Stable Identity Rule

Once created, an entity UUID must not change because:

- name changed
- event status changed
- user changed display name
- location alias changed
- source URL changed

Updates modify fields, not identity.

---

# 9. Event Version Identity

Each version gets its own UUID.

Example:

```text
outage_event.id = EVENT_UUID

version 1:
VERSION_UUID_1

version 2:
VERSION_UUID_2

version 3:
VERSION_UUID_3
```

All versions point to the same `outage_event_id`.

---

# 10. Source Document Identity

Every captured source document should receive a UUID.

If the same document is re-ingested:

- detect duplicate using checksum/source metadata
- do not blindly create duplicate records

---

# 11. Notification Idempotency

Notifications require both:

- UUID primary key
- deterministic idempotency key

Suggested:

```text
SHA256(
  user_id +
  user_place_id +
  outage_event_id +
  event_version_id +
  notification_type +
  channel
)
```

This prevents duplicate sends.

---

# 12. Correlation IDs

Use UUID correlation IDs for multi-step operations such as:

```text
admin ingestion
-> AI extraction
-> review
-> publication
-> notification generation
```

This helps tracing and debugging.

---

# 13. Client-Generated UUIDs

Prefer server/database-generated UUIDs for persistent authoritative entities.

Client-generated UUIDs may be used for:

- temporary optimistic UI
- draft local objects

but should not be treated as authoritative unless explicitly supported.

---

# 14. UUID Validation

All incoming UUID route parameters must be validated.

Invalid UUID:

- return 400
- do not forward raw malformed input to database query

---

# 15. UID Security Note

UUIDs are not authorization.

Knowing a UUID must not grant access.

Always enforce:

- authentication
- RLS
- server-side authorization

---

# 16. Definition of Done

UID/UUID implementation is correct when:

- one canonical user UUID exists
- all persistent entities use UUID PKs
- event codes are secondary identifiers
- foreign keys use UUIDs
- event versions have separate UUIDs
- notification idempotency works
- UUID knowledge does not bypass permissions
