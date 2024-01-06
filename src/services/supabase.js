import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://aprthgulztsljuvimirz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwcnRoZ3VsenRzbGp1dmltaXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM0MDU5MTgsImV4cCI6MjAxODk4MTkxOH0.6Hk63OyWol1-REmhlEtMvY2caJPuipcb0P96JQzdbPU";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
