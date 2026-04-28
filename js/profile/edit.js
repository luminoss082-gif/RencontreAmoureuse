import { client, currentUser, el } from "./core.js";

export async function loadForm() {
  if (!currentUser) return;

  const { data } = await client()
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .maybeSingle();

  if (!data) return;

  el("prenom").value = data.prenom || "";
  el("nom").value = data.nom || "";
  el("age").value = data.age || "";
  el("ville").value = data.ville || "";
  el("bio").value = data.bio || "";
  el("lookingFor").value = data.lookingfor || "";
}