
const client = () => window.supabaseClient;

// =============================
// DETECT FAKE LIKES (RULE BASED)
// =============================
export async function detectFakeLikes() {
  const { data: likes } = await client()
    .from("likes")
    .select("from_user, created_at");

  if (!likes) return [];

  const map = {};

  // group by user
  likes.forEach(like => {
    map[like.from_user] = map[like.from_user] || [];
    map[like.from_user].push(like.created_at);
  });

  const suspicious = [];

  Object.keys(map).forEach(userId => {
    const times = map[userId];

    // 🚨 rule 1: too many likes
    if (times.length > 30) {
      suspicious.push({
        userId,
        reason: "Too many likes"
      });
    }

    // 🚨 rule 2: too fast (spam burst)
    const sorted = times
      .map(t => new Date(t))
      .sort((a, b) => a - b);

    let burst = 0;

    for (let i = 1; i < sorted.length; i++) {
      const diff = (sorted[i] - sorted[i - 1]) / 1000;

      if (diff < 2) burst++;
    }

    if (burst > 10) {
      suspicious.push({
        userId,
        reason: "Spam behavior"
      });
    }
  });

  renderSuspicious(suspicious);

  return suspicious;
}

// =============================
// RENDER PANEL
// =============================
function renderSuspicious(list) {
  const box = document.getElementById("cheatList");
  if (!box) return;

  if (!list.length) {
    box.innerHTML = "✅ No suspicious activity";
    return;
  }

  box.innerHTML = list.map(u => `
    <div class="cheat">
      <b>${u.userId}</b>
      <p>⚠️ ${u.reason}</p>

      <button onclick="banUser('${u.userId}')">Ban</button>
    </div>
  `).join("");
}