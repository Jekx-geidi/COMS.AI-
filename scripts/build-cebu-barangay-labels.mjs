// One-off build script: fetches barangay/neighborhood name + point data for
// Cebu City, Mandaue City, and Lapu-Lapu City from OpenStreetMap (Overpass
// API). Point-based, not polygons — geoBoundaries has no ADM4 (barangay)
// level for the Philippines, and faeldon/philippines-json-maps' barangay
// data (bgysubmuns) excludes all 3 Highly Urbanized Cities (confirmed via
// direct 404s across every resolution tier), which is exactly where COMS.AI's
// data concentrates. OSM's admin_level=10 *boundary relations* are also very
// incomplete for Cebu City specifically, but its place=suburb/neighbourhood
// *nodes* are not — hence points, not polygons, for this layer.
//
// Re-run only if OSM coverage changes; not part of the app runtime.
import fs from "node:fs";
import path from "node:path";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// Bounding box tightly covering Cebu City + Mandaue City + Lapu-Lapu City.
const QUERY = `
[out:json][timeout:90];
(
  node["place"~"^(suburb|neighbourhood|quarter|hamlet|village)$"](10.24,123.84,10.43,124.02);
);
out body;
`;

const res = await fetch(OVERPASS_URL, {
  method: "POST",
  headers: {
    "User-Agent": "coms-ai-build-script/1.0 (github.com/faeldon)",
    Accept: "application/json",
  },
  body: new URLSearchParams({ data: QUERY }),
});
if (!res.ok) throw new Error(`Overpass request failed: ${res.status}`);
const data = await res.json();

const seen = new Set();
const features = data.elements
  .filter((el) => el.tags?.name)
  .filter((el) => {
    // de-dupe identical names at (almost) the same point
    const key = `${el.tags.name}:${el.lat.toFixed(3)}:${el.lon.toFixed(3)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .map((el) => ({
    type: "Feature",
    properties: {
      name: el.tags.name,
      placeType: el.tags.place,
      source: "OpenStreetMap contributors (ODbL)",
    },
    geometry: { type: "Point", coordinates: [el.lon, el.lat] },
  }));

const geojson = {
  type: "FeatureCollection",
  properties: {
    description:
      "Barangay/neighborhood name labels for Cebu City, Mandaue City, Lapu-Lapu City (points only — no polygon data exists for these HUCs in any source checked)",
    source: "OpenStreetMap contributors, ODbL — https://www.openstreetmap.org/copyright",
    generatedAt: new Date().toISOString(),
  },
  features,
};

const outDir = path.resolve(import.meta.dirname, "../public/map");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "cebu-barangay-labels.geojson"), JSON.stringify(geojson));

console.log(`Wrote ${features.length} barangay/place labels to public/map/cebu-barangay-labels.geojson`);
