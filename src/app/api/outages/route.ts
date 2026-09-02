import { NextResponse } from "next/server";
import { getVerifiedAffectedAreas } from "@/lib/db/repositories/outage.repository";

// Public read endpoint — residents have no account (README "Architecture
// decision: no login for residents"), so this must work unauthenticated.
// RLS (`outage_events_public_select`) already restricts the underlying
// query to verified, non-superseded events regardless of who's asking; this
// route exists so client components (which can't use next/headers-based
// Supabase clients) can reach the same repository server components use.
export async function GET() {
  const areas = await getVerifiedAffectedAreas();
  return NextResponse.json({ areas });
}
