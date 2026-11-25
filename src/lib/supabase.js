import { createClient } from '@supabase/supabase-js';

const getEnvVar = (viteKey, fallback) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env && import.meta.env[viteKey]) {
      return import.meta.env[viteKey];
    }
  } catch (e) {}
  try {
    if (typeof process !== 'undefined' && process.env && process.env[viteKey]) {
      return process.env[viteKey];
    }
  } catch (e) {}
  return fallback;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://mhiyjqcwdbqpmplghewi.supabase.co');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'sb_publishable_4tV2fBv9dgzSHv7sjdzYWw_jnIQxJDa');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});
