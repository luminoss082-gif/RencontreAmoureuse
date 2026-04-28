import { client, getUser } from "../core/session.js";

// =============================
// LOAD MATCHES
// =============================
export async function loadMatches() {
  const user = await getUser();
  if (!user) return;

  const { data } = await client()
    .from("matches")
    .select("*")
    .or(`user1.eq.${user.id},user2.eq.${user.id}`);

  const grid = document.getElementById("matchesGrid");
  if (!grid) return;

  grid.innerHTML = "";

  data.forEach(m => {
    const other = m.user1 === user.id ? m.user2 : m.user1;

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p>💘 Match</p>
      <button onclick="openChat('${other}')">💬 Chat</button>
    `;

    grid.appendChild(div);
    
    users.forEach(user => {
  const card = document.createElement("div");
  card.className = "card";

  // important pour identifier l’utilisateur
  card.dataset.userid = user.id;

  card.innerHTML = `
  <div class="avatar-wrap">
    <img src="${user.photo_url || 'https://picsum.photos/300'}">

    <span class="online-dot ${user.is_online ? 'online' : 'offline'}"></span>
  </div>

  <h3>${user.prenom}</h3>
  <p>${user.age || ""} ans • ${user.ville || ""}</p>

  <button onclick="openChat('${user.id}')">
    💬 Discuter
  </button>
`;

  grid.appendChild(card);
});
  });
}

// =============================
// CREATE MATCH
// =============================
export async function createMatch(u1, u2) {
  await client().from("matches").insert({
    user1: u1,
    user2: u2
  });
}