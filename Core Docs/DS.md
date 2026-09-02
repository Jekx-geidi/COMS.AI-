# COMS.AI
## Cebu Outage Monitoring & Intelligence System
### DS.md — Data Schema and Data Structure Specification

**Version:** 1.0  
**Purpose:** Define canonical application data objects and payload shapes used across database, API, AI, map, and frontend.

---

# 1. Canonical Data Rule

The application must not invent different versions of the same entity across multiple modules.

Canonical domain objects must be centralized.

---

# 2. OutageEvent

```ts
type OutageStatus =
  | "NORMAL"
  | "MONITORING"
  | "POSSIBLE"
  | "SCHEDULED"
  | "CONFIRMED"
  | "ONGOING"
  | "RESTORING"
  | "RESTORED"
  | "CANCELLED"
  | "COMPLETED"
  | "UNKNOWN";

interface OutageEvent {
  id: string;
  eventCode?: string;
  eventType: string;
  status: OutageStatus;

  sourceId: string;
  sourceDocumentId?: string;

  effectiveDate?: string;
  startAt?: string;
  endAt?: string;

  reason?: string;

  verified: boolean;
  verificationState:
    | "DRAFT"
    | "REVIEW_REQUIRED"
    | "VERIFIED"
    | "REJECTED"
    | "SUPERSEDED";

  confidence?: number;

  locations: OutageEventLocation[];

  currentVersionId?: string;

  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
}
```

---

# 3. OutageEventLocation

```ts
interface OutageEventLocation {
  id: string;
  outageEventId: string;

  locationId?: string;

  coverageType:
    | "FULL"
    | "PARTIAL"
    | "STREET"
    | "SITIO"
    | "LANDMARK_AREA"
    | "POINT"
    | "POLYGON"
    | "UNKNOWN_EXTENT";

  coverageDescription?: string;

  confidence?: number;

  point?: {
    lat: number;
    lng: number;
  };

  geometry?: GeoJSON.MultiPolygon;
}
```

---

# 4. Location

```ts
interface Location {
  id: string;

  countryCode: "PH";
  region?: string;
  province?: string;
  cityMunicipality?: string;
  barangay?: string;
  sitio?: string;
  street?: string;

  name: string;
  normalizedName: string;
  aliases: string[];

  latitude?: number;
  longitude?: number;

  point?: GeoJSON.Point;
  boundary?: GeoJSON.MultiPolygon;

  boundarySource?: string;

  createdAt: string;
  updatedAt: string;
}
```

---

# 5. UserPlace

```ts
interface UserPlace {
  id: string;
  userId: string;

  label:
    | "Home"
    | "School"
    | "Work"
    | "Business"
    | "Parents' Home"
    | string;

  locationId?: string;

  customAddress?: string;

  latitude?: number;
  longitude?: number;

  notificationEnabled: boolean;

  preparednessProfile?:
    | "HOUSEHOLD"
    | "STUDENT"
    | "REMOTE_WORKER"
    | "BUSINESS";

  createdAt: string;
  updatedAt: string;
}
```

---

# 6. Source

```ts
interface Source {
  id: string;

  name: string;

  type:
    | "UTILITY"
    | "GRID_OPERATOR"
    | "GOVERNMENT"
    | "LGU"
    | "SOCIAL_MEDIA"
    | "WEBSITE"
    | "MANUAL"
    | "OTHER";

  official: boolean;
  sourceUrl?: string;
  trustLevel?: number;
  active: boolean;

  createdAt: string;
  updatedAt: string;
}
```

---

# 7. SourceDocument

```ts
interface SourceDocument {
  id: string;
  sourceId: string;

  sourceUrl?: string;
  rawText?: string;
  imagePath?: string;

  publishedAt?: string;
  capturedAt: string;

  checksum?: string;

  metadata: Record<string, unknown>;

  createdBy?: string;
  createdAt: string;
}
```

---

# 8. AIExtraction

```ts
interface AIExtraction {
  id: string;

  sourceDocumentId: string;

  modelProvider?: string;
  modelName?: string;
  promptVersion?: string;
  schemaVersion?: string;

  extractedPayload: AdvisoryExtractionPayload;

  confidence?: number;

  uncertainties: AIUncertainty[];
  conflicts: AIConflict[];

  reviewRequired: boolean;

  status:
    | "DRAFT"
    | "REVIEW_REQUIRED"
    | "VERIFIED"
    | "REJECTED"
    | "SUPERSEDED";

  createdAt: string;
}
```

---

# 9. AdvisoryExtractionPayload

```ts
interface AdvisoryExtractionPayload {
  eventType?: string;

  status?: OutageStatus;

  publishedAt?: string;
  effectiveDate?: string;

  startAt?: string;
  endAt?: string;

  locations: Array<{
    rawName: string;
    normalizedName?: string;

    cityMunicipality?: string;
    barangay?: string;
    sitio?: string;
    street?: string;

    coverageType:
      | "FULL"
      | "PARTIAL"
      | "STREET"
      | "SITIO"
      | "LANDMARK_AREA"
      | "POINT"
      | "POLYGON"
      | "UNKNOWN_EXTENT";

    coverageDescription?: string;

    confidence?: number;
  }>;

  reason?: string;

  cancellation: boolean;
  restoration: boolean;

  confidence?: number;

  uncertainties: AIUncertainty[];
  conflicts: AIConflict[];
}
```

---

# 10. AIConflict

```ts
interface AIConflict {
  field: string;
  captionValue?: unknown;
  imageValue?: unknown;
  sourceValue?: unknown;
  explanation?: string;
}
```

---

# 11. AIUncertainty

```ts
interface AIUncertainty {
  field: string;
  value?: unknown;
  reason: string;
  confidence?: number;
}
```

---

# 12. EventVersion

```ts
interface OutageEventVersion {
  id: string;
  outageEventId: string;

  versionNumber: number;

  status: OutageStatus;

  effectiveDate?: string;
  startAt?: string;
  endAt?: string;

  reason?: string;

  locationsSnapshot: OutageEventLocation[];

  payload: Record<string, unknown>;

  changeType:
    | "CREATED"
    | "TIME_CHANGED"
    | "DATE_CHANGED"
    | "AREA_CHANGED"
    | "STATUS_CHANGED"
    | "CANCELLED"
    | "RESTORED"
    | "CORRECTED";

  verificationState:
    | "DRAFT"
    | "REVIEW_REQUIRED"
    | "VERIFIED"
    | "REJECTED"
    | "SUPERSEDED";

  changedBy?: string;
  verifiedBy?: string;
  verifiedAt?: string;

  createdAt: string;
}
```

---

# 13. LocateMeRequest

```ts
interface LocateMeRequest {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  requestedAt: string;
}
```

---

# 14. LocateMeResult

```ts
type LocationMatchType =
  | "MATCH_CONFIRMED"
  | "MATCH_PARTIAL_AREA"
  | "MATCH_NEARBY"
  | "NO_VERIFIED_MATCH"
  | "DATA_STALE";

interface LocateMeResult {
  matchType: LocationMatchType;

  detectedLocation?: Location;

  event?: OutageEvent;

  distanceMeters?: number;

  uncertaintyMessage?: string;

  source?: Source;

  lastVerifiedAt?: string;
}
```

---

# 15. CommunityReport

```ts
interface CommunityReport {
  id: string;
  userId: string;

  reportType:
    | "POWER_OUT"
    | "POWER_RESTORED"
    | "FLICKERING"
    | "LOW_VOLTAGE"
    | "INTERMITTENT";

  locationId?: string;
  locationText?: string;

  latitude?: number;
  longitude?: number;

  note?: string;

  trustScore?: number;

  moderationStatus:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "EXPIRED";

  createdAt: string;
  expiresAt?: string;
}
```

---

# 16. CommunityCluster

```ts
interface CommunityCluster {
  id: string;

  clusterType:
    | "POWER_OUT"
    | "POWER_RESTORED"
    | "FLICKERING"
    | "LOW_VOLTAGE"
    | "INTERMITTENT";

  center?: {
    lat: number;
    lng: number;
  };

  reportCount: number;

  firstReportedAt?: string;
  lastReportedAt?: string;

  confidence?: number;

  linkedOutageEventId?: string;

  status: string;
}
```

---

# 17. Notification

```ts
interface Notification {
  id: string;

  userId: string;
  outageEventId?: string;
  eventVersionId?: string;
  userPlaceId?: string;

  notificationType:
    | "NEW_ADVISORY"
    | "TOMORROW_REMINDER"
    | "PREPARATION_REMINDER"
    | "STARTED"
    | "CHANGED"
    | "CANCELLED"
    | "RESTORED"
    | "COMMUNITY_CLUSTER";

  channel:
    | "IN_APP"
    | "WEB_PUSH"
    | "EMAIL"
    | "SMS"
    | "MESSENGER"
    | "VIBER"
    | "TELEGRAM";

  title: string;
  body: string;

  idempotencyKey: string;

  scheduledAt?: string;
  sentAt?: string;
  openedAt?: string;

  deliveryStatus: string;

  createdAt: string;
}
```

---

# 18. AuditLog

```ts
interface AuditLog {
  id: string;

  actorId?: string;

  action: string;
  entityType: string;
  entityId?: string;

  beforeData?: unknown;
  afterData?: unknown;

  correlationId?: string;

  createdAt: string;
}
```

---

# 19. Public Outage API Shape

Recommended response:

```json
{
  "event": {
    "id": "uuid",
    "eventCode": "COMS-2026-000124",
    "status": "SCHEDULED",
    "startAt": "2026-09-04T05:00:00Z",
    "endAt": "2026-09-04T08:00:00Z",
    "reason": "Scheduled service interruption",
    "locations": []
  },
  "source": {
    "name": "Source Name",
    "sourceUrl": "https://..."
  },
  "freshness": {
    "verifiedAt": "2026-09-04T02:24:00Z",
    "stale": false
  }
}
```

---

# 20. AI Grounding Context Shape

Recommended:

```ts
interface OutageGroundingContext {
  currentTime: string;

  normalizedLocation?: Location;

  matchingEvents: OutageEvent[];

  latestVersions: OutageEventVersion[];

  sources: Source[];

  communitySignals?: CommunityCluster[];

  freshness: {
    newestVerifiedAt?: string;
    stale: boolean;
  };
}
```

AI should never receive more private user data than required.

---

# 21. Data Validation Requirements

All payloads must validate:

- UUID format
- enum values
- date/time format
- latitude range
- longitude range
- geometry validity
- confidence 0 to 1
- required fields
- string length
- JSON schema

---

# 22. Nullability Rules

Use null/undefined only when the source genuinely lacks information.

Do not replace unknown values with fabricated defaults.

Example:

Wrong:

```json
{
  "endAt": "2026-09-04T16:00:00+08:00"
}
```

if no end time exists.

Correct:

```json
{
  "endAt": null
}
```

---

# 23. Data Structure Definition of Done

Data structures are complete when:

- database and API names are mapped consistently
- AI structured output validates
- map payloads use canonical location structure
- UUIDs are used consistently
- timestamps use ISO-8601
- public/private fields are clearly separated
- partial coverage is representable
- stale/unknown states are representable
