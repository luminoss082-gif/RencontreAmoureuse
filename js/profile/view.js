import { client, currentUser, el } from "./core.js";

export async function loadProfile() {
  if (!currentUser) return;

  const { data } = await client()
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .maybeSingle();

  const createBox = el("profileCreate");
  const viewBox = el("profileView");

  if (!createBox || !viewBox) return;

  if (!data) {
    createBox.style.display = "block";
    viewBox.style.display = "none";
    return;
  }

  createBox.style.display = "none";
  viewBox.style.display = "block";

  el("viewName").textContent = `${data.prenom || ""} ${data.nom || ""}`;
  el("viewAgeVille").textContent = `${data.age || ""} ans - ${data.ville || ""}`;
  el("viewBio").textContent = data.bio || "";
  el("viewLooking").textContent = data.lookingfor || "";

  const img = el("viewPhoto");
  if (img) img.src = data.photo_url || "https://picsum.photos/200";
}