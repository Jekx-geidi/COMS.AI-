"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { getMapEvents } from "@/features/map/services/map-data.service";
import { MapEventCard } from "@/features/map/components/map-event-card";
import { MapFilterPanel, type MapFilter } from "@/features/map/components/map-filter-panel";
import { MapLegend } from "@/features/map/components/map-legend";
import type { MapEventSummary } from "@/features/map/types";

// Leaflet touches `window`/`document` at module scope — never let it run
// during SSR (standard Next.js pattern for Leaflet).
const OutageMap = dynamic(
  () => import("@/features/map/components/outage-map").then((m) => m.OutageMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] w-full animate-pulse items-center justify-center rounded-panel border border-border-subtle bg-bg-1 md:h-[480px]">
        <p className="text-xs text-text-secondary">Loading map…</p>
      </div>
    ),
  }
);

export default function MapPage() {
  const [events, setEvents] = useState<MapEventSummary[]>([]);
  const [filter, setFilter] = useState<MapFilter>("ALL");

  useEffect(() => {
    getMapEvents().then(setEvents);
  }, []);

  const filtered = useMemo(() => {
    if (filter === "ALL") return events;
    if (filter === "COMMUNITY") return events.filter((e) => e.isCommunity);
    return events.filter((e) => e.status === filter);
  }, [events, filter]);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="font-display text-lg font-semibold">Live Map</h1>
        <p className="text-sm text-text-secondary">
          Where interruptions are happening or scheduled across Cebu.
        </p>
      </header>

      <div className="flex items-center gap-2 rounded-control border border-border-subtle bg-bg-2 px-3 py-2.5">
        <Search className="h-4 w-4 text-text-secondary" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search location (coming in Stage 3)"
          disabled
          className="w-full bg-transparent text-sm text-text-secondary placeholder:text-text-secondary/70 focus:outline-none"
        />
      </div>

      <MapFilterPanel value={filter} onChange={setFilter} />

      {/* Leaflet loads standard OpenStreetMap tiles, plus local Cebu
          boundaries on top. The list below remains regardless, per
          NFR-230/231. */}
      <OutageMap events={filtered} />

      <MapLegend />

      {filtered.length === 0 ? (
        <p className="rounded-panel border border-border-subtle bg-bg-1/60 px-4 py-6 text-center text-sm text-text-secondary">
          No verified events match this filter.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((event) => (
            <MapEventCard key={event.id} event={event} />
          ))}
        </ul>
      )}
    </div>
  );
}
