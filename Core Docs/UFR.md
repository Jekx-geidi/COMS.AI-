# UFR.md

# COMS.AI
## Cebu Outage Monitoring & Intelligence System
### User and Functional Requirements

**Version:** 1.0  
**Status:** Implementation Ready

---

# 1. Purpose

This document defines the user-facing and system functional requirements for COMS.AI.

Requirement priorities use:

- **MUST** - required for MVP or system safety
- **SHOULD** - important but may be phased
- **COULD** - optional/future enhancement

---

# 2. Public Access Requirements

## UFR-001
**Priority:** MUST  
The system shall allow users to access the public outage dashboard without creating an account.

## UFR-002
**Priority:** MUST  
The system shall display the latest verified Cebu power interruption status.

## UFR-003
**Priority:** MUST  
The system shall show a visible last-verified timestamp for current outage information.

## UFR-004
**Priority:** MUST  
The system shall provide access to source information for verified outage events.

---

# 3. Live Map Requirements

## UFR-010
**Priority:** MUST  
The system shall provide an interactive map focused on Cebu.

## UFR-011
**Priority:** MUST  
The map shall display verified outage events using location pins, polygons, or appropriate geographic overlays.

## UFR-012
**Priority:** MUST  
Each map marker shall show an outage status.

## UFR-013
**Priority:** MUST  
The map shall distinguish:
- ongoing
- confirmed
- scheduled
- possible
- restoring
- restored
- cancelled
- unknown
- community reported

## UFR-014
**Priority:** MUST  
The map shall not mark an entire barangay as confirmed affected when the verified source only states "portion of" the barangay.

## UFR-015
**Priority:** MUST  
Partial area coverage shall be represented using:
- partial overlay
- point markers
- coverage description
- uncertainty label

## UFR-016
**Priority:** MUST  
Users shall be able to tap a map marker or affected area to view:
- location
- status
- date
- start time
- end time
- duration when known
- reason
- source
- last verified timestamp

## UFR-017
**Priority:** SHOULD  
Users shall be able to filter the map by:
- date
- event status
- city/municipality
- barangay
- official vs community data

## UFR-018
**Priority:** SHOULD  
The map shall visually cluster dense markers at lower zoom levels.

---

# 4. Locate Me Requirements

## UFR-020
**Priority:** MUST  
The system shall provide a clearly visible **Locate Me** action.

## UFR-021
**Priority:** MUST  
The system shall request browser/device geolocation permission only after the user activates Locate Me or another location-dependent feature.

## UFR-022
**Priority:** MUST  
If permission is granted, the system shall retrieve the user's current latitude and longitude.

## UFR-023
**Priority:** MUST  
The system shall resolve the detected coordinates into a readable Cebu location when possible.

## UFR-024
**Priority:** MUST  
The system shall compare the detected coordinates against current verified outage coverage.

## UFR-025
**Priority:** MUST  
The location matching engine shall support:
- point-in-polygon matching
- distance-to-event matching
- administrative location matching
- partial coverage handling

## UFR-026
**Priority:** MUST  
The system shall classify the result as one of:

```text
MATCH_CONFIRMED
MATCH_PARTIAL_AREA
MATCH_NEARBY
NO_VERIFIED_MATCH
DATA_STALE
```

## UFR-027
**Priority:** MUST  
When MATCH_CONFIRMED occurs, the system shall display:
- detected area
- outage status
- date
- start time
- end time
- duration when known
- source
- last verified timestamp

## UFR-028
**Priority:** MUST  
When MATCH_PARTIAL_AREA occurs, the system shall explicitly state that the user's exact point cannot be confirmed as affected from the available source.

## UFR-029
**Priority:** MUST  
When no verified match exists, the system shall say:

> No currently verified power interruption was found for your detected location.

The system shall not guarantee that power will remain available.

## UFR-030
**Priority:** MUST  
When location permission is denied, the system shall offer manual search instead of blocking access.

---

# 5. Location Search Requirements

## UFR-040
**Priority:** MUST  
Users shall be able to search for Cebu locations by text.

## UFR-041
**Priority:** MUST  
Search shall support:
- city
- municipality
- barangay
- street where available
- sitio where available
- known landmark aliases

## UFR-042
**Priority:** SHOULD  
The system shall normalize informal location names such as:
- IT Park
- Ayala
- Colon
- SM Cebu
- USC Talamban

## UFR-043
**Priority:** MUST  
If a query is materially ambiguous, the system shall present likely matches instead of silently selecting one.

---

# 6. Calendar Requirements

## UFR-050
**Priority:** MUST  
The system shall provide an outage calendar.

## UFR-051
**Priority:** MUST  
Calendar views shall include:
- Today
- Tomorrow
- 7 Days
- Month

## UFR-052
**Priority:** MUST  
Each calendar event shall show:
- location
- status
- start time
- end time
- event type

## UFR-053
**Priority:** SHOULD  
Users shall be able to filter the calendar by location and status.

---

# 7. AI Assistant Requirements

## UFR-060
**Priority:** MUST  
The system shall provide an AI-powered outage assistant.

## UFR-061
**Priority:** MUST  
The AI assistant shall support:
- Cebuano/Bisaya
- English
- Tagalog/Filipino
- code-switched language

## UFR-062
**Priority:** MUST  
The AI shall retrieve verified structured outage data before answering current outage questions.

## UFR-063
**Priority:** MUST  
The AI shall not use general model knowledge as the source of current outage status.

## UFR-064
**Priority:** MUST  
The AI shall preserve status distinctions such as:
- possible
- scheduled
- confirmed
- ongoing
- cancelled
- restored

## UFR-065
**Priority:** MUST  
The AI shall preserve partial geographic uncertainty.

## UFR-066
**Priority:** MUST  
The AI shall not invent:
- restoration times
- affected streets
- outage dates
- outage durations
- utility statements

## UFR-067
**Priority:** MUST  
Current-status responses shall include or expose:
- source
- last verified time
- relevant event status

## UFR-068
**Priority:** MUST  
If outage data retrieval fails, the AI shall not answer from memory.

## UFR-069
**Priority:** MUST  
The AI shall support follow-up questions about the currently selected map event or location.

---

# 8. Plan My Day Around Power Requirements

## UFR-070
**Priority:** MUST  
The AI shall allow users to describe an activity, location, and time.

## UFR-071
**Priority:** MUST  
The system shall check whether the activity overlaps with a verified outage event.

## UFR-072
**Priority:** MUST  
The result shall use one of:
- NO_VERIFIED_CONFLICT
- POSSIBLE_CONFLICT
- CONFIRMED_CONFLICT
- PARTIAL_AREA_CONFLICT
- DATA_UNAVAILABLE

## UFR-073
**Priority:** MUST  
The AI may recommend:
- earlier preparation
- device charging
- backup internet
- schedule adjustment
- relocation consideration
- business contingency steps

## UFR-074
**Priority:** MUST  
The AI shall not claim an alternative location has electricity unless verified.

---

# 9. My Places Requirements

## UFR-080
**Priority:** MUST  
Registered users shall be able to save important places.

## UFR-081
**Priority:** MUST  
Users shall be able to assign labels such as:
- Home
- School
- Work
- Business
- Parents' Home
- Custom

## UFR-082
**Priority:** MUST  
Users shall be able to:
- add
- edit
- delete
- enable/disable alerts for saved places

## UFR-083
**Priority:** MUST  
The system shall evaluate saved places against newly published verified events.

## UFR-084
**Priority:** MUST  
Users shall be able to view a current status summary for all saved places.

---

# 10. Preparedness Requirements

## UFR-090
**Priority:** MUST  
The system shall provide preparedness guidance for upcoming interruptions.

## UFR-091
**Priority:** MUST  
Preparedness guidance shall support at least:
- Household
- Student
- Remote Worker
- Business

## UFR-092
**Priority:** SHOULD  
Users shall be able to check off preparedness tasks.

## UFR-093
**Priority:** MUST  
The system shall not provide unsafe electrical repair instructions.

---

# 11. Notification Requirements

## UFR-100
**Priority:** MUST  
Registered users shall be able to receive notifications for saved locations.

## UFR-101
**Priority:** MUST  
Supported MVP notification channels shall include:
- in-app
- browser push

## UFR-102
**Priority:** MUST  
Notification types shall include:
- new advisory
- upcoming interruption
- preparation reminder
- schedule changed
- cancellation
- restoration

## UFR-103
**Priority:** SHOULD  
The system may notify users about significant community clusters separately from official notifications.

## UFR-104
**Priority:** MUST  
Notifications shall be deduplicated.

## UFR-105
**Priority:** MUST  
A schedule update shall trigger a new notification only when it materially affects the user.

---

# 12. Community Reporting Requirements

## UFR-110
**Priority:** SHOULD  
Registered users shall be able to submit community power reports.

## UFR-111
**Priority:** SHOULD  
Report types shall include:
- Power Out
- Power Restored
- Flickering
- Low Voltage
- Intermittent Power

## UFR-112
**Priority:** MUST  
Community reports shall be labeled as non-official.

## UFR-113
**Priority:** MUST  
Community reports shall never automatically become verified outage events.

## UFR-114
**Priority:** SHOULD  
The system shall cluster reports based on:
- geographic proximity
- time
- report type

## UFR-115
**Priority:** SHOULD  
The system shall apply:
- rate limits
- duplicate detection
- abuse prevention
- report expiry

---

# 13. Admin Ingestion Requirements

## UFR-120
**Priority:** MUST  
Authorized admins shall be able to create advisory drafts using:
- pasted text
- uploaded image
- text + image
- source URL
- manual structured entry

## UFR-121
**Priority:** MUST  
Original source content shall be preserved.

## UFR-122
**Priority:** MUST  
The AI extraction engine shall extract:
- event type
- status
- published date/time
- effective date
- start time
- end time
- locations
- coverage type
- reason
- cancellation
- restoration
- confidence

## UFR-123
**Priority:** MUST  
AI extraction shall produce schema-valid structured output.

## UFR-124
**Priority:** MUST  
The system shall compare extracted image and caption values when both are provided.

## UFR-125
**Priority:** MUST  
Conflicting values shall be flagged for human review.

## UFR-126
**Priority:** MUST  
Low-confidence or conflicting advisories shall not automatically publish.

---

# 14. Admin Review Requirements

## UFR-130
**Priority:** MUST  
Admin review shall display:
- original source text
- original image
- extracted fields
- confidence
- uncertainties
- conflicts
- proposed map locations

## UFR-131
**Priority:** MUST  
Admin actions shall include:
- APPROVE & PUBLISH
- EDIT
- REANALYZE
- REJECT

## UFR-132
**Priority:** MUST  
Admin corrections shall be recorded.

## UFR-133
**Priority:** MUST  
The final published event shall identify the verifier and verification timestamp internally.

---

# 15. Admin Map Review Requirements

## UFR-140
**Priority:** MUST  
Admins shall be able to review AI-resolved outage locations on a map.

## UFR-141
**Priority:** MUST  
Admins shall be able to:
- move pins
- add/remove affected points
- adjust polygons
- mark partial coverage
- add coverage description

## UFR-142
**Priority:** MUST  
Published geographic data shall reflect the approved map state.

---

# 16. Advisory Versioning Requirements

## UFR-150
**Priority:** MUST  
Every material advisory change shall create a new version.

## UFR-151
**Priority:** MUST  
The system shall retain previous versions.

## UFR-152
**Priority:** MUST  
Supported change categories shall include:
- time changed
- date changed
- area changed
- status changed
- cancelled
- restored
- corrected

## UFR-153
**Priority:** MUST  
The latest verified version shall be used for public responses.

---

# 17. Data Freshness Requirements

## UFR-160
**Priority:** MUST  
Each verified event shall have freshness metadata.

## UFR-161
**Priority:** MUST  
The AI and UI shall identify stale information.

## UFR-162
**Priority:** MUST  
A stale event shall not be presented as definitely current.

---

# 18. Source Requirements

## UFR-170
**Priority:** MUST  
Each verified outage event shall be traceable to a source record.

## UFR-171
**Priority:** MUST  
The system shall store:
- source name
- source URL when available
- original text
- original image when provided
- captured timestamp
- published timestamp when known

## UFR-172
**Priority:** MUST  
AI interpretation shall be distinguishable from official source wording.

---

# 19. Historical Intelligence Requirements

## UFR-180
**Priority:** SHOULD  
The system shall retain historical interruption events.

## UFR-181
**Priority:** SHOULD  
Users may view historical outage trends by area.

## UFR-182
**Priority:** COULD  
The system may calculate a Power Resilience Score.

## UFR-183
**Priority:** MUST  
Historical analytics shall not be represented as guaranteed future predictions.

---

# 20. Public Sharing Requirements

## UFR-190
**Priority:** SHOULD  
Users shall be able to share a public outage event.

## UFR-191
**Priority:** SHOULD  
Shared content should include:
- location
- status
- date/time
- source
- COMS.AI public link

---

# 21. Authentication and Role Requirements

## UFR-200
**Priority:** MUST  
Public outage information shall not require authentication.

## UFR-201
**Priority:** MUST  
Saved places and notification preferences shall require authentication.

## UFR-202
**Priority:** MUST  
Admin functionality shall require authorized roles.

## UFR-203
**Priority:** MUST  
Unauthorized users shall not access admin ingestion, review, or publishing actions.

---

# 22. Audit Requirements

## UFR-210
**Priority:** MUST  
The system shall audit:
- advisory creation
- AI extraction
- admin correction
- approval
- rejection
- publication
- update
- cancellation
- map edits

## UFR-211
**Priority:** MUST  
Audit logs shall include actor, action, timestamp, and affected entity.

---

# 23. Accessibility Requirements

## UFR-220
**Priority:** MUST  
The system shall not rely on color alone to communicate outage status.

## UFR-221
**Priority:** MUST  
Map markers shall have accessible labels.

## UFR-222
**Priority:** MUST  
Critical outage information shall also be available in text form outside the map.

## UFR-223
**Priority:** MUST  
Locate Me results shall be readable without requiring map interaction.

---

# 24. MVP Functional Acceptance Summary

COMS.AI MVP is functionally acceptable when:

1. A public user can open the site and view current verified outage information.
2. A user can view outage pins/areas on a Cebu map.
3. A user can tap Locate Me and receive a location-aware outage result.
4. A user can search a location manually.
5. A user can view today/tomorrow/week interruption schedules.
6. The AI answers only from verified data.
7. Partial coverage is never falsely presented as exact coverage.
8. Admin can upload a screenshot and/or caption.
9. AI can extract structured outage information.
10. Admin can review map placement and approve publication.
11. Publication updates the map, calendar, dashboard, and AI retrieval layer.
12. Registered users can save places and receive alerts.
13. Changes and cancellations create new versions and alerts.
14. Source and freshness are visible.
