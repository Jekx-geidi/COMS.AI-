"use client";

import { useCallback, useEffect, useState } from "react";
import type { PreparednessProfile } from "../types";

const PROFILE_KEY = "coms-ai-preparedness-profile";
const CHECKLIST_KEY_PREFIX = "coms-ai-preparedness-checked:";

function readChecked(profile: PreparednessProfile): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(CHECKLIST_KEY_PREFIX + profile);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function usePreparednessChecklist() {
  const [profile, setProfileState] = useState<PreparednessProfile | null>(null);
  const [draftProfile, setDraftProfile] = useState<PreparednessProfile>("STUDENT");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedProfile = window.localStorage.getItem(PROFILE_KEY) as PreparednessProfile | null;
    if (savedProfile) {
      setProfileState(savedProfile);
      setDraftProfile(savedProfile);
      setChecked(readChecked(savedProfile));
    }
    setLoaded(true);
  }, []);

  const buildChecklist = useCallback((nextProfile: PreparednessProfile = draftProfile) => {
    setProfileState(nextProfile);
    setDraftProfile(nextProfile);
    window.localStorage.setItem(PROFILE_KEY, nextProfile);
    setChecked(readChecked(nextProfile));
  }, [draftProfile]);

  const changeProfile = useCallback(() => {
    if (profile) setDraftProfile(profile);
    setProfileState(null);
  }, [profile]);

  const resetChecklist = useCallback(() => {
    if (!profile) return;
    window.localStorage.removeItem(CHECKLIST_KEY_PREFIX + profile);
    setChecked({});
  }, [profile]);

  const toggleItem = useCallback(
    (itemId: string) => {
      if (!profile) return;
      setChecked((prev) => {
        const next = { ...prev, [itemId]: !prev[itemId] };
        window.localStorage.setItem(CHECKLIST_KEY_PREFIX + profile, JSON.stringify(next));
        return next;
      });
    },
    [profile]
  );

  return {
    profile,
    draftProfile,
    setDraftProfile,
    buildChecklist,
    changeProfile,
    resetChecklist,
    checked,
    toggleItem,
    loaded,
  };
}
