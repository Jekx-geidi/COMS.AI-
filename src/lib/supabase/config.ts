function requiredPublicEnv(
  name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  value: string | undefined
): string {
  if (!value) {
    throw new Error(`${name} is required to use staff authentication.`);
  }
  return value;
}

export function getSupabasePublicConfig() {
  return {
    // Keep these direct references. Next.js only inlines NEXT_PUBLIC_* values
    // in browser bundles when their property names are statically known.
    url: requiredPublicEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: requiredPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  };
}
