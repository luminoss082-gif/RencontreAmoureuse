import { loadUsers } from "./admin.js";
import { loadStats } from "./stats.js";
import { initCharts } from "./charts.js";
import { initAdminAlerts } from "./alerts.js";
import { detectFakeLikes } from "./antiCheat.js";
import { startPresenceTracker } from "./presence.js";

window.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  loadStats();
  initCharts();
  initAdminAlerts();
  detectFakeLikes();
  startPresenceTracker();
});

import { requireAdmin } from "./guard.js";

window.addEventListener("DOMContentLoaded", async () => {
  await requireAdmin();

  // si pas admin → ça s'arrête ici
  loadUsers();
  loadStats();
});