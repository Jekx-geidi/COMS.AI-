import { CommunityChip } from "@/components/ui/status-chip";
import { getCommunityReportLabel } from "@/lib/utils/status-display";
import { formatRelativeVerified } from "@/lib/dates/format-outage-time";
import type { CommunityCluster } from "@/types/community";

// UIS.md #35 / AGENT.md #17 — must never borrow official red/blue status
// weight, and must always state it is unverified.
export function CommunityClusterCard({ cluster }: { cluster: CommunityCluster }) {
  return (
    <li className="rounded-panel border border-status-community/40 bg-bg-1 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{cluster.locationLabel ?? "Unknown area"}</p>
          <p className="text-xs text-text-secondary">
            {cluster.reportCount} recent reports · {getCommunityReportLabel(cluster.clusterType)}
          </p>
        </div>
        <CommunityChip />
      </div>
      <p className="mt-2 text-xs text-text-secondary">
        No official confirmation is currently available for this cluster.
      </p>
      {cluster.lastReportedAt && (
        <p className="mt-1 text-[11px] text-text-secondary">
          Last report {formatRelativeVerified(cluster.lastReportedAt)}
        </p>
      )}
    </li>
  );
}
