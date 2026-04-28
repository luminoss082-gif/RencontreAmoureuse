let currentTicket = null;
let user = null;

document.addEventListener("DOMContentLoaded", async () => {

  const { data } = await supabaseClient.auth.getUser();
  user = data.user;

  loadTickets();
  listenMessages();
});

/* LOAD TICKETS */
async function loadTickets() {

  const { data } = await supabaseClient
    .from("support_tickets")
    .select("*")
    .eq("admin_id", user.id)
    .eq("status", "open");

  const box = document.getElementById("tickets");
  box.innerHTML = "";

  data.forEach(t => {

    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = "Ticket " + t.id;

    div.onclick = () => openTicket(t);

    box.appendChild(div);
  });
}

/* OPEN */
function openTicket(t) {
  currentTicket = t.id;
  document.getElementById("title").textContent = "Ticket " + t.id;
  loadMessages();
}

/* LOAD MSG */
async function loadMessages() {

  const { data } = await supabaseClient
    .from("support_messages")
    .select("*")
    .eq("ticket_id", currentTicket)
    .order("created_at");

  const box = document.getElementById("chat");
  box.innerHTML = "";

  data.forEach(render);
}

/* RENDER */
function render(m) {

  const div = document.createElement("div");
  div.className = "msg " + (m.sender_role === "admin" ? "me" : "them");
  div.textContent = m.content;

  document.getElementById("chat").appendChild(div);
}

/* SEND */
async function send() {

  const input = document.getElementById("msg");

  await supabaseClient.from("support_messages").insert({
    ticket_id: currentTicket,
    sender_id: user.id,
    sender_role: "admin",
    content: input.value
  });

  input.value = "";
}

/* REALTIME */
function listenMessages() {

  supabaseClient
    .channel("support-admin")
    .on("postgres_changes",
      { event:"INSERT", schema:"public", table:"support_messages" },
      payload => {

        if (payload.new.ticket_id === currentTicket) {
          render(payload.new);
        }
      })
    .subscribe();
}