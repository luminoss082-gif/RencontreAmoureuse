
const client = () => window.supabaseClient;

// =============================
// GET GLOBAL STATS
// =============================
export async function loadStats() {
  const [users, likes, matches] = await Promise.all([
    client().from("profiles").select("*", { count: "exact", head: true }),
    client().from("likes").select("*", { count: "exact", head: true }),
    client().from("matches").select("*", { count: "exact", head: true })
  ]);

  setStat("usersCount", users.count);
  setStat("likesCount", likes.count);
  setStat("matchesCount", matches.count);
}

function setStat(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || 0;
}