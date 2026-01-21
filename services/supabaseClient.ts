
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const getEnv = (key: string) => {
  try {
    // Intenta obtener de Vite o de process.env (inyectado por el hoster)
    return ((import.meta as any).env?.[key]) || (process.env?.[key]) || '';
  } catch (e) {
    return '';
  }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '' && supabaseUrl.startsWith('http');

let supabaseInstance: any = null;

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true },
      realtime: { params: { eventsPerSecond: 10 } }
    });
  } catch (e) {
    console.warn("Supabase initialization failed, continuing in local mode.", e);
  }
}

export const supabase = supabaseInstance;
