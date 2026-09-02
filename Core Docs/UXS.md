# COMS.AI
## Cebu Outage Monitoring & Intelligence System
### UXS.md — User Experience Specification

**Version:** 1.0  
**Status:** Design Execution Ready  
**Experience Direction:** AI-Modern Punk / Cyber Utility Interface  
**Brand Inspiration:** Current Visayan Electric visual identity: deep electric blue, bright cyan, white, with critical red reserved for outage severity  
**Primary Device:** Mobile First  
**Primary Locale:** Cebu, Philippines

---

# 1. Experience Vision

COMS.AI should feel like:

> **A live AI power-awareness command center for Cebu.**

It should combine:

- public-safety clarity
- map-first intelligence
- modern AI interaction
- bold punk-inspired visual energy
- fast mobile access
- source transparency
- strong geographic context

The experience must look advanced without becoming difficult to read.

COMS.AI must NOT feel like:

- a utility billing portal
- a generic admin dashboard
- a gaming HUD
- a neon-heavy interface with weak readability
- a VECO clone
- a chatbot floating over unstructured information

The punk aesthetic is used through angular cuts, signal lines, strong grids, high contrast, kinetic micro-interactions, and controlled electric accents.

---

# 2. Experience Promise

COMS.AI should answer three questions quickly:

```text
WHERE?
Is my area affected?

WHEN?
What time and date?

WHAT NOW?
What should I do next?
```

The user should never need to decode a long advisory before understanding their situation.

---

# 3. Core UX Principles

## 3.1 Situation Before Navigation

The first screen must immediately show:

- current Cebu power status
- latest verified time
- number of active/scheduled events
- Locate Me
- Live Map
- Ask COMS AI

Navigation should support the experience, not delay it.

---

## 3.2 Location First

The primary public CTA is:

> **LOCATE ME**

The primary flow is:

```text
Detect location
→ Match outage geography
→ Explain certainty
→ Show date/time
→ Show source
→ Prepare
```

---

## 3.3 Verified Before Beautiful

Visual confidence must never exceed data confidence.

A beautiful red alert card must not say an outage is confirmed when the source only says "portion of the area."

Every critical state must show:

- verification state
- freshness
- source
- coverage certainty

---

## 3.4 AI as Interpreter, Not Oracle

AI should explain retrieved verified information.

The user experience should communicate that COMS AI:

- understands the user's question
- checks current structured records
- compares time and location
- explains the result

It must not visually imply that the model independently predicts utility behavior.

---

## 3.5 Progressive Disclosure

Default views stay simple.

Users can expand for:

- source evidence
- full advisory
- affected streets
- event history
- confidence
- map geometry
- community signals

---

# 4. Information Hierarchy

Every outage result should follow:

```text
1. STATUS
2. LOCATION
3. DATE + TIME
4. IMPACT / COVERAGE
5. WHAT TO DO
6. SOURCE
7. LAST VERIFIED
```

Never bury the date and time below decorative content.

---

# 5. Primary Public Journey

```text
OPEN COMS.AI
     ↓
CURRENT POWER STATUS
     ↓
[ LOCATE ME ]
     ↓
LOCATION PERMISSION
     ↓
DETECT POSITION
     ↓
MATCH CURRENT VERIFIED EVENTS
     ↓
RESULT
 ┌──────────┬────────────┬───────────┐
 │CONFIRMED │PARTIAL AREA│NO MATCH   │
 └──────────┴────────────┴───────────┘
     ↓
AI EXPLANATION
     ↓
[ VIEW MAP ]
[ PREPARE ]
[ ASK COMS ]
[ SET REMINDER ]
```

---

# 6. Homepage UX

## Above the Fold

Recommended composition:

```text
COMS.AI
Cebu Outage Monitoring & Intelligence System

LIVE POWER STATUS
● MONITORING CEBU

3 active
8 scheduled today

Last verified 10:24 AM

[ ◎ LOCATE ME ]
[ ◉ LIVE MAP ]

Ask COMS:
"Naay brownout diri sa akong location?"
```

The first screen should feel operational, not promotional.

---

# 7. Locate Me UX

## 7.1 Entry

Use a strong primary button:

> **◎ LOCATE ME**

Helper text:

> Check your current location against verified outage areas.

---

## 7.2 Permission Primer

Before the browser prompt:

> **Use your location?**  
> COMS.AI uses your current position to compare your location with verified outage areas. Your anonymous live position is not permanently saved by default.

Actions:

- Use My Location
- Search Instead

---

## 7.3 Scan State

Instead of a generic spinner:

```text
SCANNING LOCATION
01 Position detected
02 Resolving area
03 Checking outage zones
04 Reading latest schedules
```

The animation should be subtle and finish quickly.

---

## 7.4 Confirmed Match

Header:

> **OUTAGE MATCH**

Show:

- You are near: Lahug, Cebu City
- Status: Scheduled
- Today
- 1:00 PM–4:00 PM
- Approx. duration: 3 hours
- Source
- Last verified

Primary action:

> **PREPARE NOW**

Secondary:

- View Coverage
- Ask COMS
- Set Reminder
- View Source

---

## 7.5 Partial Area Match

Header:

> **PARTIAL AREA ALERT**

Message:

> Your detected barangay appears in the advisory, but only a portion is listed. The available source is not precise enough to confirm your exact point.

The UI must visually use warning treatment, not confirmed-red treatment.

---

## 7.6 Nearby Match

Header:

> **OUTAGE NEARBY**

Explain:

> A verified outage area is near your detected position, but your location is not currently inside the verified mapped coverage.

---

## 7.7 No Verified Match

Header:

> **NO CURRENT VERIFIED MATCH**

Message:

> No currently verified interruption matches your detected location.

Never say:

> No brownout.

---

## 7.8 Stale Result

Header:

> **UPDATE MAY BE STALE**

Display the timestamp prominently and offer:

> View Latest Source

---

# 8. Live Map UX

The map is a first-class interface.

It should resemble an AI utility intelligence surface, not a normal consumer Google Map screen.

## Core Controls

Top-left:
- search

Top-right:
- layers
- filter

Bottom-right:
- Locate Me
- zoom

Bottom sheet:
- event detail

---

# 9. Map Marker UX

Each marker must communicate status with:

- shape
- icon
- label
- accent
- optional pulse animation

Recommended meanings:

```text
ONGOING     = critical bolt marker
SCHEDULED   = clock/bolt marker
POSSIBLE    = warning marker
RESTORING   = progress marker
RESTORED    = check marker
COMMUNITY   = signal marker
```

Do not use color alone.

---

# 10. Map Area UX

For polygon coverage:

### Confirmed Coverage
Solid translucent area with strong outline.

### Partial Coverage
Striped / scan-line overlay.

### Uncertain Extent
Do not fake a polygon. Use pins plus an uncertainty note.

### Community Cluster
Soft signal/radar visualization clearly labeled Community.

---

# 11. Map Detail Bottom Sheet

On mobile:

```text
[ STATUS TAG ]

Lahug, Cebu City
Scheduled interruption

SEP 04
1:00 PM → 4:00 PM

Coverage
Portion of Lahug

[ PREPARE ]
[ ASK COMS ]

Source: ...
Verified: 10:24 AM
```

Swipe up for full details.

---

# 12. Ask COMS AI UX

The AI should feel embedded into the product.

## Entry Points

- homepage Ask COMS
- map event Ask COMS
- Locate Me result
- My Places
- event detail
- preparedness screen

---

# 13. AI Chat Experience

Header:

```text
COMS AI
● GROUNDED IN VERIFIED OUTAGE DATA
```

Suggested prompts:

- Naay brownout diri?
- What areas are affected today?
- Brownout ba ugma sa Talamban?
- Naa koy online class 2 PM. Safe ra?
- Show my affected places.

Responses should use compact evidence cards.

---

# 14. AI Response Card

Structure:

```text
AI SUMMARY

Your detected area has a scheduled interruption...

STATUS       SCHEDULED
TIME         1 PM – 4 PM
COVERAGE     PARTIAL AREA

Recommended action:
Charge essential devices before 12:30 PM.

SOURCE
Visayan Electric advisory

LAST VERIFIED
10:24 AM
```

---

# 15. Plan My Day UX

Input can be conversational:

> I have an online interview tomorrow at 2 PM in Talamban.

COMS should return:

```text
SCHEDULE CONFLICT DETECTED

Your activity overlaps:
1:00 PM – 4:00 PM

PREP BEFORE 12:30 PM

[ BUILD MY CHECKLIST ]
[ FIND ANOTHER PLACE ]
```

Never claim alternative places have power unless verified.

---

# 16. Calendar UX

The calendar should be designed as a power schedule board.

Views:

- Today
- Tomorrow
- 7 Days
- Month

Each event should show:

- status stripe
- location
- time
- coverage label

Click/tap opens event detail.

---

# 17. My Places UX

Cards should resemble monitored nodes.

Example:

```text
HOME
Lahug, Cebu City

● SCHEDULED
1 PM–4 PM

Alerts ON
```

Other labels:

- School
- Work
- Business
- Parents
- Custom

---

# 18. Preparedness UX

Preparedness Mode should feel like an actionable sequence, not an article.

Example:

```text
OUTAGE IN 01:42:18

PREP CHECK

[✓] Charge phone
[ ] Charge laptop
[ ] Download files
[ ] Prepare mobile data
[ ] Save important work
```

Profile switcher:

- Household
- Student
- Remote Worker
- Business

---

# 19. Notification UX

Notifications should prioritize:

```text
WHAT CHANGED
WHERE
WHEN
ACTION
```

Example:

> **Schedule changed — Home**  
> Lahug interruption now starts at 2:00 PM instead of 1:00 PM.  
> Verified 11:08 AM.

---

# 20. Community UX

Community data must feel visually separate.

Section label:

> **COMMUNITY SIGNALS**

Example:

> 12 recent reports near Banilad  
> Not yet officially verified

Actions:
- View Reports
- Report Power Issue

Never use the same status chip as official events.

---

# 21. Admin UX

The admin experience should preserve the same design language but reduce decorative effects.

Admin priority:

- speed
- confidence
- auditability
- data comparison

Admin dashboard:

```text
ADVISORY INBOX
AI REVIEW
MAP REVIEW
ACTIVE EVENTS
COMMUNITY REPORTS
NOTIFICATIONS
AUDIT LOG
```

---

# 22. AI Advisory Review UX

Recommended split layout:

```text
LEFT
ORIGINAL SOURCE
- caption
- image

CENTER
AI EXTRACTION
- date
- time
- areas
- status
- confidence

RIGHT
VERIFICATION
- conflicts
- map
- corrections
```

Bottom actions:

- REJECT
- REANALYZE
- SAVE EDITS
- APPROVE & PUBLISH

---

# 23. UX Error States

Design explicit states for:

- GPS denied
- GPS unavailable
- low location accuracy
- map unavailable
- AI unavailable
- database unavailable
- no result
- stale result
- invalid source
- source conflict
- unauthorized admin
- notification permission denied

No blank screens.

---

# 24. Mobile Navigation

Recommended bottom navigation:

```text
HOME
MAP
LOCATE
AI
MORE
```

Locate may be emphasized as the central action.

---

# 25. Desktop Navigation

Recommended left rail:

```text
COMS.AI

Overview
Live Map
Calendar
Ask COMS
My Places
Preparedness
Community

──────────
Notifications
Settings
```

Public users see only relevant public items.

---

# 26. Motion Principles

Use motion for:

- status changes
- map pin activation
- scanning
- AI processing
- new advisory arrival
- notification attention

Avoid:

- constant flashing
- distracting glitch effects
- strong screen shakes
- high-frequency animation

Cyberpunk does not mean visual chaos.

---

# 27. Accessibility Experience

The user must be able to understand the app without:

- color vision
- map interaction
- animation
- precise pointer control

Requirements:

- text equivalents
- status labels
- focus states
- reduced-motion support
- keyboard navigation
- large touch targets

---

# 28. UX Success Metrics

Measure:

- time to determine current-location impact
- Locate Me completion rate
- map task completion
- AI answer comprehension
- calendar task success
- source discovery rate
- official/community distinction accuracy
- System Usability Scale
- notification usefulness
- preparedness completion

---

# 29. Experience Definition of Done

The UX is complete when a first-time user can:

1. open COMS.AI,
2. understand current power status,
3. tap Locate Me,
4. understand whether the result is confirmed/partial/nearby/no match,
5. see date/time/source,
6. ask a follow-up question,
7. prepare,
8. navigate the map,
9. distinguish verified information from community signals,

without needing instructions.

---

# 30. Final UX Principle

> **COMS.AI should feel futuristic, but the information should feel unmistakably clear.**

The visual personality can be punk.

The information architecture cannot be.
