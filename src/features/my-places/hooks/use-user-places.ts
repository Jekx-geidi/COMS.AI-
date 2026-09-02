"use client";

import { useCallback, useEffect, useState } from "react";
import { getDeviceId } from "@/lib/utils/device-id";
import type { PlaceLabel, UserPlace } from "../types";

const STORAGE_KEY = "coms-ai-places";

function read(): UserPlace[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserPlace[]) : [];
  } catch {
    return [];
  }
}

function write(places: UserPlace[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
}

// Device-scoped CRUD — no account, no server round-trip (UFR-080/082 satisfied
// without login per the product's no-login decision). Swappable later for a
// real API without touching consuming components.
export function useUserPlaces() {
  const [places, setPlaces] = useState<UserPlace[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPlaces(read());
    setLoaded(true);
  }, []);

  const addPlace = useCallback((input: { label: PlaceLabel; customLabel?: string; addressText: string }) => {
    setPlaces((prev) => {
      const next: UserPlace[] = [
        ...prev,
        {
          id: crypto.randomUUID(),
          deviceId: getDeviceId(),
          label: input.label,
          customLabel: input.customLabel,
          addressText: input.addressText,
          notificationEnabled: true,
          createdAt: new Date().toISOString(),
        },
      ];
      write(next);
      return next;
    });
  }, []);

  const removePlace = useCallback((id: string) => {
    setPlaces((prev) => {
      const next = prev.filter((p) => p.id !== id);
      write(next);
      return next;
    });
  }, []);

  const toggleAlerts = useCallback((id: string) => {
    setPlaces((prev) => {
      const next = prev.map((p) =>
        p.id === id ? { ...p, notificationEnabled: !p.notificationEnabled } : p
      );
      write(next);
      return next;
    });
  }, []);

  return { places, loaded, addPlace, removePlace, toggleAlerts };
}
