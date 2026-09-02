# COMS.AI
## Cebu Outage Monitoring & Intelligence System
### Organized Repository Branching Tree + File Ownership Guide

**Document Type:** Repository Structure and Code Organization Standard  
**Version:** 1.0  
**Purpose:** Prevent confusion, duplication, misplaced files, and tightly coupled code during implementation.

---

# 1. Core Rule

Claude must not place files randomly.

Every file must belong to one of these categories:

```text
APP ROUTES
FEATURE MODULES
SHARED UI
DOMAIN TYPES
SERVICES
DATABASE
AI
GEO
NOTIFICATIONS
VALIDATION
AUTH
TESTS
DOCS
CONFIG
```

If a file does not clearly fit one category, Claude should first decide its responsibility before creating it.

---

# 2. Recommended Root Structure

```text
coms-ai/
├─ README.md
├─ PLAN.md
├─ BRD.md
├─ PRD.md
├─ UF.md
├─ UFR.md
├─ NFR.md
├─ AGENT.md
├─ CLAUDE.md
├─ COMS-AI-RESEARCH.md
├─ PLAN-FLOW-REQUIREMENTS.md
├─ COMS-AI-FILE-BRANCHING-TREE.md
├─ .env.example
├─ package.json
├─ tsconfig.json
├─ eslint.config.js
├─ next.config.js
├─ middleware.ts
├─ public/
├─ src/
├─ supabase/
├─ tests/
├─ scripts/
└─ docs/
```

---

# 3. Source Tree

```text
src/
├─ app/
│  ├─ (public)/
│  ├─ (auth)/
│  ├─ (user)/
│  ├─ admin/
│  ├─ api/
│  ├─ layout.tsx
│  └─ globals.css
│
├─ features/
│  ├─ dashboard/
│  ├─ map/
│  ├─ locate-me/
│  ├─ calendar/
│  ├─ assistant/
│  ├─ my-places/
│  ├─ preparedness/
│  ├─ notifications/
│  ├─ community/
│  ├─ advisories/
│  ├─ outage-events/
│  ├─ sources/
│  ├─ ai-review/
│  ├─ analytics/
│  └─ audit/
│
├─ components/
│  ├─ ui/
│  ├─ layout/
│  ├─ feedback/
│  └─ accessibility/
│
├─ lib/
│  ├─ auth/
│  ├─ db/
│  ├─ ai/
│  ├─ geo/
│  ├─ notifications/
│  ├─ validation/
│  ├─ dates/
│  ├─ permissions/
│  ├─ logging/
│  └─ utils/
│
├─ services/
│  ├─ outage.service.ts
│  ├─ location.service.ts
│  ├─ advisory.service.ts
│  ├─ ai.service.ts
│  ├─ notification.service.ts
│  ├─ community.service.ts
│  └─ source.service.ts
│
├─ types/
│  ├─ outage.ts
│  ├─ location.ts
│  ├─ source.ts
│  ├─ user.ts
│  ├─ notification.ts
│  ├─ community.ts
│  ├─ ai.ts
│  └─ index.ts
│
├─ hooks/
│  ├─ use-current-location.ts
│  ├─ use-outage-map.ts
│  ├─ use-outage-search.ts
│  ├─ use-user-places.ts
│  └─ use-notifications.ts
│
└─ config/
   ├─ env.ts
   ├─ app.ts
   ├─ map.ts
   ├─ ai.ts
   └─ notifications.ts
```

---

# 4. App Route Tree

```text
src/app/
├─ (public)/
│  ├─ page.tsx
│  ├─ map/
│  │  └─ page.tsx
│  ├─ calendar/
│  │  └─ page.tsx
│  ├─ ask-ai/
│  │  └─ page.tsx
│  ├─ preparedness/
│  │  └─ page.tsx
│  ├─ community/
│  │  └─ page.tsx
│  └─ outage/
│     └─ [eventId]/
│        └─ page.tsx
│
├─ (auth)/
│  ├─ login/
│  │  └─ page.tsx
│  └─ register/
│     └─ page.tsx
│
├─ (user)/
│  ├─ my-places/
│  │  └─ page.tsx
│  ├─ notifications/
│  │  └─ page.tsx
│  └─ settings/
│     └─ page.tsx
│
├─ admin/
│  ├─ page.tsx
│  ├─ advisory-inbox/
│  │  └─ page.tsx
│  ├─ outage-events/
│  │  └─ page.tsx
│  ├─ sources/
│  │  └─ page.tsx
│  ├─ map-review/
│  │  └─ page.tsx
│  ├─ ai-review/
│  │  └─ page.tsx
│  ├─ community-reports/
│  │  └─ page.tsx
│  ├─ analytics/
│  │  └─ page.tsx
│  ├─ audit-logs/
│  │  └─ page.tsx
│  └─ settings/
│     └─ page.tsx
│
└─ api/
   ├─ outages/
   ├─ locations/
   ├─ locate-me/
   ├─ ai/
   ├─ places/
   ├─ notifications/
   ├─ community/
   ├─ admin/
   └─ sources/
```

---

# 5. Feature Module Pattern

Every feature should follow the same internal pattern.

Example:

```text
src/features/map/
├─ components/
│  ├─ outage-map.tsx
│  ├─ outage-marker.tsx
│  ├─ outage-polygon.tsx
│  ├─ map-legend.tsx
│  └─ map-event-card.tsx
│
├─ hooks/
│  ├─ use-map-events.ts
│  └─ use-map-filters.ts
│
├─ services/
│  └─ map-data.service.ts
│
├─ schemas/
│  └─ map-filter.schema.ts
│
├─ utils/
│  ├─ marker-style.ts
│  └─ coverage-display.ts
│
├─ types.ts
└─ index.ts
```

Rule:

```text
UI -> feature component
business logic -> service/lib
validation -> schema
shared type -> src/types
feature-only type -> feature/types.ts
database logic -> src/lib/db or repository layer
```

---

# 6. Dashboard Module

```text
src/features/dashboard/
├─ components/
│  ├─ power-status-card.tsx
│  ├─ active-outages-card.tsx
│  ├─ today-schedule-card.tsx
│  ├─ tomorrow-schedule-card.tsx
│  ├─ recent-updates-card.tsx
│  └─ freshness-indicator.tsx
├─ services/
│  └─ dashboard.service.ts
├─ hooks/
│  └─ use-dashboard-data.ts
├─ types.ts
└─ index.ts
```

Dashboard must not contain direct database queries in React components.

---

# 7. Locate Me Module

```text
src/features/locate-me/
├─ components/
│  ├─ locate-me-button.tsx
│  ├─ locate-me-result-card.tsx
│  ├─ permission-denied-state.tsx
│  └─ gps-accuracy-warning.tsx
├─ hooks/
│  └─ use-locate-me.ts
├─ services/
│  └─ locate-me.service.ts
├─ utils/
│  └─ classify-location-match.ts
├─ types.ts
└─ index.ts
```

Responsibilities:

```text
use-locate-me.ts
-> browser GPS only

locate-me.service.ts
-> sends coordinate to backend / matching service

classify-location-match.ts
-> MATCH_CONFIRMED
-> MATCH_PARTIAL_AREA
-> MATCH_NEARBY
-> NO_VERIFIED_MATCH
-> DATA_STALE
```

Do not mix UI, GPS permission logic, and geospatial matching inside one component.

---

# 8. Map Module

```text
src/features/map/
├─ components/
│  ├─ outage-map.tsx
│  ├─ outage-marker.tsx
│  ├─ outage-area.tsx
│  ├─ community-marker.tsx
│  ├─ current-location-marker.tsx
│  ├─ map-legend.tsx
│  ├─ map-filter-panel.tsx
│  └─ map-event-card.tsx
├─ hooks/
│  ├─ use-map-events.ts
│  └─ use-map-bounds.ts
├─ services/
│  └─ map-query.service.ts
├─ utils/
│  ├─ map-status-display.ts
│  └─ map-clustering.ts
├─ types.ts
└─ index.ts
```

---

# 9. Calendar Module

```text
src/features/calendar/
├─ components/
│  ├─ outage-calendar.tsx
│  ├─ calendar-event-card.tsx
│  ├─ calendar-filter.tsx
│  └─ calendar-view-switcher.tsx
├─ services/
│  └─ calendar.service.ts
├─ hooks/
│  └─ use-calendar-events.ts
├─ types.ts
└─ index.ts
```

---

# 10. Ask COMS AI Module

```text
src/features/assistant/
├─ components/
│  ├─ assistant-shell.tsx
│  ├─ chat-message.tsx
│  ├─ assistant-input.tsx
│  ├─ source-chip.tsx
│  ├─ freshness-badge.tsx
│  └─ uncertainty-note.tsx
├─ hooks/
│  └─ use-assistant.ts
├─ services/
│  └─ assistant.service.ts
├─ schemas/
│  └─ assistant-request.schema.ts
├─ types.ts
└─ index.ts
```

The frontend assistant module must not contain the core LLM prompt.

Prompt/system logic belongs under:

```text
src/lib/ai/
```

---

# 11. AI Library Structure

```text
src/lib/ai/
├─ prompts/
│  ├─ outage-assistant.system.ts
│  ├─ advisory-extraction.system.ts
│  ├─ preparedness.system.ts
│  └─ location-resolution.system.ts
│
├─ schemas/
│  ├─ advisory-extraction.schema.ts
│  ├─ assistant-response.schema.ts
│  ├─ preparedness.schema.ts
│  └─ location-resolution.schema.ts
│
├─ pipelines/
│  ├─ extract-advisory.ts
│  ├─ answer-outage-question.ts
│  ├─ plan-day-around-power.ts
│  └─ analyze-source-conflict.ts
│
├─ guards/
│  ├─ grounding.guard.ts
│  ├─ prompt-injection.guard.ts
│  ├─ uncertainty.guard.ts
│  └─ freshness.guard.ts
│
├─ providers/
│  ├─ provider.ts
│  └─ provider.factory.ts
│
├─ retrieval/
│  ├─ retrieve-outage-context.ts
│  ├─ retrieve-source-context.ts
│  └─ retrieve-community-context.ts
│
├─ types.ts
└─ index.ts
```

Rule:

```text
AI prompt -> prompts/
AI output validation -> schemas/
multi-step AI workflow -> pipelines/
safety rule -> guards/
model provider code -> providers/
RAG/context retrieval -> retrieval/
```

---

# 12. Advisory Ingestion Module

```text
src/features/advisories/
├─ components/
│  ├─ advisory-create-form.tsx
│  ├─ caption-input.tsx
│  ├─ screenshot-upload.tsx
│  ├─ source-url-input.tsx
│  ├─ extraction-preview.tsx
│  └─ advisory-history.tsx
├─ services/
│  ├─ advisory-ingestion.service.ts
│  └─ advisory-review.service.ts
├─ schemas/
│  ├─ advisory-input.schema.ts
│  └─ advisory-review.schema.ts
├─ types.ts
└─ index.ts
```

---

# 13. AI Review Module

```text
src/features/ai-review/
├─ components/
│  ├─ ai-review-panel.tsx
│  ├─ confidence-display.tsx
│  ├─ conflict-list.tsx
│  ├─ source-comparison.tsx
│  └─ extracted-fields-editor.tsx
├─ services/
│  └─ ai-review.service.ts
├─ types.ts
└─ index.ts
```

---

# 14. Outage Events Module

```text
src/features/outage-events/
├─ components/
│  ├─ outage-event-table.tsx
│  ├─ outage-event-form.tsx
│  ├─ outage-event-status.tsx
│  ├─ outage-version-history.tsx
│  └─ outage-detail.tsx
├─ services/
│  ├─ outage-event.service.ts
│  └─ outage-version.service.ts
├─ schemas/
│  └─ outage-event.schema.ts
├─ types.ts
└─ index.ts
```

---

# 15. My Places Module

```text
src/features/my-places/
├─ components/
│  ├─ place-card.tsx
│  ├─ add-place-dialog.tsx
│  ├─ place-search.tsx
│  ├─ place-status.tsx
│  └─ place-alert-settings.tsx
├─ services/
│  └─ places.service.ts
├─ hooks/
│  └─ use-user-places.ts
├─ schemas/
│  └─ place.schema.ts
├─ types.ts
└─ index.ts
```

---

# 16. Preparedness Module

```text
src/features/preparedness/
├─ components/
│  ├─ preparedness-card.tsx
│  ├─ preparedness-checklist.tsx
│  ├─ profile-selector.tsx
│  └─ countdown-banner.tsx
├─ services/
│  └─ preparedness.service.ts
├─ data/
│  ├─ household.ts
│  ├─ student.ts
│  ├─ remote-worker.ts
│  └─ business.ts
├─ types.ts
└─ index.ts
```

---

# 17. Notifications Module

```text
src/features/notifications/
├─ components/
│  ├─ notification-list.tsx
│  ├─ notification-item.tsx
│  ├─ notification-settings.tsx
│  └─ push-permission-card.tsx
├─ services/
│  ├─ notification.service.ts
│  └─ push.service.ts
├─ hooks/
│  └─ use-notifications.ts
├─ types.ts
└─ index.ts
```

Server-side notification logic belongs under:

```text
src/lib/notifications/
```

---

# 18. Community Module

```text
src/features/community/
├─ components/
│  ├─ report-form.tsx
│  ├─ report-type-selector.tsx
│  ├─ community-report-card.tsx
│  ├─ community-cluster-card.tsx
│  └─ moderation-status.tsx
├─ services/
│  ├─ community-report.service.ts
│  └─ community-cluster.service.ts
├─ schemas/
│  └─ community-report.schema.ts
├─ types.ts
└─ index.ts
```

---

# 19. Geo Library

```text
src/lib/geo/
├─ geocode.ts
├─ reverse-geocode.ts
├─ point-in-polygon.ts
├─ distance.ts
├─ normalize-location.ts
├─ resolve-alias.ts
├─ coverage-match.ts
├─ geo.types.ts
└─ index.ts
```

Rule:

No geospatial math should be duplicated inside UI components.

---

# 20. Database Layer

Recommended:

```text
src/lib/db/
├─ client.ts
├─ admin-client.ts
├─ repositories/
│  ├─ outage.repository.ts
│  ├─ location.repository.ts
│  ├─ source.repository.ts
│  ├─ places.repository.ts
│  ├─ notification.repository.ts
│  ├─ community.repository.ts
│  └─ audit.repository.ts
├─ queries/
│  ├─ current-outages.ts
│  ├─ outage-by-location.ts
│  ├─ latest-event-version.ts
│  └─ user-place-impact.ts
└─ index.ts
```

Components must not directly contain SQL or raw Supabase queries.

---

# 21. Supabase Tree

```text
supabase/
├─ config.toml
├─ migrations/
│  ├─ 0001_extensions.sql
│  ├─ 0002_core_users.sql
│  ├─ 0003_locations.sql
│  ├─ 0004_sources.sql
│  ├─ 0005_outage_events.sql
│  ├─ 0006_event_versions.sql
│  ├─ 0007_ai_extractions.sql
│  ├─ 0008_user_places.sql
│  ├─ 0009_notifications.sql
│  ├─ 0010_community.sql
│  ├─ 0011_audit_logs.sql
│  ├─ 0012_indexes.sql
│  └─ 0013_rls.sql
│
├─ seed.sql
└─ functions/
   ├─ publish-outage/
   ├─ process-notifications/
   └─ cluster-community-reports/
```

Migration names should describe the data responsibility.

Do not create one giant `schema.sql` for all future changes.

---

# 22. Types Tree

```text
src/types/
├─ outage.ts
├─ location.ts
├─ advisory.ts
├─ source.ts
├─ ai.ts
├─ user.ts
├─ place.ts
├─ notification.ts
├─ community.ts
├─ audit.ts
└─ index.ts
```

Use shared types for domain entities used by multiple features.

Do not redefine `OutageStatus` in five separate modules.

---

# 23. Validation Tree

```text
src/lib/validation/
├─ outage.schema.ts
├─ location.schema.ts
├─ advisory.schema.ts
├─ place.schema.ts
├─ community.schema.ts
├─ notification.schema.ts
└─ index.ts
```

Rule:

All external input must be validated:

- API requests
- admin forms
- uploads metadata
- AI output
- geolocation input
- community reports

---

# 24. Auth Tree

```text
src/lib/auth/
├─ session.ts
├─ user.ts
├─ roles.ts
├─ require-auth.ts
├─ require-admin.ts
└─ index.ts
```

---

# 25. Permissions Tree

```text
src/lib/permissions/
├─ can-view-admin.ts
├─ can-publish-advisory.ts
├─ can-moderate-community.ts
├─ can-manage-source.ts
└─ index.ts
```

Do not place permission checks only inside buttons.

Server must enforce them.

---

# 26. Date and Time Tree

```text
src/lib/dates/
├─ timezone.ts
├─ resolve-relative-time.ts
├─ format-outage-time.ts
├─ freshness.ts
└─ index.ts
```

All Cebu-facing time interpretation should use:

```text
Asia/Manila
```

---

# 27. Notification Server Library

```text
src/lib/notifications/
├─ evaluate-impact.ts
├─ schedule.ts
├─ deduplicate.ts
├─ templates.ts
├─ channels/
│  ├─ in-app.ts
│  └─ web-push.ts
└─ index.ts
```

---

# 28. Logging and Audit

```text
src/lib/logging/
├─ logger.ts
├─ correlation-id.ts
└─ index.ts
```

Audit persistence belongs in the repository/service layer, not random `console.log` statements.

---

# 29. API Organization

Recommended:

```text
src/app/api/
├─ outages/
│  ├─ route.ts
│  └─ [id]/
│     └─ route.ts
│
├─ locations/
│  ├─ search/
│  │  └─ route.ts
│  └─ reverse/
│     └─ route.ts
│
├─ locate-me/
│  └─ route.ts
│
├─ ai/
│  ├─ ask/
│  │  └─ route.ts
│  ├─ extract/
│  │  └─ route.ts
│  └─ preparedness/
│     └─ route.ts
│
├─ places/
│  └─ route.ts
│
├─ notifications/
│  └─ route.ts
│
├─ community/
│  ├─ reports/
│  │  └─ route.ts
│  └─ clusters/
│     └─ route.ts
│
└─ admin/
   ├─ advisories/
   ├─ publish/
   ├─ sources/
   └─ map-review/
```

---

# 30. Test Tree

```text
tests/
├─ unit/
│  ├─ geo/
│  ├─ dates/
│  ├─ outage-status/
│  ├─ freshness/
│  ├─ notification/
│  └─ validation/
│
├─ integration/
│  ├─ advisory-ingestion.test.ts
│  ├─ publish-flow.test.ts
│  ├─ locate-me.test.ts
│  ├─ ask-ai.test.ts
│  ├─ user-places.test.ts
│  └─ community.test.ts
│
├─ ai/
│  ├─ extraction/
│  ├─ grounding/
│  ├─ prompt-injection/
│  ├─ partial-coverage/
│  └─ multilingual/
│
├─ e2e/
│  ├─ public-outage-check.spec.ts
│  ├─ locate-me.spec.ts
│  ├─ admin-publish.spec.ts
│  ├─ my-places.spec.ts
│  └─ notification.spec.ts
│
└─ fixtures/
   ├─ advisories/
   ├─ screenshots/
   ├─ locations/
   └─ events/
```

---

# 31. Documentation Tree

```text
docs/
├─ architecture/
│  ├─ system-architecture.md
│  ├─ data-flow.md
│  ├─ ai-architecture.md
│  └─ geo-architecture.md
│
├─ database/
│  ├─ schema.md
│  ├─ rls.md
│  └─ migrations.md
│
├─ product/
│  ├─ feature-matrix.md
│  └─ roadmap.md
│
├─ testing/
│  ├─ test-plan.md
│  ├─ uat.md
│  └─ ai-evaluation.md
│
├─ operations/
│  ├─ deployment.md
│  ├─ backup-recovery.md
│  └─ incident-response.md
│
└─ security/
   ├─ security-model.md
   ├─ privacy.md
   └─ prompt-injection.md
```

---

# 32. Scripts Tree

```text
scripts/
├─ seed-cebu-locations.ts
├─ import-location-aliases.ts
├─ validate-source-data.ts
├─ test-geospatial-match.ts
└─ backfill-event-versions.ts
```

Scripts must not contain production-only secrets.

---

# 33. Public Assets

```text
public/
├─ icons/
├─ logos/
├─ map/
├─ illustrations/
├─ manifest/
└─ offline/
```

Do not store private source screenshots inside `public/`.

Use secure object storage for admin-ingested source files.

---

# 34. Feature Ownership Matrix

| Concern | Correct Location |
|---|---|
| Public page | `src/app/(public)` |
| Admin page | `src/app/admin` |
| Feature UI | `src/features/<feature>/components` |
| Feature hooks | `src/features/<feature>/hooks` |
| Shared UI | `src/components/ui` |
| AI prompts | `src/lib/ai/prompts` |
| AI workflow | `src/lib/ai/pipelines` |
| AI guards | `src/lib/ai/guards` |
| Geo calculations | `src/lib/geo` |
| DB repository | `src/lib/db/repositories` |
| Shared domain types | `src/types` |
| Validation schemas | `src/lib/validation` |
| Notifications logic | `src/lib/notifications` |
| Auth | `src/lib/auth` |
| Permission rules | `src/lib/permissions` |
| API routes | `src/app/api` |
| DB migrations | `supabase/migrations` |
| E2E tests | `tests/e2e` |
| AI evaluation | `tests/ai` |
| Architecture docs | `docs/architecture` |

---

# 35. Naming Rules

Use:

```text
kebab-case.ts
kebab-case.tsx
```

Examples:

```text
outage-event-card.tsx
locate-me.service.ts
resolve-location.ts
```

React components:

```text
OutageEventCard
LocateMeButton
```

Functions:

```text
resolveLocation()
getCurrentOutages()
classifyCoverageMatch()
```

Types:

```text
OutageEvent
OutageStatus
LocationMatchResult
```

Constants:

```text
OUTAGE_STATUS
DEFAULT_MAP_CENTER
```

---

# 36. Import Rules

Preferred:

```text
@/features/map
@/lib/geo
@/types/outage
```

Avoid deep imports such as:

```text
../../../../../../lib/geo/point-in-polygon
```

Use path aliases.

---

# 37. Dependency Direction

Dependencies should flow downward:

```text
APP ROUTE
   |
   v
FEATURE
   |
   v
SERVICE
   |
   v
LIB / REPOSITORY
   |
   v
DATABASE / EXTERNAL API
```

Not:

```text
DATABASE -> UI
```

and not:

```text
shared lib -> feature component
```

---

# 38. Forbidden Patterns

Claude should not:

- put API calls directly in every React component
- duplicate status enums
- mix AI prompts into UI files
- store SQL inside components
- put all logic into one `utils.ts`
- create one giant `api.ts`
- create one giant `types.ts`
- store source screenshots in `/public`
- use local JSON files as production database
- duplicate permission rules in UI only
- make page files contain full business logic

---

# 39. Claude File Creation Rule

Before creating any file, Claude must answer internally:

```text
1. What feature owns this?
2. Is it UI, business logic, persistence, AI, geo, validation, or test?
3. Is it shared or feature-specific?
4. Does an existing file already serve this responsibility?
5. Will this create duplicate logic?
```

Only then create the file.

---

# 40. Stage-to-Folder Mapping

## Stage 0
Mostly:

```text
root/
docs/
config/
```

## Stage 1

```text
supabase/
src/lib/db/
src/types/
```

## Stage 2

```text
src/lib/auth/
src/lib/permissions/
src/app/(auth)/
```

## Stage 3

```text
src/lib/geo/
src/features/map/
src/types/location.ts
```

## Stage 4

```text
src/features/outage-events/
src/lib/db/repositories/outage.repository.ts
src/types/outage.ts
```

## Stage 5

```text
src/features/advisories/
src/features/sources/
```

## Stage 6

```text
src/lib/ai/
src/features/ai-review/
```

## Stage 7

```text
src/features/map/
src/app/(public)/map/
```

## Stage 8

```text
src/features/locate-me/
src/app/api/locate-me/
```

## Stage 9

```text
src/features/dashboard/
src/features/calendar/
```

## Stage 10

```text
src/features/assistant/
src/lib/ai/pipelines/
```

## Stage 11

```text
src/features/my-places/
```

## Stage 12

```text
src/features/notifications/
src/features/preparedness/
src/lib/notifications/
```

## Stage 13

```text
src/features/community/
```

## Stage 14

```text
src/features/analytics/
src/features/audit/
```

## Stage 15

```text
src/components/accessibility/
public/
PWA config
```

## Stage 16

```text
src/lib/logging/
docs/security/
docs/operations/
```

## Stage 17

```text
tests/
```

## Stage 18

```text
deployment config
docs/operations/
```

---

# 41. Recommended Final Repository Tree

```text
coms-ai/
├─ README.md
├─ PLAN.md
├─ BRD.md
├─ PRD.md
├─ UF.md
├─ UFR.md
├─ NFR.md
├─ AGENT.md
├─ CLAUDE.md
├─ COMS-AI-RESEARCH.md
├─ PLAN-FLOW-REQUIREMENTS.md
├─ COMS-AI-FILE-BRANCHING-TREE.md
├─ .env.example
├─ package.json
├─ tsconfig.json
├─ next.config.js
├─ middleware.ts
│
├─ public/
│  ├─ icons/
│  ├─ logos/
│  └─ manifest/
│
├─ src/
│  ├─ app/
│  ├─ features/
│  ├─ components/
│  ├─ lib/
│  ├─ services/
│  ├─ types/
│  ├─ hooks/
│  └─ config/
│
├─ supabase/
│  ├─ migrations/
│  ├─ functions/
│  └─ seed.sql
│
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  ├─ ai/
│  ├─ e2e/
│  └─ fixtures/
│
├─ scripts/
│
└─ docs/
   ├─ architecture/
   ├─ database/
   ├─ product/
   ├─ testing/
   ├─ operations/
   └─ security/
```

---

# 42. Final Rule for Claude

Claude should prioritize:

```text
CLEAR OWNERSHIP
> SHORT FILES
> SINGLE RESPONSIBILITY
> SHARED TYPES
> CENTRALIZED BUSINESS RULES
> TESTABLE SERVICES
> EXPLICIT DATA FLOW
```

over:

```text
FAST BUT MESSY IMPLEMENTATION
```

The repository should make it obvious:

- where a feature lives
- where business logic lives
- where database access lives
- where AI logic lives
- where map/geospatial logic lives
- where tests belong
- where documentation belongs

The goal is that another developer can open the repository and understand the project structure without asking where files are supposed to go.
