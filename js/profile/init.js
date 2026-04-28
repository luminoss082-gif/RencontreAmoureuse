import { initUser } from "./core.js";
import { loadProfile } from "./view.js";
import { loadLikeCount } from "./likes.js";
import { loadForm } from "./edit.js";



window.addEventListener("DOMContentLoaded", async () => {
  const user = await initUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  await Promise.all([
    loadProfile(),
    loadLikeCount(),
    loadForm()
  ]);
});
