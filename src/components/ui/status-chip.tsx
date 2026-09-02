import { Zap, Clock, Triangle, RotateCw, Check, Radio, HelpCircle } from "lucide-react";
import type { OutageStatus } from "@/types/outage";
import { getOutageStatusDisplay, TONE_CLASSES, type StatusTone } from "@/lib/utils/status-display";

// Every status chip must pair color with an icon and text label — never color
// alone (UIS.md #19, #47 / UFR-220).

const TONE_ICON: Record<StatusTone, React.ComponentType<{ className?: string }>> = {
  critical: Zap,
  scheduled: Clock,
  monitor: Triangle,
  restoring: RotateCw,
  stable: Check,
  community: Radio,
  unknown: HelpCircle,
};

export function StatusChip({ status }: { status: OutageStatus }) {
  const display = getOutageStatusDisplay(status);
  return <ToneChip label={display.label.toUpperCase()} tone={display.tone} />;
}

export function CommunityChip({ label = "COMMUNITY" }: { label?: string }) {
  return <ToneChip label={label} tone="community" />;
}

function ToneChip({ label, tone }: { label: string; tone: StatusTone }) {
  const classes = TONE_CLASSES[tone];
  const Icon = TONE_ICON[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${classes.border} bg-bg-2/60 px-2.5 py-1 text-xs font-medium tracking-wide ${classes.text}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
