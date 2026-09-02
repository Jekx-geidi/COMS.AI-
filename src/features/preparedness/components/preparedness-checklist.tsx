import type { ChecklistItem } from "../types";

export function PreparednessChecklist({
  items,
  checked,
  onToggle,
}: {
  items: ChecklistItem[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const doneCount = items.filter((item) => checked[item.id]).length;

  return (
    <div className="rounded-panel border border-border-subtle bg-bg-1 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        Preparation {doneCount} / {items.length}
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => {
          const isChecked = !!checked[item.id];
          return (
            <li key={item.id}>
              <button
                onClick={() => onToggle(item.id)}
                className="flex w-full items-center gap-2.5 text-left text-sm"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    isChecked
                      ? "border-status-stable bg-status-stable/20 text-status-stable"
                      : "border-border-subtle text-transparent"
                  }`}
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span className={isChecked ? "text-text-secondary line-through" : "text-text-primary"}>
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
