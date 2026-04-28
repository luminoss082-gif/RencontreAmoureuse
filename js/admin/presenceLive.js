
const client = () => window.supabaseClient;

// =============================
// UPDATE ONLINE STATUS
// =============================
export async function pingAdmin() {
  const { data } = await client().auth.getUser();

  if (!data?.user) return;

  await client()
    .from("admin_presence")
    .upsert({
      user_id: data.user.id,
      last_seen: new Date().toISOString(),
      status: "online"
    });
}

// =============================
// LIVE LIST
// =============================
export async function loadOnlineAdmins() {
  const { data } = await client()
    .from("admin_presence")
    .select("*");

  const box = document.getElementById("onlineAdmins");

  if (!box) return;

  const now = Date.now();

  box.innerHTML = data
    .filter(u => (now - new Date(u.last_seen)) < 60000)
    .map(u => `
      <div class="online-admin">
        🟢 ${u.user_id}
      </div>
    `).join("");
}

// =============================
export function startAdminPresence() {
  setInterval(pingAdmin, 5000);
  setInterval(loadOnlineAdmins, 5000);
}