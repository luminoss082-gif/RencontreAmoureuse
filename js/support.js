let ticketId = null;
let user = null;

/* INIT */
document.addEventListener("DOMContentLoaded", async () => {

  const { data, error } = await supabaseClient.auth.getUser();

  if (error || !data?.user) {
    alert("Non connecté");
    location.href = "login.html";
    return;
  }

  user = data.user;

  ticketId = await getOrCreateTicket();

  await loadMessages();
  listenMessages();
});

/* CREATE / GET TICKET */
async function getOrCreateTicket() {

  const { data: existing, error } = await supabaseClient
    .from("support_tickets")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "open")
    .maybeSingle();

  if (existing) return existing.id;

  const { data: admins, error: err1 } = await supabaseClient
    .from("profiles")
    .select("user_id")
    .eq("role", "admin");

  if (err1 || !admins?.length) {
    alert("Aucun admin disponible");
    return null;
  }

  const { data: tickets } = await supabaseClient
    .from("support_tickets")
    .select("admin_id")
    .eq("status", "open");

  const count = {};
  admins.forEach(a => count[a.user_id] = 0);

  tickets?.forEach(t => {
    if (count[t.admin_id] !== undefined) count[t.admin_id]++;
  });

  let best = admins[0].user_id;

  admins.forEach(a => {
    if (count[a.user_id] < count[best]) best = a.user_id;
  });

  const { data: ticket, error } = await supabaseClient
    .from("support_tickets")
    .insert({
      user_id: user.id,
      admin_id: best,
      status: "open"
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    alert("Erreur création ticket");
    return null;
  }

  return ticket.id;
}

/* SEND MESSAGE */
async function sendMsg() {

  const input = document.getElementById("msg");
  const text = input.value.trim();

  if (!text) return alert("Message vide");
  if (!ticketId) return alert("Ticket introuvable");

  const { error } = await supabaseClient
    .from("support_messages")
    .insert({
      ticket_id: ticketId,
      sender_id: user.id,
      sender_role: "user",
      content: text
    });

  if (error) {
    console.error("INSERT ERROR:", error);
    alert("Erreur envoi message");
    return;
  }

  input.value = "";
}

/* LOAD MESSAGES */
async function loadMessages() {

  if (!ticketId) return;

  const { data, error } = await supabaseClient
    .from("support_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at");

  if (error) {
    console.error(error);
    return;
  }

  const box = document.getElementById("chat");
  box.innerHTML = "";

  (data || []).forEach(render);
}

/* RENDER */
function render(m) {

  const div = document.createElement("div");
  div.className = "msg " + (m.sender_role === "user" ? "me" : "them");
  div.textContent = m.content;

  document.getElementById("chat").appendChild(div);
}

/* REALTIME */
function listenMessages() {

  supabaseClient
    .channel("support")
    .on("postgres_changes",
      { event: "INSERT", schema: "public", table: "support_messages" },
      payload => {

        if (payload.new.ticket_id === ticketId) {
          render(payload.new);
        }
      }
    )
    .subscribe();
}