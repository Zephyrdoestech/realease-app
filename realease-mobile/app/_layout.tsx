import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '@/ctx/AuthContext';
import '../global.css';

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  // ✅ FIX 1: Wait for navigation to be ready to avoid "Unmatched Route" crashes
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (isLoading || !navigationState?.key) return;

    // ✅ FIX 2: Check for (auth) with parentheses
    const firstSegment = segments[0] as string | undefined;
    const inAuthGroup = firstSegment === '(auth)';
    const atRoot = !firstSegment; // If no segments, we are at '/'

    if (!session) {
      // ⛔ NOT LOGGED IN
      // If user is NOT in (auth) and NOT at root, send them to root
      if (!inAuthGroup && !atRoot) {
        router.replace('/');
      }
    } else {
      // ✅ LOGGED IN
      // If user IS in (auth) or AT root, send them to Home
      if (inAuthGroup || atRoot) {
        router.replace('/(tabs)');
      }
    }
  }, [session, segments, isLoading, navigationState?.key]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0F766E" />
      </View>
    );
  }

  // ✅ FIX 3: Use Stack to explicitly register all your screens
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Main Routes */}
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />

      {/* Feature Screens */}
      <Stack.Screen name="property/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="chat/[id]" />
      
      {/* Modals */}
      <Stack.Screen name="checkout/[id]" options={{ presentation: 'modal' }} />
      <Stack.Screen name="verification" options={{ presentation: 'modal' }} />
      <Stack.Screen name="seller" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootLayoutNav />
    </AuthProvider>
  );
}