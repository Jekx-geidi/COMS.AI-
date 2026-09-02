import { Search } from "lucide-react";

// UFR-030 / NFR: permission denial must offer manual search, not a dead end.
// Real search lands in Stage 3 — this is the UI shell wired to nothing yet.
export function PermissionDeniedState() {
  return (
    <div className="rounded-panel border border-border-subtle bg-bg-1 p-5">
      <p className="text-sm font-medium">Location access wasn&rsquo;t granted.</p>
      <p className="mt-1 text-sm text-text-secondary">
        Search your barangay or area instead.
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-control border border-border-subtle bg-bg-2 px-3 py-2.5">
        <Search className="h-4 w-4 text-text-secondary" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search a barangay, city, or landmark (coming soon)"
          disabled
          className="w-full bg-transparent text-sm text-text-secondary placeholder:text-text-secondary/70 focus:outline-none"
        />
      </div>
    </div>
  );
}
