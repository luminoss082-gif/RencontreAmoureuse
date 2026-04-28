
const client = () => window.supabaseClient;

// =============================
// LOG ACTIONS
// =============================
export async function audit(action, target, details) {
  const { data } = await client().auth.getUser();

  if (!data?.user) return;

  await client().from("admin_audit").insert({
    admin_id: data.user.id,
    action,
    target,
    details,
    created_at: new Date()
  });
}