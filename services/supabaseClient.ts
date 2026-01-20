import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const getEnv = (key: string) => {
  try {
    // Intenta obtener de Vite o de process.env (inyectado por el hoster)
    // Fix: Cast import.meta to any to allow access to 'env' property which may not be defined in standard TypeScript ImportMeta
    return ((import.meta as any).env?.[key]) || (process.env?.[key]) || '';
  } catch (e) {
    return '';
  }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;