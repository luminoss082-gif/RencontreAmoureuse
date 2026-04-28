import { client, getUser } from "../core/session.js";

// =============================
// LIKE USER
// =============================
export async function likeUser(targetId) {
  const user = await getUser();
  if (!user) return alert("Connecte-toi");

  if (user.id === targetId) return;

  await client().from("likes").insert({
    from_user: user.id,
    to_user: targetId
  });

  alert("❤️ Like envoyé");
}