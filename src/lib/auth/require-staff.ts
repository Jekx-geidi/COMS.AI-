import { canAccessAdmin, type StaffProfile } from "./staff";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StaffAccess =
  | { state: "unauthenticated" }
  | { state: "forbidden" }
  | { state: "authorized"; staff: StaffProfile };

// This is the authorization boundary for server-rendered admin routes. Never
// infer staff access from client state, email domains, or URL parameters.
export async function getStaffAccess(): Promise<StaffAccess> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { state: "unauthenticated" };

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile || !canAccessAdmin(profile.role)) {
    return { state: "forbidden" };
  }

  return {
    state: "authorized",
    staff: {
      id: user.id,
      displayName: profile.display_name,
      role: profile.role,
    },
  };
}
