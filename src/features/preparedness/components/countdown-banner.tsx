"use client";

import { useEffect, useState } from "react";

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Scheduled period started";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}

// UIS.md #34 / UXS.md #18 — countdown to the nearest known interruption.
export function CountdownBanner({ targetIso, label }: { targetIso: string; label: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = new Date(targetIso).getTime() - now;

  return (
    <div className="rounded-panel border border-brand-cyan/30 bg-bg-1 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 font-mono text-3xl font-semibold text-brand-cyan">
        {formatCountdown(remaining)}
      </p>
    </div>
  );
}
