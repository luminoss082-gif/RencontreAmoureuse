import { client, currentUser, el } from "./core.js";
import { uploadPhoto } from "./upload.js";
import { loadProfile } from "./view.js";

export async function saveProfile() {
  if (!currentUser) return alert("Not logged in");

  const photoUrl = await uploadPhoto();

  const payload = {
    id: currentUser.id,
    prenom: el("prenom")?.value || "",
    nom: el("nom")?.value || "",
    age: el("age")?.value || "",
    ville: el("ville")?.value || "",
    bio: el("bio")?.value || "",
    lookingfor: el("lookingFor")?.value || "",
    ...(photoUrl && { photo_url: photoUrl })
  };

  const { error } = await client()
    .from("profiles")
    .upsert(payload);

  if (error) return alert("Erreur profil");

  alert("Profil sauvegardé 💖");

  await loadProfile();
}
export async function deleteProfile() {
  if (!confirm("Supprimer profil ?")) return;

  const { error } = await client()
    .from("profiles")
    .delete()
    .eq("id", currentUser.id);

  if (error) return alert("Erreur");

  window.location.href = "index.html";
}
import { el } from "./core.js";

export function enableEdit() {
  el("profileView").style.display = "none";
  el("profileEdit").style.display = "block";
}

export function cancelEdit() {
  el("profileEdit").style.display = "none";
  el("profileView").style.display = "block";
}