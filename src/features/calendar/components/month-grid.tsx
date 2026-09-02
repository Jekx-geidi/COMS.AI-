import type { CalendarEvent } from "../types";

interface MonthGridProps {
  events: CalendarEvent[];
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
}

// Lightweight month grid — day cell shows a count dot when events exist
// (UIS.md #32 "day cell: date, status count"). Full calendar rendering with
// multi-month navigation is deferred; this covers the current month.
export function MonthGrid({ events, selectedDay, onSelectDay }: MonthGridProps) {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstWeekday = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

  const countByDay = new Map<number, number>();
  for (const event of events) {
    const d = new Date(event.startAt);
    if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
      countByDay.set(d.getDate(), (countByDay.get(d.getDate()) ?? 0) + 1);
    }
  }

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
        <span key={i} className="pb-1 text-center text-[10px] text-text-secondary">
          {d}
        </span>
      ))}
      {cells.map((day, i) => {
        if (day === null) return <span key={`empty-${i}`} />;
        const count = countByDay.get(day) ?? 0;
        const isToday = day === now.getDate();
        return (
          <button
            key={day}
            onClick={() => onSelectDay(day)}
            className={`flex aspect-square flex-col items-center justify-center rounded-control border text-xs ${
              selectedDay === day
                ? "border-brand-cyan bg-brand-cyan/15 text-brand-cyan"
                : isToday
                  ? "border-border-subtle bg-bg-2 text-text-primary"
                  : "border-border-subtle text-text-secondary"
            }`}
          >
            {day}
            {count > 0 && (
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-status-scheduled" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}
