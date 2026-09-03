import { Check, Download, RotateCcw } from "lucide-react";
import type { ChecklistItem, ChecklistSectionKey, PreparednessProfile } from "../types";
import { PROFILE_LABELS } from "../data";

const SECTION_LABELS: Record<ChecklistSectionKey, string> = {
  DO_FIRST: "Do first",
  BEFORE: "Before the outage",
  DURING: "During the outage",
  AFTER: "When power returns",
};

const SECTION_HELP: Record<ChecklistSectionKey, string> = {
  DO_FIRST: "Actions that become harder once power or internet is gone.",
  BEFORE: "Preparation to finish before the scheduled window.",
  DURING: "Battery, communication, and practical steps while power is out.",
  AFTER: "Recovery checks once service is restored.",
};

export function PreparednessChecklist({
  profile,
  items,
  checked,
  onToggle,
  onReset,
  onDownload,
}: {
  profile: PreparednessProfile;
  items: ChecklistItem[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  onReset: () => void;
  onDownload: () => void;
}) {
  const doneCount = items.filter((item) => checked[item.id]).length;
  const sections = (Object.keys(SECTION_LABELS) as ChecklistSectionKey[])
    .map((section) => ({ section, items: items.filter((item) => item.section === section) }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-panel border border-border-subtle bg-bg-1 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-cyan">
              {PROFILE_LABELS[profile]} mode
            </p>
            <h2 className="mt-1 font-display text-base font-semibold">Your outage to-do list</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {doneCount} of {items.length} tasks complete. Your progress is saved on this device.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center gap-2 rounded-control border border-border-subtle bg-bg-2 px-3 py-2 text-xs font-semibold text-text-primary transition-colors hover:border-brand-cyan hover:text-brand-cyan"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-control border border-border-subtle px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-status-critical hover:text-status-critical"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {sections.map(({ section, items: sectionItems }) => (
        <section key={section} className="rounded-panel border border-border-subtle bg-bg-1/85 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              {SECTION_LABELS[section]}
            </p>
            <p className="mt-1 text-xs text-text-secondary">{SECTION_HELP[section]}</p>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {sectionItems.map((item) => {
              const isChecked = !!checked[item.id];
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onToggle(item.id)}
                    className={`flex w-full items-start gap-3 rounded-control border px-3 py-3 text-left transition-colors ${
                      isChecked
                        ? "border-status-stable/40 bg-status-stable/10"
                        : "border-border-subtle bg-bg-2/35 hover:border-border-strong hover:bg-bg-2/70"
                    }`}
                    aria-pressed={isChecked}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        isChecked
                          ? "border-status-stable bg-status-stable text-bg-0"
                          : "border-border-strong text-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className={isChecked ? "block text-sm text-text-secondary line-through" : "block text-sm text-text-primary"}>
                        {item.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-text-secondary">{item.detail}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
