const STORAGE_KEY = "coms-ai-device-id";

// Resident-owned data (My Places, notifications, community reports) is keyed
// to this client-generated identity instead of a Supabase Auth user — see
// README "Architecture decision: no login for residents".
export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";

  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
