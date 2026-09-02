"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { findContainingFeature } from "@/lib/geo/point-in-polygon";
import { getOutageStatusDisplay, TONE_HEX } from "@/lib/utils/status-display";
import { getAffectedAreas } from "@/features/locate-me/services/locate-me.service";
import { OSM_TILE_URL, OSM_ATTRIBUTION, MAX_ZOOM } from "@/config/map";

interface LocateResultMapProps {
  coords: { lat: number; lng: number };
}

// Shows the actual Cebu boundaries map (same source as the Live Map) zoomed
// to the user's detected point, with the containing municipality colorized
// if a verified event affects it — the visual counterpart to the text result
// card (UFR-223 requires the text card to work standalone too; this is the
// enhancement, not a replacement).
export function LocateResultMap({ coords }: LocateResultMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [coords.lat, coords.lng],
      zoom: 13,
      minZoom: 10,
      maxZoom: 17,
    });
    mapRef.current = map;

    L.tileLayer(OSM_TILE_URL, {
      maxZoom: MAX_ZOOM,
      attribution: OSM_ATTRIBUTION,
    }).addTo(map);

    Promise.all([
      fetch("/map/cebu-boundaries.geojson").then((res) => res.json()),
      getAffectedAreas(),
    ])
      .then(([geojson, areas]: [GeoJSON.FeatureCollection, Awaited<ReturnType<typeof getAffectedAreas>>]) => {
        if (cancelled) return;

        const containing = findContainingFeature<GeoJSON.Feature>(
          coords.lat,
          coords.lng,
          geojson
        );
        const containingName = containing?.properties?.name as string | undefined;

        const affectedArea = containingName
          ? areas.find((area) => area.municipality === containingName)
          : undefined;

        const boundariesLayer = L.geoJSON(geojson, {
          style: (feature) => {
            const isAffected =
              affectedArea && feature?.properties?.name === affectedArea.municipality;
            if (isAffected) {
              const tone = getOutageStatusDisplay(affectedArea.event.status).tone;
              return {
                color: TONE_HEX[tone],
                weight: 2,
                opacity: 0.9,
                fillColor: TONE_HEX[tone],
                fillOpacity: 0.35,
              };
            }
            return {
              color: "#6de4ff",
              weight: 1,
              opacity: 0.4,
              fillColor: "#0d2553",
              fillOpacity: 1,
            };
          },
          onEachFeature: (feature, layer) => {
            const name = feature.properties?.name;
            if (name) layer.bindTooltip(name, { sticky: true, opacity: 0.9 });
          },
        }).addTo(map);

        if (containingName) {
          const layers = boundariesLayer
            .getLayers()
            .filter(
              (l) => (l as L.Path & { feature?: GeoJSON.Feature }).feature?.properties?.name === containingName
            );
          if (layers.length > 0) {
            const bounds = L.latLngBounds([]);
            layers.forEach((l) => bounds.extend((l as L.Polygon).getBounds()));
            map.fitBounds(bounds.pad(0.15));
          }
        }

        map.attributionControl.addAttribution(
          'Boundaries: <a href="https://github.com/faeldon/philippines-json-maps">PH PSGC (MIT)</a>, <a href="https://www.geoboundaries.org">geoBoundaries.org</a> (CC BY 3.0 IGO)'
        );
      })
      .catch(() => {
        // Map is supplementary — the text result card below still works.
      });

    // User position: cyan ring + white center (UIS.md #24), distinct from
    // outage-event markers.
    L.circleMarker([coords.lat, coords.lng], {
      radius: 14,
      color: "#6de4ff",
      weight: 2,
      fillOpacity: 0,
    }).addTo(map);
    L.circleMarker([coords.lat, coords.lng], {
      radius: 6,
      color: "#19b8e8",
      weight: 2,
      fillColor: "#f7fbff",
      fillOpacity: 1,
    }).addTo(map);

    return () => {
      cancelled = true;
      map.remove();
      mapRef.current = null;
    };
  }, [coords.lat, coords.lng]);

  return (
    <div
      ref={containerRef}
      className="h-[280px] w-full overflow-hidden rounded-panel border border-border-subtle"
      role="img"
      aria-label="Map showing your detected location in Cebu"
    />
  );
}
