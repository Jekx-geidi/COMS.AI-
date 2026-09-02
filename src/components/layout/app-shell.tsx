import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { Radio } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-control bg-brand-cyan px-4 py-2 text-sm font-semibold text-text-on-accent transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-subtle bg-bg-0/80 px-4 backdrop-blur-xl md:hidden">
          <Link href="/" aria-label="COMS.AI home">
            <Logo className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-status-stable/20 bg-status-stable/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-status-stable">
              <Radio className="h-3 w-3" aria-hidden="true" />
              Live data
            </span>
            <ThemeToggle />
          </div>
        </header>
        <main
          id="main-content"
          className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-32 pt-5 sm:px-6 md:px-8 md:pb-12 md:pt-8 lg:px-10"
        >
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
