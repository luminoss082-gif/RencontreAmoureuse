const SUPABASE_URL = "https://ngxrsfntupkrpuzaffov.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5neHJzZm50dXBrcnB1emFmZm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3Mzk0MTEsImV4cCI6MjA5MTMxNTQxMX0.rferAxInyPefZ6e_gqlemLOlAkRowu_gmSazEQDH96w";

// création du client
const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// rendre global
window.supabaseClient = supabaseClient;