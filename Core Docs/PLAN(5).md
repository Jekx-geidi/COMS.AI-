# PLAN.md

# COMS.AI
## AI-Centered Power Preparedness and Community Intelligence Platform

Version: 1.0  
Status: Product Direction  
Primary Location: Cebu, Philippines  
Primary Objective: Public awareness, preparedness, and disruption intelligence  
Product Principle: Do not duplicate a utility app. Build an independent AI-powered preparedness and community intelligence layer.

---

## 1. Product Vision

COMS.AI is not intended to replace VECO, Visayan Electric, MobileAP, NGCP, or any official utility system.

The platform exists to solve a different problem:

> People may receive outage information, but they still lack context, personalization, preparedness guidance, multi-location awareness, and a simple way to understand how a power interruption affects their day.

The product should convert fragmented outage information into:

- understandable updates
- location-aware intelligence
- personalized preparedness
- AI-assisted planning
- community awareness
- source-grounded notifications
- historical reliability insights

The core product question is not only:

> "Is there a brownout?"

It is:

> "How will today's power situation affect me, and what should I do about it?"

---

## 2. Core Differentiation

COMS.AI must not behave like a clone of an electricity provider app.

### Utility App Focus

Typical utility applications focus on:

- customer accounts
- bills
- payments
- account-linked properties
- utility service interruptions
- consumption
- official notices

### COMS.AI Focus

COMS.AI should focus on:

- public access without requiring a utility account
- multiple saved life locations
- AI interpretation
- preparedness
- public awareness
- community signals
- multi-source intelligence
- location impact
- historical reliability
- personalized disruption planning

---

## 3. Product Positioning

### Recommended Positioning

**COMS.AI is an AI-powered public preparedness and disruption intelligence platform that helps Cebu residents understand, prepare for, and respond to power interruptions.**

### Recommended Tagline

**Know Before the Lights Go Out.**

Alternative:

**Understand. Prepare. Stay Powered.**

---

## 4. Core User Problems

The platform should solve the following problems:

1. Users do not always see official outage announcements.
2. Advisories may contain long lists of locations and schedules.
3. Important details may be posted as images instead of structured data.
4. Residents may not know whether their exact area is affected.
5. Users may forget interruptions announced hours or days earlier.
6. A user may care about multiple locations, not just one service account.
7. Information may change or be cancelled.
8. Residents may need guidance on how to prepare.
9. Businesses may need operational impact guidance.
10. Community-reported outages may appear before official confirmation.
11. Historical interruption patterns are difficult for residents to understand.
12. Different public sources may publish related but separate information.

---

## 5. Primary User Groups

### 5.1 General Residents
Need quick access to current and upcoming power interruption information.

### 5.2 Students
Need advance notice for classes, assignments, charging, and connectivity.

### 5.3 Remote Workers
Need planning for internet, devices, meetings, and alternative workplaces.

### 5.4 Households
Need preparation for refrigeration, lighting, devices, children, and elderly family members.

### 5.5 Small Businesses
Need operational preparation for staff, customers, equipment, refrigeration, and payments.

### 5.6 Multi-Location Users
Need awareness across home, school, work, parents' home, business branches, and other important places.

### 5.7 Barangays and Community Leaders
Need easy-to-share verified advisories.

### 5.8 Platform Administrators
Need controlled ingestion, AI extraction, verification, publishing, and audit tools.

---

## 6. Core Product Modules

### 6.1 Live Power Situation Dashboard

The dashboard should immediately answer:

- What is happening now?
- What areas are affected?
- What is scheduled later?
- What changed recently?
- When was the information last verified?

Suggested cards:

- Current Cebu Power Status
- Active Interruptions
- Scheduled Today
- Scheduled Tomorrow
- Recently Restored
- Updated or Cancelled Advisories
- Community Activity
- Last Verified Update

---

## 6.2 Power Risk Map

The map must be more than an outage map.

Possible statuses:

- Normal
- Monitoring
- Possible Interruption
- Scheduled
- Confirmed
- Ongoing
- Restoring
- Restored
- Cancelled
- Unknown
- Community Reports Detected

Map interaction should allow users to inspect:

- city or municipality
- barangay
- affected portion
- specific streets or sitios when available
- schedule
- duration
- reason
- source
- verification status
- latest update
- community reports
- confidence

Important:
If an advisory says "portion of Lahug," the application must never mark all of Lahug as definitely affected.

---

## 6.3 My Places

Users can save multiple important locations.

Examples:

- Home
- School
- Work
- Business
- Parents' Home
- Dormitory
- Branch 1
- Branch 2

Each location should show:

- current status
- upcoming interruption
- next interruption
- risk level
- last update
- alert preference

---

## 6.4 AI Power Impact Assistant

The assistant should not merely repeat advisories.

It should interpret how an interruption affects the user's situation.

Example questions:

- "Naay brownout sa Lahug karon?"
- "Naa koy interview ugma 2 PM sa Talamban. Safe ra?"
- "I run a milk tea shop in Banilad. Unsa akong i-prepare?"
- "Which of my saved places are affected tomorrow?"
- "Asa mas safe mag work karon?"
- "Na cancel ba ang advisory sa Guadalupe?"
- "Unsa pinaka latest update?"

The assistant must support:

- English
- Cebuano
- Tagalog
- code switching

---

## 6.5 Plan My Day Around Power

This should be a flagship AI feature.

Inputs may include:

- user's location
- appointment time
- work schedule
- class schedule
- business operating hours
- saved places
- verified interruption data

The AI provides:

- conflict detection
- recommended preparation time
- alternative timing
- backup planning
- practical checklist

Example:

> Your interview is at 2:00 PM and a scheduled interruption affects part of Talamban from 1:00 PM to 4:00 PM. Prepare backup power and internet, or relocate before 12:30 PM. The advisory only covers portions of Talamban, so verify your exact street below.

---

## 6.6 Preparedness Mode

When a verified interruption approaches, the application should shift into a preparation experience.

Example countdown:

- 3 hours remaining
- 1 hour remaining
- 30 minutes remaining
- interruption may now be active

Preparedness checklists by user type:

### Household
- charge phones
- charge power banks
- prepare emergency lights
- secure refrigerated food
- unplug sensitive devices if appropriate
- prepare water if dependent on electric pumps

### Student
- charge laptop
- download study materials
- save assignments offline
- prepare mobile data
- notify instructor if necessary

### Remote Worker
- save work
- charge devices
- prepare hotspot
- relocate if necessary
- move meetings

### Business
- notify staff
- protect equipment
- prepare manual operations
- review refrigeration risk
- prepare alternative payment process
- inform customers

---

## 6.7 Brownout Calendar

Views:

- Today
- Tomorrow
- 7 Days
- Monthly

Events should be filterable by:

- location
- status
- source
- interruption type

Supported statuses:

- Possible
- Scheduled
- Confirmed
- Ongoing
- Cancelled
- Completed

---

## 6.8 Community Intelligence

Residents may submit reports such as:

- Power Out
- Power Restored
- Flickering
- Low Voltage
- Intermittent Service

Community information must always be visually separated from official or verified information.

Example:

> 9 community reports of power loss were received near Banilad during the last 20 minutes. No official confirmation is currently available.

Community reports must never automatically become verified events.

AI may cluster reports by:

- proximity
- time window
- event type
- report volume

Potential abuse controls:

- rate limiting
- duplicate detection
- account reputation
- anomaly detection
- report expiry
- administrator review

---

## 6.9 AI Advisory Ingestion

Admin can ingest information through:

- pasted caption
- uploaded screenshot
- caption + screenshot
- official URL
- manual structured entry

AI should extract:

- source
- publication date
- effective date
- start time
- end time
- location names
- affected portions
- interruption type
- reason
- status
- restoration update
- cancellation
- confidence

AI must compare text and image when both exist.

If values conflict:

> Information Conflict Detected

The system must require manual verification.

---

## 6.10 Source Intelligence

Long-term, the system should monitor multiple legitimate public sources.

Potential source categories:

- electricity utilities
- grid operators
- government agencies
- local government units
- emergency management offices
- verified social pages

Manual ingestion remains a fallback.

The product should store:

- source name
- source URL
- source type
- original text
- original image
- ingestion timestamp
- verification timestamp

---

## 6.11 Power Resilience Score

A location can receive a historical descriptive score.

This must initially be based on historical observed data and not portrayed as a prediction.

Example:

**Lahug Power Resilience: 82/100**

Supporting metrics:

- scheduled interruptions in last 30 days
- total interruption hours
- average scheduled duration
- restoration duration when known
- interruption frequency
- change or cancellation rate
- comparative percentile

The score must include an explanation of how it was calculated.

---

## 6.12 Nearby Resilience Finder

When the user's location is affected, the system may help them find nearby alternatives such as:

- coworking spaces
- malls
- libraries
- cafés
- charging stations
- community centers

Do not claim these locations currently have electricity unless confirmed.

Future partner businesses may voluntarily indicate:

- generator available
- charging available
- Wi-Fi available
- open during interruption

---

## 6.13 Personal Daily Power Brief

Example:

> Your home has no verified interruption today. Your school area has a scheduled interruption from 1 PM to 3 PM. Your workplace has no current advisory. One new community outage cluster is being monitored near Mandaue.

The brief should be generated only from current verified data plus clearly labeled community information.

---

## 7. Data Architecture Direction

Do not use LLM memory as the operational source of truth.

Use a structured database.

Recommended backend:

- PostgreSQL / Supabase
- PostGIS for geospatial data
- object storage for images
- vector search only where useful for source retrieval
- event/version tables for advisory history

Core entities:

- users
- user_places
- locations
- outage_events
- outage_event_locations
- outage_event_versions
- sources
- source_documents
- ai_extractions
- verification_reviews
- notifications
- community_reports
- community_report_clusters
- preparedness_profiles
- audit_logs

---

## 8. AI Architecture

The public assistant must never operate as:

User -> LLM -> Answer

Required flow:

User
-> Intent Detection
-> Location Resolution
-> Time Resolution
-> Retrieve Current Structured Events
-> Retrieve Relevant Source Evidence
-> Apply Temporal and Status Rules
-> Apply Safety and Uncertainty Rules
-> Generate User-Friendly Answer
-> Show Source and Freshness

---

## 9. Status Model

Use an explicit status taxonomy:

- NORMAL
- MONITORING
- POSSIBLE
- SCHEDULED
- CONFIRMED
- ONGOING
- RESTORING
- RESTORED
- CANCELLED
- COMPLETED
- UNKNOWN

Never infer NORMAL solely because no advisory was found.

Correct wording:

> No currently verified interruption was found for this location.

Incorrect wording:

> There will be no brownout.

---

## 10. Advisory Versioning

Every significant change must create a new version.

Example:

Version 1: Possible
Version 2: Scheduled
Version 3: Time changed
Version 4: Location changed
Version 5: Cancelled

Never silently overwrite prior public-safety information.

---

## 11. MVP Scope

### Must Have

- responsive public dashboard
- power situation summary
- power map
- today/tomorrow/week calendar
- location search
- My Places
- AI Power Impact Assistant
- Plan My Day Around Power
- admin caption ingestion
- admin screenshot ingestion
- multimodal extraction
- human approval
- structured outage database
- source transparency
- advisory versioning
- in-app alerts
- browser push notifications
- preparation reminders
- admin audit trail

### Should Have

- community reporting
- community clustering
- preparedness profiles
- daily AI briefing
- historical metrics

### Not MVP

- bill payments
- utility account management
- electricity consumption billing
- utility payment gateway
- authoritative outage prediction
- automatic emergency declarations
- fully autonomous publication of low-confidence advisories

---

## 12. Phase 2

- automated official-source monitoring
- improved geospatial matching
- landmark-to-barangay resolution
- community trust scoring
- SMS alerts
- email alerts
- Messenger/Viber/Telegram integration
- business multi-branch mode
- barangay dashboards
- power resilience scoring
- nearby resilience finder
- public reporting analytics

---

## 13. Phase 3

Evolve into:

# Cebu Disruption Intelligence Platform

Potential verticals:

- electricity interruption
- water interruption
- flood alerts
- road closures
- telecom outages
- traffic disruptions
- class suspensions
- severe weather advisories
- emergency public announcements

The reusable platform pattern becomes:

Public Source
-> AI Ingestion
-> Structured Event
-> Verification
-> Geographic Relevance
-> Personal Impact
-> Notification
-> Public Intelligence

---

## 14. UX Principles

1. Mobile first.
2. No login required for basic public information.
3. Show status immediately.
4. Always show last verified timestamp.
5. Always distinguish official, verified, AI-interpreted, and community data.
6. Do not rely on color alone.
7. Avoid technical electricity terminology where unnecessary.
8. Allow Cebuano-first conversation.
9. Use clear uncertainty wording.
10. Do not make users search through long advisories manually.
11. Minimize steps to answer "Is my area affected?"
12. Never hide source evidence.

---

## 15. Trust and Safety Principles

The system must never:

- fabricate an outage
- claim an area is safe based only on missing information
- treat community reports as official
- hide uncertainty
- publish conflicting AI extraction automatically
- describe AI interpretation as an official utility statement
- overwrite old advisory history
- invent restoration times
- present historical patterns as guaranteed future predictions

---

## 16. Product Success Metrics

### Awareness
- users warned before interruption
- notifications opened
- saved places monitored
- share actions

### Information Quality
- extraction accuracy
- location mapping accuracy
- schedule extraction accuracy
- administrator correction rate
- grounded answer rate
- source citation rate

### Engagement
- daily active users
- location searches
- AI questions
- My Places usage
- preparedness checklist completion

### Speed
- time from advisory detection to structured draft
- time from administrator approval to publication
- alert delivery latency

### Community
- valid community reports
- duplicate report rate
- false report rate
- verified community clusters

---

## 17. Definition of Success

The platform succeeds when a Cebu resident can immediately understand:

- what is happening
- whether their important locations are affected
- when the interruption may happen
- what changed
- what the source is
- how confident the information is
- what they should prepare
- what alternatives they may have

The end product must feel like a personal disruption intelligence assistant, not another electricity provider portal.
