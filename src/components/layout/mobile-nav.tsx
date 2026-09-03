"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, LocateFixed, Sparkles, Menu } from "lucide-react";
import { MOBILE_NAV } from "@/config/nav";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Map,
  Locate: LocateFixed,
  AI: Sparkles,
  More: Menu,
};

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-3 bottom-3 z-40 flex items-stretch justify-around rounded-2xl bg-bg-1/95 px-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-xl md:hidden"
    >
      {MOBILE_NAV.map((item) => {
        const Icon = ICONS[item.label] ?? Home;
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const isLocate = item.label === "Locate";
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex min-h-[64px] flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-semibold tracking-[0.08em] transition-colors ${
              active ? "text-brand-cyan" : "text-text-secondary"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <span
              className={
                isLocate
                  ? "-mt-7 flex h-12 w-12 items-center justify-center rounded-full bg-brand-cyan text-text-on-accent shadow-cyan"
                  : "flex h-7 w-9 items-center justify-center"
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            {item.label.toUpperCase()}
            {active && !isLocate && <span className="absolute top-0 h-0.5 w-5 rounded-full bg-brand-cyan" />}
          </Link>
        );
      })}
    </nav>
  );
}
