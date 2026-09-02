import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicConfig } from "./config";

type CookieToSet = { name: string; value: string; options: CookieOptions };

// Server Components and route handlers use this client for identity checks.
// Authorization still happens in lib/auth/staff after getUser() succeeds.
export function createSupabaseServerClient() {
  const cookieStore = cookies();
  const { url, anonKey } = getSupabasePublicConfig();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. Middleware refreshes the
          // session, and route handlers can still write when appropriate.
        }
      },
    },
  });
}
