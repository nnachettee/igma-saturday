import { createClient } from "@supabase/supabase-js";

let client = null;

// Created on first use (in the browser), so the build never needs the keys.
export function getSupabase() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase keys are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local (and to Vercel)."
    );
  }
  client = createClient(url, key);
  return client;
}
