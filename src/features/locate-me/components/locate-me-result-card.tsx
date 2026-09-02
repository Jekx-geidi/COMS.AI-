import { StatusChip } from "@/components/ui/status-chip";
import { formatDate, formatTimeRange, formatRelativeVerified } from "@/lib/dates/format-outage-time";
import { formatDistanceAway } from "@/lib/utils/format-distance";
import type { LocateMeResult } from "@/types/locate";

const HEADER: Record<LocateMeResult["matchType"], string> = {
  MATCH_CONFIRMED: "Outage Match",
  MATCH_PARTIAL_AREA: "Partial Area Alert",
  MATCH_NEARBY: "Outage Nearby",
  NO_VERIFIED_MATCH: "No Current Verified Match",
  DATA_STALE: "Update May Be Stale",
};

const TONE_BORDER: Record<LocateMeResult["matchType"], string> = {
  MATCH_CONFIRMED: "border-status-critical/50",
  MATCH_PARTIAL_AREA: "border-status-scheduled/50",
  MATCH_NEARBY: "border-status-monitor/50",
  NO_VERIFIED_MATCH: "border-border-subtle",
  DATA_STALE: "border-status-unknown/50",
};

// UXS.md #7.4-7.8: each match type gets its own header/copy — a confirmed
// match must never borrow the same visual weight as an uncertain one.
export function LocateMeResultCard({ result }: { result: LocateMeResult }) {
  const { matchType } = result;

  return (
    <div className={`rounded-panel border ${TONE_BORDER[matchType]} bg-bg-1 p-5`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {HEADER[matchType]}
      </p>

      <p className="mt-2 text-sm font-medium">
        You are near: <span className="text-text-primary">{result.detectedLocationLabel}</span>
      </p>

      {result.event && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <StatusChip status={result.event.status} />
          {formatDate(result.event.startAt) && (
            <span className="font-mono text-xs text-text-secondary">
              {formatDate(result.event.startAt)} · {formatTimeRange(result.event.startAt, result.event.endAt)}
            </span>
          )}
          {matchType === "MATCH_NEARBY" && result.distanceMeters !== undefined && (
            <span className="rounded-full border border-status-monitor/40 px-2 py-0.5 text-xs font-semibold text-status-monitor">
              {formatDistanceAway(result.distanceMeters)}
            </span>
          )}
        </div>
      )}

      {matchType === "NO_VERIFIED_MATCH" && (
        <p className="mt-3 text-sm text-text-secondary">
          No currently verified power interruption was found for your detected location. This
          does not guarantee that power will remain uninterrupted.
        </p>
      )}

      {result.uncertaintyMessage && (
        <p className="mt-3 text-sm text-text-secondary">{result.uncertaintyMessage}</p>
      )}

      {result.event?.locations[0]?.coverageDescription && matchType !== "NO_VERIFIED_MATCH" && (
        <p className="mt-2 text-xs text-text-secondary">
          Coverage: {result.event.locations[0].coverageDescription}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-xs text-text-secondary">
        <span>{result.sourceName ?? "No source"}</span>
        {result.lastVerifiedAt && <span>Verified {formatRelativeVerified(result.lastVerifiedAt)}</span>}
      </div>
    </div>
  );
}
