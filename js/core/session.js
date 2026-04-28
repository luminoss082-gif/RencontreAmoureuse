const client = () => window.supabaseClient;

export async function getUser() {
  const { data } = await client().auth.getUser();
  return data?.user || null;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) window.location.href = "login.html";
}
async function initAuthUI() {
  const btn = document.getElementById("authBtn");
  const userInfo = document.getElementById("userInfo");
  const avatar = document.getElementById("userAvatar");

  if (!btn) return;

  const { data } = await window.supabaseClient.auth.getUser();
  const user = data?.user;

  if (user) {
    btn.innerHTML = "<span>Déconnexion</span>";

    // email
    if (userInfo) userInfo.textContent = user.email;

    // avatar (fallback initials)
    const photo = user.user_metadata?.avatar_url;

    if (avatar) {
      avatar.classList.remove("hidden");

      if (photo) {
        avatar.src = photo;
      } else {
        avatar.src = `https://ui-avatars.com/api/?name=${user.email}`;
      }
    }

    btn.onclick = async () => {
      await window.supabaseClient.auth.signOut();
      updateUI(null);
    };

  } else {
    updateUI(null);

    btn.innerHTML = "<span>Connexion</span>";
    btn.onclick = () => location.href = "login.html";
  }
}
function startAuthListener() {
  window.supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
      initAuthUI();
    }
  });
}
async function setOnlineStatus() {
  const user = await getUser();
  if (!user) return;

  await window.supabaseClient
    .from("profiles")
    .update({
      last_seen: new Date().toISOString()
    })
    .eq("id", user.id);
}

// ping every 30 sec
setInterval(setOnlineStatus, 30000);

function isOnline(lastSeen) {
  if (!lastSeen) return false;

  const diff = Date.now() - new Date(lastSeen).getTime();
  return diff < 60000; // 1 minute
}