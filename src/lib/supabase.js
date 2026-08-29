import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://zejzfgogccmmhsjexxml.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_i8u-iVSyT1F1FzlNkR91Xg_wrxJQ4VF";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);