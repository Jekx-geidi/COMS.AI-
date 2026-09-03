import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AskTeaser() {
  return (
    <Link
      href="/ask-ai"
      className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-panel bg-bg-1/95 px-4 py-4 shadow-[0_14px_34px_rgba(0,0,0,0.14)] transition-all hover:-translate-y-0.5 hover:bg-bg-1 md:px-5"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-cyan/10 text-brand-cyan shadow-cyan">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold">Ask COMS AI</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-text-secondary">
            &ldquo;Naay brownout diri sa akong location?&rdquo;
          </p>
        </div>
      </div>
      <span className="text-xs text-brand-cyan">Ask</span>
    </Link>
  );
}
