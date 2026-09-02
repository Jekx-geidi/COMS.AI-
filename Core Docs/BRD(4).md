# BRD.md

# COMS.AI
## Business Requirements Document

**Version:** 1.0  
**Status:** Proposed MVP  
**Market:** Cebu, Philippines  
**Product Type:** AI-Centered Power Preparedness and Community Intelligence Platform  
**Primary Goal:** Help people understand, locate, prepare for, and receive timely awareness about power interruptions.

---

## 1. Executive Summary

COMS.AI is a public-facing, mobile-first web application designed to make power interruption information easier to discover, understand, visualize, and act on.

The product is not intended to replace an electricity provider's customer application. Instead, it provides an independent preparedness and disruption-intelligence layer centered on location, AI, maps, reminders, multi-location awareness, and practical preparation.

The platform converts verified advisories and approved community signals into structured events that can power:

- an interactive outage map
- visible outage pins and affected-area overlays
- a **Locate Me** GPS feature
- an AI Power Assistant
- today/tomorrow/weekly outage calendars
- multiple saved locations
- personalized reminders
- preparation guidance
- advisory change and cancellation alerts
- community outage signals
- historical power-interruption intelligence

A user should be able to open the platform, tap **Locate Me**, permit location access, and immediately receive an AI-supported answer such as:

> A verified scheduled power interruption affects part of your current area today from 1:00 PM to 4:00 PM. Your detected location is within or near the mapped affected zone. The latest verified update was recorded at 10:20 AM.

If there is no verified matching interruption, the application must say that no currently verified interruption was found. It must never guarantee that an outage cannot occur merely because no advisory exists.

---

## 2. Business Problem

Power interruption information may be available through utility websites, social media, graphics, government announcements, or other public sources, but availability does not guarantee awareness.

Residents may experience the following problems:

1. They do not see the announcement before the interruption.
2. Advisories can contain long lists of barangays, streets, schedules, and exceptions.
3. Information may be embedded in an image.
4. Users may not know whether their exact location is included.
5. A resident may care about home, work, school, and family locations simultaneously.
6. Schedules can change or be cancelled.
7. People forget advisories they saw earlier.
8. Existing information tells users what is happening but may not help them prepare.
9. Community outages may be observed before an official update becomes available.
10. Historical interruption information is difficult to understand geographically.

The central business problem is therefore:

> **Power interruption information is fragmented and insufficiently personalized, contextualized, visualized, and actionable for ordinary Cebu residents.**

---

## 3. Business Opportunity

COMS.AI can transform an unstructured public advisory into a personalized public-awareness experience.

```text
Verified Source
    ↓
AI Ingestion and Extraction
    ↓
Human / Source Verification
    ↓
Structured Outage Event
    ↓
Geographic Matching
    ↓
Map + Calendar + Locate Me
    ↓
AI Impact Interpretation
    ↓
Preparation + Notification
```

The product creates value not by producing electricity information itself, but by reducing the effort between publication and meaningful public action.

---

## 4. Vision

Build Cebu's most accessible AI-centered power preparedness platform where a person can immediately understand:

- What is happening?
- Where is it happening?
- Is my current location affected?
- Are my saved places affected?
- When will it start?
- What is the scheduled end time?
- Is the information confirmed, possible, changed, or cancelled?
- What should I prepare?
- What is the original source?
- When was the information last verified?

---

## 5. Product Positioning

COMS.AI shall be positioned as:

> **An AI-powered public preparedness and disruption intelligence platform for Cebu.**

It shall not position itself as an official electricity provider or utility account application.

### Differentiation

| Traditional Utility Experience | COMS.AI |
|---|---|
| Utility/account centered | Resident and preparedness centered |
| Account-linked properties | Current GPS location + multiple life locations |
| Official notices | Verified multi-source intelligence |
| Advisory reading | AI interpretation |
| Basic outage information | Impact and preparation guidance |
| Property monitoring | Home, school, work, business, family locations |
| Static announcement | Map, calendar, AI, reminders, change tracking |
| Provider-centric | Community-accessible |

---

## 6. Business Objectives

### BO-01 Public Awareness
Increase the number of people who discover relevant interruption information before an interruption occurs.

### BO-02 Location Accessibility
Allow users to determine their status through map search, GPS, saved locations, and common Cebu place names.

### BO-03 Preparedness
Provide sufficient notice and contextual guidance to help residents prepare.

### BO-04 Information Simplification
Use AI to convert complex captions and images into understandable structured information.

### BO-05 Trust
Keep every current-status answer grounded in verified records with visible source and freshness information.

### BO-06 Community Intelligence
Allow community signals to improve situational awareness without misrepresenting them as official information.

### BO-07 Multi-Location Awareness
Allow users to monitor places important to their daily life.

### BO-08 Expandability
Design the core architecture so it can later support other Cebu public disruptions.

---

## 7. Target Users

### Residents
Need quick answers about their present area and home.

### Students
Need to plan classes, charging, assignments, and internet access.

### Remote Workers
Need to protect meetings, connectivity, devices, and productivity.

### Households
Need to prepare lighting, refrigeration, devices, water pumps, and family needs.

### Businesses
Need to plan staff, equipment, refrigeration, customers, and operations.

### Multi-Location Users
Need simultaneous monitoring of home, work, school, business branches, dormitories, and family locations.

### Barangays / Community Leaders
Need accessible, shareable, verified interruption information.

### Platform Administrators
Need controlled AI ingestion, review, mapping, publishing, and monitoring.

---

## 8. Core Business Requirements

### BR-001 Public Dashboard
The system shall provide a public dashboard showing current, upcoming, recently changed, restored, and cancelled interruption information.

### BR-002 Interactive Power Map
The system shall provide an interactive Cebu map showing power interruption events using pins, markers, and affected-area overlays where geographic data permits.

### BR-003 Outage Pins
Each relevant interruption shall be represented by one or more map pins or geographic areas.

A map marker may show:

- status
- location
- date
- start time
- scheduled end time
- interruption type
- affected coverage
- source
- verification timestamp

### BR-004 Locate Me
The map shall provide a prominent **Locate Me** control.

When activated and permission is granted, the system shall:

1. obtain the device's current coordinates
2. center the map on the user
3. display a distinct user-location marker
4. resolve the coordinates into a useful place description
5. compare the point with current and upcoming mapped interruption areas
6. retrieve matching verified events
7. show an immediate status card
8. make the result available to the AI assistant

### BR-005 AI Location Answer
After Locate Me succeeds, the AI shall be capable of answering automatically or on request:

- whether a verified interruption affects the detected area
- status
- date
- start time
- scheduled end time
- estimated/scheduled duration when derivable
- affected coverage
- source
- last verification time
- relevant preparation guidance

### BR-006 Geospatial Uncertainty
If the advisory only identifies a portion of an area, the platform shall not claim that the user's exact coordinates are definitely affected unless the source provides sufficient geographic detail.

The UI shall distinguish:

- Inside confirmed mapped area
- Near affected area
- Same barangay but exact coverage uncertain
- Outside mapped area
- Unable to determine

### BR-007 Location Search
Users shall be able to search barangays, cities, municipalities, streets, and supported landmarks.

### BR-008 Map Filters
Users shall be able to filter the map by:

- Now
- Today
- Tomorrow
- This Week
- Ongoing
- Scheduled
- Possible
- Restored
- Community Reports

### BR-009 Brownout Calendar
The platform shall provide Today, Tomorrow, Weekly, and Monthly schedule views.

### BR-010 My Places
Authenticated users shall be able to save multiple important locations and label them.

### BR-011 AI Power Impact Assistant
The platform shall provide a multilingual AI assistant grounded in approved platform records.

### BR-012 Plan My Day Around Power
Users shall be able to describe an activity and receive AI assistance identifying interruption conflicts and preparation steps.

### BR-013 Preparedness Mode
The platform shall provide countdowns and context-specific preparation checklists for approaching interruptions.

### BR-014 Notifications
Users shall be able to receive relevant notifications for saved locations and verified event changes.

### BR-015 Advisory Ingestion
Administrators shall be able to add an advisory through text, image, combined text/image, URL, or structured manual entry.

### BR-016 Multimodal AI Analysis
AI shall analyze uploaded advisory screenshots and captions and extract structured event information.

### BR-017 Conflict Detection
If image and text disagree on material information, the system shall flag the event for human review.

### BR-018 Human Verification
Critical or uncertain AI-extracted public information shall require an authorized review before publication.

### BR-019 Source Transparency
Published events shall retain the original source, source URL when available, publication timestamp, and verification timestamp.

### BR-020 Advisory Version History
Changes, cancellations, restorations, and corrections shall create traceable event versions rather than silently replacing historical information.

### BR-021 Community Reporting
Users may report power loss, restoration, flickering, low voltage, or intermittent service.

### BR-022 Community Separation
Community reports shall never be displayed as official/verified information unless independently verified.

### BR-023 Daily Power Brief
The system should generate a concise daily power brief based on verified records and separately labeled community signals.

### BR-024 Historical Intelligence
The platform should maintain historical interruption data to support descriptive reliability analytics.

---

## 9. Map Experience Business Requirements

The map is a primary accessibility feature, not decorative visualization.

### Required Map Elements

- Cebu geographic view
- interruption pins
- affected-area polygons when available
- user GPS marker
- Locate Me button
- search box
- current-status legend
- time filter
- status filter
- marker clustering at low zoom
- event detail card
- source button
- last verified timestamp
- My Places markers
- community signal layer

### Pin Interaction

Selecting a pin should open a card containing:

```text
Location
Status
Interruption Type
Date
Start Time
Scheduled End Time
Affected Coverage
Reason
Latest Update
Source
Last Verified
Ask AI About This
```

### Locate Me Result Example

```text
Your Location
Talamban, Cebu City

Status: Scheduled Interruption Nearby
Date: September 4, 2026
Time: 1:00 PM - 4:00 PM
Coverage: Part of Talamban

Your detected location is within the same affected area, but the source does not provide street-level boundaries. Check the affected-location details before relying on exact coverage.

Last Verified: 10:20 AM
```

---

## 10. AI Business Requirements

AI shall act as an interpretation layer, not the operational source of truth.

The required flow is:

```text
User Intent
→ Location Resolution
→ Time Resolution
→ Verified Event Retrieval
→ Geographic Matching
→ Temporal Rules
→ Source/Freshness Check
→ AI Explanation
```

AI shall support Cebuano, English, Tagalog, and mixed-language conversations.

AI shall never:

- fabricate interruptions
- invent restoration times
- claim no interruption is possible merely because no event exists
- expand partial coverage into whole-area coverage
- treat community reports as official
- hide stale information
- describe AI-generated interpretation as an official statement

---

## 11. Notification Business Requirements

Notification types may include:

- New advisory
- Scheduled tomorrow
- Preparation reminder
- Starting soon
- Schedule changed
- Affected area changed
- Cancelled
- Restored
- Significant community signal

Users should control notification preferences by saved place.

---

## 12. Administrative Business Requirements

Administrators require:

- dashboard
- advisory inbox
- image upload
- text/caption input
- source URL field
- AI extraction preview
- confidence display
- conflict display
- map/location preview
- edit
- approve and publish
- reject
- reanalyze
- event management
- event version history
- community moderation
- notification monitoring
- analytics
- audit logs

---

## 13. Data and Trust Requirements

The system shall use persistent structured storage for operational information.

Core data categories:

- outage events
- event locations
- event versions
- sources
- source documents
- AI extractions
- verification decisions
- users
- saved places
- notifications
- community reports
- geospatial data
- audit logs

LLM memory shall not be used as the primary source of current outage truth.

---

## 14. Non-Functional Requirements

### Availability
The public interface should tolerate traffic spikes during widespread interruptions.

### Mobile First
The primary user journey must work comfortably on a mobile browser.

### Performance
Map and location-status results should appear quickly after location permission is granted.

### Accessibility
Status shall use text/icons in addition to color.

### Security
Admin functionality requires authorization and audit logging.

### Privacy
Precise user coordinates shall not be publicly exposed or retained unnecessarily.

### Reliability
Every current-status answer shall be traceable to stored information.

### Timezone
Cebu-facing date/time interpretation shall use Asia/Manila.

---

## 15. MVP Scope

### Included

- public dashboard
- interactive Cebu map
- outage pins
- affected-area overlays where available
- Locate Me
- GPS-to-outage matching
- AI location status response
- location search
- Today/Tomorrow/Week calendar
- My Places
- AI Power Impact Assistant
- Plan My Day Around Power
- preparedness guidance
- admin text ingestion
- admin screenshot ingestion
- multimodal extraction
- human review
- structured event storage
- source transparency
- event versioning
- browser/in-app notifications
- map filters
- community reporting basic version

### Excluded from MVP

- utility billing
- bill payments
- consumption billing
- authoritative outage prediction
- automatic emergency declarations
- guaranteed restoration predictions
- fully autonomous publication of conflicting or low-confidence AI results

---

## 16. Future Potential

The platform may eventually become **Cebu Disruption Intelligence**, using the same architecture for:

- water interruptions
- flooding
- road closures
- telecom outages
- traffic disruptions
- class suspensions
- weather advisories
- emergency announcements

The reusable engine becomes:

```text
Public Information
→ AI Understanding
→ Verification
→ Structured Event
→ Geographic Matching
→ Personal Impact
→ Preparation
→ Notification
```

---

## 17. Success Metrics

### Awareness
- users notified before scheduled interruptions
- notification open rate
- map usage
- Locate Me usage
- saved locations

### AI Quality
- grounded answer rate
- extraction accuracy
- schedule accuracy
- location accuracy
- administrator correction rate
- hallucination rate

### Map Quality
- successful geolocation rate
- successful location resolution rate
- event-to-map matching accuracy
- false geographic match rate

### Operations
- time from source ingestion to review
- time from approval to public availability
- notification latency

### Community
- valid reports
- duplicate rate
- false-report rate
- meaningful clusters

---

## 18. Business Risks and Mitigation

### Incorrect AI Extraction
Mitigation: schema validation, confidence scoring, source comparison, human review.

### Outdated Information
Mitigation: freshness timestamps, event versioning, source monitoring, stale-data warnings.

### GPS False Precision
Mitigation: represent partial/uncertain coverage explicitly and never imply street-level certainty without evidence.

### Community Misinformation
Mitigation: separation from verified data, clustering, rate limits, moderation, expiry.

### Product Confusion with Utility Provider
Mitigation: clear independent-platform branding and visible original sources.

### Privacy
Mitigation: minimize coordinate retention, secure saved places, no public exposure of personal location history.

---

## 19. Definition of Business Success

COMS.AI succeeds when a resident does not need to manually inspect multiple posts just to understand whether a disruption may affect them.

The ideal journey is:

```text
Open App
→ Tap Locate Me
→ See Current Location
→ See Nearby/Affected Pins
→ AI Checks Verified Data
→ Receive Clear Status + Date + Time
→ Understand Coverage and Source
→ Prepare or Set Reminder
```

The platform's core promise is:

> **Do not make people search for the warning. Bring understandable, location-aware, verified disruption intelligence to the people who need it.**
