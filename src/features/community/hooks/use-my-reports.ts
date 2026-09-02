"use client";

import { useCallback, useEffect, useState } from "react";
import { getDeviceId } from "@/lib/utils/device-id";
import type { ReportType } from "@/types/community";
import type { MyCommunityReport } from "../types";

const STORAGE_KEY = "coms-ai-my-community-reports";

function read(): MyCommunityReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MyCommunityReport[]) : [];
  } catch {
    return [];
  }
}

// No login required to submit (UFR-110 scoped to the no-login model) — reports
// are device-scoped locally until Stage 13 wires POST /api/community/reports.
export function useMyReports() {
  const [reports, setReports] = useState<MyCommunityReport[]>([]);

  useEffect(() => {
    setReports(read());
  }, []);

  const submitReport = useCallback((input: { reportType: ReportType; locationText: string; note?: string }) => {
    setReports((prev) => {
      const next: MyCommunityReport[] = [
        {
          id: crypto.randomUUID(),
          deviceId: getDeviceId(),
          reportType: input.reportType,
          locationText: input.locationText,
          note: input.note,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { reports, submitReport };
}
