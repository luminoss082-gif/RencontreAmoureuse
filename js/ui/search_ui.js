
// =============================
// IMPORT (si module)
// =============================
import { loadProfiles, viewProfile, closeProfile } from "../search/profiles.js";
import { likeUser } from "../search/likes.js";
import { loadMatches } from "../search/matches.js";
import { openChat, messageUser } from "../search/chat.js";
import { searchUsers } from "../search/filters.js";


<span class="online-dot ${profile.is_online ? 'online' : 'offline'}"></span>

// =============================
// GLOBAL BIND (WINDOW)
// =============================
window.loadProfiles = loadProfiles;
window.viewProfile = viewProfile;
window.closeProfile = closeProfile;
window.likeUser = likeUser;
window.loadMatches = loadMatches;
window.openChat = openChat;
window.messageUser = messageUser;
window.searchUsers = searchUsers;

// =============================
// AUTO INIT UI
// =============================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Search UI ready");

  // Auto load profiles si page search
 document.addEventListener("DOMContentLoaded", () => {
  loadProfiles();
  loadMatches();
    initAuthUI();
      startAuthListener();
});


  // bouton login navbar
  const authBtn = document.getElementById("authBtn");

  if (authBtn) {
    authBtn.onclick = () => {
      window.location.href = "login.html";
    };
  }
});
const supabase = window.supabaseClient;

export async function loadProfiles() {
const { data, error } = await supabaseClient
  .from("profiles")
  .select("user_id, prenom, age, ville, bio, photo")
  .gte("age", 20)
  .lte("age", 35);

  const grid = document.getElementById("profilesGrid");
  if (!grid) return;

  grid.innerHTML = data.map(u => `
    <div class="profile-card">

      <div class="avatar-container">
        <img src="${u.photo || 'https://picsum.photos/200'}" class="avatar">

        <!-- 🟢 ONLINE -->
        <span class="online-dot ${u.is_online ? 'online' : 'offline'}"></span>
      </div>

      <h3>${u.prenom || ""}</h3>
      <p>${u.age || ""} ans</p>
      <p>${u.ville || ""}</p>

      <button onclick="viewProfile('${u.id}')">👀 Voir</button>

      <!-- 💬 BOUTON DISCUTER -->
      <button onclick="startChat('${u.id}')">
        💬 Discuter
      </button>

    </div>
  `).join("");
}