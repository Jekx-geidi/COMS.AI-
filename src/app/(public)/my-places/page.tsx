"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useUserPlaces } from "@/features/my-places/hooks/use-user-places";
import { PlaceCard } from "@/features/my-places/components/place-card";
import { AddPlaceForm } from "@/features/my-places/components/add-place-dialog";

export default function MyPlacesPage() {
  const { places, loaded, addPlace, removePlace, toggleAlerts } = useUserPlaces();
  const [adding, setAdding] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-lg font-semibold">My Places</h1>
          <p className="text-sm text-text-secondary">
            Saved to this device — no account needed.
          </p>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 rounded-control bg-brand-cyan px-3 py-2 text-sm font-semibold text-text-on-accent"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add
          </button>
        )}
      </header>

      {adding && (
        <AddPlaceForm
          onSubmit={(input) => {
            addPlace(input);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      {loaded && places.length === 0 && !adding && (
        <div className="rounded-panel border border-border-subtle bg-bg-1 px-6 py-12 text-center">
          <p className="text-sm text-text-secondary">
            No saved places yet. Add Home, School, Work, or another important location to
            monitor its status here.
          </p>
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onRemove={removePlace}
            onToggleAlerts={toggleAlerts}
          />
        ))}
      </ul>
    </div>
  );
}
