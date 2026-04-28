
import { getUser } from "../core/session.js";

const client = () => window.supabaseClient;

// =============================
// OPEN CHAT
// =============================
export async function messageUser(userId) {
  const user = await getUser();

  if (!user) {
    alert("Connecte-toi");
    return;
  }

  if (user.id === userId) {
    alert("Impossible 😅");
    return;
  }

  // check match exist
  const { data: match } = await client()
    .from("matches")
    .select("*")
    .or(
      `and(user1.eq.${user.id},user2.eq.${userId}),and(user1.eq.${userId},user2.eq.${user.id})`
    )
    .maybeSingle();

  if (!match) {
    alert("💡 Vous devez matcher avant de discuter !");
    return;
  }

  openChat(userId);
}


// =============================
// OPEN CHAT PAGE
// =============================
export function openChat(userId) {
  window.location.href = `app.html?user=${userId}`;
}


// =============================
// LOAD MESSAGES
// =============================
export async function loadMessages(otherUserId) {
  const user = await getUser();
  if (!user) return;

  const { data, error } = await client()
    .from("messages")
    .select("*")
    .or(
      `and(sender.eq.${user.id},receiver.eq.${otherUserId}),and(sender.eq.${otherUserId},receiver.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  const box = document.getElementById("chatBox");
  if (!box) return;

  box.innerHTML = "";

  data.forEach(msg => {
    const div = document.createElement("div");

    div.className =
      msg.sender === user.id ? "msg me" : "msg other";

    div.textContent = msg.text;

    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}


// =============================
// SEND MESSAGE
// =============================
export async function sendMessage(otherUserId) {
  const user = await getUser();
  if (!user) return;

  const input = document.getElementById("messageInput");
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  const { error } = await client().from("messages").insert({
    sender: user.id,
    receiver: otherUserId,
    text
  });

  if (error) {
    console.error(error);
    return;
  }

  input.value = "";

  loadMessages(otherUserId);
}


// =============================
// REALTIME (OPTIONNEL MAIS PRO)
// =============================
export function subscribeToChat(otherUserId) {
  const user = window.supabaseClient.auth.getUser();

  return client()
    .channel("messages")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages"
      },
      (payload) => {
        const msg = payload.new;

        if (
          (msg.sender === user.id && msg.receiver === otherUserId) ||
          (msg.sender === otherUserId && msg.receiver === user.id)
        ) {
          loadMessages(otherUserId);
        }
      }
    )
    .subscribe();
}
window.startChat = function(userId) {
  window.location.href = `chat.html?user=${userId}`;
}