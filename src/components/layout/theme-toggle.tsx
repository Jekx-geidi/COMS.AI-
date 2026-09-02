"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme/theme-provider";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  // Before the post-mount sync, render the dark-mode default so this
  // matches the server's hydration output exactly (see theme-provider.tsx).
  const isLight = mounted && theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-border-subtle bg-bg-2/60 text-text-secondary transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan ${className ?? ""}`}
    >
      {isLight ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
