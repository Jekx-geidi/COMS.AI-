import { StatusChip, CommunityChip } from "@/components/ui/status-chip";

// UIS.md #27 — compact legend, icon+text per status (never color alone).
export function MapLegend() {
  return (
    <div className="flex flex-wrap gap-1.5 rounded-panel border border-border-subtle bg-bg-1/80 p-3">
      <StatusChip status="ONGOING" />
      <StatusChip status="SCHEDULED" />
      <StatusChip status="POSSIBLE" />
      <StatusChip status="RESTORING" />
      <StatusChip status="RESTORED" />
      <StatusChip status="UNKNOWN" />
      <CommunityChip />
    </div>
  );
}
