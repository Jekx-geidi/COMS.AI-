"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useLocateMe } from "@/features/locate-me/hooks/use-locate-me";
import { classifyLocationMatch } from "@/features/locate-me/utils/classify-location-match";
import { LocateScanPanel } from "@/features/locate-me/components/locate-scan-panel";
import { LocateMeResultCard } from "@/features/locate-me/components/locate-me-result-card";
import { PermissionDeniedState } from "@/features/locate-me/components/permission-denied-state";
import type { LocateMeResult } from "@/types/locate";

const LocateResultMap = dynamic(
  () => import("@/features/locate-me/components/locate-result-map").then((m) => m.LocateResultMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[280px] w-full animate-pulse items-center justify-center rounded-panel border border-border-subtle bg-bg-1">
        <p className="text-xs text-text-secondary">Loading map…</p>
      </div>
    ),
  }
);

// Embedded directly on the Overview page — no separate /locate route.
// Locate Me must be reachable in one tap, without leaving the home screen.
export function LocateMeWidget() {
  const { status, coords, errorMessage, request, reset } = useLocateMe();
  const [result, setResult] = useState<LocateMeResult | null>(null);

  useEffect(() => {
    if (status !== "granted" || !coords) {
      setResult(null);
      return;
    }
    let cancelled = false;
    classifyLocationMatch(coords).then((r) => {
      if (!cancelled) setResult(r);
    });
    return () => {
      cancelled = true;
    };
  }, [status, coords]);

  return (
    <section id="locate-me" className="flex scroll-mt-20 flex-col gap-5">
      <header>
        <h2 className="font-display text-lg font-semibold">Locate Me</h2>
        <p className="text-sm text-text-secondary">
          Check your current location against verified outage areas.
        </p>
      </header>

      {status === "idle" && (
        <div className="rounded-panel bg-bg-1/95 p-5 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">
          <button
            onClick={request}
            className="mx-auto flex flex-col items-center gap-1 rounded-panel"
            aria-label="Use my location"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/locate-me-quick-access.svg"
              alt=""
              aria-hidden="true"
              className="h-auto w-44 transition-transform active:scale-95"
            />
          </button>
          <p className="text-center text-sm text-text-secondary">
            Tap the icon above. COMS.AI uses your current position to compare it with
            verified outage areas — your anonymous live position is not permanently saved
            by default.
          </p>
        </div>
      )}

      {status === "requesting" && <LocateScanPanel />}

      {status === "denied" && <PermissionDeniedState />}

      {status === "error" && (
        <div className="rounded-panel bg-bg-1/95 p-5 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">
          <p className="text-sm text-text-secondary">{errorMessage}</p>
          <button
            onClick={reset}
            className="mt-3 rounded-control bg-bg-2/70 px-3 py-2 text-sm text-text-primary"
          >
            Try Again
          </button>
        </div>
      )}

      {status === "granted" && coords && (
        <>
          <LocateResultMap coords={coords} />
          {result ? (
            <LocateMeResultCard result={result} />
          ) : (
            <div className="flex h-20 w-full animate-pulse items-center justify-center rounded-panel bg-bg-1/95">
              <p className="text-xs text-text-secondary">Checking verified outage areas…</p>
            </div>
          )}
          <button
            onClick={reset}
            className="self-start text-xs text-text-secondary underline underline-offset-2"
          >
            Check again
          </button>
        </>
      )}
    </section>
  );
}
