// app/verification/_layout.tsx
import { Stack } from 'expo-router';

export default function VerificationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="upload" />
    </Stack>
  );
}