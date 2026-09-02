"use client";

import { useEffect, useState } from "react";
import { RadioTower } from "lucide-react";
import { getCommunityClusters } from "@/features/community/services/community.service";
import { CommunityClusterCard } from "@/features/community/components/community-cluster-card";
import { ReportForm } from "@/features/community/components/report-form";
import { useMyReports } from "@/features/community/hooks/use-my-reports";
import { getCommunityReportLabel } from "@/lib/utils/status-display";
import { formatRelativeVerified } from "@/lib/dates/format-outage-time";
import type { CommunityCluster } from "@/types/community";

export default function CommunityPage() {
  const [clusters, setClusters] = useState<CommunityCluster[]>([]);
  const [reporting, setReporting] = useState(false);
  const { reports, submitReport } = useMyReports();

  useEffect(() => {
    getCommunityClusters().then(setClusters);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-lg font-semibold text-status-community">
            Community Signals
          </h1>
          <p className="text-sm text-text-secondary">Not official — no login needed to report.</p>
        </div>
        {!reporting && (
          <button
            onClick={() => setReporting(true)}
            className="flex items-center gap-1.5 rounded-control bg-status-community px-3 py-2 text-sm font-semibold text-text-on-accent"
          >
            <RadioTower className="h-4 w-4" aria-hidden="true" />
            Report
          </button>
        )}
      </header>

      {reporting && (
        <ReportForm
          onSubmit={(input) => {
            submitReport(input);
            setReporting(false);
          }}
          onCancel={() => setReporting(false)}
        />
      )}

      <ul className="flex flex-col gap-2">
        {clusters.map((cluster) => (
          <CommunityClusterCard key={cluster.id} cluster={cluster} />
        ))}
      </ul>

      {reports.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Your Reports (this device)
          </h2>
          <ul className="flex flex-col gap-2">
            {reports.map((report) => (
              <li
                key={report.id}
                className="rounded-panel border border-border-subtle bg-bg-1/60 px-4 py-2.5 text-xs text-text-secondary"
              >
                {getCommunityReportLabel(report.reportType)} — {report.locationText} ·{" "}
                {formatRelativeVerified(report.createdAt)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
