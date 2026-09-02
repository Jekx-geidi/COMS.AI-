# COMS.AI
## Cebu Outage Monitoring & Intelligence System
### PLAN-FLOW-REQUIREMENTS.md

**Document Type:** Master Implementation Roadmap + Stage-Gated Requirements  
**Version:** 1.0  
**Status:** Build Execution Guide  
**Purpose:** Define the exact implementation order from project initialization to production release  
**Primary Principle:** Build in stages, validate each stage, and do not move forward when critical dependencies are incomplete.

---

# 1. Purpose of This Document

This document defines how COMS.AI should be built **from scratch to production**.

It is intended for:

- Claude or another coding agent
- developers
- testers
- project managers
- reviewers
- future maintainers

This is not a feature wishlist.

It is a **stage-gated execution plan**.

Each stage defines:

- objective
- required work
- technical requirements
- expected deliverables
- testing requirements
- completion gate
- dependencies on previous stages

The application should be implemented in the order defined below unless an approved architectural reason requires a different sequence.

---

# 2. Overall Build Sequence

```text
STAGE 0
Project Initialization
        |
        v
STAGE 1
Architecture + Data Foundation
        |
        v
STAGE 2
Authentication + Roles + Security Base
        |
        v
STAGE 3
Location + Geospatial Foundation
        |
        v
STAGE 4
Outage Event Core
        |
        v
STAGE 5
Admin Advisory Ingestion
        |
        v
STAGE 6
AI Extraction + Verification
        |
        v
STAGE 7
Live Map + Pins + Area Overlays
        |
        v
STAGE 8
Locate Me
        |
        v
STAGE 9
Calendar + Public Dashboard
        |
        v
STAGE 10
Ask COMS AI
        |
        v
STAGE 11
My Places
        |
        v
STAGE 12
Notifications + Preparedness
        |
        v
STAGE 13
Community Intelligence
        |
        v
STAGE 14
Analytics + Audit + Admin Operations
        |
        v
STAGE 15
Accessibility + Mobile + PWA
        |
        v
STAGE 16
Security Hardening + Reliability
        |
        v
STAGE 17
Testing + UAT
        |
        v
STAGE 18
Production Deployment
        |
        v
STAGE 19
Post-Launch Monitoring + Iteration
```

---

# 3. Core Product Rule

At all stages, COMS.AI must remain:

> **An AI-powered outage awareness, mapping, location intelligence, and preparedness platform for Cebu.**

It must not drift into becoming:

- a billing portal
- a payment app
- an electricity provider replacement
- an unofficial source claiming authority it does not have
- a generic chatbot without verified data grounding

---

# 4. Stage Completion Rule

Every stage must have:

```text
IMPLEMENTED
+
PERSISTED
+
TESTED
+
ERROR HANDLED
+
DOCUMENTED
+
ACCEPTANCE GATE PASSED
```

before being considered complete.

A visually working feature is not complete if:

- data is not persisted
- permissions are missing
- errors are not handled
- mobile layout is broken
- AI can hallucinate
- tests are absent
- required source/freshness metadata is missing

---

# 5. STAGE 0 - Project Initialization

## Objective

Create the base repository, environment, documentation, and development standards.

## Requirements

### Project Files

Create and retain:

```text
PLAN.md
CLAUDE.md
AGENT.md
BRD.md
PRD.md
UF.md
UFR.md
NFR.md
COMS-AI-RESEARCH.md
PLAN-FLOW-REQUIREMENTS.md
README.md
.env.example
```

### Initial Stack

Recommended:

- Next.js / React
- TypeScript
- Supabase
- PostgreSQL
- PostGIS
- map provider abstraction
- AI provider abstraction
- web push notification support
- modern testing framework

### Repository Standards

Create:

```text
src/
components/
features/
lib/
types/
services/
hooks/
tests/
supabase/
docs/
```

### Development Rules

- TypeScript strict mode enabled
- linting configured
- formatting configured
- environment variables documented
- secrets excluded from Git
- branch protection recommended
- meaningful commits

---

## Deliverables

- working local development environment
- README setup guide
- environment variable template
- base project shell
- documentation committed

---

## Acceptance Gate

Do not proceed unless:

- app starts locally
- no missing critical dependencies
- lint works
- build works
- environment documentation exists

---

# 6. STAGE 1 - Architecture and Data Foundation

## Objective

Build the persistent backend and core schema before user-facing features depend on temporary state.

## Required Database Capabilities

- PostgreSQL
- PostGIS extension
- persistent storage
- migrations
- timestamps
- indexes
- foreign keys
- audit-ready structure

## Core Tables

Create at minimum:

```text
users
user_places
locations
sources
source_documents
outage_events
outage_event_locations
outage_event_versions
ai_extractions
verification_reviews
community_reports
community_report_clusters
notifications
audit_logs
```

---

## Core Enums

Create centralized values for:

### Outage Status

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

### Coverage Type

```text
FULL
PARTIAL
STREET
SITIO
LANDMARK_AREA
UNKNOWN_EXTENT
```

### Verification State

```text
DRAFT
REVIEW_REQUIRED
VERIFIED
REJECTED
SUPERSEDED
```

---

## Geospatial Requirements

Locations must support:

- latitude
- longitude
- geometry
- polygon/multipolygon where available
- normalized place name
- aliases
- administrative hierarchy

---

## Data Integrity Requirements

- no orphan outage locations
- timestamps required
- status validation
- source traceability
- version history preserved
- migrations used for schema change

---

## Deliverables

- complete initial migration
- indexes
- seed data for Cebu sample locations
- data access layer
- schema documentation

---

## Acceptance Gate

Proceed only when:

- migrations run cleanly
- sample events can be created/read/updated
- PostGIS queries work
- versioning data model is valid
- data persists after server restart

---

# 7. STAGE 2 - Authentication, Roles, and Security Base

## Objective

Create secure public, user, and admin access boundaries.

## Roles

Minimum:

```text
PUBLIC
USER
ADMIN
SUPER_ADMIN
```

Optional later:

```text
MODERATOR
VERIFIER
```

---

## Public Access

No login required for:

- dashboard
- live map
- calendar
- location search
- public outage details
- Ask COMS AI public queries

---

## Authenticated User Access

Required for:

- My Places
- saved alert preferences
- community reporting
- personalized notifications

---

## Admin Access

Required for:

- advisory ingestion
- AI review
- map verification
- publishing
- source management
- community moderation
- audit access

---

## Security Requirements

- server-side authorization
- row-level security
- protected admin endpoints
- secure session handling
- least privilege
- no client-side-only role checks

---

## Deliverables

- login flow
- registration flow if enabled
- role routing
- protected admin area
- RLS policies
- auth tests

---

## Acceptance Gate

Must prove:

- public user cannot access admin actions
- normal user cannot publish advisories
- admin can access admin tools
- user-specific data is isolated

---

# 8. STAGE 3 - Location and Geospatial Foundation

## Objective

Create the location model that powers map, search, Locate Me, and outage matching.

## Required Capabilities

- Cebu city/municipality data
- barangay lookup
- alias handling
- geocoding
- reverse geocoding
- coordinate normalization
- point-to-area matching

---

## Location Resolution

The system should understand:

```text
Talamban
Lahug
Banilad
IT Park
Ayala
Colon
SM Cebu
USC Talamban
```

---

## Ambiguity Rule

If two places could materially change the answer:

- show choices
- do not silently guess

---

## Deliverables

- location search service
- alias resolver
- geocoding integration
- reverse geocoding integration
- point/polygon utilities
- location test fixtures

---

## Acceptance Gate

Test:

- known barangay
- known landmark
- ambiguous term
- invalid location
- coordinate to barangay
- point inside polygon
- point outside polygon

---

# 9. STAGE 4 - Core Outage Event Engine

## Objective

Create the central event model used by every later feature.

## Event Fields

At minimum:

```text
id
event_type
status
effective_date
start_at
end_at
reason
source_id
source_document_id
verified
confidence
created_at
updated_at
```

---

## Location Relationship

Each event may affect:

- one location
- multiple locations
- whole administrative area
- partial area
- street
- sitio
- custom polygon
- unknown extent

---

## Versioning

Material changes must create versions.

Examples:

- schedule changed
- date changed
- area changed
- status changed
- cancelled
- restored
- corrected

---

## Current Event Logic

Public systems must retrieve:

> latest verified, non-superseded event version

---

## Deliverables

- outage event CRUD
- outage location relations
- event versioning
- current-event query service
- status transition rules

---

## Acceptance Gate

Must pass:

- create event
- update event
- cancel event
- restore event
- retrieve latest version
- preserve previous versions

---

# 10. STAGE 5 - Admin Advisory Ingestion

## Objective

Allow admins to capture outage source information.

## Input Types

Support:

- paste caption
- upload screenshot
- caption + screenshot
- source URL
- manual structured entry

---

## Source Preservation

Always store original:

- text
- image
- URL
- captured timestamp
- source name
- original publication timestamp when known

---

## Upload Requirements

- file size limits
- file type validation
- image validation
- secure storage
- source checksum

---

## Deliverables

- advisory creation form
- screenshot upload
- caption field
- source field
- source storage
- ingestion history

---

## Acceptance Gate

Admin can:

1. create source
2. upload image
3. paste caption
4. save as draft
5. view original input later

---

# 11. STAGE 6 - AI Extraction and Verification

## Objective

Use AI to transform unstructured advisories into structured candidate outage data.

## Required AI Output

```text
event_type
status
published_at
effective_date
start_at
end_at
locations
coverage_type
coverage_description
reason
cancellation
restoration
confidence
uncertainties
conflicts
```

---

## Multimodal Logic

If caption + screenshot both exist:

compare:

- date
- time
- locations
- status
- reason
- cancellation
- restoration

---

## Conflict Rule

If values disagree:

```text
review_required = true
```

Do not auto-publish.

---

## AI Safety

Source content is untrusted.

Prompt injection must not alter:

- system behavior
- roles
- publishing
- authorization

---

## Human Review UI

Display:

- original caption
- screenshot
- extracted values
- AI confidence
- conflicts
- unresolved locations

Actions:

```text
APPROVE & PUBLISH
EDIT
REANALYZE
REJECT
```

---

## Deliverables

- AI extraction service
- JSON schema validation
- conflict detection
- AI review screen
- correction tracking
- verification records

---

## Acceptance Gate

Test:

- correct caption
- correct image
- conflicting caption/image
- missing time
- missing date
- unknown location
- prompt injection content
- malformed source

---

# 12. STAGE 7 - Live Outage Map

## Objective

Build the visual geographic outage experience.

## Required Map Features

- Cebu default view
- outage pins
- affected polygons
- partial overlays
- current event status
- zoom
- pan
- clustering
- filters
- detail cards

---

## Map Status Layers

Use distinct visual + textual treatment for:

- ongoing
- confirmed
- scheduled
- possible
- restoring
- restored
- unknown
- community reports

---

## Pin Detail

Show:

- area
- status
- date
- start time
- end time
- duration
- reason
- source
- verification time

---

## Partial Coverage Rule

Never color a full barangay polygon if source only says:

> portion of barangay

unless approved geometry supports it.

---

## Deliverables

- Live Map page
- map markers
- polygons
- clustering
- filters
- event detail panel
- map error fallback

---

## Acceptance Gate

Must support:

- multiple simultaneous events
- partial coverage
- event detail
- mobile interaction
- map service failure fallback

---

# 13. STAGE 8 - Locate Me

## Objective

Allow users to determine whether their current position matches an outage.

## Flow

```text
Tap Locate Me
      |
      v
Request Permission
      |
      v
Get Coordinates
      |
      v
Reverse Geocode
      |
      v
Match Against Verified Geography
      |
      v
Return Classification
```

---

## Required Match States

```text
MATCH_CONFIRMED
MATCH_PARTIAL_AREA
MATCH_NEARBY
NO_VERIFIED_MATCH
DATA_STALE
```

---

## Required Response Fields

- detected area
- match type
- status
- date
- time
- duration
- source
- last verified
- uncertainty note

---

## Permission Denied

Fallback:

> Search location manually

---

## Privacy Rule

Anonymous Locate Me coordinates should not be stored permanently by default.

---

## Deliverables

- Locate Me button
- browser geolocation
- map centering
- outage matching service
- user-friendly status card
- permission fallback

---

## Acceptance Gate

Test:

- exact match
- partial area
- nearby
- no match
- stale event
- permission denied
- low GPS accuracy

---

# 14. STAGE 9 - Calendar and Public Dashboard

## Objective

Provide non-map ways to understand outages.

## Dashboard

Show:

- current situation
- active outages
- today
- tomorrow
- recently changed
- recently restored
- last verified

---

## Calendar

Views:

```text
TODAY
TOMORROW
7 DAYS
MONTH
```

Filters:

- location
- status
- event type

---

## Deliverables

- homepage dashboard
- outage cards
- calendar page
- filter system
- event links

---

## Acceptance Gate

Public users can find an outage without using the map.

---

# 15. STAGE 10 - Ask COMS AI

## Objective

Create a grounded conversational assistant.

## Supported Languages

- Cebuano
- English
- Tagalog
- mixed language

---

## Mandatory Retrieval Flow

```text
Question
  |
  v
Intent
  |
  v
Location
  |
  v
Time
  |
  v
Verified Event Retrieval
  |
  v
Latest Version
  |
  v
Source + Freshness
  |
  v
Generate Answer
```

---

## AI Must Never

- answer current outage status from model memory
- invent affected streets
- invent restoration time
- turn possible into confirmed
- hide uncertainty

---

## Supported Intents

- outage now
- outage today
- outage tomorrow
- outage by date/time
- location impact
- latest update
- cancellation
- restoration
- preparedness
- plan my day
- source check
- multi-place status

---

## Deliverables

- chat UI
- retrieval service
- intent parser
- time resolver
- location resolver
- grounded response generator
- failure state

---

## Acceptance Gate

Must pass:

- Cebuano query
- English query
- code-switched query
- no data
- partial area
- stale data
- cancelled event
- retrieval failure

---

# 16. STAGE 11 - My Places

## Objective

Allow users to monitor multiple important locations.

## Features

Users can:

- add place
- label place
- edit
- delete
- enable alerts
- disable alerts

Labels:

```text
Home
School
Work
Business
Parents' Home
Custom
```

---

## Place Input

Support:

- search
- drop pin
- current location

---

## Personal Status

Generate:

```text
Home - No verified match
School - Scheduled 1 PM-4 PM
Work - Possible interruption
```

---

## Deliverables

- My Places page
- saved places CRUD
- notification preferences
- personal status summary

---

## Acceptance Gate

Data is isolated per user and persists correctly.

---

# 17. STAGE 12 - Notifications and Preparedness

## Objective

Move from passive checking to proactive awareness.

## Notification Types

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

---

## Channels

MVP:

- in-app
- web push

Future:

- email
- SMS
- Messenger/Viber/Telegram

---

## Deduplication

Suggested key:

```text
user_id
+
place_id
+
event_id
+
event_version
+
notification_type
```

---

## Preparedness Profiles

- Household
- Student
- Remote Worker
- Business

---

## Deliverables

- notification engine
- notification history
- web push
- reminder settings
- preparedness checklists

---

## Acceptance Gate

Test:

- new event
- changed time
- cancelled event
- restored event
- duplicate notification prevention

---

# 18. STAGE 13 - Community Intelligence

## Objective

Allow non-official public observations without confusing them with verified events.

## Report Types

```text
POWER_OUT
POWER_RESTORED
FLICKERING
LOW_VOLTAGE
INTERMITTENT
```

---

## Community Rules

Must be labeled:

> Community Report

Never:

> Official Outage

---

## Clustering

Use:

- distance
- time
- report type
- report volume

---

## Abuse Prevention

- authentication
- rate limits
- duplicate detection
- moderation
- report expiry
- trust scoring

---

## Deliverables

- report submission
- community map layer
- clustering
- moderation queue
- abuse controls

---

## Acceptance Gate

Community data cannot create official outage status automatically.

---

# 19. STAGE 14 - Analytics, Audit, and Admin Operations

## Objective

Make COMS.AI operationally manageable.

## Admin Dashboard Metrics

- active events
- scheduled events
- ingestion queue
- AI review queue
- community reports
- notification delivery
- admin actions
- source freshness

---

## Audit Events

Track:

- ingestion
- AI extraction
- corrections
- approval
- rejection
- publishing
- map changes
- cancellations
- restorations
- source changes

---

## Product Analytics

Track:

- Locate Me usage
- map usage
- searches
- AI queries
- My Places adoption
- notification opt-in
- task success proxies

---

## Deliverables

- admin operations dashboard
- analytics
- audit viewer
- source monitoring indicators

---

## Acceptance Gate

Every critical admin action is traceable.

---

# 20. STAGE 15 - Accessibility, Mobile, and PWA

## Objective

Ensure COMS.AI is usable by real users, not only desktop developers.

## Mobile Requirements

- mobile-first
- touch-friendly map
- no critical horizontal scrolling
- responsive cards
- visible Locate Me
- bottom-friendly mobile actions where appropriate

---

## Accessibility

Target:

> WCAG 2.1 AA principles

Required:

- map status has text labels
- keyboard navigation
- sufficient contrast
- screen-reader labels
- accessible form validation
- outage text fallback outside map

---

## PWA

Where practical:

- installable
- app manifest
- service worker
- offline shell
- notification support

Critical warning:

Offline content must clearly display freshness.

---

## Deliverables

- mobile QA
- accessibility fixes
- PWA shell
- responsive map
- text fallbacks

---

## Acceptance Gate

Test common mobile widths and keyboard-only navigation.

---

# 21. STAGE 16 - Security, Reliability, and Hardening

## Objective

Prepare the application for real-world public usage.

## Security Review

Test:

- authorization
- RLS
- XSS
- SQL injection
- upload abuse
- prompt injection
- IDOR
- rate limits
- secret exposure

---

## Reliability

Ensure:

- no local ephemeral persistence
- database backups
- notification retry
- AI failure fallback
- map failure fallback
- source preservation
- event version integrity

---

## Performance

Optimize:

- geospatial indexes
- public event queries
- map bounding-box loading
- image optimization
- caching
- AI request size

---

## Deliverables

- security checklist
- backup policy
- recovery notes
- performance baseline
- rate limits

---

## Acceptance Gate

No known critical security issue.

---

# 22. STAGE 17 - Testing and UAT

## Objective

Prove the product works end-to-end.

## Unit Testing

Test:

- status logic
- freshness
- coverage matching
- event versioning
- notification rules
- date/time logic

---

## Integration Testing

Test:

- source to AI extraction
- extraction to review
- review to publish
- publish to map
- publish to calendar
- publish to AI retrieval
- publish to notification

---

## AI Evaluation

Test:

- dates
- times
- locations
- status
- partial coverage
- cancellation
- restoration
- conflicts
- hallucination
- prompt injection

---

## UAT Core Scenario

```text
Admin uploads advisory
        |
        v
AI analyzes
        |
        v
Admin reviews
        |
        v
Admin approves
        |
        v
Event becomes visible
        |
        v
Map updates
        |
        v
Calendar updates
        |
        v
User taps Locate Me
        |
        v
AI explains current impact
        |
        v
User saves place
        |
        v
Notification is generated
```

---

## Usability Testing

Test:

- can user find current status?
- can user understand partial coverage?
- can user locate themselves?
- can user distinguish verified/community?
- can user find source?
- can user understand AI answer?

---

## Deliverables

- test report
- UAT report
- defect log
- AI evaluation report
- usability results

---

## Acceptance Gate

No unresolved blocker or critical defect.

---

# 23. STAGE 18 - Production Deployment

## Objective

Deploy a stable production version.

## Pre-Deployment Checklist

- production database
- migrations
- environment variables
- HTTPS
- domain
- storage
- map keys
- AI keys
- push notification keys
- monitoring
- error tracking
- backups
- admin account
- source configuration

---

## Deployment Order

```text
1. Database
2. Storage
3. Backend/API
4. AI services
5. Frontend
6. Notification worker
7. Monitoring
8. Smoke test
```

---

## Production Smoke Test

Verify:

- homepage
- map
- Locate Me
- location search
- calendar
- AI assistant
- admin ingestion
- publish
- event update
- notification
- mobile

---

## Acceptance Gate

Production workflow works with a controlled test advisory.

---

# 24. STAGE 19 - Post-Launch Monitoring

## Objective

Verify that the application remains useful and trustworthy after launch.

## Monitor

- API availability
- AI failures
- map errors
- source freshness
- stale events
- notification failures
- community abuse
- extraction correction rate
- user task behavior

---

## Feedback Collection

Collect feedback on:

- map clarity
- Locate Me usefulness
- AI answer clarity
- notification timing
- preparedness usefulness

---

## Iteration Priorities

Prioritize fixes by:

```text
1. Public safety / wrong outage info
2. Security / privacy
3. Data freshness
4. Location accuracy
5. Usability
6. Performance
7. New features
```

---

# 25. Feature Dependency Matrix

| Feature | Depends On |
|---|---|
| Live Map | Locations + Outage Events |
| Locate Me | Geolocation + Locations + Map + Verified Events |
| Calendar | Outage Events |
| Ask COMS AI | Verified Events + Location + Time Resolution |
| My Places | Auth + Locations |
| Notifications | My Places + Events + Event Versioning |
| Preparedness | Events + AI + User Context |
| Community Reports | Auth + Locations |
| Community Map | Community Reports + Map |
| Admin AI Ingestion | Sources + Storage + AI |
| AI Verification | AI Extraction + Admin Roles |
| Analytics | Event + User + Notification Activity |
| Power Resilience Score | Historical Event Data |

---

# 26. Mandatory MVP Completion Checklist

COMS.AI MVP is not complete until all of these are available:

## Public

- [ ] Home dashboard
- [ ] Live Cebu outage map
- [ ] outage pins
- [ ] area overlays
- [ ] partial coverage handling
- [ ] Locate Me
- [ ] manual location search
- [ ] Today/Tomorrow/7-Day calendar
- [ ] Ask COMS AI
- [ ] source display
- [ ] freshness display
- [ ] preparedness guidance

## User

- [ ] authentication
- [ ] My Places
- [ ] notification preferences
- [ ] in-app notifications
- [ ] web push

## Admin

- [ ] admin authentication
- [ ] source management
- [ ] caption ingestion
- [ ] screenshot upload
- [ ] AI extraction
- [ ] conflict detection
- [ ] map review
- [ ] human approval
- [ ] event publishing
- [ ] versioning
- [ ] audit trail

## Quality

- [ ] persistent storage
- [ ] mobile responsive
- [ ] accessibility fallback
- [ ] authorization tests
- [ ] geospatial tests
- [ ] AI tests
- [ ] UAT
- [ ] production monitoring

---

# 27. Hard Stop Conditions

Do not proceed to production if any of the following are true:

- AI can answer current outage status without retrieval
- admins can publish without authorization
- partial areas are shown as full confirmed coverage
- anonymous GPS is stored without need/disclosure
- source information is lost
- stale events appear definitely current
- event history is overwritten
- community reports appear official
- map is the only way to access critical information
- no production backup exists
- unresolved critical security defect exists

---

# 28. Recommended Claude Execution Pattern

Claude should work stage-by-stage.

For each stage:

```text
1. Read PLAN-FLOW-REQUIREMENTS.md
2. Identify current stage
3. Inspect existing code
4. Identify missing requirements
5. Implement only required scope
6. Add tests
7. Run tests
8. Fix failures
9. Update documentation
10. Report completed items
11. Report remaining gate blockers
```

Claude should not jump into future features if the current stage has unresolved critical dependencies.

---

# 29. Required Stage Completion Report Format

At the end of each stage, output:

```text
STAGE:
STATUS: PASS / PARTIAL / FAIL

IMPLEMENTED:
- ...

TESTED:
- ...

TEST RESULTS:
- ...

NOT IMPLEMENTED:
- ...

RISKS:
- ...

BLOCKERS:
- ...

READY FOR NEXT STAGE:
YES / NO
```

---

# 30. Final End-to-End Product Flow

```text
OFFICIAL / APPROVED SOURCE
          |
          v
ADMIN INGESTS CAPTION / IMAGE / URL
          |
          v
SOURCE PRESERVED
          |
          v
AI EXTRACTS STRUCTURED INFORMATION
          |
          v
VALIDATION + CONFLICT DETECTION
          |
          v
LOCATION RESOLUTION
          |
          v
ADMIN REVIEWS DATA + MAP
          |
          v
APPROVE & PUBLISH
          |
          v
VERIFIED OUTAGE EVENT
          |
   +------+------+------+------+
   |      |      |      |      |
   v      v      v      v      v
Dashboard Map Calendar AI Notifications
                 |
                 v
              USER
                 |
     +-----------+-----------+
     |           |           |
     v           v           v
 Locate Me    Search      Ask AI
     |           |           |
     +-----------+-----------+
                 |
                 v
       LOCATION + TIME MATCH
                 |
                 v
        VERIFIED EXPLANATION
                 |
                 v
       PREPARE / SAVE / ALERT
```

---

# 31. Definition of Finished Application

COMS.AI is considered functionally complete when a real end user can:

1. Open the site without logging in.
2. See current verified outage information.
3. View outages on a Cebu map.
4. Tap **Locate Me**.
5. Allow location access.
6. Receive an accurate match classification.
7. See time, date, duration, status, source, and freshness.
8. Ask COMS AI follow-up questions.
9. Search another place.
10. View outage schedules in a calendar.
11. Save important locations after login.
12. Receive relevant reminders.
13. Understand preparation steps.
14. Distinguish official information from community reports.

And an admin can:

1. log in securely,
2. ingest source information,
3. upload screenshot/caption,
4. let AI extract details,
5. review conflicts,
6. correct location/map data,
7. approve publication,
8. publish to map/calendar/AI,
9. update/cancel/restore events,
10. retain full version and audit history.

---

# 32. Final Build Principle

COMS.AI should be developed in this order:

> **Foundation -> Data -> Security -> Geography -> Events -> Ingestion -> AI Verification -> Map -> Locate Me -> Public Experience -> AI Assistant -> Personalization -> Alerts -> Community -> Hardening -> Testing -> Production**

The product should never prioritize visual polish or advanced AI features before the underlying data, security, geography, and verification systems are reliable.

The final system must consistently follow:

> **Detect -> Understand -> Verify -> Locate -> Explain -> Prepare -> Notify**
