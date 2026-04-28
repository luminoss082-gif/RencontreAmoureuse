// =============================
// SUPABASE CLIENT SAFE ACCESS
// =============================
const client = () => window.supabaseClient;

// =============================
// LOGIN
// =============================
async function login() {
  const email = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value;

  const errorBox = document.getElementById("errorMsg");

  if (!email || !password) {
    if (errorBox) errorBox.textContent = "Email ou mot de passe manquant";
    return;
  }

  const { error } = await client().auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    if (errorBox) errorBox.textContent = error.message;
    return;
  }

  window.location.href = "profile.html";
}

// =============================
// SIGNUP (ROBUST VERSION)
// =============================
async function signup() {
  const email = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value;
  const errorBox = document.getElementById("errorMsg");

  if (errorBox) errorBox.textContent = "";

  // Validation front simple
  if (!email || !password) {
    const msg = "Email ou mot de passe manquant";
    if (errorBox) errorBox.textContent = msg;
    else alert(msg);
    return;
  }

  try {
    const { data, error } = await client().auth.signUp({
      email,
      password
    });

    // 🔥 IMPORTANT : Supabase peut renvoyer error = null mais user = null
    if (error) {
      console.error("Signup error:", error);
      if (errorBox) errorBox.textContent = error.message;
      else alert(error.message);
      return;
    }

    if (!data?.user) {
      const msg = "Erreur: utilisateur non créé (vérifie Supabase Auth settings)";
      console.error(msg, data);
      if (errorBox) errorBox.textContent = msg;
      else alert(msg);
      return;
    }

    // Succès
    alert("Compte créé ✔");

    // petit délai pour éviter race condition UI
    setTimeout(() => {
      window.location.href = "login.html";
    }, 500);

  } catch (err) {
    console.error("Unexpected error:", err);
    const msg = "Erreur serveur inattendue";
    if (errorBox) errorBox.textContent = msg;
    else alert(msg);
  }
}
// =============================
// LOGOUT
// =============================
async function logout() {
  await client().auth.signOut();
  window.location.href = "login.html";
}

// =============================
// RESET PASSWORD
// =============================
async function resetPassword() {
  const email = document.getElementById("resetEmail")?.value?.trim();

  if (!email) {
    alert("Email requis");
    return;
  }

  const { error } = await client().auth.resetPasswordForEmail(email);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Email envoyé 📩");
}

// =============================
// AUTH UI (NAVBAR AUTO)
// =============================
async function initAuthUI() {
  const { data } = await client().auth.getUser();

  const btn = document.getElementById("authBtn");
  const userInfo = document.getElementById("userInfo");

  if (!btn) return;

  if (data?.user) {
    btn.textContent = "Déconnexion";
    btn.onclick = logout;

    if (userInfo) {
      userInfo.textContent = data.user.email;
    }

  } else {
    btn.textContent = "Connexion";
    btn.onclick = () => window.location.href = "login.html";

    if (userInfo) {
      userInfo.textContent = "";
    }
  }
}

// =============================
// INIT AUTO
// =============================
document.addEventListener("DOMContentLoaded", () => {
  initAuthUI();
});

// =============================
// GLOBAL EXPORT (IMPORTANT pour onclick HTML)
// =============================
window.login = login;
window.signup = signup;
window.logout = logout;
window.resetPassword = resetPassword;
window.initAuthUI = initAuthUI;