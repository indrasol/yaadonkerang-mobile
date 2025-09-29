// services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from "@/config";
import type { Database } from "@/services/supabaseTypes";


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});


// Auth functions
export const signInWithOTP = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  return { data, error };
};

export const verifyOTP = async (email: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};
