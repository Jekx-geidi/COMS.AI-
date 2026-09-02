# PRD.md

# COMS.AI
## Product Requirements Document

**Version:** 1.0  
**Status:** MVP Product Specification  
**Primary Platform:** Responsive Web Application / PWA  
**Primary Region:** Cebu, Philippines  
**Timezone:** Asia/Manila

---

## 1. Product Summary

COMS.AI is an AI-centered public power preparedness application that turns verified interruption advisories into structured, searchable, geospatial, and personalized information.

Its primary product surfaces are:

1. Live Dashboard
2. Interactive Power Map
3. Locate Me
4. Brownout Calendar
5. My Places
6. Ask AI
7. Plan My Day Around Power
8. Preparedness Mode
9. Community Intelligence
10. Admin AI Advisory Ingestion

The map and Locate Me workflow are core MVP features.

---

## 2. Product Goals

### G-01
Allow a user to determine within seconds whether their current location matches a verified power interruption event.

### G-02
Provide understandable date, time, duration, status, source, and geographic coverage.

### G-03
Use AI to interpret impact and provide preparation guidance.

### G-04
Allow users to monitor multiple important locations.

### G-05
Convert uploaded captions/screenshots into structured outage-event drafts.

### G-06
Prevent hallucinated or unverified AI outage claims.

### G-07
Make interruption information accessible through maps, search, calendar, AI, and notifications.

---

## 3. Non-Goals

The MVP is not:

- an electricity billing application
- a bill payment platform
- a replacement for an electricity provider
- a guaranteed outage predictor
- a guaranteed restoration-time predictor
- an autonomous emergency authority

---

## 4. Information Architecture

### Public Navigation

```text
Home
Live Map
Calendar
My Places
Ask AI
Preparedness
Community
History
```

### Admin Navigation

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

---

# 5. Feature Requirements

## F-001 Live Dashboard

### Purpose
Give users immediate awareness without requiring search.

### Components

- Current Cebu Power Status
- Happening Now
- Later Today
- Tomorrow
- Recently Changed
- Recently Cancelled
- Recently Restored
- Map Preview
- Locate Me CTA
- Ask AI CTA
- My Places summary
- Latest verification timestamp

### Acceptance Criteria

- Dashboard loads current verified events.
- Events are ordered by urgency and relevance.
- Each event displays status and source freshness.
- Dashboard never interprets absence of records as guaranteed normal service.

---

# 6. F-002 Interactive Power Map

## 6.1 Purpose

The map is the primary spatial interface for understanding where interruptions are occurring or scheduled.

## 6.2 Required Map Layers

1. Base map
2. Verified outage events
3. Scheduled events
4. Possible events
5. Restored/recent events
6. Community reports
7. User location
8. My Places

## 6.3 Map Markers

Where exact polygons are unavailable, use pins/markers representing the affected location.

Marker data:

```text
id
latitude
longitude
status
event_type
location_name
start_at
end_at
coverage_type
confidence
verified
```

## 6.4 Geographic Areas

When sufficient geographic boundaries exist, show polygons or highlighted regions.

Coverage types:

```text
FULL
PARTIAL
STREET
SITIO
LANDMARK_AREA
UNKNOWN_EXTENT
```

### Critical Rule

`PARTIAL` or `UNKNOWN_EXTENT` must never visually imply that the whole administrative area is confirmed affected.

Use uncertainty patterns, labels, or pin-based representation rather than falsely precise polygons.

## 6.5 Pin Detail Drawer

Selecting a pin opens:

```text
[Status Badge]
Location
Date
Start Time
Scheduled End Time
Duration
Interruption Type
Coverage
Reason
Last Update
Last Verified
Source

[Ask AI About This]
[Set Reminder]
[Share]
```

## 6.6 Clustering

At low zoom levels, nearby markers should cluster.

Cluster interaction:

- show event count
- zoom on click
- distinguish verified events from community-only signals

## 6.7 Filters

Required:

- Now
- Today
- Tomorrow
- 7 Days
- Ongoing
- Scheduled
- Possible
- Restored
- Community Reports

## 6.8 Map Legend

Suggested statuses:

- Normal / no matching verified event
- Monitoring
- Possible
- Scheduled
- Confirmed
- Ongoing
- Restoring
- Restored
- Cancelled
- Community Signal
- Unknown

Do not rely on color alone. Include icons/text.

---

# 7. F-003 Locate Me

## 7.1 User Story

As a Cebu resident, I want to tap **Locate Me** so I can immediately determine whether my current location is affected by a verified interruption.

## 7.2 Entry Points

Locate Me must be accessible from:

- Home dashboard
- Live Map
- Ask AI

## 7.3 Permission Flow

```text
User taps Locate Me
→ Browser requests location permission
→ Permission granted?
   → Yes: acquire coordinates
   → No: show manual location search
```

Do not repeatedly request permission after denial without user action.

## 7.4 Successful Geolocation Flow

```text
Coordinates acquired
→ Center map
→ Place "You are here" marker
→ Reverse geocode
→ Resolve city/barangay/nearby location
→ Query current + upcoming outage events
→ Perform point/area matching
→ Evaluate uncertainty
→ Generate status result
→ Offer AI explanation
```

## 7.5 Location Status Outcomes

### MATCH_CONFIRMED
Coordinates fall inside sufficiently precise verified affected geometry.

Example:

> A verified scheduled interruption affects your current location today from 1:00 PM to 4:00 PM.

### MATCH_PARTIAL_AREA
User is inside the same administrative area but exact outage boundary is incomplete.

Example:

> Part of Talamban is included in today's advisory. Your current location is in Talamban, but the source does not provide enough street-level detail to confirm that your exact position is affected.

### MATCH_NEARBY
User is near but outside known geometry.

Example:

> A scheduled interruption is mapped near your current location. Your detected point is not inside the confirmed affected area.

### NO_VERIFIED_MATCH

Example:

> No currently verified interruption was found for your detected location.

Never say:

> There is definitely no brownout here.

### DATA_STALE

Example:

> I found information for this area, but it has not been verified recently. Check the original source before relying on it.

### LOCATION_ERROR

Provide manual search fallback.

## 7.6 Locate Me Result Card

Required fields:

```text
Detected Location
Match Status
Event Status
Date
Start Time
Scheduled End Time
Duration
Coverage Type
Reason
Source
Last Verified
```

Actions:

- Ask AI
- Set Reminder
- Save as My Place
- View Source
- Share

## 7.7 Privacy

Current coordinates should be used only for the requested location operation unless the user explicitly saves the place.

Do not create permanent location history by default.

---

# 8. F-004 AI Response After Locate Me

After a successful location match, the application should create structured context for the AI.

Example tool/context payload:

```json
{
  "user_location": {
    "latitude": 10.0,
    "longitude": 123.0,
    "display_name": "Talamban, Cebu City"
  },
  "match_type": "MATCH_PARTIAL_AREA",
  "events": [],
  "checked_at": "ISO_TIMESTAMP"
}
```

The AI must not perform geographic guessing independently if deterministic geospatial results are available.

### Example AI Output

> Naa'y verified scheduled interruption affecting part of Talamban today from 1:00 PM to 4:00 PM. Naa ka sa Talamban based sa imong current location, pero partial area ra ang gi-state sa advisory, so dili pa nato ma-confirm nga apil gyud imong exact street. I can show you the affected details on the map.

---

# 9. F-005 Location Search

Search should support:

- city
- municipality
- barangay
- street where available
- sitio where available
- supported landmark aliases

Example inputs:

- Lahug
- Talamban
- IT Park
- Banilad
- Cebu Business Park

Search result should show disambiguation when necessary.

---

# 10. F-006 Brownout Calendar

Views:

- Today
- Tomorrow
- 7 Days
- Month

Event card:

```text
Status
Location
Date
Start - End
Coverage
Source
```

Clicking an event should synchronize with the map and event detail view.

---

# 11. F-007 My Places

Authenticated users may save:

- Home
- School
- Work
- Business
- Parents' Home
- Custom

Each place includes:

```text
label
location
coordinates
notification_enabled
preparation_profile
```

My Places dashboard should show each place's current/upcoming status.

---

# 12. F-008 Ask AI

## 12.1 Supported Languages

- Cebuano
- English
- Tagalog
- mixed language

## 12.2 Example Questions

- "Naay brownout diri karon?"
- "Brownout ba ugma sa Lahug?"
- "Unsa oras mubalik?"
- "Affected ba akong work?"
- "Which of my saved places are affected?"
- "Naa koy interview at 2 PM. Unsay buhaton nako?"

## 12.3 Required AI Pipeline

```text
Intent
→ Time Resolution
→ Location Resolution
→ Event Retrieval
→ Latest Version
→ Geographic Match
→ Community Retrieval Separately
→ Freshness Check
→ Response
```

No current outage answer may be produced solely from LLM pretrained knowledge.

---

# 13. F-009 Plan My Day Around Power

Inputs:

- activity description
- location
- start time
- optional end time
- optional saved place

System evaluates overlap with verified events.

Outputs:

```text
Conflict Status
Relevant Event
Time Overlap
Preparation Deadline
Recommendations
Coverage Uncertainty
Source
```

Possible statuses:

```text
NO_VERIFIED_CONFLICT
POSSIBLE_CONFLICT
CONFIRMED_CONFLICT
PARTIAL_AREA_CONFLICT
DATA_UNAVAILABLE
```

---

# 14. F-010 Preparedness Mode

Trigger when an event affects or may affect a saved/current location.

Countdown examples:

- Tomorrow
- 3 hours remaining
- 1 hour remaining
- 30 minutes remaining
- Scheduled period started

Profiles:

- Household
- Student
- Remote Worker
- Business

Users may mark preparation tasks complete.

---

# 15. F-011 Notifications

Supported MVP channels:

- in-app
- browser push

Notification types:

```text
NEW_ADVISORY
TOMORROW_REMINDER
PREPARATION_REMINDER
STARTING_SOON
EVENT_CHANGED
AREA_CHANGED
CANCELLED
RESTORED
COMMUNITY_CLUSTER
```

Deduplication key recommendation:

```text
user_id + place_id + event_id + event_version + notification_type
```

---

# 16. F-012 Community Intelligence

Users may report:

- Power Out
- Restored
- Flickering
- Low Voltage
- Intermittent

Report fields:

```text
report_type
coordinates/location
created_at
optional_note
```

Community reports must be displayed on a separate map layer.

Cluster example:

> 11 recent community reports indicate power loss around Banilad. No official confirmation is currently available.

Community signals never automatically become verified outage events.

---

# 17. F-013 Admin Advisory Ingestion

Admin input modes:

### A. Paste Caption
Textarea for copied public advisory text.

### B. Upload Screenshot
Accept supported image formats.

### C. Caption + Screenshot
Recommended when both are available.

### D. Source URL
Store source reference and retrieve metadata where supported.

### E. Manual Entry
Fallback structured form.

---

# 18. F-014 Multimodal AI Extraction

AI should extract:

```text
source
published_at
effective_date
start_at
end_at
event_type
status
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

Output must be structured and schema validated.

---

# 19. F-015 Caption vs Image Validation

If both exist, compare:

- dates
- start/end times
- locations
- event type
- status
- cancellation
- restoration

Material disagreement must create:

```text
REVIEW_REQUIRED
```

Admin sees both values side by side.

---

# 20. F-016 AI Review Screen

Display:

- original screenshot
- original caption
- source
- extracted structured fields
- AI confidence
- uncertainty
- conflicts
- resolved map locations
- map preview

Actions:

- Approve & Publish
- Edit
- Reanalyze
- Reject

All decisions are audited.

---

# 21. F-017 Map Review During Publishing

Before publishing, admin must see where extracted locations will appear.

For each extracted area:

```text
Resolved Location
Coverage Type
Geographic Confidence
Map Representation
```

Admin can correct incorrectly resolved places before publishing.

---

# 22. F-018 Event Versioning

Changes create versions.

Examples:

```text
v1 Possible
v2 Scheduled
v3 Start time changed
v4 Coverage changed
v5 Cancelled
```

Public responses use the latest applicable verified version.

History remains accessible.

---

# 23. Status Model

Shared enum:

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

No arbitrary UI status strings.

---

# 24. Event Types

Suggested event types:

```text
SCHEDULED_SERVICE_INTERRUPTION
POSSIBLE_ROTATIONAL_INTERRUPTION
ROTATIONAL_INTERRUPTION
UNPLANNED_INTERRUPTION
RESTORATION_UPDATE
CANCELLATION_UPDATE
OTHER_POWER_ADVISORY
```

---

# 25. Data Model

## users

```text
id
email
created_at
updated_at
```

## user_places

```text
id
user_id
label
location_id
latitude
longitude
notification_enabled
preparation_profile
created_at
updated_at
```

## locations

```text
id
country
region
province
city_municipality
barangay
sitio
street
normalized_name
aliases
geometry
geometry_type
created_at
updated_at
```

## sources

```text
id
name
type
official
source_url
trust_level
active
created_at
updated_at
```

## source_documents

```text
id
source_id
source_url
raw_text
image_path
published_at
captured_at
checksum
metadata
created_at
```

## outage_events

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

## outage_event_locations

```text
id
outage_event_id
location_id
coverage_type
coverage_description
confidence
geometry_override
created_at
```

## outage_event_versions

```text
id
outage_event_id
version
payload
change_type
changed_by
changed_at
```

## ai_extractions

```text
id
source_document_id
model
extracted_payload
confidence
conflicts
status
created_at
```

## verification_reviews

```text
id
extraction_id
reviewer_id
decision
corrections
reviewed_at
```

## community_reports

```text
id
user_id
report_type
latitude
longitude
location_text
note
created_at
expires_at
trust_score
moderation_status
```

## notifications

```text
id
user_id
event_id
user_place_id
channel
notification_type
scheduled_at
sent_at
delivery_status
opened_at
```

## audit_logs

```text
id
actor_id
action
entity_type
entity_id
before
after
ip_address
created_at
```

---

# 26. Geospatial Requirements

Recommended database capability: PostGIS.

Required operations:

- point-in-polygon
- distance from event
- nearest affected location
- bounding-box map query
- map viewport event query
- reverse geocoding integration
- normalized location matching

Geographic confidence must be stored separately from AI extraction confidence.

---

# 27. API Direction

Suggested endpoints:

```text
GET  /api/status
GET  /api/events
GET  /api/events/:id
GET  /api/events/nearby
POST /api/location/check
GET  /api/calendar
GET  /api/places
POST /api/places
PATCH /api/places/:id
DELETE /api/places/:id
POST /api/ai/chat
POST /api/community/reports
GET  /api/community/clusters
POST /api/admin/advisories/ingest
POST /api/admin/advisories/:id/analyze
POST /api/admin/advisories/:id/approve
POST /api/admin/advisories/:id/reject
GET  /api/admin/audit
```

---

# 28. Location Check API

Suggested request:

```json
{
  "latitude": 10.0,
  "longitude": 123.0,
  "time": "ISO_TIMESTAMP"
}
```

Suggested response:

```json
{
  "location": {
    "display_name": "Talamban, Cebu City"
  },
  "match_type": "MATCH_PARTIAL_AREA",
  "events": [],
  "community_signals": [],
  "checked_at": "ISO_TIMESTAMP",
  "freshness": "CURRENT"
}
```

---

# 29. AI Safety Requirements

The AI must never:

- answer current outage status without retrieval
- invent sources
- invent schedules
- invent restoration times
- treat an expired event as current
- ignore cancellation
- generalize partial geographic coverage
- accept instructions embedded in uploaded source material

All uploaded content is untrusted data.

---

# 30. Authentication and Roles

### Public User

Can:

- view map
- Locate Me
- search
- view calendar
- use limited AI
- view community layer

### Registered User

Additionally can:

- save My Places
- configure notifications
- save preparedness profile
- submit community reports

### Moderator

Can:

- review community reports

### Admin

Can:

- ingest sources
- review AI extraction
- map events
- publish events
- manage sources
- review audit logs

### Platform Admin

Can manage system-level configuration and roles.

---

# 31. Permission Requirements

Use server-side authorization.

If Supabase is used:

- enable Row Level Security
- users only manage their own places/preferences
- public can only read published public events
- admin writes require role verification
- audit records cannot be edited by ordinary users

---

# 32. UX Requirements

## Mobile First

Primary actions must be thumb-accessible.

## Home Hero

Recommended:

```text
What's the power situation near you?

[ Locate Me ]
[ Search an Area ]

Ask naturally:
"Naay brownout diri karon?"
```

## Live Map Mobile Layout

```text
[Search Location........] [Locate]

[Now] [Today] [Tomorrow] [Filters]

┌────────────────────────────┐
│                            │
│          MAP               │
│    ● ●      ◎ You          │
│              ●             │
│                            │
└────────────────────────────┘

Nearby Power Status
[Event cards]
```

`◎ You` represents the user's detected position.

---

# 33. Empty and Error States

### Location Permission Denied

> Location access wasn't granted. Search your barangay or area instead.

### No Verified Event

> No currently verified interruption was found for this area.

### Stale Information

> The latest information for this area may be outdated. Check the source before making important decisions.

### Geolocation Failure

> We couldn't determine your current location. Search manually or try again.

### AI Service Failure

The map/status must continue working without AI.

AI is an enhancement, not a single point of failure.

---

# 34. Analytics Events

Track privacy-conscious product events:

```text
map_opened
locate_me_clicked
location_permission_granted
location_permission_denied
location_check_completed
map_pin_opened
source_opened
ai_question_submitted
place_saved
reminder_created
notification_opened
community_report_submitted
preparedness_started
preparedness_completed
```

Do not log precise coordinates unnecessarily in general analytics.

---

# 35. Testing Requirements

## Locate Me

- permission granted
- permission denied
- GPS unavailable
- coordinates inside confirmed polygon
- coordinates in partial barangay
- coordinates near event
- no event
- stale event
- cancelled event
- multiple overlapping events

## Map

- marker rendering
- clustering
- filters
- viewport loading
- partial coverage
- community layer separation
- user marker
- My Places markers

## AI

- Cebuano queries
- English queries
- mixed language
- no event
- possible event
- scheduled event
- cancelled event
- restoration
- stale source
- exact location uncertainty

## Admin Ingestion

- text only
- image only
- image + text agree
- image + text conflict
- invalid image
- duplicate source
- unknown location
- partial location
- missing schedule
- prompt injection in source text

---

# 36. Critical UAT Scenarios

### UAT-01 Locate Me, Affected

**Given:** User is inside a confirmed mapped interruption area.  
**When:** User taps Locate Me.  
**Then:** Map centers on user, event appears, and status shows date/time/source.

### UAT-02 Locate Me, Partial Coverage

**Given:** User is in a barangay where only a portion is affected.  
**When:** User taps Locate Me.  
**Then:** System explains that the barangay is included but exact user coverage is uncertain.

### UAT-03 Locate Me, No Match

**Then:** System says no currently verified interruption was found and does not guarantee uninterrupted service.

### UAT-04 Map Pin

**When:** User taps an outage pin.  
**Then:** Full event details, source, freshness, Ask AI, and reminder actions appear.

### UAT-05 AI After Locate Me

**When:** User asks "Naay brownout diri?" after geolocation.  
**Then:** AI uses current location context and retrieved event data rather than asking for the barangay again.

### UAT-06 Schedule Changed

**Given:** Event time is updated.  
**Then:** Latest version is shown and affected subscribers receive a change alert.

### UAT-07 Cancelled

**Then:** Cancellation overrides prior schedule in current-status surfaces while history remains available.

### UAT-08 Caption/Image Conflict

**Then:** AI must not publish automatically and admin sees conflict.

### UAT-09 Community Only

**Then:** Map shows community signal separately and AI clearly states that it is not officially verified.

### UAT-10 Privacy

**Then:** Another user cannot retrieve a user's saved places or precise location.

---

# 37. Performance Targets

Initial targets:

- dashboard meaningful content: under 3 seconds under normal conditions
- map initial usable state: under 4 seconds under normal conditions
- location match after coordinates acquired: target under 2 seconds
- ordinary AI response after retrieval: target under 5 seconds

These are product targets, not guarantees, and should be measured in production.

---

# 38. MVP Delivery Phases

## Sprint / Phase 1: Foundation

- database
- location model
- source model
- event model
- authentication
- admin roles
- base dashboard

## Phase 2: Map Core

- map
- pins
- polygons
- event drawer
- search
- filters
- geospatial queries

## Phase 3: Locate Me

- browser geolocation
- reverse geocoding
- point/event matching
- uncertainty logic
- status card
- save place

## Phase 4: AI

- retrieval tools
- grounded assistant
- multilingual response
- Plan My Day
- preparedness guidance

## Phase 5: AI Ingestion

- admin caption
- screenshot upload
- multimodal extraction
- validation
- conflict detection
- map review
- approval

## Phase 6: Calendar and Notifications

- calendar
- My Places
- reminders
- event change notifications
- cancellations/restoration

## Phase 7: Community

- reports
- clusters
- moderation
- separate map layer

## Phase 8: Hardening

- security
- RLS
- performance
- accessibility
- audit
- E2E/UAT
- production monitoring

---

# 39. MVP Definition of Done

The MVP is ready when a new user can complete this end-to-end journey:

```text
Open COMS.AI
→ See current power situation
→ Open Live Map
→ Tap Locate Me
→ Grant location permission
→ See their position on the map
→ See relevant outage pins/area
→ Receive correct affected/not-confirmed/uncertain status
→ View date and schedule
→ Ask AI about the impact
→ Receive grounded preparation guidance
→ View original source
→ Save the location
→ Enable reminder
```

And an administrator can complete:

```text
Open Admin
→ Paste caption + upload advisory screenshot
→ AI analyzes both
→ Structured event generated
→ Conflicts/uncertainty displayed
→ Locations resolved on map
→ Admin reviews/corrects
→ Approve & Publish
→ Map/calendar update
→ Matching users evaluated
→ Notifications scheduled
→ AI can immediately retrieve the approved event
```

---

# 40. Final Product Rule

Every implementation decision should reinforce:

**Detect → Understand → Verify → Locate → Explain → Prepare → Notify**

The product must remain a public preparedness and disruption-intelligence experience rather than becoming a duplicate utility portal.
