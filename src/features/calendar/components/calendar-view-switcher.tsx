import type { CalendarView } from "../utils/filter-events";

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: "TODAY", label: "Today" },
  { value: "TOMORROW", label: "Tomorrow" },
  { value: "7_DAYS", label: "7 Days" },
  { value: "MONTH", label: "Month" },
];

export function CalendarViewSwitcher({
  value,
  onChange,
}: {
  value: CalendarView;
  onChange: (view: CalendarView) => void;
}) {
  return (
    <div className="flex min-w-0 gap-2 overflow-x-auto">
      {VIEWS.map((v) => (
        <button
          key={v.value}
          onClick={() => onChange(v.value)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
            value === v.value
              ? "border-brand-cyan bg-brand-cyan/15 text-brand-cyan"
              : "border-border-subtle text-text-secondary"
          }`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
