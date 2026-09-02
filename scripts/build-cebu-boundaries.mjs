// One-off build script: merges Cebu Province municipality/component-city
// boundaries (faeldon/philippines-json-maps, MIT) with the 3 Highly
// Urbanized Cities missing from that dataset — Cebu City, Mandaue City,
// Lapu-Lapu City (geoBoundaries.org PHL ADM3, CC BY 3.0 IGO) — into one
// normalized FeatureCollection at public/map/cebu-boundaries.geojson.
//
// Re-run only if the upstream sources change; this is not part of the app
// runtime.
import fs from "node:fs";
import path from "node:path";

// medres ("normal" resolution per user request) — noticeably more detailed
// boundary vertices than lowres (233KB vs 46KB), still light enough to fetch
// client-side without hires's ~1.8MB cost.
const PROVINCE_URL =
  "https://raw.githubusercontent.com/faeldon/philippines-json-maps/master/2023/geojson/provdists/medres/municities-provdist-702200000.0.01.json";
const ADM3_URL =
  "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/PHL/ADM3/geoBoundaries-PHL-ADM3_simplified.geojson";

const HUC_NAMES = ["Cebu City", "Lapu-Lapu City", "Mandaue City"];

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

const province = await fetchJson(PROVINCE_URL);
const adm3 = await fetchJson(ADM3_URL);

const provinceFeatures = province.features.map((f) => ({
  type: "Feature",
  properties: {
    name: f.properties.adm3_en,
    level: f.properties.geo_level === "City" ? "component_city" : "municipality",
    psgc: f.properties.adm3_psgc,
    source: "faeldon/philippines-json-maps (MIT)",
  },
  geometry: f.geometry,
}));

const hucFeatures = adm3.features
  .filter((f) => HUC_NAMES.includes(f.properties.shapeName))
  .map((f) => ({
    type: "Feature",
    properties: {
      name: f.properties.shapeName,
      level: "highly_urbanized_city",
      psgc: null,
      source: "geoBoundaries.org PHL ADM3 (CC BY 3.0 IGO)",
    },
    geometry: f.geometry,
  }));

if (hucFeatures.length !== HUC_NAMES.length) {
  throw new Error(
    `Expected ${HUC_NAMES.length} HUC features, found ${hucFeatures.length}. Check shapeName matches.`
  );
}

const merged = {
  type: "FeatureCollection",
  properties: {
    description: "Cebu Province municipalities/component cities + 3 independent HUCs",
    sources: [
      "faeldon/philippines-json-maps (MIT License)",
      "geoBoundaries.org PHL ADM3 (CC BY 3.0 IGO)",
    ],
    generatedAt: new Date().toISOString(),
  },
  features: [...provinceFeatures, ...hucFeatures],
};

const outDir = path.resolve(import.meta.dirname, "../public/map");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "cebu-boundaries.geojson"), JSON.stringify(merged));

console.log(`Wrote ${merged.features.length} features to public/map/cebu-boundaries.geojson`);
