"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DESKTOP_NAV } from "@/config/nav";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import {
  CalendarDays,
  CircleHelp,
  ClipboardCheck,
  House,
  Map,
  MapPinned,
  Radio,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Overview: House,
  "Live Map": Map,
  Calendar: CalendarDays,
  "Ask COMS": Sparkles,
  "My Places": MapPinned,
  Preparedness: ClipboardCheck,
  Community: Users,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border-subtle bg-bg-0/70 px-4 py-5 backdrop-blur-xl md:flex">
      <div className="mb-7 rounded-panel border border-border-subtle bg-bg-1/60 p-4">
        <Logo className="h-auto w-full max-w-[180px]" />
        <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-3">
          <span className="text-[10px] uppercase tracking-[0.14em] text-text-secondary">Cebu grid</span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-status-stable">
            <Radio className="h-3 w-3" aria-hidden="true" /> Live
          </span>
        </div>
      </div>

      <nav aria-label="Primary" className="flex flex-1 flex-col gap-1">
        {DESKTOP_NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = ICONS[item.label] ?? CircleHelp;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-control px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-brand-blue/45 text-text-primary shadow-[inset_0_0_0_1px_rgba(109,228,255,0.12)]"
                  : "text-text-secondary hover:bg-bg-2/60 hover:text-text-primary"
              }`}
            >
              {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-brand-cyan" />}
              <Icon className={`h-4 w-4 ${active ? "text-brand-cyan" : "group-hover:text-brand-cyan"}`} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-border-subtle pt-4">
        <div className="flex items-center justify-between px-3">
          <Link
            href="/settings"
            className="flex flex-1 items-center gap-3 rounded-control py-2.5 text-sm text-text-secondary hover:text-text-primary"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            Settings
          </Link>
          <ThemeToggle />
        </div>
        <p className="mt-4 px-3 text-[10px] leading-relaxed text-text-secondary/70">
          Independent outage intelligence for Cebu.
        </p>
      </div>
    </aside>
  );
}
