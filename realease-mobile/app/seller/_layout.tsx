import { Stack } from 'expo-router';

export default function SellerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The Add Property Screen */}
      <Stack.Screen 
        name="add" 
        options={{ 
          presentation: 'modal', // Makes it slide up nicely
          headerShown: false 
        }} 
      />
    </Stack>
  );
}