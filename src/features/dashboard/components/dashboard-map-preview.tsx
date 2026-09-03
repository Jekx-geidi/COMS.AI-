"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Layers, MapPin, Radio } from "lucide-react";
import { getMapEvents } from "@/features/map/services/map-data.service";
import type { MapEventSummary } from "@/features/map/types";

const OutageMap = dynamic(
  () => import("@/features/map/components/outage-map").then((m) => m.OutageMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] w-full animate-pulse items-center justify-center rounded-panel bg-bg-1 md:h-[460px]">
        <p className="text-xs text-text-secondary">Loading map...</p>
      </div>
    ),
  }
);

export function DashboardMapPreview() {
  const [events, setEvents] = useState<MapEventSummary[]>([]);

  useEffect(() => {
    let cancelled = false;
    getMapEvents().then((items) => {
      if (!cancelled) setEvents(items);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="overflow-hidden rounded-panel bg-bg-1/95 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
      <div className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
        <div>
          <h2 className="font-display text-base font-semibold">Live Tracking Map</h2>
          <p className="mt-0.5 text-xs text-text-secondary">
            Cebu outages and scheduled interruptions on the shared Leaflet map.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] font-medium text-text-secondary">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-2/70 px-3 py-1.5">
            <Radio className="h-3.5 w-3.5 text-status-stable" aria-hidden="true" />
            Live
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-2/70 px-3 py-1.5">
            <Layers className="h-3.5 w-3.5 text-brand-cyan" aria-hidden="true" />
            Canvas boundaries
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-2/70 px-3 py-1.5">
            <MapPin className="h-3.5 w-3.5 text-status-scheduled" aria-hidden="true" />
            {events.length} events
          </span>
        </div>
      </div>
      <div className="px-2 pb-2 md:px-3 md:pb-3">
        <OutageMap events={events} />
      </div>
    </section>
  );
}
