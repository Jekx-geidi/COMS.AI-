import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.log("MISSING_ENV");
  process.exit(1);
}

const DEMO_EMAIL = "admin.demo@coms.ai";
const DEMO_PASSWORD = "ComsAiDemo!2026";

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// getStaffAccess() (src/lib/auth/require-staff.ts) never reads
// auth.users.user_metadata — it looks up user_profiles.role, which only a
// controlled staff-invite flow is supposed to write (see
// supabase/migrations/0003_user_profiles.sql). A demo account without a
// matching user_profiles row authenticates fine but then hits the "Staff
// access required" forbidden screen, so this script provisions both.
async function upsertStaffProfile(userId) {
  const { error } = await supabase
    .from("user_profiles")
    .upsert(
      { id: userId, display_name: "Admin Demo", role: "ADMIN" },
      { onConflict: "id" }
    );
  if (error) {
    console.log("PROFILE_ERROR:", error.message);
    process.exit(1);
  }
}

async function main() {
  const { data: existing, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.log("LIST_ERROR:", listError.message);
    process.exit(1);
  }

  const found = existing.users.find((u) => u.email === DEMO_EMAIL);

  if (found) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(found.id, {
      password: DEMO_PASSWORD,
      email_confirm: true,
    });
    if (updateError) {
      console.log("UPDATE_ERROR:", updateError.message);
      process.exit(1);
    }
    await upsertStaffProfile(found.id);
    console.log("UPDATED_OK");
    return;
  }

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { role: "admin", demo: true },
  });

  if (createError) {
    console.log("CREATE_ERROR:", createError.message);
    process.exit(1);
  }

  await upsertStaffProfile(created.user.id);
  console.log("CREATED_OK");
}

main();
