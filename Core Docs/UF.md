# UF.md

# COMS.AI
## Cebu Outage Monitoring & Intelligence System
### User Flow Specification

**Version:** 1.0  
**Status:** Implementation Ready  
**Product Type:** AI-powered public power outage awareness and preparedness platform  
**Primary Location:** Cebu, Philippines

---

# 1. Purpose

This User Flow document defines how public users, registered users, community contributors, and administrators interact with COMS.AI.

COMS.AI must help users quickly answer:

- Is there a power interruption near me?
- Is my current location affected?
- When will the interruption start and end?
- Which of my saved places are affected?
- What should I prepare?
- Has the schedule changed or been cancelled?
- What is the latest verified information?
- Are people nearby reporting an outage?

The system must remain distinct from a utility billing portal. Its purpose is awareness, location intelligence, AI interpretation, preparedness, and verified outage monitoring.

---

# 2. Primary Actors

## 2.1 Public User
Can:
- view outage map
- use Locate Me
- search areas
- view calendar
- ask COMS AI
- read current advisories
- view public community reports
- view preparedness guidance

No login required.

## 2.2 Registered User
Can additionally:
- save My Places
- enable reminders
- configure notification preferences
- submit community reports
- receive personalized AI briefings
- use multi-location monitoring

## 2.3 Community Contributor
A registered user who submits:
- Power Out
- Power Restored
- Flickering
- Low Voltage
- Intermittent Power

Community reports remain non-official until verified.

## 2.4 Administrator
Can:
- upload screenshots
- paste advisory captions
- submit source URLs
- manually enter advisories
- review AI extraction
- resolve conflicts
- approve/reject advisories
- manage map coverage
- publish notifications
- review community reports
- inspect audit logs

---

# 3. Main Public User Flow

```text
User Opens COMS.AI
        |
        v
Public Dashboard
        |
        +--> View Current Cebu Power Status
        |
        +--> View Live Outage Map
        |
        +--> Tap "Locate Me"
        |
        +--> Search Location
        |
        +--> View Outage Calendar
        |
        +--> Ask COMS AI
        |
        +--> View Preparedness Guidance
```

---

# 4. Home Dashboard Flow

```text
Open COMS.AI
      |
      v
Load Latest Verified Events
      |
      v
Display:
- Current Power Situation
- Active Interruptions
- Scheduled Today
- Scheduled Tomorrow
- Recently Updated
- Recently Restored
- Last Verified Timestamp
      |
      +--> Tap Active Event
      |       |
      |       v
      |   Open Event Details
      |
      +--> Tap Live Map
      |
      +--> Tap Locate Me
      |
      +--> Tap Ask AI
      |
      +--> Tap Calendar
```

---

# 5. Locate Me Flow

This is a core COMS.AI feature.

```text
User taps "Locate Me"
        |
        v
Browser requests location permission
        |
        +--> DENIED
        |      |
        |      v
        |  Show explanation
        |  Offer manual location search
        |
        +--> ALLOWED
               |
               v
        Capture latitude/longitude
               |
               v
        Reverse geocode coordinates
               |
               v
        Resolve:
        - City/Municipality
        - Barangay
        - Nearby landmark
               |
               v
        Query verified outage events
               |
               v
        Run point-in-polygon / coverage matching
               |
               v
        Determine Location Match Result
```

Possible results:

### MATCH_CONFIRMED
Exact detected point is inside a verified mapped affected area.

Response:

> A verified power interruption affects your detected location.

Display:
- current location
- event status
- date
- start time
- end time
- expected duration
- reason
- source
- last verified time

### MATCH_PARTIAL_AREA
The user is within an administrative area mentioned as partial coverage, but exact affected boundaries are unknown.

Response:

> Part of your detected area is included in the advisory. Your exact location cannot be confirmed from the available source.

### MATCH_NEARBY
A verified affected area is near the user but does not currently include the detected point.

Response:

> A verified interruption is occurring near your location, but your detected position is not inside the mapped affected area.

### NO_VERIFIED_MATCH
No currently verified event matches the detected location.

Response:

> No currently verified power interruption was found for your detected location.

Never say:
> There will be no brownout.

### DATA_STALE
Relevant information exists but freshness threshold has been exceeded.

Response:

> I found information for your area, but the latest verification may be outdated. Please check the linked source for the latest official update.

---

# 6. Locate Me + AI Response Flow

```text
Location Detected
      |
      v
Retrieve Matching Events
      |
      v
Retrieve Latest Event Version
      |
      v
Retrieve Source + Verification Time
      |
      v
AI generates grounded response
      |
      v
Display result card
      |
      +--> View on Map
      +--> View Source
      +--> Set Reminder
      +--> Prepare with AI
      +--> Ask Follow-up Question
```

Example:

> You are near Lahug, Cebu City. A scheduled interruption affects part of this area today from 1:00 PM to 4:00 PM. The advisory does not confirm that all of Lahug is affected. Last verified at 10:20 AM.

---

# 7. Live Outage Map Flow

```text
Open Live Map
      |
      v
Load Cebu Map
      |
      v
Load Verified Events
      |
      v
Render:
- Pins
- Area polygons
- Partial coverage overlays
- Community report clusters
      |
      v
User interacts with map
```

Recommended map layers:

- Red = Ongoing / Confirmed
- Orange = Scheduled
- Yellow = Possible / Monitoring
- Blue = Restoring
- Gray = Unknown
- Purple = Community Reports

Color must not be the only indicator.

Each pin or polygon must show:
- icon
- status label
- accessible text

---

# 8. Map Pin Interaction Flow

```text
User taps outage pin
       |
       v
Open Map Detail Card
       |
       v
Show:
- Location
- Status
- Date
- Start Time
- End Time
- Duration
- Coverage
- Reason
- Source
- Last Verified
       |
       +--> Ask AI About This
       +--> Set Reminder
       +--> Share
       +--> Open Full Advisory
```

---

# 9. Map Search Flow

```text
User enters:
"Talamban"
       |
       v
Location Resolver
       |
       v
Normalize Location
       |
       v
Center Map
       |
       v
Retrieve Matching Events
       |
       v
Display Status + AI Summary
```

Support common aliases and landmarks such as:
- IT Park
- Colon
- Ayala
- SM Cebu
- USC Talamban

When location is ambiguous:
- show likely matches
- do not silently select a materially different area

---

# 10. Outage Calendar Flow

```text
Open Calendar
      |
      v
Default: Today
      |
      +--> Today
      +--> Tomorrow
      +--> 7 Days
      +--> Month
      |
      v
Display outage events
      |
      v
Filter by:
- City
- Barangay
- Status
- Event Type
      |
      v
Tap Event
      |
      v
Open Event Details
```

---

# 11. Ask COMS AI Flow

```text
User enters question
       |
       v
Detect language
       |
       v
Classify intent
       |
       v
Resolve location
       |
       v
Resolve time
       |
       v
Retrieve verified events
       |
       v
Retrieve latest versions
       |
       v
Retrieve source evidence
       |
       v
Check community signals separately
       |
       v
Apply uncertainty rules
       |
       v
Generate grounded answer
```

Supported examples:
- "Naay brownout sa Lahug karon?"
- "Brownout ba ugma sa Talamban?"
- "What time ang outage sa Banilad?"
- "Naa koy interview 2 PM. Safe ra?"
- "Which of my saved places are affected?"
- "Na cancel na ba?"

---

# 12. AI Failure Flow

If outage database cannot be reached:

```text
AI Request
   |
   v
Outage Data Retrieval Fails
   |
   v
DO NOT answer from model memory
   |
   v
Show:
"I can't verify the latest outage data right now."
```

---

# 13. My Places Flow

Login required.

```text
Open My Places
      |
      v
Show Saved Places
      |
      +--> Add Place
      |      |
      |      v
      |  Search / Drop Pin / Use Current Location
      |      |
      |      v
      |  Name:
      |  Home / School / Work / Custom
      |      |
      |      v
      |  Configure Notifications
      |      |
      |      v
      |  Save
      |
      +--> Open Existing Place
             |
             v
        View current status
        View upcoming events
        View history
        Edit alerts
```

---

# 14. Personal Power Brief Flow

```text
Logged-in User Opens Dashboard
        |
        v
Retrieve Saved Places
        |
        v
Check each place against latest events
        |
        v
Generate personalized briefing
```

Example:

> Home: No currently verified interruption.  
> School: Scheduled 1 PM to 4 PM.  
> Work: Possible interruption under monitoring.

---

# 15. Plan My Day Around Power Flow

```text
User enters:
- activity
- location
- time
       |
       v
AI resolves details
       |
       v
Retrieve verified outage events
       |
       v
Check schedule overlap
       |
       v
Determine:
- NO_VERIFIED_CONFLICT
- POSSIBLE_CONFLICT
- CONFIRMED_CONFLICT
- PARTIAL_AREA_CONFLICT
- DATA_UNAVAILABLE
       |
       v
Generate practical plan
```

Example:

> Your online interview at 2 PM overlaps with a scheduled interruption from 1 PM to 4 PM. Prepare backup power and internet before 12:30 PM or consider relocating.

---

# 16. Preparedness Mode Flow

```text
Upcoming Event Detected
       |
       v
Check Reminder Threshold
       |
       +--> 24 hours
       +--> 3 hours
       +--> 1 hour
       +--> 30 minutes
       |
       v
Show Preparedness Card
       |
       v
Load Profile:
- Household
- Student
- Remote Worker
- Business
       |
       v
Show Checklist
```

---

# 17. Notification Flow

```text
Verified Event Published / Updated
         |
         v
Find Affected Locations
         |
         v
Find Matching User Places
         |
         v
Evaluate Notification Rules
         |
         v
Deduplicate
         |
         v
Schedule / Send Notification
```

Notification types:
- NEW_ADVISORY
- TOMORROW_REMINDER
- PREPARATION_REMINDER
- STARTED
- CHANGED
- CANCELLED
- RESTORED
- COMMUNITY_CLUSTER

---

# 18. Community Report Submission Flow

```text
User taps "Report Power Issue"
       |
       v
Login if required
       |
       v
Choose:
- Power Out
- Power Restored
- Flickering
- Low Voltage
- Intermittent Power
       |
       v
Use Current Location / Choose Location
       |
       v
Optional Note
       |
       v
Submit
       |
       v
Rate Limit + Duplicate Check
       |
       v
Store as COMMUNITY_REPORTED
       |
       v
Cluster with nearby reports
```

The system must display:
> Community reported. Not yet officially verified.

---

# 19. Community Cluster Flow

```text
Multiple nearby reports
       |
       v
Cluster Engine
       |
       v
Evaluate:
- distance
- time
- report type
- report count
       |
       v
Create/Update Community Cluster
       |
       v
Display purple community marker
```

Never convert automatically to an official outage.

---

# 20. Admin Login Flow

```text
Admin Login
    |
    v
Authentication
    |
    v
Role Verification
    |
    +--> Unauthorized -> Deny
    |
    +--> Authorized
           |
           v
       Admin Dashboard
```

---

# 21. Admin Advisory Ingestion Flow

```text
Admin Dashboard
       |
       v
Create Advisory
       |
       +--> Paste Caption
       +--> Upload Screenshot
       +--> Caption + Screenshot
       +--> Add Source URL
       +--> Manual Entry
       |
       v
Store Original Input
       |
       v
AI Extraction
       |
       v
Deterministic Validation
       |
       v
Location Resolution
       |
       v
Caption/Image Comparison
       |
       v
Conflict Detection
       |
       v
Generate Draft
```

---

# 22. AI Extraction Review Flow

```text
Draft Created
    |
    v
Admin Review Screen
    |
    +--> Original Caption
    +--> Original Screenshot
    +--> Extracted Date
    +--> Extracted Time
    +--> Extracted Locations
    +--> Coverage Type
    +--> Event Status
    +--> Reason
    +--> AI Confidence
    +--> Conflicts
    |
    v
Admin Decision
```

Available actions:
- APPROVE & PUBLISH
- EDIT
- REANALYZE
- REJECT

---

# 23. Conflict Flow

Example:
Caption says 1 PM.
Image says 2 PM.

```text
Conflict Detected
      |
      v
Set review_required = true
      |
      v
Prevent automatic publication
      |
      v
Admin manually resolves conflict
      |
      v
Record correction in audit log
```

---

# 24. Map Review Flow for Admin

```text
AI Resolves Locations
       |
       v
Generate Suggested Pins/Areas
       |
       v
Admin Map Review
       |
       +--> Correct Pin
       +--> Adjust Polygon
       +--> Mark Partial Coverage
       +--> Add Coverage Description
       |
       v
Save Verified Geography
```

---

# 25. Publish Flow

```text
Admin Approves Advisory
       |
       v
Create/Update Verified Event
       |
       v
Create Event Version
       |
       v
Publish to:
- Dashboard
- Map
- Calendar
- AI Retrieval Layer
       |
       v
Evaluate Notifications
       |
       v
Write Audit Log
```

---

# 26. Advisory Update Flow

```text
New Source Update Arrives
       |
       v
Match Existing Event
       |
       v
Detect Change
       |
       +--> Time Changed
       +--> Area Changed
       +--> Status Changed
       +--> Cancelled
       +--> Restored
       |
       v
Create New Version
       |
       v
Admin Verification
       |
       v
Publish Latest Version
       |
       v
Notify affected users
```

Older versions must remain accessible in history.

---

# 27. End-to-End MVP Flow

```text
Official Advisory Published
        |
        v
Admin Captures Caption/Screenshot
        |
        v
COMS.AI Stores Original Source
        |
        v
Multimodal AI Extracts Details
        |
        v
System Validates
        |
        v
AI Resolves Locations
        |
        v
Admin Reviews Map + Details
        |
        v
Admin Approves
        |
        v
Verified Event Stored
        |
        +--> Live Map Updated
        +--> Pins/Areas Updated
        +--> Calendar Updated
        +--> Dashboard Updated
        +--> AI Knowledge Retrieval Updated
        +--> User Places Evaluated
        +--> Notifications Sent
        |
        v
User Opens COMS.AI
        |
        v
Taps "Locate Me"
        |
        v
GPS Detects Position
        |
        v
COMS.AI Checks Verified Coverage
        |
        v
AI Answers with:
- Status
- Exact/Partial Location Match
- Date
- Time
- Duration
- Source
- Last Verified
- Preparation Advice
```

---

# 28. User Flow Success Criteria

The user should be able to:

1. Know the current situation without logging in.
2. Tap Locate Me and receive a location-aware result quickly.
3. Understand whether the match is exact, partial, nearby, unknown, or stale.
4. View affected places visually on the Cebu map.
5. Ask questions in Cebuano, English, Tagalog, or mixed language.
6. Never receive invented outage information.
7. See the source and freshness of critical information.
8. Save multiple important places.
9. Receive useful alerts before interruptions.
10. Prepare for an interruption using AI guidance.
