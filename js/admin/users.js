
const client = () => window.supabaseClient;

// =============================
// LOAD USERS (ADMIN PANEL)
// =============================
export async function loadUsers() {
  const { data, error } = await client()
    .from("profiles")
    .select("id, email, role, banned, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const box = document.getElementById("usersList");
  if (!box) return;

  if (!data?.length) {
    box.innerHTML = "Aucun utilisateur";
    return;
  }

  box.innerHTML = data.map(renderUser).join("");
}


// =============================
// RENDER USER CARD
// =============================
function renderUser(u) {
  return `
    <div class="user-card">
      <b>${u.email}</b>

      <p>Role: ${u.role || "user"}</p>
      <p>Banned: ${u.banned ? "🚫 oui" : "✅ non"}</p>

      <div class="actions">
        <button onclick="banUser('${u.id}')">Ban</button>
        <button onclick="unbanUser('${u.id}')">Unban</button>
        <button onclick="setRole('${u.id}','mod')">Mod</button>
        <button onclick="setRole('${u.id}','premium')">Premium</button>
        <button onclick="deleteUser('${u.id}')">Delete</button>
      </div>
    </div>
  `;
}


// =============================
// BAN USER
// =============================
export async function banUser(id) {
  await client()
    .from("profiles")
    .update({ banned: true })
    .eq("id", id);

  loadUsers();
}


// =============================
// UNBAN USER
// =============================
export async function unbanUser(id) {
  await client()
    .from("profiles")
    .update({ banned: false })
    .eq("id", id);

  loadUsers();
}


// =============================
// DELETE USER
// ⚠️ supabase auth user delete = backend only
// =============================
export async function deleteUser(id) {
  await client()
    .from("profiles")
    .delete()
    .eq("id", id);

  loadUsers();
}


// =============================
// CHANGE ROLE
// =============================
export async function setRole(id, role) {
  await client()
    .from("profiles")
    .update({ role })
    .eq("id", id);

  loadUsers();
}


// =============================
// SEARCH USERS (ADMIN)
// =============================
export async function searchUsers(value) {
  const { data } = await client()
    .from("profiles")
    .select("*")
    .ilike("email", `%${value}%`);

  const box = document.getElementById("usersList");
  if (!box) return;

  box.innerHTML = data.map(renderUser).join("");
}


// =============================
// LOG ACTION (OPTIONAL AUDIT)
// =============================
export async function logAction(action, target, details = "") {
  const user = await client().auth.getUser();

  await client().from("admin_logs").insert({
    admin_id: user.data.user.id,
    action,
    target_user: target,
    details
  });
}


// =============================
// INIT ADMIN PANEL
// =============================
export function initAdmin() {
  loadUsers();

  const search = document.getElementById("searchUser");
  if (search) {
    search.addEventListener("input", (e) => {
      searchUsers(e.target.value);
    });
  }
}