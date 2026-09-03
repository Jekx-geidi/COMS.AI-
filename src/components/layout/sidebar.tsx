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
    <aside className="sticky top-0 hidden h-screen w-28 shrink-0 flex-col bg-bg-1/55 px-3 py-5 backdrop-blur-xl md:flex lg:w-64">
      <div className="mb-7 rounded-panel bg-bg-2/35 p-4">
        <Logo className="h-auto w-full max-w-[180px]" />
        <div className="mt-3 hidden items-center justify-between pt-3 lg:flex">
          <span className="text-[10px] uppercase text-text-secondary">Cebu grid</span>
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
              className={`group relative flex min-h-14 flex-col items-center justify-center gap-1 overflow-hidden rounded-control px-2 py-2 text-[11px] font-medium transition-all lg:min-h-0 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:py-2.5 lg:text-sm ${
                active
                  ? "bg-brand-cyan/10 text-brand-cyan"
                  : "text-text-secondary hover:bg-bg-2/60 hover:text-text-primary"
              }`}
            >
              {active && <span className="absolute inset-y-2 left-0 hidden w-0.5 rounded-full bg-brand-cyan lg:block" />}
              <Icon className={`h-4 w-4 ${active ? "text-brand-cyan" : "group-hover:text-brand-cyan"}`} aria-hidden="true" />
              <span className="text-center leading-tight lg:text-left">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 pt-4">
        <div className="flex flex-col items-center gap-2 px-1 lg:flex-row lg:justify-between lg:px-3">
          <Link
            href="/settings"
            className="flex min-h-11 flex-1 flex-col items-center justify-center gap-1 rounded-control px-2 py-2 text-[11px] text-text-secondary hover:bg-bg-2/60 hover:text-text-primary lg:flex-row lg:justify-start lg:gap-3 lg:text-sm"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            Settings
          </Link>
          <ThemeToggle />
        </div>
        <p className="mt-4 hidden px-3 text-[10px] leading-relaxed text-text-secondary/70 lg:block">
          Independent outage intelligence for Cebu.
        </p>
      </div>
    </aside>
  );
}
