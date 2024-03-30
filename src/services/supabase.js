import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://aprthgulztsljuvimirz.supabase.co";
// const supabaseKey = import.meta.env.VITE_REACT_APP_API_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

const supabaseServiveRoleKey = import.meta.env
  .VITE_REACT_APP_API_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiveRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: true,
  },
});

const supabaseAuthUrl = "https://ptgevxelcojvdjvctirn.supabase.co";
const supabaseAuthKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Z2V2eGVsY29qdmRqdmN0aXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE1Nzg3MzQsImV4cCI6MjAyNzE1NDczNH0.YgXUAVYyyjwL2y5IUdBoH35XMfyZvKiLjj7JLekH_8s";
export const supabaseAuth = createClient(supabaseAuthUrl, supabaseAuthKey);

export const supabaseAdminAuthClient = supabase.auth.admin;

export default supabase;
