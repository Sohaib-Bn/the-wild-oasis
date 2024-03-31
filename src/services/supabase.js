import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://aprthgulztsljuvimirz.supabase.co";
const supabaseAuthUrl = "https://ptgevxelcojvdjvctirn.supabase.co";

const supabaseServiveRoleKey = import.meta.env
  .VITE_REACT_APP_API_SERVICE_ROLE_KEY;
const supabaseAuthKey = import.meta.env.VITE_REACT_APP_SUPABASE_AUTH_API_KEY;

const supabase = createClient(supabaseUrl, supabaseServiveRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: true,
  },
});

export const supabaseAuth = createClient(supabaseAuthUrl, supabaseAuthKey);

export const supabaseAdminAuthClient = supabase.auth.admin;

export default supabase;
