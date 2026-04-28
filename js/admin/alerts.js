
const client = () => window.supabaseClient;

// =============================
// REALTIME ALERTS
// =============================
export function initAdminAlerts() {
  client()
    .channel("admin-alerts")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "reports" },
      (payload) => {
        showAlert("🚨 New report received");
      }
    )
    .subscribe();
}

function showAlert(msg) {
  const box = document.getElementById("adminAlerts");
  if (!box) return;

  const div = document.createElement("div");
  div.className = "alert";
  div.textContent = msg;

  box.appendChild(div);

  setTimeout(() => div.remove(), 5000);
}