import { client, currentUser, el } from "./core.js";

export async function loadLikeCount() {
  if (!currentUser) return;

  const { count } = await client()
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("to_user", currentUser.id);

  const box = el("likeCount");
  if (box) box.textContent = `❤️ ${count || 0} likes`;
}