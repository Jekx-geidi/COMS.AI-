import type { Config } from "tailwindcss";

// Design tokens sourced from Core Docs/UIS.md #52.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          0: "var(--bg-0)",
          1: "var(--bg-1)",
          2: "var(--bg-2)",
        },
        brand: {
          blue: "var(--brand-blue)",
          cyan: "var(--brand-cyan)",
          "cyan-light": "var(--brand-cyan-light)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          "on-accent": "var(--on-accent)",
        },
        status: {
          critical: "var(--status-critical)",
          scheduled: "var(--status-scheduled)",
          monitor: "var(--status-monitor)",
          restoring: "var(--status-restoring)",
          stable: "var(--status-stable)",
          community: "var(--status-community)",
          unknown: "var(--status-unknown)",
        },
        border: {
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        panel: "12px",
        control: "8px",
      },
      boxShadow: {
        cyan: "0 0 24px rgba(25, 184, 232, 0.25)",
        critical: "0 0 20px rgba(229, 57, 53, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
