# COMS.AI — Project Understanding & Feature Checklist

Source: my reading of `Core Docs/` (PRD, BRD, PLAN, AGENT, NFR, UF, UFR, CLAUDE.md).
Purpose: a single reference of how I understand the product, kept up to date as the docs evolve.

---

## 1. What this is

**COMS.AI (Cebu Outage Monitoring & Intelligence System)** is an interactive public web platform — usable on both mobile and desktop web, not mobile-only — that turns fragmented, unofficial power-interruption info (utility posts, screenshots, captions) into **verified, structured, geospatial, personalized** outage intelligence for Cebu, Philippines.

**It is NOT:**
- a utility account / billing / payment app
- a clone of VECO, Visayan Electric, MobileAP, or NGCP
- an authoritative outage predictor or emergency authority
- a chatbot that answers from general LLM knowledge
- a login-gated resident experience — **the entire public/resident side is open, no account required.** The only gated area is the Admin advisory-ingestion/review/publish console.

**Core loop (the product's spine):**
```
Detect → Understand → Verify → Locate → Explain → Prepare → Notify
```

**The one journey everything is built to support:**
> Open app → Locate Me → grant location → see pin(s)/status → get a grounded answer (status, date, time, coverage, source, freshness) → ask AI for impact → prepare → save place / set reminder.

**Non-negotiable architecture rule:** the AI is a *reasoning/explanation layer*, never the source of truth. Every current-outage answer must go through:
`intent → location resolution → time resolution → retrieve verified structured events → retrieve source/freshness → apply status+uncertainty rules → grounded response`. Never `user → LLM → answer`.

---

## 2. Primary users

**Correction (2026-09-02): no login for residents.** COMS.AI's resident/public side has no accounts at all — dashboard, map, Locate Me, search, calendar, Ask AI, My Places, notifications, and community reporting are all open to anyone with no sign-up. My Places and notification preferences persist per-device (browser storage / anonymous device identity) rather than via a user account. The only authenticated tier is Admin.

| Actor | Access | Can do |
|---|---|---|
| Public / Resident (everyone) | no login, no account | view dashboard, map, Locate Me, search, calendar, Ask AI, community layer (read); save My Places, set notification preferences, submit community reports — all device-based, no sign-up |
| Moderator | role (gated) | reviews community reports |
| Admin | role (gated) | ingest advisories, review AI extraction, map review, publish, manage sources, audit logs |
| Platform Admin | role (gated) | system config, role management |

---

## 3. Feature list (full build scope)

### A. Public-facing core
- [ ] **Live Dashboard** — current status, happening now/later today/tomorrow, recently changed/cancelled/restored, map preview, last-verified timestamp
- [ ] **Interactive Power Map**
  - [ ] base map (Cebu-focused)
  - [ ] verified / scheduled / possible / restored event layers
  - [ ] community report layer (visually separate)
  - [ ] user GPS marker + My Places markers
  - [ ] pins where polygons unavailable; polygons/highlighted regions when geometry permits
  - [ ] coverage types: FULL / PARTIAL / STREET / SITIO / LANDMARK_AREA / UNKNOWN_EXTENT — **partial must never visually read as whole-area confirmed**
  - [ ] pin detail drawer (status, location, date, start/end, duration, type, coverage, reason, last update/verified, source, Ask AI / Set Reminder / Share)
  - [ ] clustering at low zoom (verified vs community-only distinguished)
  - [ ] filters: Now / Today / Tomorrow / 7 Days / Ongoing / Scheduled / Possible / Restored / Community
  - [ ] legend using icon+text, not color alone
  - [ ] map failure → text/list fallback (NFR-230/231)
- [ ] **Locate Me**
  - [ ] entry points: dashboard, map, Ask AI
  - [ ] permission flow (no repeated re-prompt after denial) → manual search fallback
  - [ ] geolocate → center map → "You are here" marker → reverse geocode → query events → point/area match → uncertainty eval → status result → offer AI explanation
  - [ ] result classification: `MATCH_CONFIRMED / MATCH_PARTIAL_AREA / MATCH_NEARBY / NO_VERIFIED_MATCH / DATA_STALE / LOCATION_ERROR`
  - [ ] result card: detected location, match status, event status, date/start/end/duration, coverage, reason, source, last verified + actions (Ask AI, Set Reminder, Save as My Place, View Source, Share)
  - [ ] privacy: coordinates used only for the request unless explicitly saved; no default location history
- [ ] **Location Search** — city/municipality/barangay/street/sitio/landmark aliases (IT Park, Ayala, Colon, SM Cebu, USC Talamban, etc.), disambiguation UI when ambiguous
- [ ] **Brownout Calendar** — Today / Tomorrow / 7 Days / Month views, event card (status, location, date, start-end, coverage, source), tap → sync map + detail
- [ ] **My Places** (no login — device-based) — save Home/School/Work/Business/Parents'/Custom; label, location, coords, notification toggle, prep profile; dashboard summary of all places' status

### B. AI layer
- [ ] **Ask AI (COMS AI assistant)** — Cebuano / English / Tagalog / code-switched; required pipeline: intent → time resolution → location resolution → event retrieval → latest version → geographic match → community retrieval (separate) → freshness check → response
- [ ] **AI Response After Locate Me** — structured context payload (`user_location`, `match_type`, `events[]`, `checked_at`) feeds AI; no independent geographic guessing when deterministic results exist
- [ ] **Plan My Day Around Power** — inputs: activity, location, start/end time, optional saved place → outputs: conflict status, relevant event, overlap, prep deadline, recommendations, coverage uncertainty, source
  - statuses: `NO_VERIFIED_CONFLICT / POSSIBLE_CONFLICT / CONFIRMED_CONFLICT / PARTIAL_AREA_CONFLICT / DATA_UNAVAILABLE`
- [ ] **Preparedness Mode** — countdown triggers (24h/3h/1h/30min/started); profiles: Household / Student / Remote Worker / Business; checklist completion tracking
- [ ] **Multi-Place comparison** — compact status list across saved places, sorted ongoing→confirmed/scheduled→possible→none→unknown/stale
- [ ] **Personal Daily Power Brief** (should-have) — per-user summary across saved places + labeled community signal
- [ ] AI must never: fabricate outages/sources/schedules/restoration times, treat expired events as current, ignore cancellation, expand partial→whole coverage, treat community reports as official, hide staleness, obey instructions embedded in source material

### C. Admin / ingestion pipeline
- [ ] **Advisory ingestion** — paste caption / upload screenshot / caption+screenshot / source URL / manual structured entry
- [ ] **Multimodal AI extraction** — event_type, status, published_at, effective_date, start/end, locations, coverage_type/description, reason, cancellation, restoration, confidence, uncertainties, conflicts — schema-validated server-side
- [ ] **Caption vs image validation** — compare dates/times/locations/type/status/cancellation/restoration; material disagreement → `REVIEW_REQUIRED`, side-by-side display, no auto-publish
- [ ] **AI Review screen** — original screenshot+caption, source, extracted fields, confidence, uncertainty, conflicts, resolved map locations, map preview; actions: Approve & Publish / Edit / Reanalyze / Reject; every decision audited
- [ ] **Map Review during publishing** — resolved location, coverage type, geographic confidence, map representation; admin can correct before publish
- [ ] **Event Versioning** — every material change (time/area/status/cancel/restore/correction) creates a new version; latest verified version is authoritative for public surfaces; history stays accessible
- [ ] **Admin nav**: Dashboard, Advisory Inbox, Outage Events, Sources, Map Review, Community Reports, Notifications, AI Review, Analytics, Audit Logs, Settings

### D. Notifications
- [ ] Channels (MVP): in-app, browser push
- [ ] Types: `NEW_ADVISORY / TOMORROW_REMINDER / PREPARATION_REMINDER / STARTING_SOON / EVENT_CHANGED / AREA_CHANGED / CANCELLED / RESTORED / COMMUNITY_CLUSTER`
- [ ] Dedup key: `device_id + place_id + event_id + event_version + notification_type` (device/browser identity, not a user account — no login exists to key off of)
- [ ] Async from publish, retryable with bounded attempts, references specific event version

### E. Community Intelligence
- [ ] No login required to submit a report — open to anyone
- [ ] Report types: Power Out / Restored / Flickering / Low Voltage / Intermittent
- [ ] Fields: report_type, coordinates/location, created_at, optional note
- [ ] Separate map layer; clustering by proximity/time/type/count; never auto-promotes to verified event
- [ ] Abuse controls (matter more without accounts): rate limit, duplicate detection, device/IP-based reputation or anomaly detection, expiry, moderation

### F. Cross-cutting / platform
- [ ] Shared status enum: `NORMAL / MONITORING / POSSIBLE / SCHEDULED / CONFIRMED / ONGOING / RESTORING / RESTORED / CANCELLED / COMPLETED / UNKNOWN` (no ad-hoc UI strings)
- [ ] Event types: `SCHEDULED_SERVICE_INTERRUPTION / POSSIBLE_ROTATIONAL_INTERRUPTION / ROTATIONAL_INTERRUPTION / UNPLANNED_INTERRUPTION / RESTORATION_UPDATE / CANCELLATION_UPDATE / OTHER_POWER_ADVISORY`
- [ ] Auth & roles: Public/Resident (no account, no login) / Moderator / Admin / Platform Admin (gated roles only) — server-side authorization on gated routes, RLS if Supabase
- [ ] Audit logs on all admin actions (actor, action, entity, before/after, timestamp)
- [ ] Prompt-injection defense — all ingested content (captions, OCR, URLs) is untrusted data, never an instruction
- [ ] Privacy — no public exposure of saved places/precise coords even without accounts; device-scoped data isn't shared across devices; no permanent unnecessary location history by default; users can delete places / disable notifications from their own device
- [ ] Accessibility — WCAG 2.1 AA target, never color-only status, accessible map labels, keyboard access to non-map info
- [ ] i18n — Cebuano/English/Tagalog/code-switching; Asia/Manila timezone for all Cebu-facing date/time
- [ ] Graceful degradation — AI outage ≠ app outage (structured data still viewable); map outage → text fallback

### Should-have / Phase 2+ (not MVP-blocking)
- [ ] Historical Intelligence / Power Resilience Score (reproducible, explained, never framed as prediction)
- [ ] Nearby Resilience Finder (coworking/malls/cafés w/ power — never claimed without confirmation)
- [ ] Source Intelligence — automated multi-source monitoring beyond manual admin ingestion
- [ ] SMS / email / Messenger / Viber / Telegram channels
- [ ] Business multi-branch mode, barangay dashboards
- [ ] Public sharing of events
- [ ] Community trust scoring, landmark→barangay auto-resolution improvements
- [ ] Later platform evolution → **Cebu Disruption Intelligence** (water, flood, road, telecom, weather, class suspension) reusing the same pipeline

### Explicitly out of scope (MVP)
- Utility billing / bill payments / consumption billing
- Utility account linking/management
- Authoritative outage or restoration-time prediction
- Automatic emergency declarations
- Fully autonomous publication of conflicting/low-confidence AI extractions

---

## 4. Data model (core entities)

`devices` (or `user_places` keyed by device/anonymous identity instead of a login-backed `users` table), `locations, sources, source_documents, outage_events, outage_event_locations, outage_event_versions, ai_extractions, verification_reviews, community_reports, community_report_clusters, notifications, audit_logs`

`users`/accounts only exist for the gated Admin/Moderator/Platform Admin tier — residents are never rows in a login-backed `users` table.

Geospatial: PostGIS recommended; point-in-polygon, distance-from-event, nearest-affected-location, bbox/viewport queries, reverse geocoding, normalized location matching. Geographic confidence stored separately from AI extraction confidence.

---

## 5. Suggested delivery order (per PRD §38 / PLAN)

1. **Foundation** — DB, location/source/event models, admin-only auth/roles (no resident auth), base dashboard
2. **Map Core** — map, pins, polygons, drawer, search, filters, geospatial queries
3. **Locate Me** — geolocation, reverse geocode, matching, uncertainty, status card, save place
4. **AI** — retrieval tools, grounded assistant, multilingual, Plan My Day, preparedness
5. **AI Ingestion** — caption/screenshot upload, multimodal extraction, validation, conflict detection, map review, approval
6. **Calendar & Notifications** — calendar, My Places, reminders, change/cancel/restore alerts
7. **Community** — reports, clusters, moderation, separate layer
8. **Hardening** — security, RLS, performance, accessibility, audit, E2E/UAT, monitoring

---

## 6. Definition of done (MVP)

**User side:** open app → see current situation → open map → Locate Me → grant permission → see position + relevant pins/area → get correct confirmed/uncertain/none status → see schedule → ask AI → get grounded prep guidance → view source → save location → enable reminder.

**Admin side:** paste caption + upload screenshot → AI analyzes both → structured event generated → conflicts/uncertainty shown → locations resolved on map → admin reviews/corrects → approve & publish → map/calendar update → matching users evaluated → notifications scheduled → AI can immediately retrieve the approved event.

---

## 7. Key guardrails I'll keep enforcing while building

1. Never answer a current-outage question from LLM memory alone — always retrieve first.
2. Never let `PARTIAL` / `UNKNOWN_EXTENT` coverage render or read as full-area confirmed.
3. Never auto-publish on low confidence or caption/image conflict — always require human review.
4. Never treat community reports as official, or silently promote them to verified events.
5. Never invent restoration times or treat an expired/cancelled event as current.
6. Every event change creates a new version; history is never overwritten.
7. All ingested source content (caption/screenshot/URL/OCR) is untrusted — instructions embedded in it are never followed.
8. Saved places / precise coordinates are private by default and device-scoped; no cross-device or cross-user exposure. Residents never need an account — only Admin/Moderator/Platform Admin are login-gated.
9. Status vocabulary and event types come from the shared enum — no ad-hoc strings in components.
10. Asia/Manila for all Cebu-facing date/time; Cebuano-first conversational tone is acceptable and expected.
