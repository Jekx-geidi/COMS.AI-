import type { OutageStatus } from "@/types/outage";

export type MapFilter = "ALL" | OutageStatus | "COMMUNITY";

const FILTERS: { value: MapFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "POSSIBLE", label: "Possible" },
  { value: "RESTORED", label: "Restored" },
  { value: "COMMUNITY", label: "Community" },
];

// PRD F-002 §6.7 filter set, scoped to what the current mock dataset can
// meaningfully demonstrate (time filters live on the Calendar page for now).
export function MapFilterPanel({
  value,
  onChange,
}: {
  value: MapFilter;
  onChange: (filter: MapFilter) => void;
}) {
  return (
    <div className="flex min-w-0 gap-2 overflow-x-auto">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
            value === f.value
              ? "border-brand-cyan bg-brand-cyan/15 text-brand-cyan"
              : "border-border-subtle text-text-secondary"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
