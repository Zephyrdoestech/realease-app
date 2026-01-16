import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '@/ctx/AuthContext';
import '../global.css';

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // ✅ FIX: Safer way to check current route
    const firstSegment = segments[0]; 
    const inAuthGroup = firstSegment === '(auth)';
    const inIndex = !firstSegment; // If no segments, we are at root (/)

    if (!session) {
      // ⛔ NOT LOGGED IN
      // If trying to access anything other than Auth or Splash, kick them out
      if (!inAuthGroup && !inIndex) {
        router.replace('/');
      }
    } else {
      // ✅ LOGGED IN
      // If trying to access Auth or Splash, send them to Home
      if (inAuthGroup || inIndex) {
        router.replace('/(tabs)');
      }
    }
  }, [session, segments, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0F766E" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. Splash & Auth */}
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />

      {/* 2. Main App */}
      <Stack.Screen name="(tabs)" />

      {/* 3. Detail Screens */}
      <Stack.Screen name="property/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="chat/[id]" />
      
      {/* 4. Modals */}
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