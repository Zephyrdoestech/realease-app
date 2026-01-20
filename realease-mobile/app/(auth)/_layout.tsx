import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hides the default top bar
        animation: 'fade',  // Smooth transition
      }}
    >
      {/* 1. The Entry Screen (Get Started / Login) */}
      <Stack.Screen name="welcome" />

      {/* 2. Role Selection (Client vs Seller) */}
      <Stack.Screen name="role-selection" />

      {/* 3. The Forms */}
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}