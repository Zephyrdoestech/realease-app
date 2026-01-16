import { Stack } from 'expo-router';

export default function VerificationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="upload" options={{ presentation: 'modal', title: 'Verify Identity' }} />
    </Stack>
  );
}