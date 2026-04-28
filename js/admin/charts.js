
import { loadStats } from "./stats.js";

let chart;

export async function initCharts() {
  await loadStats();

  const ctx = document.getElementById("growthChart");

  if (!ctx) return;

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      datasets: [
        {
          label: "Users",
          data: [5, 10, 15, 30, 40, 60, 80],
          borderColor: "#ff4b2b",
          tension: 0.4
        }
      ]
    }
  });
}