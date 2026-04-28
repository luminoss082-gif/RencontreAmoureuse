const client = () => window.supabaseClient;

export let currentUser = null;

export const el = (id) => document.getElementById(id);

// SAFE USER
export async function getUser() {
  try {
    const { data } = await client().auth.getUser();
    return data?.user || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// INIT USER
export async function initUser() {
  currentUser = await getUser();
  return currentUser;
}