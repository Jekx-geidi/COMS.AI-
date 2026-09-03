import type { CalendarEvent } from "../types";

interface MonthGridProps {
  events: CalendarEvent[];
  visibleYear: number;
  visibleMonth: number;
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
}

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function eventDateKey(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function MonthGrid({ events, visibleYear, visibleMonth, selectedDateKey, onSelectDate }: MonthGridProps) {
  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();
  const firstWeekday = new Date(visibleYear, visibleMonth, 1).getDay();

  const countByDay = new Map<number, number>();
  for (const event of events) {
    const key = eventDateKey(event.startAt);
    const [year, month, day] = key.split("-").map(Number);
    if (year === visibleYear && month === visibleMonth + 1 && day) {
      countByDay.set(day, (countByDay.get(day) ?? 0) + 1);
    }
  }

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="overflow-hidden rounded-panel border border-border-subtle bg-bg-1">
      <div className="grid grid-cols-7 border-b border-border-subtle bg-bg-2/50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span key={day} className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
            {day}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, index) => {
          if (day === null) {
            return <span key={`empty-${index}`} className="min-h-20 border-b border-r border-border-subtle/60 bg-bg-0/30" />;
          }

          const key = toDateKey(visibleYear, visibleMonth, day);
          const count = countByDay.get(day) ?? 0;
          const selected = selectedDateKey === key;
          const isToday = key === todayKey;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(key)}
              className={`min-h-20 border-b border-r border-border-subtle/60 p-2 text-left transition-colors ${
                selected
                  ? "bg-brand-cyan/15 text-brand-cyan"
                  : isToday
                    ? "bg-bg-2 text-text-primary"
                    : "bg-bg-1 text-text-primary hover:bg-bg-2/70"
              }`}
              aria-pressed={selected}
              aria-label={`Show brownouts for ${key}`}
            >
              <span className="font-mono text-sm">{day}</span>
              {count > 0 && (
                <span className="mt-3 inline-flex items-center rounded-full bg-status-scheduled/15 px-2 py-0.5 text-[11px] font-semibold text-status-scheduled">
                  {count} {count === 1 ? "area" : "areas"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
