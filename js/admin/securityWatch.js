
const client = () => window.supabaseClient;

let attempts = 0;

// =============================
// TRACK ADMIN ACCESS ATTEMPTS
// =============================
export async function trackAdminAccess() {
  const { data: user } = await client().auth.getUser();

  if (!user?.user) return;

  const { data: profile } = await client()
    .from("profiles")
    .select("role")
    .eq("id", user.user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "superadmin") {
    attempts++;

    await logSecurityEvent(user.user.id, "ADMIN_ACCESS_DENIED");

    if (attempts > 3) {
      await client().auth.signOut();
      window.location.href = "login.html";
    }
  }
}

// =============================
async function logSecurityEvent(userId, type) {
  await client().from("security_logs").insert({
    user_id: userId,
    type,
    created_at: new Date()
  });
}