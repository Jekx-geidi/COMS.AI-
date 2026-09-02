// Ray-casting point-in-polygon test against raw GeoJSON geometry (Polygon or
// MultiPolygon, with hole support). No PostGIS yet (Stage 3/4) — this is the
// client-safe stand-in used to classify which municipality/city boundary
// contains a detected point.

type Ring = [number, number][]; // [lng, lat] pairs
type PolygonCoords = Ring[]; // first ring = exterior, rest = holes

function pointInRing(lat: number, lng: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const pi = ring[i]!;
    const pj = ring[j]!;
    const xi = pi[0];
    const yi = pi[1];
    const xj = pj[0];
    const yj = pj[1];
    const intersects =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInPolygonCoords(lat: number, lng: number, polygon: PolygonCoords): boolean {
  const [exterior, ...holes] = polygon;
  if (!exterior || !pointInRing(lat, lng, exterior)) return false;
  return !holes.some((hole) => pointInRing(lat, lng, hole));
}

export function pointInGeometry(
  lat: number,
  lng: number,
  geometry: GeoJSON.Geometry
): boolean {
  if (geometry.type === "Polygon") {
    return pointInPolygonCoords(lat, lng, geometry.coordinates as PolygonCoords);
  }
  if (geometry.type === "MultiPolygon") {
    return (geometry.coordinates as PolygonCoords[]).some((poly) =>
      pointInPolygonCoords(lat, lng, poly)
    );
  }
  return false;
}

export function findContainingFeature<F extends GeoJSON.Feature>(
  lat: number,
  lng: number,
  featureCollection: GeoJSON.FeatureCollection
): F | undefined {
  return featureCollection.features.find((f) => pointInGeometry(lat, lng, f.geometry)) as
    | F
    | undefined;
}
