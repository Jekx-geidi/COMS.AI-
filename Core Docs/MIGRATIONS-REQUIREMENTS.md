# COMS.AI
## Cebu Outage Monitoring & Intelligence System
### MIGRATIONS-REQUIREMENTS.md

**Version:** 1.0  
**Status:** Required for Production  
**Database:** PostgreSQL / Supabase

---

# 1. Purpose

All database changes must be represented as version-controlled migrations.

Do not modify production schema manually and then forget to capture the change.

The database must be reproducible from an empty environment.

---

# 2. Migration Directory

Use:

```text
supabase/
└─ migrations/
```

Recommended initial migration sequence:

```text
0001_extensions.sql
0002_enums.sql
0003_user_profiles.sql
0004_locations.sql
0005_user_places.sql
0006_sources.sql
0007_source_documents.sql
0008_ai_extractions.sql
0009_outage_events.sql
0010_outage_event_locations.sql
0011_outage_event_versions.sql
0012_verification_reviews.sql
0013_notifications.sql
0014_community_reports.sql
0015_community_clusters.sql
0016_audit_logs.sql
0017_indexes.sql
0018_views.sql
0019_functions.sql
0020_rls.sql
0021_seed_reference_data.sql
```

If using timestamp-based Supabase migration names, retain the same logical order.

---

# 3. Migration Rules

Every migration must be:

- deterministic
- version controlled
- reviewable
- backward-aware
- tested on empty DB
- tested on populated DB when relevant

---

# 4. Never Do This

Do not:

- manually edit production tables without a migration
- drop production tables casually
- rename columns without compatibility planning
- rewrite migration history after it has been applied to shared environments
- store application data in migration files
- put secrets in migrations
- create one giant forever-changing `schema.sql`

---

# 5. Initial Migration Requirements

## 0001_extensions

Enable:

```sql
pgcrypto
postgis
```

Optional:

```sql
vector
```

---

## 0002_enums

Create canonical enums.

---

## 0003_user_profiles

Create public user profile extension of Supabase Auth.

---

## 0004_locations

Create geographic location structure and PostGIS columns.

---

## 0005_user_places

Create user saved places and privacy constraints.

---

## 0006_sources

Create source registry.

---

## 0007_source_documents

Create original-source storage metadata.

---

## 0008_ai_extractions

Create AI audit/extraction storage.

---

## 0009_outage_events

Create canonical event record.

---

## 0010_outage_event_locations

Create event-to-location relation.

---

## 0011_outage_event_versions

Create immutable version history.

---

## 0012_verification_reviews

Create human review records.

---

## 0013_notifications

Create notification queue/history.

---

## 0014_community_reports

Create user report storage.

---

## 0015_community_clusters

Create clustered signal storage.

---

## 0016_audit_logs

Create admin/system audit history.

---

## 0017_indexes

Add:

- temporal indexes
- user indexes
- source indexes
- status indexes
- GiST spatial indexes
- search indexes

---

## 0018_views

Create safe reusable views.

Examples:

```text
current_verified_outages
active_community_clusters
user_place_outage_matches
```

---

## 0019_functions

Optional database functions for:

- event code allocation
- current-version update
- geospatial matching
- audit triggers

Use functions only when they improve consistency.

---

## 0020_rls

Enable and define Row Level Security.

---

## 0021_seed_reference_data

Seed only stable reference data such as:

- Cebu administrative locations
- allowed system configuration defaults

Do not seed fake production outage events.

---

# 6. Migration Naming

Names should describe the change.

Good:

```text
20260902_add_outage_event_versions.sql
```

Bad:

```text
fix.sql
new.sql
update2.sql
final.sql
```

---

# 7. Forward-Only Philosophy

Prefer forward migrations.

If a production migration is wrong:

- create a corrective migration
- do not rewrite already-applied migration history

---

# 8. Destructive Change Requirements

Before:

- dropping a column
- dropping a table
- changing an enum
- changing a primary key
- changing geometry type

must have:

1. dependency analysis
2. backup
3. migration test
4. data migration plan
5. rollback/recovery plan

---

# 9. Column Rename Strategy

Safer approach:

```text
1. Add new column.
2. Backfill data.
3. Update application to write both if needed.
4. Switch reads.
5. Validate.
6. Remove old column in later migration.
```

Avoid instant destructive rename on heavily used production fields.

---

# 10. Enum Migration Rule

PostgreSQL enum changes require care.

Prefer:

- additive enum values

For major semantic changes, consider constrained text if future flexibility is important.

---

# 11. Data Backfill Requirements

Backfills should:

- run in batches if large
- be idempotent when possible
- log progress
- avoid long table locks
- be tested with realistic data size

---

# 12. PostGIS Migration Requirements

When changing geography/geometry:

- confirm SRID 4326
- validate geometry
- rebuild GiST index if needed
- test point-in-polygon queries
- test map API payload

---

# 13. RLS Migration Requirements

RLS must be tested for:

```text
anonymous
authenticated user
admin
service role
```

Critical tests:

- user cannot read another user's places
- user cannot read another user's notifications
- public can read verified outages only
- normal user cannot publish event
- admin-only data remains protected

---

# 14. Migration Test Procedure

For every migration set:

```text
1. Create clean test database.
2. Run all migrations from zero.
3. Run seed/reference data.
4. Run schema tests.
5. Insert sample event.
6. Run geospatial match.
7. Create user place.
8. Verify RLS.
9. Create event version.
10. Verify current view.
```

---

# 15. Production Deployment Procedure

Before deploy:

- backup production database
- review migration SQL
- identify destructive operations
- confirm app compatibility
- run staging migration first

Deploy order:

```text
1. Backup
2. Database migration
3. Verify DB
4. Deploy backend
5. Deploy frontend
6. Run smoke tests
```

---

# 16. Migration Failure Rule

If migration fails:

- stop deployment
- do not partially deploy dependent application code
- inspect error
- recover safely
- record incident if production

---

# 17. Rollback Philosophy

Not every migration can be safely reversed.

Prefer:

> forward correction + backup recovery

over blind downgrade scripts.

For high-risk migrations, define explicit recovery steps.

---

# 18. Migration Ownership

Database migration files are the only approved schema history.

Claude must update migration files whenever implementing:

- new table
- new column
- new index
- new constraint
- RLS policy
- function
- view
- enum change

---

# 19. Migration Documentation

For meaningful migrations, document:

```text
WHY
WHAT CHANGED
DATA IMPACT
APPLICATION IMPACT
ROLLBACK / RECOVERY
```

---

# 20. Migration Definition of Done

A migration is complete when:

- SQL is committed
- empty DB migration succeeds
- staging migration succeeds
- indexes exist
- RLS works
- old data remains valid
- app tests pass
- no critical query regression exists
