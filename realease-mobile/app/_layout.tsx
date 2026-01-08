// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Main tabs */}
        <Stack.Screen name="(tabs)" />
        
        {/* Property details */}
        <Stack.Screen name="property/[id]" />
        
        {/* Checkout modal */}
        <Stack.Screen 
          name="checkout/[id]" 
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}