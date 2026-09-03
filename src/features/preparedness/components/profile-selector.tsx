import { BriefcaseBusiness, Car, GraduationCap, HeartPulse, Home, Laptop, Plane, Store, UserRound } from "lucide-react";
import { PROFILE_OPTIONS } from "../data";
import type { PreparednessProfile } from "../types";

const ICONS = {
  STUDENT: GraduationCap,
  OFFICE_WORKER: BriefcaseBusiness,
  REMOTE_WORKER: Laptop,
  HOUSEHOLD: Home,
  BUSINESS: Store,
  TOURIST: Plane,
  SENIOR_CAREGIVER: HeartPulse,
  COMMUTER_DRIVER: Car,
  CUSTOM: UserRound,
} satisfies Record<PreparednessProfile, typeof GraduationCap>;

export function ProfileSelector({
  value,
  onChange,
}: {
  value: PreparednessProfile;
  onChange: (profile: PreparednessProfile) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {PROFILE_OPTIONS.map((profile) => {
        const Icon = ICONS[profile.id];
        const selected = value === profile.id;
        return (
          <button
            key={profile.id}
            type="button"
            onClick={() => onChange(profile.id)}
            className={`flex min-h-[104px] items-start gap-3 rounded-panel border p-3 text-left transition-colors ${
              selected
                ? "border-brand-cyan bg-brand-cyan/15 text-text-primary shadow-cyan"
                : "border-border-subtle bg-bg-1/75 text-text-secondary hover:border-border-strong hover:bg-bg-2/60 hover:text-text-primary"
            }`}
            aria-pressed={selected}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-control ${
                selected ? "bg-brand-cyan text-text-on-accent" : "bg-bg-2 text-brand-cyan"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{profile.label}</span>
              <span className="mt-1 block text-xs leading-5">{profile.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
