import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./config";

// Service-role client — bypasses RLS entirely. Import this ONLY from
// server-only execution contexts (Route Handlers, Server Actions), never
// from a "use client" component or anything that could end up in the
// browser bundle. Callers are responsible for verifying staff access
// (getStaffAccess()) *before* using this client for a privileged write —
// it grants no authorization on its own.
export function createSupabaseServiceClient() {
  const { url } = getSupabasePublicConfig();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for this operation.");
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
