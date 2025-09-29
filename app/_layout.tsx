import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { supabase, getCurrentUser } from '@/services/supabaseClient';

export default function RootLayout() {
  useFrameworkReady();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial auth state
    checkAuthState();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const authenticated = !!session;
        setIsAuthenticated(authenticated);
        
        // Navigate based on auth state
        if (authenticated) {
          router.replace('/upload');
        } else {
          router.replace('/landing');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthState = async () => {
    const { user } = await getCurrentUser();
    const authenticated = !!user;
    setIsAuthenticated(authenticated);
    
    // Initial navigation
    if (authenticated) {
      router.replace('/upload');
    } else {
      router.replace('/landing');
    }
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="landing" />
        <Stack.Screen name="login" />
        <Stack.Screen name="upload" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}