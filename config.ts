// src/config.ts

// Helper so consumers get a clear error if something is missing
function requireEnv(name: keyof NodeJS.ProcessEnv): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing ${name} in your environment`);
    return v;
  }
  
  // Public values (Expo inlines EXPO_PUBLIC_* at build time)
  export const apiBaseUrl = requireEnv("EXPO_PUBLIC_API_BASE_URL");
  export const supabaseUrl = requireEnv("EXPO_PUBLIC_SUPABASE_URL");
  export const supabaseAnonKey = requireEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY");
   