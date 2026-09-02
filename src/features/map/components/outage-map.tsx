"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Maximize2, Minimize2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import {
  OSM_TILE_URL,
  OSM_ATTRIBUTION,
  CEBU_BOUNDS,
  DEFAULT_MAP_CENTER,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
} from "@/config/map";
import { getOutageStatusDisplay, TONE_HEX } from "@/lib/utils/status-display";
import { formatDate, formatTimeRange, formatRelativeVerified } from "@/lib/dates/format-outage-time";
import type { MapEventSummary } from "../types";

const LABEL_MIN_ZOOM = 13;

// Leaflet renders the interactive map. Standard OpenStreetMap raster tiles
// are used beneath our Cebu boundaries; event markers and boundaries
// deliberately use Canvas/HTML renderers rather than SVG assets.
export function OutageMap({ events }: { events: MapEventSummary[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const labelsLayerRef = useRef<L.LayerGroup | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!containerRef.current) return;

    if (!mapRef.current) {
      const bounds = L.latLngBounds(
        [CEBU_BOUNDS.south, CEBU_BOUNDS.west],
        [CEBU_BOUNDS.north, CEBU_BOUNDS.east]
      );
      const vectorRenderer = L.canvas({ padding: 0.5 });

      const map = L.map(containerRef.current, {
        center: [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng],
        zoom: DEFAULT_ZOOM,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        maxBounds: bounds.pad(0.2),
        maxBoundsViscosity: 1,
        renderer: vectorRenderer,
      });

      L.tileLayer(OSM_TILE_URL, {
        maxZoom: MAX_ZOOM,
        attribution: OSM_ATTRIBUTION,
      }).addTo(map);

      fetch("/map/cebu-boundaries.geojson")
        .then((res) => res.json())
        .then((geojson: GeoJSON.FeatureCollection) => {
          if (cancelled) return;
          L.geoJSON(geojson, {
            style: {
              color: "#6de4ff",
              weight: 1.2,
              opacity: 0.62,
              fillColor: "#0d2553",
              fillOpacity: 0.08,
            },
            onEachFeature: (feature, layer) => {
              const name = feature.properties?.name;
              if (name) layer.bindTooltip(name, { sticky: true, opacity: 0.9 });
            },
          }).addTo(map);
          map.attributionControl.addAttribution(
            'Boundaries: <a href="https://github.com/faeldon/philippines-json-maps">PH PSGC (MIT)</a>, <a href="https://www.geoboundaries.org">geoBoundaries.org</a> (CC BY 3.0 IGO)'
          );
        })
        .catch(() => {
          // Boundary context is supplementary. The tile layer and the page's
          // text-list fallback remain available if this request fails.
        });

      // Barangay/neighborhood name labels — point data only (see
      // scripts/build-cebu-barangay-labels.mjs for why: no polygon source
      // exists for these 3 cities' barangays). Hidden until the user zooms
      // in past LABEL_MIN_ZOOM so 387 points don't clutter the province view.
      const labelsLayer = L.layerGroup();
      labelsLayerRef.current = labelsLayer;

      fetch("/map/cebu-barangay-labels.geojson")
        .then((res) => res.json())
        .then((geojson: GeoJSON.FeatureCollection) => {
          if (cancelled) return;
          for (const feature of geojson.features) {
            if (feature.geometry.type !== "Point") continue;
            const lng = feature.geometry.coordinates[0];
            const lat = feature.geometry.coordinates[1];
            const name = feature.properties?.name;
            if (!name || lat === undefined || lng === undefined) continue;

            const icon = L.divIcon({
              className: "coms-place-label",
              html: `<span>${name}</span>`,
              iconSize: [0, 0],
            });
            L.marker([lat, lng], { icon, interactive: false }).addTo(labelsLayer);
          }

          const updateLabelVisibility = () => {
            if (map.getZoom() >= LABEL_MIN_ZOOM) {
              if (!map.hasLayer(labelsLayer)) labelsLayer.addTo(map);
            } else if (map.hasLayer(labelsLayer)) {
              map.removeLayer(labelsLayer);
            }
          };
          map.on("zoomend", updateLabelVisibility);
          updateLabelVisibility();
        })
        .catch(() => {
          // Labels are supplementary context, not critical data.
        });

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    }

    const markersLayer = markersLayerRef.current;
    markersLayer?.clearLayers();

    for (const event of events) {
      const tone = getOutageStatusDisplay(event.status).tone;
      const color = TONE_HEX[tone];

      const marker = L.marker([event.point.lat, event.point.lng], {
        icon: L.divIcon({
          className: "coms-map-event-marker",
          html: `<span style="--marker-color:${color}"></span>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -14],
        }),
      });

      const timeRange = formatTimeRange(event.startAt, event.endAt);
      marker.bindPopup(
        `<strong>${event.locationLabel}</strong><br/>` +
          `${getOutageStatusDisplay(event.status).label}` +
          (formatDate(event.startAt) ? ` — ${formatDate(event.startAt)}` : "") +
          (timeRange ? ` ${timeRange}` : "") +
          (event.coverageDescription ? `<br/>${event.coverageDescription}` : "") +
          `<br/><small>${event.sourceName}${
            event.verifiedAt ? ` · verified ${formatRelativeVerified(event.verifiedAt)}` : ""
          }</small>`
      );

      markersLayer?.addLayer(marker);
    }

    return () => {
      cancelled = true;
    };
  }, [events]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Leaflet caches tile positions against its container's size at creation
  // time, so a pure CSS resize (fixed-overlay expand/collapse) leaves it
  // drawing at the old dimensions until invalidateSize() runs. A single
  // requestAnimationFrame after toggling isExpanded isn't reliable here:
  // going into `position: fixed` can take an extra layout/paint pass before
  // getBoundingClientRect reflects the real size, so Leaflet was measuring
  // too early, deciding nothing changed, and leaving the old (often
  // zero-tile, background-color-only) view in place — the "falls back to
  // dark" bug. A ResizeObserver reacts to the container's *actual* measured
  // size instead of guessing timing, so it's correct regardless of cause
  // (this toggle, a window resize, a sidebar collapse, etc.).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      mapRef.current?.invalidateSize();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isExpanded) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isExpanded]);

  return (
    <div
      className={
        isExpanded
          ? "fixed inset-0 z-50 bg-bg-0 p-3 md:p-6"
          : "relative"
      }
    >
      {/* Leaflet imperatively adds its own classes (leaflet-container, etc.,
          which carry position/overflow rules the whole coordinate system
          depends on) directly to the containerRef div. Toggling a *different*
          className on that same node makes React overwrite the class
          attribute wholesale on every render, silently wiping Leaflet's
          classes and breaking tile positioning. So containerRef's className
          stays permanently static, and this wrapper (which React fully owns
          and Leaflet never touches) carries the size toggle instead. */}
      <div className={isExpanded ? "h-full w-full" : "h-[360px] w-full md:h-[480px]"}>
        <div
          ref={containerRef}
          className="h-full w-full overflow-hidden rounded-panel border border-border-subtle"
          role="img"
          aria-label="Interactive map of Cebu showing power interruption locations"
        />
      </div>
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-label={isExpanded ? "Exit fullscreen map" : "Expand map to fullscreen"}
        className="absolute right-3 top-3 z-[1000] inline-flex h-9 w-9 items-center justify-center rounded-control border border-border-subtle bg-bg-1/90 text-text-primary shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
      >
        {isExpanded ? <Minimize2 className="h-4 w-4" aria-hidden="true" /> : <Maximize2 className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
