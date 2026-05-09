import { createClient } from "@supabase/supabase-js";

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
};

export function isSupabaseConfigured() {
  return Boolean(supabaseConfig.url && (supabaseConfig.serviceRoleKey || supabaseConfig.anonKey));
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey || supabaseConfig.anonKey, {
      auth: {
        persistSession: false
      }
    })
  : null;
