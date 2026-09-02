"use client";

import { useCallback, useEffect, useState } from "react";
import type { PreparednessProfile } from "../types";

const PROFILE_KEY = "coms-ai-preparedness-profile";
const CHECKLIST_KEY_PREFIX = "coms-ai-preparedness-checked:";

export function usePreparednessChecklist() {
  const [profile, setProfileState] = useState<PreparednessProfile>("HOUSEHOLD");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedProfile = window.localStorage.getItem(PROFILE_KEY) as PreparednessProfile | null;
    const activeProfile = savedProfile ?? "HOUSEHOLD";
    setProfileState(activeProfile);
    loadChecklist(activeProfile);
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadChecklist(p: PreparednessProfile) {
    try {
      const raw = window.localStorage.getItem(CHECKLIST_KEY_PREFIX + p);
      setChecked(raw ? JSON.parse(raw) : {});
    } catch {
      setChecked({});
    }
  }

  const setProfile = useCallback((p: PreparednessProfile) => {
    setProfileState(p);
    window.localStorage.setItem(PROFILE_KEY, p);
    loadChecklist(p);
  }, []);

  const toggleItem = useCallback(
    (itemId: string) => {
      setChecked((prev) => {
        const next = { ...prev, [itemId]: !prev[itemId] };
        window.localStorage.setItem(CHECKLIST_KEY_PREFIX + profile, JSON.stringify(next));
        return next;
      });
    },
    [profile]
  );

  return { profile, setProfile, checked, toggleItem, loaded };
}
