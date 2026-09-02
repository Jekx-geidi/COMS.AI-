"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function AssistantInput({ onSend, disabled }: { onSend: (text: string) => void; disabled?: boolean }) {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onSend(value);
        setValue("");
      }}
      className="flex items-center gap-2 rounded-control border border-border-subtle bg-bg-2 px-3 py-2.5"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Naay brownout diri sa akong location?"
        disabled={disabled}
        className="w-full bg-transparent text-sm placeholder:text-text-secondary/70 focus:outline-none"
      />
      <button
        type="submit"
        disabled={disabled}
        aria-label="Send"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-cyan text-text-on-accent disabled:opacity-50"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
