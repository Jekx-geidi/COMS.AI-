"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  // False until the post-mount effect has synced React state with the
  // data-theme attribute the pre-hydration script already stamped onto
  // <html>. Consumers whose rendered output depends on theme (icons, etc.)
  // should treat `mounted === false` as "render the dark-mode default" so
  // the client's first hydration pass matches the server's, and only branch
  // on the real theme once mounted flips true a tick later.
  mounted: boolean;
}

const STORAGE_KEY = "coms-ai-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// COMS.AI defaults to Dark Command Mode; light mode is an opt-in accessibility
// toggle, persisted per-device so it survives reloads and route changes.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Read-only: this only syncs React state to whatever the blocking inline
  // script already wrote to the DOM before hydration. It must never write
  // the attribute itself — doing so here would race the inline script and
  // briefly clobber a persisted "light" preference back to "dark".
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    setThemeState(current);
    setMounted(true);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
