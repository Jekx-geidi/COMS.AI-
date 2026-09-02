import { PROFILE_LABELS } from "../data";
import type { PreparednessProfile } from "../types";

export function ProfileSelector({
  value,
  onChange,
}: {
  value: PreparednessProfile;
  onChange: (profile: PreparednessProfile) => void;
}) {
  return (
    <div className="flex min-w-0 gap-2 overflow-x-auto">
      {(Object.keys(PROFILE_LABELS) as PreparednessProfile[]).map((profile) => (
        <button
          key={profile}
          onClick={() => onChange(profile)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
            value === profile
              ? "border-brand-cyan bg-brand-cyan/15 text-brand-cyan"
              : "border-border-subtle text-text-secondary"
          }`}
        >
          {PROFILE_LABELS[profile]}
        </button>
      ))}
    </div>
  );
}
