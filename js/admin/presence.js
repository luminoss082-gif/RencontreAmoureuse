
const client = () => window.supabaseClient;

// =============================
// UPDATE ONLINE STATUS
// =============================
export async function updatePresence() {
  const user = await client().auth.getUser();

  if (!user.data.user) return;

  await client()
    .from("presence")
    .upsert({
      user_id: user.data.user.id,
      last_seen: new Date().toISOString()
    });
}

// =============================
// GET ONLINE USERS
// =============================
export async function getOnlineUsers() {
  const { data } = await client()
    .from("presence")
    .select("*");

  const now = Date.now();

  return (data || []).filter(u => {
    return (now - new Date(u.last_seen).getTime()) < 60000;
  });
}

// =============================
// LIVE REFRESH
// =============================
export function startPresenceTracker() {
  setInterval(updatePresence, 10000);
}