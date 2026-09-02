import { readFile } from "node:fs/promises";
import path from "node:path";
import { CEBU_MUNICIPALITIES } from "@/config/cebu-municipalities";
import { findContainingFeature } from "./point-in-polygon";
import type { ResolvedArea } from "@/features/outage-events/schemas/advisory-extraction.schema";

// Two separate systems, deliberately: the AI says WHICH names were
// mentioned; this module is the only thing allowed to say WHERE they are,
// against the actual boundary/label data on disk — never an LLM guess.
let boundariesCache: GeoJSON.FeatureCollection | null = null;
let barangayCache: GeoJSON.FeatureCollection | null = null;

async function loadBoundaries(): Promise<GeoJSON.FeatureCollection> {
  if (!boundariesCache) {
    const file = await readFile(path.join(process.cwd(), "public/map/cebu-boundaries.geojson"), "utf8");
    boundariesCache = JSON.parse(file);
  }
  return boundariesCache!;
}

async function loadBarangayLabels(): Promise<GeoJSON.FeatureCollection> {
  if (!barangayCache) {
    const file = await readFile(path.join(process.cwd(), "public/map/cebu-barangay-labels.geojson"), "utf8");
    barangayCache = JSON.parse(file);
  }
  return barangayCache!;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

// Simple exterior-ring average — good enough for "roughly where to drop a
// pin," not a survey-grade centroid. Never used to draw a boundary, only to
// place a marker when no more precise (barangay) point resolved.
function approximateCentroid(geometry: GeoJSON.Geometry): { lat: number; lng: number } | null {
  const rings: [number, number][][] =
    geometry.type === "Polygon"
      ? [(geometry.coordinates as [number, number][][])[0]!]
      : geometry.type === "MultiPolygon"
        ? (geometry.coordinates as [number, number][][][]).map((poly) => poly[0]!)
        : [];

  const points = rings.flat();
  if (points.length === 0) return null;

  const sum = points.reduce((acc, [lng, lat]) => ({ lat: acc.lat + lat, lng: acc.lng + lng }), { lat: 0, lng: 0 });
  return { lat: sum.lat / points.length, lng: sum.lng / points.length };
}

export async function resolveLocationNames(mentions: string[]): Promise<ResolvedArea[]> {
  const boundaries = await loadBoundaries();
  const barangayLabels = await loadBarangayLabels();

  return mentions.map((mention): ResolvedArea => {
    const needle = normalize(mention);

    // 1. Direct municipality/city match — exact only. A substring/contains
    // fallback here previously matched unrelated names across municipality
    // boundaries (e.g. a Mandaue barangay mention resolving into Cordova, a
    // different island entirely, because one barangay's name happened to be
    // a substring of another's) — silently wrong is worse than unresolved.
    const municipalityMatch = CEBU_MUNICIPALITIES.find((name) => normalize(name) === needle);
    if (municipalityMatch) {
      const feature = boundaries.features.find((f) => f.properties?.name === municipalityMatch);
      const point = feature ? approximateCentroid(feature.geometry) : null;

      return {
        mentionedAs: mention,
        resolvedType: "municipality",
        municipality: municipalityMatch,
        barangayName: null,
        point,
      };
    }

    // 2. Barangay/neighborhood point match — exact only, same reasoning as
    // above. Recognized name, but only a point, not a boundary; infer the
    // containing municipality by testing that point against the real
    // polygons (never guessed).
    const barangayFeature = barangayLabels.features.find((f) => {
      const name = f.properties?.name as string | undefined;
      return name && normalize(name) === needle;
    });

    if (barangayFeature && barangayFeature.geometry.type === "Point") {
      const [lng, lat] = barangayFeature.geometry.coordinates as [number, number];
      const containing = findContainingFeature<GeoJSON.Feature>(lat, lng, boundaries);
      const municipality = (containing?.properties?.name as string | undefined) ?? null;

      return {
        mentionedAs: mention,
        resolvedType: "barangay",
        municipality,
        barangayName: barangayFeature.properties?.name as string,
        point: { lat, lng },
      };
    }

    // 3. Nothing matched — surfaced to the admin, never silently dropped.
    return {
      mentionedAs: mention,
      resolvedType: "unresolved",
      municipality: null,
      barangayName: null,
      point: null,
    };
  });
}
