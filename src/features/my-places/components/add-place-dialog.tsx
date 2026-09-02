"use client";

import { useState } from "react";
import type { PlaceLabel } from "../types";

const LABELS: PlaceLabel[] = ["Home", "School", "Work", "Business", "Parents' Home", "Custom"];

interface AddPlaceFormProps {
  onSubmit: (input: { label: PlaceLabel; customLabel?: string; addressText: string }) => void;
  onCancel: () => void;
}

// Search / drop-pin location input arrives with Stage 3 geocoding — free-text
// address is the placeholder input until then (UFR-081/082 scoped down).
export function AddPlaceForm({ onSubmit, onCancel }: AddPlaceFormProps) {
  const [label, setLabel] = useState<PlaceLabel>("Home");
  const [customLabel, setCustomLabel] = useState("");
  const [addressText, setAddressText] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!addressText.trim()) return;
        onSubmit({ label, customLabel: customLabel.trim() || undefined, addressText: addressText.trim() });
      }}
      className="flex flex-col gap-3 rounded-panel border border-brand-cyan/40 bg-bg-1 p-4"
    >
      <div>
        <label className="mb-1 block text-xs text-text-secondary">Label</label>
        <select
          value={label}
          onChange={(e) => setLabel(e.target.value as PlaceLabel)}
          className="w-full rounded-control border border-border-subtle bg-bg-2 px-3 py-2 text-sm"
        >
          {LABELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {label === "Custom" && (
        <div>
          <label className="mb-1 block text-xs text-text-secondary">Custom name</label>
          <input
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="e.g. Dormitory"
            className="w-full rounded-control border border-border-subtle bg-bg-2 px-3 py-2 text-sm placeholder:text-text-secondary/60"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs text-text-secondary">
          Area (barangay/city — search coming in Stage 3)
        </label>
        <input
          value={addressText}
          onChange={(e) => setAddressText(e.target.value)}
          placeholder="e.g. Lahug, Cebu City"
          required
          className="w-full rounded-control border border-border-subtle bg-bg-2 px-3 py-2 text-sm placeholder:text-text-secondary/60"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-control bg-brand-cyan px-4 py-2.5 text-sm font-semibold text-text-on-accent"
        >
          Save Place
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-control border border-border-subtle px-4 py-2.5 text-sm text-text-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
