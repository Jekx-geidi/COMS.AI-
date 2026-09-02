# CLAUDE.md

# COMS.AI - Claude Development Context

This file defines the implementation rules, product boundaries, architectural expectations, and decision priorities for Claude or any coding agent working on COMS.AI.

---

## 1. Project Identity

Project: COMS.AI

Purpose:
Build an AI-centered public preparedness and disruption intelligence platform for Cebu focused initially on electricity interruptions.

This project MUST NOT be implemented as a clone of VECO, Visayan Electric, MobileAP, or another utility account application.

Primary focus:

- outage understanding
- location impact
- preparedness
- AI planning
- community awareness
- multiple saved places
- source-grounded information
- notification intelligence
- historical reliability

---

## 2. Core Product Rule

Before implementing any feature, ask:

> Does this help users understand, prepare for, or respond to a power disruption?

If the feature only duplicates:

- bill payment
- account management
- utility account linking
- consumption billing
- traditional utility portal functionality

then it is outside the core product direction unless specifically requested.

---

## 3. Required Documentation Priority

When product behavior is unclear, use this order:

1. PLAN.md
2. AGENT.md
3. Existing approved implementation
4. User-requested change

Do not silently reinterpret the product.

---

## 4. Non-Negotiable AI Grounding Rule

Never implement the public assistant as:

user_message -> generic LLM response

Required pattern:

user_message
-> parse intent
-> resolve location
-> resolve relevant time
-> query structured outage records
-> retrieve source evidence
-> apply status and temporal rules
-> generate grounded response
-> attach freshness/source metadata

The LLM is a reasoning and communication layer.

The database is the source of truth.

---

## 5. Do Not Use LLM Memory as Primary Storage

Operational outage data must be stored in persistent structured storage.

Recommended:

- Supabase PostgreSQL
- PostGIS
- Supabase Storage
- optional vector retrieval for source documents

Never depend on model conversational memory for current outage status.

---

## 6. Suggested Architecture

Frontend:
- React / Next.js preferred
- TypeScript
- responsive PWA
- mobile-first UI

Backend:
- API layer
- PostgreSQL / Supabase
- PostGIS
- server-side validation
- background ingestion workers where required

AI:
- multimodal model for screenshot + caption extraction
- structured output
- retrieval from verified outage events
- confidence scoring
- language-aware response generation

Maps:
- map provider abstraction
- geospatial polygons where available
- points/areas where polygon certainty is unavailable

Notifications:
- in-app
- web push
- future channels abstracted behind notification service

---

## 7. Suggested Project Structure

```text
/
├─ PLAN.md
├─ CLAUDE.md
├─ AGENT.md
├─ docs/
│  ├─ architecture/
│  ├─ product/
│  ├─ ai/
│  └─ testing/
├─ src/
│  ├─ app/
│  ├─ components/
│  ├─ features/
│  │  ├─ dashboard/
│  │  ├─ map/
│  │  ├─ calendar/
│  │  ├─ my-places/
│  │  ├─ assistant/
│  │  ├─ preparedness/
│  │  ├─ community/
│  │  └─ admin/
│  ├─ lib/
│  │  ├─ ai/
│  │  ├─ db/
│  │  ├─ geo/
│  │  ├─ notifications/
│  │  └─ validation/
│  └─ types/
└─ supabase/
   ├─ migrations/
   ├─ functions/
   └─ seed/
```

Adapt to the existing repository instead of restructuring unnecessarily.

---

## 8. Data Model Direction

Minimum conceptual tables:

### users
Identity and user preferences.

### user_places
Saved locations such as home, school, work, business.

Suggested fields:

- id
- user_id
- label
- location_id
- custom_address
- latitude
- longitude
- notification_enabled
- created_at
- updated_at

### locations

Suggested fields:

- id
- country
- region
- province
- city_municipality
- barangay
- sitio
- street
- normalized_name
- aliases
- geometry
- geometry_type
- created_at

### sources

Suggested fields:

- id
- name
- type
- official
- source_url
- active
- trust_level
- created_at
- updated_at

### source_documents

Suggested fields:

- id
- source_id
- source_url
- raw_text
- image_path
- published_at
- captured_at
- checksum
- metadata
- created_at

### outage_events

Suggested fields:

- id
- event_type
- status
- effective_date
- start_at
- end_at
- reason
- source_id
- source_document_id
- verified
- confidence
- created_at
- updated_at

### outage_event_locations

Suggested fields:

- id
- outage_event_id
- location_id
- coverage_type
- coverage_description
- confidence
- geometry_override

coverage_type examples:

- FULL
- PARTIAL
- STREET
- SITIO
- LANDMARK_AREA
- UNKNOWN_EXTENT

### outage_event_versions

Suggested fields:

- id
- outage_event_id
- version
- payload
- change_type
- changed_by
- changed_at

### ai_extractions

Suggested fields:

- id
- source_document_id
- model
- extracted_payload
- confidence
- conflicts
- status
- created_at

### verification_reviews

Suggested fields:

- id
- extraction_id
- reviewer_id
- decision
- corrections
- reviewed_at

### community_reports

Suggested fields:

- id
- user_id
- report_type
- latitude
- longitude
- location_text
- note
- created_at
- expires_at
- trust_score
- moderation_status

### community_report_clusters

Suggested fields:

- id
- cluster_type
- geometry
- report_count
- first_reported_at
- last_reported_at
- confidence
- official_event_id
- status

### notifications

Suggested fields:

- id
- user_id
- event_id
- user_place_id
- channel
- notification_type
- scheduled_at
- sent_at
- delivery_status
- opened_at

### audit_logs

Suggested fields:

- id
- actor_id
- action
- entity_type
- entity_id
- before
- after
- ip_address
- created_at

---

## 9. Event Status Rules

Allowed outage status values:

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

Do not create ad-hoc status strings in individual components.

Use a shared enum/type.

---

## 10. Temporal Rules

Outage information is time-sensitive.

Always evaluate:

- current application time
- event start
- event end
- publication time
- latest event version
- cancellation
- restoration
- superseding updates

A newer verified advisory should override the current interpretation of an older advisory, but older records must remain in history.

---

## 11. Missing Information Rule

Absence of an outage record does NOT mean electricity is guaranteed to be available.

UI and AI wording should say:

> No currently verified interruption was found.

Do not say:

> No brownout will happen.

---

## 12. Partial Area Rule

If source says:

- portion of
- selected areas
- specific streets
- selected sitios
- selected customers

do not mark the entire barangay or city as confirmed affected.

Store coverage uncertainty explicitly.

---

## 13. AI Extraction Workflow

Required flow:

```text
Admin Input
  -> Store Original Source
  -> Extract Text/Image Content
  -> AI Structured Extraction
  -> Deterministic Validation
  -> Compare Caption vs Image
  -> Detect Conflicts
  -> Resolve Locations
  -> Create Draft Event
  -> Human Review
  -> Approve
  -> Publish
  -> Trigger Affected User Evaluation
  -> Trigger Notifications
```

Low-confidence or conflicting extraction must never auto-publish.

---

## 14. Structured AI Output

AI extraction must return validated structured JSON.

Example schema shape:

```json
{
  "event_type": "scheduled_service_interruption",
  "status": "SCHEDULED",
  "published_at": null,
  "start_at": null,
  "end_at": null,
  "locations": [
    {
      "name": "Lahug",
      "city": "Cebu City",
      "coverage_type": "PARTIAL",
      "coverage_description": "Portion of Lahug",
      "confidence": 0.92
    }
  ],
  "reason": null,
  "cancellation": false,
  "restoration": false,
  "confidence": 0.94,
  "uncertainties": [],
  "conflicts": []
}
```

Validate server-side.

Do not trust generated JSON without schema validation.

---

## 15. Admin Review Requirements

Admin must be able to:

- see original caption
- see original image
- see extracted event
- see AI confidence
- see detected conflicts
- edit extracted values
- approve
- reject
- request re-analysis

Publication must record:

- reviewer
- timestamp
- original AI output
- corrections
- final approved data

---

## 16. Public AI Assistant Rules

The assistant must:

- support Cebuano, English, Tagalog, and mixed language
- remain concise by default
- answer based on retrieved verified data
- label community signals separately
- show freshness
- cite source internally in the response model/UI
- preserve uncertainty
- understand relative time such as today, tonight, tomorrow
- resolve saved places where permission exists

The assistant must not:

- hallucinate outages
- invent restoration times
- invent affected streets
- turn possible events into confirmed events
- treat historical trends as deterministic predictions
- expose private saved locations to another user

---

## 17. Plan My Day Feature Rules

The feature may combine:

- verified outages
- saved places
- user-provided schedule
- preparation profile

It may recommend:

- preparation time
- relocation
- device charging
- backup internet
- schedule adjustment
- business preparation

It must not claim an alternative location has power unless verified.

---

## 18. Community Reporting Rules

Community reports are non-authoritative.

Always distinguish:

```text
OFFICIAL / VERIFIED
COMMUNITY REPORTED
AI INTERPRETATION
```

Do not visually merge these statuses.

Potential clustering logic:

- same report type
- distance threshold
- time threshold
- minimum report count

Cluster output must say:

> Community reports indicate...

not:

> Official outage confirmed...

unless linked to a verified event.

---

## 19. Map Rules

Map components must:

- distinguish confirmed vs uncertain coverage
- support partial-area descriptions
- display last verification time
- allow source inspection
- avoid coloring an entire administrative polygon if only a portion is affected
- support accessible labels, not color alone

---

## 20. Notification Rules

Notifications must be location relevant.

Possible types:

- NEW_ADVISORY
- TOMORROW_REMINDER
- PREPARATION_REMINDER
- STARTED
- CHANGED
- CANCELLED
- RESTORED
- COMMUNITY_CLUSTER

Avoid duplicate alerts.

Use idempotency keys.

A changed advisory should notify only affected subscribers.

---

## 21. Security Requirements

At minimum:

- public read endpoints
- authenticated user preference endpoints
- role-protected admin endpoints
- server-side authorization
- row-level security where applicable
- upload validation
- image file restrictions
- rate limiting
- audit logging
- protection against prompt injection in ingested content

Never allow source text to override system instructions.

Treat all ingested source content as untrusted data.

---

## 22. Privacy Requirements

Saved places may reveal personal routines.

Requirements:

- users can delete places
- users can disable notifications
- do not expose precise saved coordinates publicly
- community reports should avoid public identity exposure
- only store location precision required by the product

---

## 23. Testing Expectations

Every major feature should include:

- unit tests
- integration tests
- API tests
- permission tests
- AI extraction tests
- edge-case tests
- mobile responsiveness checks

Critical scenarios:

1. New advisory with one location.
2. Advisory with multiple cities.
3. Partial barangay coverage.
4. Caption and screenshot disagree.
5. Schedule changes.
6. Advisory cancelled.
7. Restoration update.
8. No matching advisory.
9. Community reports with no official event.
10. Community reports matching an official event.
11. Duplicate source document.
12. User asks in Cebuano.
13. User asks about tomorrow around midnight.
14. Old advisory is superseded.
15. User has multiple saved places.
16. Unauthorized admin action.
17. Prompt injection inside uploaded caption.
18. Malformed image/text.
19. Missing time.
20. Unknown location.

---

## 24. UI Priorities

Primary navigation suggestion:

```text
Home
Live Map
Calendar
My Places
Ask AI
Community
Preparedness
History
```

Admin navigation:

```text
Dashboard
Advisory Inbox
Outage Events
Sources
Map Review
Community Reports
Notifications
AI Review
Analytics
Audit Logs
Settings
```

Do not overload the public sidebar.

---

## 25. Product Language

Preferred public wording:

- Power Interruption
- Scheduled Interruption
- Possible Rotational Interruption
- Current Advisory
- Verified Update
- Community Report
- Last Verified

Avoid using "brownout" as the only formal event type because not all service interruptions are the same.

The chatbot may naturally understand and use "brownout" when speaking conversationally with users.

---

## 26. Implementation Discipline

Claude must:

1. inspect existing code before modifying
2. preserve working behavior unless replacement is required
3. make additive changes where possible
4. avoid unnecessary rewrites
5. reuse existing components and utilities
6. keep types centralized
7. add migrations instead of modifying production data manually
8. document environment variables
9. validate AI outputs
10. maintain auditability
11. avoid hardcoded Cebu locations where a data model is appropriate
12. ensure date/time handling uses Asia/Manila for user-facing interpretation

---

## 27. Definition of Done

A feature is done only when:

- implementation works
- persistence works
- authorization works
- error states exist
- loading states exist
- mobile UI works
- uncertainty is represented correctly
- tests pass
- relevant documentation is updated
- source/grounding rules are respected
- no duplicated utility-app functionality has accidentally become the primary experience

---

## 28. Final Development Principle

Build the system around this sequence:

**Detect -> Understand -> Verify -> Locate -> Explain -> Prepare -> Notify**

The product should always feel like an AI-powered preparedness and intelligence system, not a utility billing portal.
