
let timer;

export function startAdminSessionTimeout() {
  resetTimer();

  ["click", "mousemove", "keydown"].forEach(e =>
    window.addEventListener(e, resetTimer)
  );
}

function resetTimer() {
  clearTimeout(timer);

  timer = setTimeout(async () => {
    const client = window.supabaseClient;

    await client.auth.signOut();

    alert("Session expirée ⏳");

    window.location.href = "login.html";
  }, 10 * 60 * 1000); // 10 min
}