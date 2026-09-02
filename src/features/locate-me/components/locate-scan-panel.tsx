// UXS.md #7.3 — a meaningful scan sequence instead of a generic spinner.
export function LocateScanPanel() {
  return (
    <div className="rounded-panel border border-brand-cyan/30 bg-bg-1 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-cyan">
        Scanning Location
      </p>
      <ul className="mt-3 flex flex-col gap-1.5 font-mono text-sm text-text-secondary">
        <li>01 Position detected</li>
        <li>02 Resolving area</li>
        <li>03 Checking outage zones</li>
        <li>04 Reading latest schedules</li>
      </ul>
    </div>
  );
}
