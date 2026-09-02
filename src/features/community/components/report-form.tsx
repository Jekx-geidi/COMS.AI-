"use client";

import { useState } from "react";
import type { ReportType } from "@/types/community";
import { getCommunityReportLabel } from "@/lib/utils/status-display";

const REPORT_TYPES: ReportType[] = [
  "POWER_OUT",
  "POWER_RESTORED",
  "FLICKERING",
  "LOW_VOLTAGE",
  "INTERMITTENT",
];

interface ReportFormProps {
  onSubmit: (input: { reportType: ReportType; locationText: string; note?: string }) => void;
  onCancel: () => void;
}

export function ReportForm({ onSubmit, onCancel }: ReportFormProps) {
  const [reportType, setReportType] = useState<ReportType>("POWER_OUT");
  const [locationText, setLocationText] = useState("");
  const [note, setNote] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!locationText.trim()) return;
        onSubmit({ reportType, locationText: locationText.trim(), note: note.trim() || undefined });
      }}
      className="flex flex-col gap-3 rounded-panel border border-status-community/50 bg-bg-1 p-4"
    >
      <div>
        <label className="mb-1.5 block text-xs text-text-secondary">What are you seeing?</label>
        <div className="flex flex-wrap gap-1.5">
          {REPORT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setReportType(type)}
              className={`rounded-full border px-3 py-1.5 text-xs ${
                reportType === type
                  ? "border-status-community bg-status-community/15 text-status-community"
                  : "border-border-subtle text-text-secondary"
              }`}
            >
              {getCommunityReportLabel(type)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-secondary">Location</label>
        <input
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
          placeholder="e.g. Banilad, Cebu City"
          required
          className="w-full rounded-control border border-border-subtle bg-bg-2 px-3 py-2 text-sm placeholder:text-text-secondary/60"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-secondary">Note (optional)</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything else worth noting?"
          className="w-full rounded-control border border-border-subtle bg-bg-2 px-3 py-2 text-sm placeholder:text-text-secondary/60"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-control bg-status-community px-4 py-2.5 text-sm font-semibold text-text-on-accent"
        >
          Submit Report
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-control border border-border-subtle px-4 py-2.5 text-sm text-text-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
