
const client = () => window.supabaseClient;

// =============================
// CHECK ADMIN ROLE
// =============================
export async function requireAdmin() {
  const { data: { user } } = await client().auth.getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const { data: profile, error } = await client()
    .from("profiles")
    .select("role, banned")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    window.location.href = "index.html";
    return;
  }

  // 🚫 banned
  if (profile.banned) {
    alert("Compte suspendu");
    await client().auth.signOut();
    window.location.href = "login.html";
    return;
  }

  // 🚫 not admin
  if (profile.role !== "admin") {
    window.location.href = "index.html";
    return;
  }

  console.log("✅ Admin access granted");
}
document.body.style.display = "none";

if (profile.role !== "admin") {
  window.location.href = "index.html";
}

document.body.style.display = "block";

const client = () => window.supabaseClient;

export async function requireAuth() {
  const { data } = await client().auth.getUser();

  if (!data?.user) {
    window.location.href = "login.html";
  }
}