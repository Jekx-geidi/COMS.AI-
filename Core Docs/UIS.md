# COMS.AI
## Cebu Outage Monitoring & Intelligence System
### UIS.md — User Interface Specification

**Version:** 1.0  
**Status:** Visual Implementation Ready  
**Visual Direction:** Modern AI Punk / Cyber Utility  
**Brand Palette Direction:** Derived from the recognizable current Visayan Electric identity: deep navy/electric blue + bright cyan + white. Critical red is reserved for confirmed/ongoing interruption states.

> Note: The palette below is a COMS.AI design interpretation inspired by publicly visible Visayan Electric branding, not an official Visayan Electric brand-standard specification.

---

# 1. Visual Concept

The visual identity should combine:

```text
VISAYAN ELECTRIC-INSPIRED BLUE/CYAN
+
AI SYSTEM INTERFACE
+
PUNK / INDUSTRIAL EDGE
+
CEBU PUBLIC-SAFETY CLARITY
```

Keywords:

- electric
- signal
- grid
- pulse
- live
- intelligence
- current
- verified
- geographic
- angular
- high contrast

---

# 2. Core Color Palette

## 2.1 Primary Navy

**COMS Navy**
`#071A3D`

Use for:
- app shell
- headers
- primary dark surfaces
- navigation
- map dark mode base

---

## 2.2 Electric Blue

**Grid Blue**
`#163B8C`

Use for:
- primary UI accents
- cards
- links
- selected controls
- secondary surfaces

---

## 2.3 Visayan-Inspired Cyan

**Pulse Cyan**
`#19B8E8`

Use for:
- AI
- Locate Me
- active focus
- map scan rings
- selected states
- live indicators
- data highlights

---

## 2.4 Signal Cyan Light

**Current Glow**
`#6DE4FF`

Use sparingly for:
- AI glow
- map current-location ring
- small data accents

---

## 2.5 White

**Power White**
`#F7FBFF`

Use for:
- primary text on dark
- clean cards in light contexts
- important contrast

---

## 2.6 Slate

**Grid Slate**
`#91A2BB`

Use for:
- secondary labels
- timestamps
- inactive navigation
- metadata

---

## 2.7 Deep Surface

**Blackout Surface**
`#030A17`

Use for:
- application background
- dark map overlays
- modal backdrop
- high-contrast command surfaces

---

# 3. Semantic Status Palette

These colors represent product meaning and must not be changed casually.

## Confirmed / Ongoing Critical

**Outage Red**
`#E53935`

Use only for:
- confirmed active outage
- destructive action
- critical alert

---

## Scheduled

**Schedule Amber**
`#FFB020`

---

## Possible / Monitoring

**Monitor Yellow**
`#FFD95A`

---

## Restoring

**Restore Cyan**
`#39D9D0`

---

## Restored / Healthy

**Stable Green**
`#2DD881`

---

## Unknown / Stale

**Unknown Gray**
`#7C8BA1`

---

## Community Signal

**Community Violet**
`#9B72FF`

Community violet prevents community information from visually impersonating official red/blue statuses.

---

# 4. Color Usage Ratio

Recommended:

```text
55% Deep Navy / Dark Surface
25% White / Neutral content
12% Blue
5% Cyan
3% Semantic accents
```

Do not flood the interface with neon cyan.

Cyan should feel meaningful.

---

# 5. Light vs Dark

Primary product mode:

> **Dark Command Mode**

Rationale:
- map visibility
- AI aesthetic
- outage status contrast
- modern punk identity

Optional light mode may be added later.

Dark mode must still maintain WCAG-oriented contrast.

---

# 6. Typography

Recommended system:

## Display / Technical Headings

Use a geometric/industrial sans-serif such as:

- Space Grotesk
- Sora
- IBM Plex Sans
- Geist

Use font availability appropriate to implementation.

## Body

- Inter
- Geist
- system sans-serif

## Data / Time / Coordinates

Use monospace selectively:

- IBM Plex Mono
- JetBrains Mono
- system monospace

Do not make normal body copy monospace.

---

# 7. Type Scale

```text
Display XL    48–56
Display       36–44
H1            30–36
H2            24–28
H3            20–22
Body Large    17–18
Body          15–16
Small         13–14
Micro         11–12
```

Mobile display sizes should reduce appropriately.

---

# 8. Logo Lockup

Recommended text lockup:

```text
COMS.AI
CEBU OUTAGE MONITORING
& INTELLIGENCE SYSTEM
```

Visual idea:

- COMS in strong white
- `.AI` in Pulse Cyan
- small angular bolt or signal mark
- no direct copying of VECO/Visayan Electric logo geometry

COMS.AI must have its own identity.

---

# 9. Punk Visual Language

Use:

- clipped corners
- angular card edges
- grid lines
- scan lines
- small technical labels
- bolt motifs
- thin signal strokes
- deliberate asymmetry
- bracket accents
- modular panels

Do NOT overuse:

- glitch text
- chromatic aberration
- random diagonal stripes
- flashing neon
- noisy background textures

---

# 10. Surface System

## Surface 0
`#030A17`

Main background.

## Surface 1
`#071A3D`

Primary panel.

## Surface 2
Approx. `#0D2553`

Elevated card.

## Glass Surface

Use low-opacity navy glass for:
- map overlays
- floating controls
- AI panels

Must preserve readability.

---

# 11. Border System

Default:

```text
1px solid rgba(109, 228, 255, 0.18)
```

Active:

```text
1px solid Pulse Cyan
```

Critical:

```text
1px solid Outage Red
```

Use occasional double-line/technical framing for major command panels.

---

# 12. Corner Language

Use mostly:

- 8px
- 12px

For punk elements, selected corners may be clipped using CSS.

Example:

```text
top-right clipped
bottom-left clipped
```

Avoid fully rounded pill-card UI everywhere.

Pills are reserved for:
- statuses
- compact filters
- tags

---

# 13. Shadows and Glow

Normal cards:

- subtle dark shadow

AI/live state:

- restrained cyan outer glow

Critical outage:

- minimal red glow

Never use glow on every component.

---

# 14. Grid Background

Optional large desktop surfaces may use:

```text
thin blue grid
very low opacity
```

The grid evokes:
- power network
- mapping
- data systems

It should disappear behind dense content.

---

# 15. Primary Button

## Locate Me

Visual:

- Pulse Cyan background
- deep navy text
- location target icon
- angular edge
- high prominence

Label:

> LOCATE ME

Hover:

- slight cyan luminance increase
- scan-ring micro-animation

---

# 16. Secondary Button

Deep blue surface with:

- cyan border
- white text

Example:

> LIVE MAP

---

# 17. Tertiary Button

Transparent with text/icon.

Examples:

- View Source
- Details
- Cancel

---

# 18. Destructive Button

Outage Red only for:

- Reject
- Delete
- destructive admin operation

Do not use red for normal primary CTA.

---

# 19. Status Chips

Examples:

```text
● ONGOING
◷ SCHEDULED
△ POSSIBLE
↻ RESTORING
✓ RESTORED
? UNKNOWN
⌁ COMMUNITY
```

Each chip must contain icon + text.

---

# 20. Current Power Status Card

Desktop concept:

```text
┌───────────────────────────────────────┐
│ LIVE POWER STATUS              10:24 │
│                                       │
│ ● MONITORING CEBU                     │
│                                       │
│ 03 ACTIVE     08 SCHEDULED            │
│                                       │
│ [ LOCATE ME ]    [ LIVE MAP ]         │
└───────────────────────────────────────┘
```

Use large status typography with controlled accent.

---

# 21. Locate Me Scan Panel

Visual language:

- cyan target icon
- animated concentric rings
- 4-step scan timeline
- subtle technical coordinates
- loading skeleton for result

Do not display exact coordinates prominently unless useful.

---

# 22. Outage Map Visual Specification

Preferred map:

- dark/navy map theme
- roads in subdued slate
- administrative borders subtle
- water darker blue
- labels high readability

Markers should be vivid against the map.

---

# 23. Map Marker Shapes

## Ongoing
Lightning pin, red.

## Scheduled
Clock-bolt pin, amber.

## Possible
Triangle-bolt, yellow.

## Restoring
Circular progress pin, cyan.

## Restored
Check pin, green.

## Community
Radio-wave pin, violet.

## User
Target/radar marker, cyan + white center.

---

# 24. User Location Marker

Use:

```text
white center
cyan ring
soft animated pulse
```

Never use the same marker style as an outage.

---

# 25. Confirmed Outage Polygon

- red outline
- red low-opacity fill
- clear label

---

# 26. Partial Area Polygon

If valid polygon exists:

- amber outline
- diagonal/scan hatch
- transparent fill

If polygon does not exist:

- never invent geometry
- use marker + textual partial-coverage warning

---

# 27. Map Legend

Compact floating card:

```text
STATUS
● Active
◷ Scheduled
△ Possible
↻ Restoring
⌁ Community
◎ You
```

Collapsible on mobile.

---

# 28. AI Visual Identity

COMS AI should have its own treatment:

- cyan accent
- small animated signal glyph
- subtle grid halo
- no humanoid robot mascot required

Label:

> **COMS AI**

Secondary:

> Grounded in verified outage data

---

# 29. Chat Message Styling

User:
- blue surface
- right alignment

COMS AI:
- navy surface
- cyan left rule
- source/evidence footer

System warning:
- amber/red bordered panel

---

# 30. AI Thinking State

Use:

```text
CHECKING VERIFIED DATA...
Resolving location
Reading latest event
Comparing schedule
```

This is more meaningful than:

> AI is thinking...

---

# 31. AI Evidence Footer

Every current outage answer may include:

```text
SOURCE   Visayan Electric
VERIFIED 10:24 AM
EVENT    #CBA-2048
```

Event ID may be hidden from normal users unless useful.

---

# 32. Calendar UI

Use technical schedule blocks.

Day cell:

- date
- status count
- short interruption bar

Selected day opens timeline.

Today view should resemble an operations timeline:

```text
09:00 ───── Scheduled — Talamban
13:00 ───── Scheduled — Lahug
16:30 ───── Restoring — Mandaue
```

---

# 33. My Places UI

Cards are "monitored nodes."

Visual:

```text
┌ HOME ─────────── ALERTS ON ┐
│ Lahug, Cebu City           │
│                            │
│ ◷ SCHEDULED                │
│ 1:00 PM → 4:00 PM          │
└────────────────────────────┘
```

Use node line/connector motif subtly.

---

# 34. Preparedness UI

Checklist cards should use a progress rail.

Example:

```text
OUTAGE ETA
01:42:18

PREPARATION  2 / 5

✓ Phone charged
○ Laptop charged
○ Files downloaded
○ Mobile data ready
○ Work saved
```

---

# 35. Community UI

Use violet accent consistently.

Header:

> COMMUNITY SIGNAL

Never use official outage red for community-only reports.

Cards show:

- report count
- location
- time window
- verification warning

---

# 36. Notification UI

Notification center grouped:

- Critical
- Today
- Earlier

Changed-event notification should visually emphasize changed data.

Example:

```text
SCHEDULE UPDATED
1:00 PM → 2:00 PM
```

Old value can use subtle strikethrough.

---

# 37. Admin UI

Admin can use a denser interface.

Use:

- left rail
- command table
- source preview
- extraction panel
- map review
- audit drawer

Avoid excessive glow in admin tables.

---

# 38. AI Review Screen

Recommended visual hierarchy:

```text
SOURCE            AI EXTRACTION         REVIEW
────────          ─────────────         ───────
Screenshot        Status                Conflicts
Caption           Time                  Confidence
URL               Locations             Corrections
                  Coverage              Map
```

Critical conflicts use amber/red borders.

---

# 39. Data Table Styling

Use dark rows with subtle separators.

Headers:
- uppercase
- small
- slate/cyan

Status column:
- chips

Avoid thick full-grid table borders.

---

# 40. Empty States

Example map empty state:

> **NO VERIFIED EVENTS IN VIEW**

> Move the map, search another area, or check the calendar.

AI empty state:

> **ASK ABOUT POWER IN CEBU**

Example prompts displayed as command chips.

---

# 41. Error States

Errors should look technical but human-readable.

Example:

```text
MAP LINK INTERRUPTED

Outage data is still available below.

[ VIEW LIST ]
[ RETRY MAP ]
```

---

# 42. Skeleton Loading

Use angular skeleton blocks with subtle cyan scan sweep.

Do not use dramatic glitch loading.

---

# 43. Iconography

Style:

- thin to medium line icons
- geometric
- consistent stroke

Key icons:

- lightning
- location target
- map
- clock
- calendar
- AI signal
- source/link
- warning
- restoration
- community radio waves
- notification bell

---

# 44. Responsive Breakpoints

Recommended:

```text
Mobile       < 640
Tablet       640–1023
Desktop      1024–1439
Wide         >= 1440
```

Design should not rely solely on these exact values.

---

# 45. Mobile Layout

Primary mobile home:

```text
HEADER
LIVE STATUS
LOCATE ME
MAP PREVIEW
TODAY
ASK COMS
BOTTOM NAV
```

Map on mobile should use a draggable bottom sheet.

---

# 46. Desktop Layout

Recommended:

```text
LEFT RAIL
+
MAIN COMMAND CONTENT
+
OPTIONAL RIGHT CONTEXT PANEL
```

Live map may occupy 60–70% of a dedicated map screen.

---

# 47. Accessibility Color Rule

Every semantic status must include:

```text
COLOR
+
ICON
+
TEXT
```

Example:

Red alone is not "ongoing."

It must say:

> ● ONGOING

---

# 48. Reduced Motion

Respect:

```css
prefers-reduced-motion
```

Disable:

- pulsing marker animations
- scan sweeps
- animated grid
- nonessential transitions

---

# 49. UI Copy Tone

Short.
Calm.
Operational.
Non-alarmist.

Good:

> Scheduled interruption in part of Lahug.

Bad:

> WARNING!!! MASSIVE BROWNOUT IN LAHUG!!!

---

# 50. Visual Dos

Do:

- use deep blue as the anchor
- use cyan for AI/location/live functions
- reserve red for real critical states
- use white generously for readability
- use angular graphic details
- keep maps clean
- make timestamps visible
- expose sources
- create strong mobile hierarchy

---

# 51. Visual Don'ts

Do not:

- copy VECO's logo
- make COMS look officially operated by VECO
- use all-neon interfaces
- use red as decorative branding
- use glowing text paragraphs
- create tiny HUD labels
- use excessive glassmorphism
- use cyberpunk fonts for body text
- cover the map with panels
- animate every map pin continuously

---

# 52. Suggested Design Tokens

```css
--bg-0: #030A17;
--bg-1: #071A3D;
--bg-2: #0D2553;

--brand-blue: #163B8C;
--brand-cyan: #19B8E8;
--brand-cyan-light: #6DE4FF;

--text-primary: #F7FBFF;
--text-secondary: #91A2BB;

--status-critical: #E53935;
--status-scheduled: #FFB020;
--status-monitor: #FFD95A;
--status-restoring: #39D9D0;
--status-stable: #2DD881;
--status-community: #9B72FF;
--status-unknown: #7C8BA1;

--border-subtle: rgba(109, 228, 255, 0.18);
```

---

# 53. Component Inventory

Claude/design implementation should create reusable UI components for:

```text
AppShell
Sidebar
MobileNav
StatusChip
LiveStatusCard
LocateMeButton
LocateScanPanel
LocationResultCard
OutageMap
OutageMarker
OutagePolygon
MapLegend
MapFilters
EventDetailSheet
OutageCalendar
TimelineEvent
AssistantPanel
ChatMessage
AIStatus
EvidenceFooter
PlaceCard
PreparednessChecklist
NotificationCard
CommunitySignalCard
SourceCard
FreshnessBadge
UncertaintyAlert
AdminReviewPanel
ConflictCard
AuditTable
```

---

# 54. Final UI Principle

> **Blue establishes trust. Cyan communicates intelligence. Red communicates actual outage severity. White keeps everything understandable.**

The modern punk identity comes from structure, geometry, motion, and attitude.

Not from sacrificing usability.
