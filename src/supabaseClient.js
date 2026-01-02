import { createClient } from '@supabase/supabase-js';

// These variables pull the credentials from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If the environment variables are missing, Vite will throw a clear error
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing. Check your .env file!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);