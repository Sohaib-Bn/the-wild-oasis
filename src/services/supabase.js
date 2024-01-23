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

export const supabaseAdminAuthClient = supabase.auth.admin;

export default supabase;
