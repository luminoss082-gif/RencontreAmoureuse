import { client, getUser } from "../core/session.js";

// =============================
// LOAD PROFILES
// =============================
export async function loadProfiles() {
  const { data, error } = await client()
    .from("profiles")
    .select("*");

  if (error) return console.error(error);

  const grid = document.getElementById("profilesGrid");
  if (!grid) return;

  grid.innerHTML = "";

  data.forEach(p => {
    const card = document.createElement("div");
    card.className = "profile-card";

    card.innerHTML = `
      <img src="${p.photo_url || "https://picsum.photos/200"}">
      <h3>${p.prenom || ""}</h3>
      <p>${p.age || "?"} ans • ${p.ville || ""}</p>

      <button onclick="viewProfile('${p.id}')">👁</button>
      <button onclick="likeUser('${p.id}')">❤️</button>
      <button onclick="messageUser('${p.id}')">💬</button>
    `;

    grid.appendChild(card);
  });
}

// =============================
// VIEW PROFILE
// =============================
export async function viewProfile(id) {
  const { data } = await client()
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) return;

  const box = document.getElementById("profileView");
  if (!box) return;

  box.style.display = "block";

  document.getElementById("viewName").textContent =
    `${data.prenom || ""} ${data.nom || ""}`;

  document.getElementById("viewAgeVille").textContent =
    `${data.age || ""} ans • ${data.ville || ""}`;

  document.getElementById("viewBio").textContent = data.bio || "";

  document.getElementById("viewPhoto").src =
    data.photo_url || "https://picsum.photos/200";
}

// CLOSE
export function closeProfile() {
  const box = document.getElementById("profileView");
  if (box) box.style.display = "none";
}
