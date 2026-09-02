import type { OutageEvent } from "@/types/outage";

export interface MockAffectedArea {
  label: string;
  municipality: string; // matches a `name` in public/map/cebu-boundaries.geojson
  point: { lat: number; lng: number };
  confirmedRadiusMeters: number;
  nearbyRadiusMeters: number;
  event: OutageEvent;
  sourceName: string;
}

// TODO(Stage 3/4/8): replace with real repository calls (outage.repository.ts
// + PostGIS point-in-polygon matching, Core Docs/DATABASE-STRUCTURE.md #21).
// Lives under src/lib/db (not a feature folder) because Locate Me, the Map,
// My Places, and Ask COMS AI all depend on this same mock "retrieval" —
// keeping it in lib respects the dependency direction in
// COMS-AI-FILE-BRANCHING-TREE.md #37 (features may depend on lib, not the
// reverse). Coordinates below are illustrative Cebu City reference points,
// not verified outage data.
export function getMockAffectedAreas(): MockAffectedArea[] {
  const now = new Date();
  return [
    {
      label: "Lahug, Cebu City",
      municipality: "Cebu City",
      point: { lat: 10.3277, lng: 123.8917 },
      confirmedRadiusMeters: 900,
      nearbyRadiusMeters: 2500,
      sourceName: "Sample Utility Advisory",
      event: {
        id: "mock-lahug",
        eventType: "SCHEDULED_SERVICE_INTERRUPTION",
        status: "SCHEDULED",
        sourceId: "mock-source",
        startAt: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        endAt: new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString(),
        verified: true,
        verificationState: "VERIFIED",
        locations: [
          {
            id: "mock-lahug-loc",
            outageEventId: "mock-lahug",
            coverageType: "PARTIAL",
            coverageDescription: "Portion of Lahug",
          },
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        verifiedAt: new Date(now.getTime() - 40 * 60 * 1000).toISOString(),
      },
    },
    {
      label: "Talamban, Cebu City",
      municipality: "Cebu City",
      point: { lat: 10.3667, lng: 123.8833 },
      confirmedRadiusMeters: 700,
      nearbyRadiusMeters: 2000,
      sourceName: "Sample Utility Advisory",
      event: {
        id: "mock-talamban",
        eventType: "SCHEDULED_SERVICE_INTERRUPTION",
        status: "SCHEDULED",
        sourceId: "mock-source",
        startAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        endAt: new Date(now.getTime() + 27 * 60 * 60 * 1000).toISOString(),
        verified: true,
        verificationState: "VERIFIED",
        locations: [
          {
            id: "mock-talamban-loc",
            outageEventId: "mock-talamban",
            coverageType: "FULL",
            coverageDescription: "All of the named sitio",
          },
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        verifiedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      label: "Mandaue City",
      municipality: "Mandaue City",
      point: { lat: 10.3236, lng: 123.9223 },
      confirmedRadiusMeters: 3500, // covers most of Mandaue's small land area
      nearbyRadiusMeters: 6000,
      sourceName: "Sample Utility Advisory",
      event: {
        id: "mock-mandaue",
        eventType: "UNPLANNED_INTERRUPTION",
        status: "ONGOING",
        sourceId: "mock-source",
        startAt: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
        verified: true,
        verificationState: "VERIFIED",
        reason: "Feeder maintenance",
        locations: [
          {
            id: "mock-mandaue-loc",
            outageEventId: "mock-mandaue",
            coverageType: "FULL",
            coverageDescription: "All of Mandaue City",
          },
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        verifiedAt: new Date(now.getTime() - 11 * 60 * 1000).toISOString(),
      },
    },
  ];
}
