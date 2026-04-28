import { client, currentUser, el } from "./core.js";

export async function uploadPhoto() {
  const file = el("photoInput")?.files?.[0];
  if (!file || !currentUser) return null;

  const fileName = `${currentUser.id}/${Date.now()}-${file.name}`;

  const { error } = await client()
    .storage
    .from("avatars")
    .upload(fileName, file, { upsert: true });

  if (error) return null;

  const { data } = client()
    .storage
    .from("avatars")
    .getPublicUrl(fileName);

  return data?.publicUrl || null;
}