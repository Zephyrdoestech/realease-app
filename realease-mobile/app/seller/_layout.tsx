import { Stack } from 'expo-router';

export default function SellerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="add" 
        options={{ 
          presentation: 'modal',
          headerTitle: 'Add Listing'
        }} 
      />
    </Stack>
  );
}