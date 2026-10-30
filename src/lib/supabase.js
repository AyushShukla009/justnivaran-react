import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (typeof import.meta !== "undefined" && import.meta?.env?.VITE_SUPABASE_URL) ||
  (typeof globalThis !== "undefined" && globalThis.process?.env?.VITE_SUPABASE_URL) ||
  "https://zejzfgogccmmhsjexxml.supabase.co";

const supabaseAnonKey =
  (typeof import.meta !== "undefined" && import.meta?.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof globalThis !== "undefined" && globalThis.process?.env?.VITE_SUPABASE_ANON_KEY) ||
  "sb_publishable_i8u-iVSyT1F1FzlNkR91Xg_wrxJQ4VF";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);