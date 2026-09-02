# NFR.md

# COMS.AI
## Cebu Outage Monitoring & Intelligence System
### Non-Functional Requirements

**Version:** 1.0  
**Status:** Implementation Ready

---

# 1. Purpose

This document defines the quality, security, performance, reliability, scalability, accessibility, privacy, AI safety, and operational requirements for COMS.AI.

---

# 2. Availability

## NFR-001
The public outage dashboard should target at least **99.5% monthly availability** during MVP operation, excluding planned maintenance.

## NFR-002
Public read access should remain available even if non-critical modules such as community reporting are temporarily unavailable.

## NFR-003
A failure in the AI response layer shall not prevent users from viewing verified structured outage records.

## NFR-004
The system should degrade gracefully.

Example:
If AI is unavailable, show structured event data instead of blocking the outage map.

---

# 3. Performance

## NFR-010
The public dashboard should become usable within **3 seconds** under normal network conditions.

## NFR-011
Location search should return initial results within **2 seconds** under normal conditions.

## NFR-012
Locate Me outage matching should target a response within **3 seconds** after valid geolocation coordinates are available.

## NFR-013
Map marker loading should be incremental and optimized for the current visible map bounds.

## NFR-014
The AI assistant should return a grounded response as quickly as practical and should expose loading/progress UI when retrieval is still in progress.

## NFR-015
Database queries for current outage matching should be indexed and optimized for:
- location
- geometry
- status
- start/end time
- verification state

---

# 4. Scalability

## NFR-020
The system architecture shall support horizontal scaling.

## NFR-021
Application state shall not depend on local ephemeral server storage.

## NFR-022
Operational data shall be stored in persistent shared services such as PostgreSQL/Supabase.

## NFR-023
Map and outage APIs should support caching for public read-heavy traffic where freshness rules permit.

## NFR-024
The architecture should support future expansion beyond Cebu without requiring a complete redesign.

## NFR-025
The source ingestion system should support multiple source providers.

---

# 5. Reliability

## NFR-030
Verified outage events shall not be lost across server restarts, deployments, or scale-to-zero events.

## NFR-031
Publishing an outage event must be transactional where practical.

## NFR-032
A failed notification delivery shall not roll back a successfully published verified event.

## NFR-033
Notification processing shall support retry with bounded attempts.

## NFR-034
Duplicate advisory ingestion should be detected using source identity, checksums, or equivalent deduplication methods.

## NFR-035
Event updates must preserve historical versions.

---

# 6. Data Consistency

## NFR-040
The latest verified event version shall be the authoritative public interpretation.

## NFR-041
The system shall prevent two conflicting versions from both being marked as the active authoritative version.

## NFR-042
Publication should update dependent views consistently:
- dashboard
- map
- calendar
- AI retrieval layer

## NFR-043
Notification jobs shall reference a specific event version.

---

# 7. Security

## NFR-050
All application traffic shall use HTTPS in production.

## NFR-051
Authentication tokens and secrets shall never be exposed to the client unnecessarily.

## NFR-052
Admin endpoints shall enforce server-side role authorization.

## NFR-053
Database access shall use least-privilege permissions.

## NFR-054
Row-level security should be applied to user-specific data where supported.

## NFR-055
Uploaded files shall be validated for:
- allowed type
- maximum size
- malformed content
- unsupported format

## NFR-056
The application shall rate-limit:
- login attempts
- community reports
- AI requests where appropriate
- public abuse-prone endpoints

## NFR-057
The system shall protect against:
- SQL injection
- XSS
- CSRF where applicable
- SSRF
- insecure direct object reference
- broken access control

## NFR-058
Sensitive credentials shall be stored using secret management or secure environment variables.

---

# 8. Prompt Injection and AI Security

## NFR-060
All imported captions, screenshots, OCR results, URLs, and source documents shall be treated as untrusted data.

## NFR-061
Text contained in source material shall never override system or developer instructions.

## NFR-062
The AI extraction pipeline shall not execute commands found in uploaded content.

## NFR-063
AI-generated structured output shall be validated against a schema before persistence.

## NFR-064
AI output must not directly trigger privileged administrative actions without server-side authorization.

## NFR-065
Low-confidence or conflicting AI extraction shall require human verification before publication.

---

# 9. Privacy

## NFR-070
The system shall collect only location data needed for the requested feature.

## NFR-071
Locate Me coordinates shall not be permanently stored for anonymous users unless explicitly required and disclosed.

## NFR-072
Saved user locations shall be private by default.

## NFR-073
The application shall not expose a user's saved locations to other users.

## NFR-074
Community reports should publicly display only the minimum necessary location precision.

## NFR-075
Users shall be able to delete saved places.

## NFR-076
Users shall be able to disable notifications.

## NFR-077
Logs should avoid storing unnecessary precise personal location data.

---

# 10. Geolocation Accuracy

## NFR-080
Locate Me results shall include uncertainty handling when device location accuracy is insufficient.

## NFR-081
The system shall not claim exact outage coverage when:
- source geography is partial
- polygon data is unavailable
- GPS accuracy is insufficient
- location matching confidence is low

## NFR-082
The system should use geospatial types and indexes appropriate for point/polygon operations.

## NFR-083
Map coordinates and administrative names must use a normalized location model.

---

# 11. AI Groundedness

## NFR-090
Current outage answers must be grounded in verified structured system data.

## NFR-091
The AI shall not answer current outage questions solely from model training knowledge.

## NFR-092
The target groundedness rate for production outage answers should be **100%**.

## NFR-093
The system should record enough response metadata to audit:
- event IDs used
- event versions used
- source IDs used
- verification time

## NFR-094
When retrieval fails, the assistant must communicate inability to verify rather than hallucinating.

---

# 12. AI Accuracy

## NFR-100
AI extraction should be evaluated separately for:
- date accuracy
- time accuracy
- location accuracy
- status classification
- cancellation detection
- restoration detection
- coverage type

## NFR-101
A human reviewer shall be able to correct every extracted critical field before publication.

## NFR-102
AI confidence shall be advisory, not authoritative.

## NFR-103
The system shall preserve the original source for comparison against AI extraction.

---

# 13. Freshness

## NFR-110
Every current outage event shall expose:
- source publication time when known
- ingestion time
- verification time
- last update time

## NFR-111
Freshness thresholds shall be configurable.

## NFR-112
Stale events must be visually and textually identified.

## NFR-113
The AI must not describe stale information as definitely current.

---

# 14. Accessibility

## NFR-120
The application should target **WCAG 2.1 AA** accessibility principles.

## NFR-121
Color shall not be the sole indicator of event status.

## NFR-122
All map markers shall have readable textual equivalents.

## NFR-123
Keyboard users shall be able to access major navigation and non-map outage information.

## NFR-124
Interactive controls shall have accessible names.

## NFR-125
Text should maintain sufficient contrast.

## NFR-126
The app should support responsive zoom without breaking critical content.

---

# 15. Mobile Responsiveness

## NFR-130
COMS.AI shall be mobile-first.

## NFR-131
Core features must remain usable on common mobile viewport widths.

## NFR-132
Locate Me shall be easily accessible on mobile.

## NFR-133
Map controls must remain touch-friendly.

## NFR-134
Critical event cards shall not require horizontal scrolling.

## NFR-135
The system should support installation as a Progressive Web App where practical.

---

# 16. Usability

## NFR-140
A first-time user should be able to find current outage status without reading documentation.

## NFR-141
Locate Me should require no more than:
1. one user action
2. geolocation permission
3. result display

## NFR-142
The system should display plain-language explanations before technical terminology.

## NFR-143
Cebuano/English mixed-language usage should be supported naturally.

## NFR-144
Critical warnings shall be concise and clearly prioritized.

---

# 17. Internationalization and Language

## NFR-150
User-facing AI responses shall support:
- Cebuano
- English
- Filipino/Tagalog

## NFR-151
Date and time presentation for Cebu shall use the **Asia/Manila** timezone.

## NFR-152
The system shall handle code-switched queries.

## NFR-153
Internal canonical data should remain language-neutral where possible.

---

# 18. Observability

## NFR-160
The application shall log server errors.

## NFR-161
Production monitoring should track:
- API error rate
- database errors
- map API errors
- AI retrieval failures
- AI extraction failures
- notification failures

## NFR-162
Critical admin publishing failures shall be traceable through logs.

## NFR-163
AI ingestion and publication flows should have correlation IDs or equivalent traceability.

---

# 19. Auditability

## NFR-170
The system shall maintain an immutable or append-oriented audit history for critical admin actions.

## NFR-171
Audit records shall include:
- actor
- action
- entity
- timestamp
- before value when appropriate
- after value when appropriate

## NFR-172
AI extraction and human correction should remain auditable.

---

# 20. Maintainability

## NFR-180
Shared status values shall use centralized enums/types.

## NFR-181
Business rules for:
- freshness
- event status
- notifications
- coverage matching
shall not be duplicated across UI components.

## NFR-182
Map provider logic should be abstracted where practical.

## NFR-183
Notification channels should use a common service interface.

## NFR-184
AI provider-specific code should be isolated from core business logic where practical.

## NFR-185
Database schema changes shall use migrations.

---

# 21. Testability

## NFR-190
Critical business logic shall be unit-testable independently of the UI.

## NFR-191
Geospatial matching shall have automated test cases.

## NFR-192
AI extraction shall have fixture-based evaluation cases.

## NFR-193
The system shall include integration tests for:
- publish flow
- Locate Me
- event versioning
- notification evaluation
- authorization

## NFR-194
The system shall include negative tests for:
- malformed uploads
- prompt injection
- unauthorized admin access
- stale events
- partial coverage
- conflicting source data

---

# 22. Backup and Recovery

## NFR-200
Production database backups shall be enabled.

## NFR-201
Source documents required for audit should be stored durably.

## NFR-202
The system should have a documented recovery process for database restoration.

## NFR-203
A deployment shall not intentionally destroy historical outage data.

---

# 23. Data Retention

## NFR-210
Verified event history should be retained for analytics and audit purposes unless policy requires deletion.

## NFR-211
Community reports may expire from active public display while remaining available for controlled historical analytics.

## NFR-212
User-specific data shall follow applicable deletion and retention policies.

---

# 24. Browser and Device Compatibility

## NFR-220
The application should support current major versions of:
- Chrome
- Edge
- Safari
- Firefox

## NFR-221
Core public features shall remain usable when push notifications are unsupported.

## NFR-222
Core search and outage details shall remain usable if geolocation is unavailable.

---

# 25. Map Resilience

## NFR-230
If the interactive map service fails, the system shall still expose outage information as searchable/list-based text.

## NFR-231
Map rendering failure shall not make critical outage information inaccessible.

## NFR-232
The system should minimize unnecessary geocoding requests using caching where legally and technically appropriate.

---

# 26. Notification Reliability

## NFR-240
Notification delivery shall be asynchronous from event publication.

## NFR-241
Failed notification attempts shall be retryable.

## NFR-242
Duplicate notifications shall be prevented using idempotency controls.

## NFR-243
Notification content must reference the latest verified event version at scheduling time.

---

# 27. Community Safety

## NFR-250
Community reports shall remain visually separate from verified events.

## NFR-251
The platform shall provide mechanisms to detect or reduce:
- spam
- duplicate reports
- automated abuse
- malicious false reporting

## NFR-252
Community report trust scoring must not expose sensitive user identity information publicly.

---

# 28. Legal and Trust Presentation

## NFR-260
The application shall clearly communicate that COMS.AI is an information interpretation and preparedness platform unless formally operated by an official electricity provider.

## NFR-261
Official source statements shall be distinguishable from AI summaries.

## NFR-262
Critical decisions should provide access to the original source when available.

---

# 29. Quality Gates for Production

Before production release, the system should meet these minimum quality gates:

1. No known critical authorization bypass.
2. No known critical geolocation privacy issue.
3. Verified events persist across deployment/restart.
4. Locate Me supports confirmed, partial, nearby, none, and stale states.
5. AI cannot answer current outage status without retrieval.
6. Caption/image conflicts cannot auto-publish.
7. Admin corrections are auditable.
8. Map failure has a text fallback.
9. Notification jobs are deduplicated.
10. Partial geographic coverage is not falsely expanded.
11. Current dates/times use Asia/Manila.
12. Major mobile screens are responsive.
13. Public critical information is keyboard/text accessible.
14. Automated tests cover critical outage logic.
