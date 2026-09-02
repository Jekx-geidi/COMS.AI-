// COMS.AI is scoped to Cebu only (Core Docs/PRD.md "Primary Region: Cebu,
// Philippines"). Every map instance, geocoding call, and location search
// (Stage 3/7) must stay constrained to this bounding box — never render or
// resolve locations outside Cebu province.

export const DEFAULT_MAP_CENTER = { lat: 10.3157, lng: 123.8854 }; // Cebu City

export const CEBU_BOUNDS = {
  south: 9.4,
  west: 123.2,
  north: 11.4,
  east: 124.2,
};

export const DEFAULT_ZOOM = 12;
export const MIN_ZOOM = 9; // prevents zooming out far enough to show areas outside Cebu
export const MAX_ZOOM = 19;

// Standard OpenStreetMap raster tiles — free, no API key required. CARTO's
// dark basemap needed a paid key that was never configured, so the map
// previously rendered with boundary outlines only and no real basemap
// underneath; this is the actual tile source in use now.
export const OSM_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export function isWithinCebuBounds(point: { lat: number; lng: number }): boolean {
  return (
    point.lat >= CEBU_BOUNDS.south &&
    point.lat <= CEBU_BOUNDS.north &&
    point.lng >= CEBU_BOUNDS.west &&
    point.lng <= CEBU_BOUNDS.east
  );
}
