"use client";

import { useCallback, useState } from "react";

export type LocateMeStatus = "idle" | "requesting" | "granted" | "denied" | "error";

interface UseLocateMeState {
  status: LocateMeStatus;
  coords?: { lat: number; lng: number };
  errorMessage?: string;
}

// Browser GPS permission/read only — no geospatial matching or UI here
// (COMS-AI-FILE-BRANCHING-TREE.md #7 responsibility split).
export function useLocateMe() {
  const [state, setState] = useState<UseLocateMeState>({ status: "idle" });

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({ status: "error", errorMessage: "Geolocation is not supported on this device." });
      return;
    }

    setState({ status: "requesting" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: "granted",
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setState({ status: "denied" });
        } else {
          setState({
            status: "error",
            errorMessage: "We couldn't determine your current location. Try again or search manually.",
          });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { ...state, request, reset };
}
