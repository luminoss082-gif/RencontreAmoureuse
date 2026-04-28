// js/admin/onlineBadges.js

import { getOnlineUsers } from "./presence.js";

export async function renderOnline() {
  const online = await getOnlineUsers();

  document.querySelectorAll("[data-user-id]").forEach(el => {
    const id = el.dataset.userId;

    const isOnline = online.find(u => u.user_id === id);

    el.classList.toggle("online", !!isOnline);
  });
}