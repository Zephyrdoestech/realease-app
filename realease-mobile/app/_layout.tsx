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
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (isLoading || !navigationState?.key) return;

    const firstSegment = segments[0] as string | undefined;

    const inAuthGroup = firstSegment === '(auth)';
    const inVerification = firstSegment === 'verification';
    const atRoot = !firstSegment; 

    if (!session) {
      // Allow access only to (auth) group or Landing Page (root)
      if (!inAuthGroup && !atRoot) {
        router.replace('/');
      }
    } else {
      // If at Root or inside Auth screens, redirect to Home
      if (atRoot || inAuthGroup) {
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

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. Main Screens */}
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />

      {/* 2. Folders */}
      <Stack.Screen name="property/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="checkout/[id]" options={{ presentation: 'modal' }} />
      
      {/* 3. Protected Modals */}
      <Stack.Screen name="seller" options={{ presentation: 'modal' }} />
      <Stack.Screen name="verification" options={{ presentation: 'modal' }} />
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