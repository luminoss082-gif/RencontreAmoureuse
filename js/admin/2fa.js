
const client = () => window.supabaseClient;

// =============================
// SEND CODE
// =============================
export async function sendAdminCode(email) {
  const code = Math.floor(100000 + Math.random() * 900000);

  sessionStorage.setItem("admin_code", code);

  console.log("ADMIN CODE:", code); // dev only

  await client().from("admin_2fa").insert({
    email,
    code,
    expires_at: new Date(Date.now() + 10 * 60000)
  });
}

// =============================
// VERIFY CODE
// =============================
export function verifyAdminCode(input) {
  const code = sessionStorage.getItem("admin_code");

  return input === code;
}