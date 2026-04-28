
import { trackAdminAccess } from "./securityWatch.js";
import { startAdminPresence } from "./presenceLive.js";
import { startAdminSessionTimeout } from "./sessionTimeout.js";

window.addEventListener("DOMContentLoaded", async () => {
  await trackAdminAccess();

  startAdminPresence();
  startAdminSessionTimeout();
});